// ── 飞书开放平台集成模块 ──────────────────────────
// 实现：消息接收 → 意图解析 → AEO API 调用 → 回复
// ─────────────────────────────────────────────────

const https = require('https');
const FEISHU_API = 'open.feishu.cn';
let cachedToken = null;
let tokenExpiry = 0;

// ── 飞书 API 调用工具 ───────────────────────────────
function apiRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const parts = path.split('?');
    const pathname = parts[0];
    const search = parts[1] || '';
    const req = https.request({
      hostname: FEISHU_API,
      path: pathname + (search ? '?' + search : ''),
      method: options.method || 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...(options.token ? { 'Authorization': 'Bearer ' + options.token } : {}),
        ...(options.headers || {})
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.code !== 0 && parsed.code !== undefined && parsed.code !== null) {
            const err = new Error(parsed.msg || '飞书API错误');
            err.code = parsed.code;
            reject(err);
          } else {
            resolve(parsed);
          }
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('飞书API超时')); });
    if (options.body) req.write(options.body);
    req.end();
  });
}

// ── 获取 tenant_access_token（自动缓存刷新）─────
async function getAccessToken(appId, appSecret) {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  if (!appId || !appSecret) throw new Error('未配置飞书 App ID 或 App Secret');
  const res = await apiRequest('/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    body: JSON.stringify({ app_id: appId, app_secret: appSecret })
  });
  cachedToken = res.tenant_access_token;
  tokenExpiry = Date.now() + (res.expire - 60) * 1000; // 提前1分钟刷新
  return cachedToken;
}

// ── 回复消息 ─────────────────────────────────────────
async function replyMessage(messageId, text, appId, appSecret) {
  const token = await getAccessToken(appId, appSecret);
  return apiRequest(`/open-apis/im/v1/messages/${messageId}/reply`, {
    method: 'POST',
    token: token,
    body: JSON.stringify({
      content: JSON.stringify({ text }),
      msg_type: 'text'
    })
  });
}

// ── 发送消息到群聊/用户（用于主动通知）──────────
async function sendMessage(chatId, text, appId, appSecret) {
  const token = await getAccessToken(appId, appSecret);
  return apiRequest('/open-apis/im/v1/messages?receive_id_type=chat_id', {
    method: 'POST',
    token: token,
    body: JSON.stringify({
      receive_id: chatId,
      content: JSON.stringify({ text }),
      msg_type: 'text'
    })
  });
}

// ── 意图解析 + 执行 ────────────────────────────────
// 使用 keyword 匹配调用 AEO 系统内部函数
function parseIntent(text) {
  const t = text.trim();
  // 查询公司信息
  if (/查询公司|公司信息/.test(t) && !/修改|设置|更新/.test(t)) {
    return { action: 'getCompany' };
  }
  // 修改公司信息
  if (/修改公司|设置公司|更新公司/.test(t)) {
    const updates = {};
    const patterns = [
      { key: 'name', regex: /(?:名称|公司名)[是为：:]?\s*("([^"]+)"|'([^']+)'|(.+?))(?:[\s,，。、]|$)/ },
      { key: 'customsCode', regex: /(?:海关编码|海关注册编码)[是为：:]?\s*(\S+)/ },
      { key: 'customsOffice', regex: /(?:主管海关)[是为：:]?\s*(\S+)/ },
      { key: 'legalPerson', regex: /(?:法人|法定代表人)[是为：:]?\s*(\S+)/ },
      { key: 'tradeAmount', regex: /(?:进出口额|进出口金额)[是为：:]?\s*(\S+)/ },
      { key: 'customsContact', regex: /(?:关务联系[人员]?|关务)[是为：:]?\s*(\S+)/ },
      { key: 'financeContact', regex: /(?:财务联系[人员]?|财务)[是为：:]?\s*(\S+)/ }
    ];
    let matched = false;
    for (const p of patterns) {
      const m = t.match(p.regex);
      if (m) {
        updates[p.key] = (m[2] || m[3] || m[4] || '').trim();
        matched = true;
      }
    }
    if (matched) return { action: 'setCompany', params: updates };
    return { action: 'setCompany', params: { name: t.replace(/修改公司|设置公司|更新公司/g,'').trim() } };
  }
  // 查询任务列表
  if (/查任务|任务列表|所有任务|我的任务/.test(t)) {
    const params = {};
    if (/部门/.test(t)) {
      const m = t.match(/部门[是为：:]?\s*(\S+)/);
      if (m) params.dept = m[1];
    }
    if (/超期|逾期|过期/.test(t)) params.overdue = true;
    return { action: 'listTasks', params };
  }
  // 任务统计
  if (/任务统计|任务数量|任务概况/.test(t)) {
    return { action: 'getStats' };
  }
  // 创建任务
  if (/创建任务|新建任务|新增任务/.test(t)) {
    const mName = t.match(/(?:任务)?名称[是为：:]?\s*"([^"]+)"|"([^"]+)"(?=.*任务)/);
    const mDept = t.match(/部门[是为：:]?\s*(\S+)/);
    const mOwner = t.match(/负责[人]?[是为：:]?\s*(\S+)/);
    const mDue = t.match(/(?:截止|到期|完成)[日期]?[是为：:]?\s*(\d{4}[年/-]\d{1,2}[月/-]?\d{0,2})/);
    const params = {};
    if (mName) params.name = (mName[1] || mName[2] || '').trim();
    if (mDept) params.dept = mDept[1];
    if (mOwner) params.owner = mOwner[1];
    if (mDue) params.due = mDue[1].replace(/[年月]/g,'-').replace(/[月日]/g,'').replace(/[^0-9-]/g,'');
    if (params.name && params.dept && params.owner && params.due) {
      return { action: 'createTask', params };
    }
    // 参数不全时返回提示
    const missing = [];
    if (!params.name) missing.push('任务名称');
    if (!params.dept) missing.push('部门');
    if (!params.owner) missing.push('负责人');
    if (!params.due) missing.push('截止日期');
    return { action: 'help', msg: '创建任务缺少: ' + missing.join('、') + '。\n格式示例：创建任务 名称"季度安全检查" 部门行政部 负责人张工 截止2026-09-30' };
  }
  // 更新任务状态
  if (/更新状态|修改状态|任务.*状态/.test(t)) {
    const mId = t.match(/(TSK-2026-\d{4})/);
    const mStatus = t.match(/(待下发|执行中|审核中|已完成|已关闭)/);
    if (mId && mStatus) {
      return { action: 'updateTaskStatus', params: { id: mId[1], status: mStatus[1] } };
    }
    return { action: 'help', msg: '请指定任务编号和目标状态。\n示例：更新状态 TSK-2026-0001 执行中' };
  }
  // 查询标准
  if (/查询标准|认证标准|标准.*查询/.test(t)) {
    const mId = t.match(/(IC-\d{2}|FI-\d{2}|LC-\d{2}|TS-\d{2})/);
    if (mId) return { action: 'getStandards' };
    return { action: 'getStandards' };
  }
  // 审计日志
  if (/日志|审计|操作记录/.test(t)) {
    return { action: 'getAuditLogs' };
  }
  // 帮助
  if (/帮助|帮助|可以做什么|能力/.test(t)) {
    return { action: 'help' };
  }
  // 默认返回帮助
  return { action: 'help' };
}

// ── 根据意图执行并格式化回复 ─────────────────────
async function executeIntent(intent, serverModules) {
  const { loadJson, saveJson } = serverModules;

  switch (intent.action) {
    case 'getCompany': {
      const info = loadJson('companyInfo', {});
      if (!info || !info.name) return '公司信息尚未设置。\n可以告诉我：修改公司名称为"上海XX有限公司"';
      return `📋 **公司信息**\n━━━━━━━━━━━━━━━━\n企业名称: ${info.name || '未设置'}
统一编码: ${info.creditCode || '未设置'}
海关编码: ${info.customsCode || '未设置'}
主管海关: ${info.customsOffice || '未设置'}
企业类型: ${info.enterpriseType || '未设置'}
认证等级: ${info.certLevel || '未设置'}
法定代表人: ${info.legalPerson || '未设置'}
财务联系人: ${info.financeContact || '未设置'}
关务联系人: ${info.customsContact || '未设置'}
━━━━━━━━━━━━━━━━
💰 进出口额: ${info.tradeAmount || '未录入'}
    增长率: ${info.growthRate || '未录入'}
    报关单数: ${info.declCount || '未录入'}
    查验率: ${info.inspectRate || '未录入'}`;
    }

    case 'setCompany': {
      const current = loadJson('companyInfo', {});
      const updated = { ...current, ...intent.params };
      saveJson('companyInfo', updated);
      const changes = Object.keys(intent.params).map(k => {
        const labels = { name:'名称', customsCode:'海关编码', customsOffice:'主管海关', legalPerson:'法定代表人', tradeAmount:'进出口额', customsContact:'关务联系人', financeContact:'财务联系人' };
        return (labels[k] || k) + ': ' + intent.params[k];
      }).join('\n  ');
      return `✅ 公司信息已更新！\n  ${changes}`;
    }

    case 'listTasks': {
      let tasks = loadJson('tasks', []);
      if (intent.params) {
        if (intent.params.dept) tasks = tasks.filter(t => t.dept === intent.params.dept);
        if (intent.params.status) tasks = tasks.filter(t => t.status === intent.params.status);
        if (intent.params.overdue) {
          const now = new Date();
          tasks = tasks.filter(t => new Date(t.due) < now && t.status !== '已完成' && t.status !== '已关闭');
        }
      }
      if (!tasks.length) return '📭 暂无符合条件的任务';
      const lines = tasks.slice(0, 10).map((t, i) => {
        const overdue = new Date(t.due) < new Date() && t.status !== '已完成' && t.status !== '已关闭';
        return `${i+1}. ${t.id} ${t.name}\n   ${t.dept} · ${t.owner} · ${overdue ? '⚠️ ' : ''}${t.status} · 截止${t.due}`;
      });
      return `📋 **任务列表**（共${tasks.length}条，显示前${Math.min(10,tasks.length)}条）\n━━━━━━━━━━━━━━━━\n${lines.join('\n')}`;
    }

    case 'createTask': {
      const { name, dept, owner, due, standard, req } = intent.params;
      const tasks = loadJson('tasks', []);
      const nums = tasks.map(t => { const m = t.id.match(/TSK-2026-(\d+)/); return m ? parseInt(m[1]) : 0; });
      const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
      const task = {
        id: 'TSK-2026-' + String(next).padStart(4, '0'),
        name, dept, owner, due,
        standard: standard || '', req: req || '', attachReq: '',
        status: '待下发', evidence: [], createdAt: new Date().toISOString()
      };
      tasks.push(task);
      saveJson('tasks', tasks);
      const logs = loadJson('auditLogs', []);
      logs.unshift({ ts: new Date().toISOString(), user: '飞书机器人', role: 'feishu_bot', action: '创建任务: ' + name, type: 'task', detail: dept + ' · ' + owner });
      if (logs.length > 500) logs.length = 500;
      saveJson('auditLogs', logs);
      return `✅ **任务已创建**\n  ${task.id} ${name}\n  部门: ${dept} · 负责人: ${owner}\n  截止: ${due}\n  状态: 待下发`;
    }

    case 'updateTaskStatus': {
      const { id, status } = intent.params;
      const tTasks = loadJson('tasks', []);
      const task = tTasks.find(t => t.id === id);
      if (!task) return `❌ 未找到任务 ${id}`;
      const validStatuses = ['待下发', '执行中', '审核中', '已完成', '已关闭'];
      if (!validStatuses.includes(status)) return `❌ 无效状态: ${status}\n可选: ${validStatuses.join('、')}`;
      task.status = status;
      saveJson('tasks', tTasks);
      const logs = loadJson('auditLogs', []);
      logs.unshift({ ts: new Date().toISOString(), user: '飞书机器人', role: 'feishu_bot', action: '更新任务状态: ' + task.name + ' → ' + status, type: 'task', detail: id + ' ' + task.dept });
      if (logs.length > 500) logs.length = 500;
      saveJson('auditLogs', logs);
      return `✅ **任务状态已更新**\n  ${id} ${task.name}\n  ${task.status} → **${status}**`;
    }

    case 'getStats': {
      const tasks = loadJson('tasks', []);
      const now = new Date();
      const overdue = tasks.filter(t => new Date(t.due) < now && t.status !== '已完成' && t.status !== '已关闭');
      return `📊 **AEO任务统计**\n━━━━━━━━━━━━━━━━\n📌 总数: ${tasks.length}\n⏳ 待下发: ${tasks.filter(t => t.status === '待下发').length}\n🔧 执行中: ${tasks.filter(t => t.status === '执行中').length}\n📋 审核中: ${tasks.filter(t => t.status === '审核中').length}\n✅ 已完成: ${tasks.filter(t => t.status === '已完成').length}\n🔒 已关闭: ${tasks.filter(t => t.status === '已关闭').length}\n⚠️ **已超期: ${overdue.length}**`;
    }

    case 'getStandards': {
      const standards = [
        { id:'IC-01', name:'海关业务培训' }, { id:'IC-02', name:'组织机构和岗位职责' },
        { id:'IC-03', name:'单证保管与海关封志' }, { id:'IC-04', name:'进出口业务操作' },
        { id:'IC-05', name:'内部审计制度' }, { id:'IC-06', name:'产品质量管理' },
        { id:'IC-07', name:'改进机制' }, { id:'IC-08', name:'信息系统' },
        { id:'IC-09', name:'数据管理' }, { id:'IC-10', name:'信息安全' },
        { id:'IC-11', name:'守法合规' }, { id:'FI-01', name:'财务状况标准' },
        { id:'LC-01', name:'遵守法律法规' }, { id:'LC-02', name:'进出口业务规范' },
        { id:'LC-03', name:'进出口专项守法' }, { id:'LC-04', name:'外部信用' },
        { id:'TS-01', name:'场所安全' }, { id:'TS-02', name:'进入安全' },
        { id:'TS-03', name:'人员安全' }, { id:'TS-04', name:'商业伙伴安全' },
        { id:'TS-05', name:'货物安全' }, { id:'TS-06', name:'集装箱安全' },
        { id:'TS-07', name:'运输工具安全' }, { id:'TS-08', name:'危机管理' },
        { id:'TS-09', name:'安全培训' }
      ];
      const dims = { IC:'📋 内部控制', FI:'💰 财务状况', LC:'📜 守法规范', TS:'🔒 贸易安全' };
      const grouped = {};
      standards.forEach(s => {
        const prefix = s.id.split('-')[0];
        if (!grouped[prefix]) grouped[prefix] = { title: dims[prefix] || prefix, items: [] };
        grouped[prefix].items.push(s);
      });
      const lines = Object.keys(grouped).map(k => {
        const g = grouped[k];
        return `${g.title}\n  ${g.items.map(s => `${s.id} ${s.name}`).join('\n  ')}`;
      });
      return `📖 **AEO认证标准（25条）**\n━━━━━━━━━━━━━━━━\n${lines.join('\n')}`;
    }

    case 'getAuditLogs': {
      const logs = loadJson('auditLogs', []);
      if (!logs.length) return '📭 暂无操作记录';
      return `📋 **最近操作记录**（最近10条）\n━━━━━━━━━━━━━━━━\n${logs.slice(0, 10).map(l => {
        return `[${new Date(l.ts).toLocaleString('zh-CN')}] ${l.user}\n  ${l.action}`;
      }).join('\n')}`;
    }

    case 'help':
    default:
      return `🤖 **AEO认证稽核系统 - 飞书机器人**\n━━━━━━━━━━━━━━━━\n我可以帮你做这些：

📋 **查询类**
  "查询公司信息"
  "查任务"
  "任务统计"
  "查询认证标准"
  "查询日志"

✏️ **操作类**
  "修改公司名称为"XX公司""
  "创建任务 名称"季度安全检查" 部门行政部 负责人张工 截止2026-09-30"
  "更新状态 TSK-2026-0001 执行中"

⚠️ **提示**
  修改后刷新浏览器即可看到变化
  隧道断开后需要重新启动`;
  }
}

// ── Webhook 事件处理入口 ──────────────────────────
async function handleWebhook(reqBody, serverModules) {
  // URL 验证挑战（飞书首次配置时使用）
  if (reqBody.type === 'url_verification' || reqBody.challenge) {
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ challenge: reqBody.challenge })
    };
  }

  // 事件回调
  const event = reqBody.event || {};
  const header = reqBody.header || {};
  const eventType = header.event_type || reqBody.type || '';

  // 消息接收事件
  if (eventType === 'im.message.receive_v1') {
    const message = event.message || {};
    const sender = event.sender || {};
    const messageId = message.message_id;
    const messageType = message.message_type;
    const chatType = message.chat_type;
    const openId = sender.sender_id?.open_id || '';

    // 只处理文本消息
    if (messageType === 'text') {
      try {
        const content = JSON.parse(message.content || '{}');
        const text = (content.text || '').trim();

        // 解析意图
        const intent = parseIntent(text);
        let reply;
        if (intent.action === 'help' && intent.msg) {
          reply = intent.msg;
        } else {
          reply = await executeIntent(intent, serverModules);
        }

        // 回复消息（异步，不阻塞响应）
        const { appId, appSecret } = serverModules;
        if (messageId && appId && appSecret) {
          replyMessage(messageId, reply, appId, appSecret).catch(err => {
            console.error('飞书回复失败:', err.message);
          });
        }
      } catch(e) {
        console.error('处理飞书消息异常:', e.message);
      }
    }
  }

  // 事件接收确认（立即返回200）
  return {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ code: 0 })
  };
}

// ── 发送系统通知到飞书（主动推送）──────────────────
async function sendSystemNotification(eventType, eventData, configLoader) {
  try {
    const config = typeof configLoader === 'function' ? configLoader() : configLoader;
    if (!config || !config.notifyEnabled || !config.chatId) return;
    const { appId, appSecret, chatId, notifyEvents } = config;
    if (!appId || !appSecret || !chatId) return;
    if (notifyEvents && !notifyEvents.includes(eventType)) return;

    const msg = formatNotifyMessage(eventType, eventData);
    if (!msg) return;

    await sendMessage(chatId, msg, appId, appSecret);
  } catch(e) {
    console.error('飞书通知发送失败:', e.message);
  }
}

function formatNotifyMessage(eventType, data) {
  switch (eventType) {
    case 'task_create':
      return `📋 **新任务创建**
━━━━━━━━━━━━━━━━
任务: ${data.name || ''}
编号: ${data.id || ''}
部门: ${data.dept || ''}
负责人: ${data.owner || ''}
截止: ${data.due || ''}
状态: 待下发`;
    case 'task_status':
      return `📋 **任务状态变更**
━━━━━━━━━━━━━━━━
任务: ${data.name || ''}
编号: ${data.id || ''}
原状态: ${data.oldStatus || ''}
新状态: ${data.newStatus || ''}
更新人: ${data.user || ''}`;
    case 'rectification':
      return `🔧 **整改项更新**
━━━━━━━━━━━━━━━━
问题: ${data.desc || ''}
编号: ${data.id || ''}
部门: ${data.dept || ''}
负责人: ${data.owner || ''}
状态: ${data.status || ''}`;
    case 'approval':
      return `✅ **审批流转**
━━━━━━━━━━━━━━━━
类型: ${data.type || ''}
编号: ${data.id || ''}
动作: ${data.action || ''}
操作人: ${data.user || ''}
意见: ${data.comment || '无'}`;
    case 'assessment':
      return `📊 **合规自评提交**
━━━━━━━━━━━━━━━━
评估人: ${data.user || ''}
总得分: ${data.score || ''}分
提交时间: ${data.time || ''}`;
    default:
      return null;
  }
}

module.exports = { getAccessToken, replyMessage, sendMessage, handleWebhook, parseIntent, sendSystemNotification };
