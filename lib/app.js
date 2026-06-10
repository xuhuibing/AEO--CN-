
// ========================================================================
// AEO认证稽核系统 v2.0 — 完整 JavaScript
// ========================================================================

const DEPARTMENTS = ['关务部','财务部','法务部','行政部','物流/仓储','HR','采购部','IT部','内审部'];
const ROLE_LABELS = { customs_officer: '关务经理', dept_lead: '部门AEO对接人', auditor: '内审员', executive: '企业高管', customs_viewer: '海关查看者' };

// JS 运行状态指示
var statusEl = document.getElementById('jsStatus');
if (statusEl) statusEl.textContent = '✅ JavaScript 正常运行';

// 登录按钮后备点击绑定
setTimeout(function() {
    var btn = document.getElementById('loginBtn');
    if (btn) {
        btn.addEventListener('click', doLogin);
        if (statusEl) statusEl.textContent = '✅ JS 正常 · 按钮已绑定';
    } else if (statusEl) {
        statusEl.textContent = '⚠️ 登录按钮未找到';
    }
}, 100);

// standardsData 已在 lib/standards-data.js 中定义（官方74项高级标准 + 62项认证标准）
// 结构: 维度 → 子分类 → 标准项，并自动展平为与旧代码兼容的 items 数组
// 子分类数据可通过 standardsData.advanced.internal.subcategories 访问

// ── 子分类索引：构建子分类级别的评估单元 ──────────────────────
// 将海关完整制度（NJ_SAMPLES官方原文）按子分类聚合，
// 每个子分类对应一套完整的制度文件，为最小评估/指派/资料上传单位。
function getSubcategoryList() {
    var type = stdType;
    var data = typeof FULL_STANDARDS !== 'undefined' ? FULL_STANDARDS[type] : null;
    if (!data) return [];
    var result = [];
    var dimOrder = ['internal','finance','compliance','security','bonus'];
    dimOrder.forEach(function(dimKey) {
        var dim = data[dimKey];
        if (!dim || !dim.subcategories) return;
        dim.subcategories.forEach(function(sc) {
            var cleanName = sc.name.replace(/^\d+\.\s*/, '').trim();
            var key = type + '_' + dimKey + '_' + cleanName;
            // 从 NJ_SAMPLES 查找完整官方制度原文
            var fullText = '';
            if (typeof NJ_SAMPLES !== 'undefined') {
                Object.keys(NJ_SAMPLES).forEach(function(nk) {
                    var ns = NJ_SAMPLES[nk];
                    if (ns.s && ns.s.length && ns.t) {
                        var match = sc.items.some(function(it) { return ns.s.indexOf(it.id) !== -1; });
                        if (match && ns.t) fullText = ns.t;
                    }
                });
            }
            // 如果没有匹配到 NJ_SAMPLES, 组合所有子项的 standard 字段
            if (!fullText) {
                fullText = sc.items.map(function(it) { return it.standard || ''; }).filter(function(s) { return s; }).join('\n\n');
            }
            // 统计最常见的负责部门
            var deptCount = {};
            sc.items.forEach(function(it) { deptCount[it.dept] = (deptCount[it.dept] || 0) + 1; });
            var primaryDept = '', maxC = 0;
            Object.keys(deptCount).forEach(function(d) {
                if (deptCount[d] > maxC) { maxC = deptCount[d]; primaryDept = d; }
            });
            // 收集所有检查要点和样本资料
            var allCheckPoints = [];
            var allSampleDocs = [];
            sc.items.forEach(function(it) {
                if (it.checkPoints) allCheckPoints = allCheckPoints.concat(it.checkPoints);
                if (it.sampleDocs) allSampleDocs = allSampleDocs.concat(it.sampleDocs);
            });
            result.push({
                key: key,
                name: cleanName,
                fullName: sc.name,
                dimKey: dimKey,
                dimTitle: dim && dim.title || '',
                dimColor: dim && dim.color || 'slate',
                dimIcon: dim && dim.icon || 'folder',
                items: sc.items,
                dept: primaryDept,
                fullText: fullText,
                checkPoints: allCheckPoints,
                sampleDocs: allSampleDocs,
                type: type
            });
        });
    });
    return result;
}

// ── 单项标准索引（4个业务类型：卫生检疫/动植物检疫/食品化妆品/商品检验） ──
function getIndividualStandardsList() {
    if (typeof INDIVIDUAL_STANDARDS === 'undefined') return [];
    var result = [];
    var type = 'individual';
    Object.keys(INDIVIDUAL_STANDARDS).forEach(function(bizKey) {
        var biz = INDIVIDUAL_STANDARDS[bizKey];
        var key = type + '_' + bizKey;
        // 收集所有检查要点和样本资料
        var allCheckPoints = [];
        var allSampleDocs = [];
        biz.items.forEach(function(it) {
            if (it.checkPoints) allCheckPoints = allCheckPoints.concat(it.checkPoints);
            if (it.sampleDocs) allSampleDocs = allSampleDocs.concat(it.sampleDocs);
        });
        // 组合标准原文
        var fullText = biz.items.map(function(it) { return it.standard || ''; }).filter(function(s) { return s; }).join('\n\n');
        result.push({
            key: key,
            name: biz.title,
            fullName: biz.title,
            dimKey: 'individual',
            dimTitle: '单项标准',
            dimColor: biz.color || 'amber',
            dimIcon: biz.icon || 'industry',
            items: biz.items,
            dept: '根据业务类型',
            fullText: fullText,
            checkPoints: allCheckPoints,
            sampleDocs: allSampleDocs,
            type: type
        });
    });
    return result;
}

// 获取单个子分类信息
function getSubcategoryByKey(key) {
    var list = getSubcategoryList();
    var found = list.find(function(sc) { return sc.key === key; });
    if (found) return found;
    var indivList = getIndividualStandardsList();
    return indivList.find(function(sc) { return sc.key === key; }) || null;
}

// 子分类评估数据存取
function loadScAssessment() { return loadData('scAssessment', {}); }
function saveScAssessment(data) { saveData('scAssessment', data); }
function getScResult(scKey) {
    var all = loadScAssessment();
    return all[scKey] || '';
}
function setScResult(scKey, val) {
    var all = loadScAssessment();
    all[scKey] = val;
    saveScAssessment(all);
}

// 子分类任务配置存取
function loadScTaskConfig() { return loadData('scTaskConfig', {}); }
function saveScTaskConfig(data) { saveData('scTaskConfig', data); }
function getScConfig(scKey) {
    var all = loadScTaskConfig();
    return all[scKey] || null;
}
function setScConfig(scKey, config) {
    var all = loadScTaskConfig();
    all[scKey] = config;
    saveScTaskConfig(all);
}

// 子分类证据文件存取
function loadScEvidence() { return loadData('scEvidence', {}); }
function saveScEvidence(data) { saveData('scEvidence', data); }

// ------------------------------------------------------------------------
// 2. 应用状态
// ------------------------------------------------------------------------

let currentUser = null;
let currentModule = 'dashboard';
let stdType = 'advanced';
let stdView = 'dimension';
let currentDemoTab = 'internal';
let assessmentType = 'advanced';
let authToken = '';  // 仅在内存中，不写入 localStorage

// ── API 同步层 ─────────────────────────────────────
const API_BASE = '';  // 空字符串表示同域，未来改地址只需修改此处

function getAuthHeaders(skipContentType) {
    const headers = {};
    if (!skipContentType) { headers['Content-Type'] = 'application/json'; }
    if (authToken) {
        headers['Authorization'] = 'Bearer ' + authToken;
    }
    // Note: Unauthenticated requests will return 401 and redirect to login
    return headers;
}

// 从服务器加载所有数据到 localStorage（在应用启动时调用）
async function initFromServer() {
    const syncKeys = ['companyInfo','tasks','scAssessment','scTaskConfig','scEvidence',
                      'lastAssessmentScore','lastAssessmentDate','auditLogs',
                      'notifications','financeData','assessmentHistory','customLaws','internalAudits',
                      'scoreWeights','supplierAssessments','standardChecks'];
    for (const key of syncKeys) {
        try {
            const res = await fetch(API_BASE + '/api/data/' + key, { headers: getAuthHeaders() });
            if (res.ok) {
                const val = await res.json();
                if (val !== null) localStorage.setItem('aeo_' + key, JSON.stringify(val));
            }
        } catch(e) { /* server not reachable, use localStorage */ }
    }
}

// 兼容型 loadData：优先 localStorage（即时），可覆盖为异步
function loadData(key, fallback) {
    try { const v = localStorage.getItem('aeo_' + key); return v ? JSON.parse(v) : (typeof fallback === 'function' ? fallback() : fallback); }
    catch(e) { return typeof fallback === 'function' ? fallback() : fallback; }
}

// ── 写入队列（带重试，确保数据可靠性） ────────────────
var writeQueue = [];
var writeQueueRunning = false;
var lastSyncTime = null;
var MAX_RETRIES = 3;

function processWriteQueue() {
    if (writeQueueRunning || writeQueue.length === 0) return;
    writeQueueRunning = true;
    var item = writeQueue[0];
    fetch(API_BASE + '/api/data/' + item.key, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(item.val)
    }).then(function(res) {
        if (res.ok) {
            writeQueue.shift();
            item.retries = 0;
            lastSyncTime = Date.now();
            updateSyncIndicator();
        } else if (item.retries < MAX_RETRIES) {
            item.retries++;
            setTimeout(processWriteQueue, 1000 * Math.pow(2, item.retries));
        } else {
            writeQueue.shift();
            console.warn('数据同步失败（已重试' + MAX_RETRIES + '次）:', item.key);
        }
        writeQueueRunning = false;
        processWriteQueue();
    }).catch(function() {
        if (item.retries < MAX_RETRIES) {
            item.retries++;
            setTimeout(processWriteQueue, 1000 * Math.pow(2, item.retries));
        } else {
            writeQueue.shift();
            console.warn('数据同步失败（已重试' + MAX_RETRIES + '次）:', item.key);
        }
        writeQueueRunning = false;
        processWriteQueue();
    });
}

// 增强型 saveData：写入 localStorage + 队列同步到服务器
function saveData(key, val) {
    // 先写 localStorage（即时响应 UI）
    try { localStorage.setItem('aeo_' + key, JSON.stringify(val)); } catch(e) {}
    // 入队同步到服务器（带重试）
    writeQueue.push({ key: key, val: val, retries: 0 });
    processWriteQueue();
}

// ── 同步状态指示器 ────────────────────────────────────
function updateSyncIndicator() {
    var el = document.getElementById('syncIndicator');
    if (!el) return;
    if (writeQueue.length > 0) {
        el.textContent = '同步中 (' + writeQueue.length + ' 待处理)';
        el.className = '';
        el.style.display = 'inline-block';
        el.style.background = '#fef3c7';
        el.style.color = '#92400e';
    } else if (lastSyncTime) {
        var ago = Math.floor((Date.now() - lastSyncTime) / 1000);
        el.textContent = ago < 60 ? '刚刚同步' : (Math.floor(ago / 60) + ' 分钟前同步');
        el.className = '';
        el.style.display = 'inline-block';
        el.style.background = '#d1fae5';
        el.style.color = '#065f46';
    } else {
        el.style.display = 'none';
    }
}

// ------------------------------------------------------------------------
// 3. Toast
// ------------------------------------------------------------------------
function showToast(msg, type) {
    type = type || 'success';
    const tc = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    const icons = { success: 'fa-check-circle text-emerald-500', warning: 'fa-exclamation-triangle text-amber-500', error: 'fa-times-circle text-red-500' };
    t.innerHTML = '<i class="fas ' + (icons[type]||icons.success) + ' mr-2"></i><span style="flex:1;font-size:0.9rem;">' + msg + '</span><button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;color:#94a3b8;"><i class="fas fa-times"></i></button>';
    tc.appendChild(t);
    setTimeout(() => { t.style.animation = 'slideOut 0.3s ease'; setTimeout(() => t.remove(), 300); }, 4000);
}

// ------------------------------------------------------------------------
// 4. 审计日志
// ------------------------------------------------------------------------
function addAuditLog(action, type, detail) {
    const logs = loadData('auditLogs', []);
    logs.unshift({ ts: new Date().toISOString(), user: currentUser ? currentUser.name : '系统', role: currentUser ? currentUser.role : 'system', action: action, type: type || 'general', detail: detail || '' });
    if (logs.length > 500) logs.length = 500;
    saveData('auditLogs', logs);
}
function renderAuditLog() {
    const filter = (document.getElementById('auditLogFilter')||{}).value || '';
    let logs = loadData('auditLogs', []);
    if (filter) logs = logs.filter(l => l.type === filter);
    const c = document.getElementById('auditLogContainer');
    if (!logs.length) { c.innerHTML = '<div class="text-center py-8 text-slate-400"><i class="fas fa-inbox text-4xl mb-3"></i><p>暂无操作记录</p></div>'; return; }
    c.innerHTML = logs.map(l => {
        const d = new Date(l.ts);
        return '<div class="flex items-start space-x-3 p-3 border-b border-slate-100 hover:bg-slate-50"><div class="w-8 h-8 bg-slate-100 rounded flex items-center justify-center flex-shrink-0"><i class="fas fa-circle text-xs ' + ({task:'text-blue-500',standards:'text-purple-500',assessment:'text-emerald-500',auth:'text-amber-500',data:'text-red-500'}[l.type]||'text-slate-400') + '"></i></div><div class="flex-1 min-w-0"><p class="text-sm text-slate-700">' + l.action + '</p><p class="text-xs text-slate-400 mt-0.5">' + l.user + ' · ' + l.detail + '</p></div><span class="text-xs text-slate-400 flex-shrink-0">' + d.toLocaleString() + '</span></div>';
    }).join('');
}
function showAuditLog() { renderAuditLog(); document.getElementById('auditLogModal').classList.add('active'); }

// ------------------------------------------------------------------------
// 5. 登录/登出
// ------------------------------------------------------------------------
function doLogin() {
    try {
        var name = document.getElementById('loginName').value.trim() || 'admin';
        var password = document.getElementById('loginPassword').value;
        var loginBtn = document.getElementById('loginBtn');
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>登录中...';

        fetch(API_BASE + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: name, password: password })
        }).then(function(res) {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>进入系统';
            if (!res.ok) {
                if (res.status === 401) {
                    showToast('用户名或密码错误', 'error');
                } else {
                    showToast('登录失败 (' + res.status + ')', 'error');
                }
                return null;
            }
            return res.json();
        }).then(function(data) {
            if (!data) return;
            authToken = data.token;
            // Token 仅在内存中，页面刷新需重新登录
            currentUser = {
                id: data.user.id,
                username: data.user.username,
                name: data.user.displayName,
                role: data.user.role
            };
            saveData('currentUser', currentUser);
            document.getElementById('loginOverlay').style.display = 'none';
            document.getElementById('appContainer').style.display = 'block';
            document.getElementById('headerUserName').textContent = data.user.displayName || name;
            document.getElementById('headerRoleBadge').textContent = ROLE_LABELS[data.user.role] || data.user.role;
            // 获取用户权限并存储
            fetch(API_BASE + '/api/auth/permissions', { headers: getAuthHeaders() })
                .then(function(r) { return r.json(); })
                .then(function(pData) {
                    currentUser.permissions = pData.permissions || [];
                }).catch(function() {});
            applyRoleBasedUI(data.user.role);
            addAuditLog('用户登录', 'auth', data.user.displayName + ' 以 ' + ROLE_LABELS[data.user.role] + ' 身份登录');
            initApp();
        }).catch(function(err) {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>进入系统';
            showToast('服务器连接失败，请检查网络或联系管理员', 'error');
        });
    } catch(e) {
        console.error('登录失败:', e);
        alert('登录遇到问题: ' + e.message + '\n请按F12查看控制台详细信息');
    }
}

function applyRoleBasedUI(role) {
    // 海关查看者限制操作
    var isViewer = role === 'customs_viewer';
    var btns = document.querySelectorAll('[data-requires-perm]');
    btns.forEach(function(b) { b.style.display = 'none'; });
    // 基础隐藏
    var createBtn = document.getElementById('btnCreateTask');
    if (createBtn) createBtn.style.display = isViewer ? 'none' : '';
    var editBtn = document.getElementById('btnEditEnterprise');
    if (editBtn) editBtn.style.display = isViewer ? 'none' : '';
}
function doLogout() {
    addAuditLog('用户登出', 'auth', (currentUser||{}).name + ' 登出');
    // 服务端登出
    if (authToken) {
        fetch(API_BASE + '/api/auth/logout', {
            method: 'POST', headers: getAuthHeaders()
        }).catch(function() {});
    }
    authToken = '';
    currentUser = null; saveData('currentUser', null);
    document.getElementById('loginOverlay').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
}

// ------------------------------------------------------------------------
// 6. 导航 & 侧边栏
// ------------------------------------------------------------------------
function navigateTo(module) {
    currentModule = module;
    document.querySelectorAll('.module-content').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(module);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navItem = document.querySelector('.nav-item[data-module="' + module + '"]');
    if (navItem) navItem.classList.add('active');
    if (window.innerWidth <= 1024) toggleSidebar(false);
    if (module === 'standards') loadStandards();
    if (module === 'tasks') { loadTasks(); renderTaskTable(); renderTaskKanban(); renderTaskProjectView(); }
    if (module === 'assessment') loadAssessment();
    if (module === 'demo') { renderDemoContent(); renderEvidenceTimeline(); }
    if (module === 'annual-archive') renderAnnualArchive();
    if (module === 'supplier') renderSuppliers();
    if (module === 'finance') renderFinance();
    if (module === 'selfcheck') renderSelfCheck();
    if (module === 'standards-training') renderStandardsTraining();
    if (module === 'enterprise') { switchEnterpriseTab('basic'); loadCompanyInfo(); }
    if (module === 'dashboard') updateDashboard();
    if (module === 'user-management') renderUserManagement();
    if (module === 'approvals') renderApprovals();
    if (module === 'rectifications') renderRectifications();
    if (module === 'system-settings') renderSystemSettings();
    if (module === 'laws') { renderCoreLaws(); renderCustomLaws(); switchLawView('builtin'); }
    if (module === 'audit') renderAudit();
    if (module === 'documents') renderDocFiles();
    if (module === 'training') { renderTrainingCards(); renderTrainingFiles(); renderTrainingRecords(); }
    if (module === 'feedback') renderFeedback();
}
function toggleSidebar(forceState) {
    const sb = document.getElementById('mainSidebar');
    const ov = document.getElementById('sidebarOverlay');
    const isOpen = sb.classList.contains('open');
    const shouldOpen = forceState !== undefined ? forceState : !isOpen;
    sb.classList.toggle('open', shouldOpen); ov.classList.toggle('open', shouldOpen);
}
function renderSidebar() {
    const nav = document.getElementById('sidebarNav');
    const items = [
        { icon: 'fa-chart-pie', label: '系统首页', module: 'dashboard' },
        { icon: 'fa-building', label: '企业介绍', module: 'enterprise' },
        { icon: 'fa-gavel', label: '法律法规', module: 'laws' },
        { icon: 'fa-clipboard-list', label: '认证标准', module: 'standards' },
        { icon: 'fa-road', label: '认证流程', module: 'cert-process' },
        { icon: 'fa-clipboard-check', label: '企业合规自评', module: 'assessment' },
        { icon: 'fa-list-check', label: '认证自查', module: 'selfcheck' },
        { icon: 'fa-chalkboard-teacher', label: '标准宣贯', module: 'standards-training' },
        { icon: 'fa-handshake', label: '供应商资质评估', module: 'supplier' },
        { icon: 'fa-calculator', label: '财务指标', module: 'finance' },
        { icon: 'fa-tasks', label: '任务管理', module: 'tasks' },
        { icon: 'fa-search', label: '内部审计', module: 'audit' },
        { icon: 'fa-folder', label: '制度文件', module: 'documents' },
        { icon: 'fa-graduation-cap', label: '培训中心', module: 'training' },
        { icon: 'fa-box-archive', label: '年度归档', module: 'annual-archive' },
        { icon: 'fa-ship', label: '进出口业务', module: 'ie-activities' },
        { icon: 'fa-comment-dots', label: '意见反馈', module: 'feedback' }
    ];
    if (!currentUser || currentUser.role !== 'customs_viewer') {
        items.push({ icon: 'fa-shield-alt', label: '🏛 海关演示', module: 'demo' });
    }
    // 新模块：根据角色显示
    if (currentUser && (currentUser.role === 'customs_officer' || (currentUser.permissions && currentUser.permissions.indexOf('user.manage') !== -1))) {
        items.push({ icon: 'fa-users-cog', label: '用户管理', module: 'user-management' });
    }
    if (currentUser && currentUser.role !== 'customs_viewer') {
        items.push({ icon: 'fa-check-double', label: '审批中心', module: 'approvals' });
        items.push({ icon: 'fa-exclamation-triangle', label: '整改跟踪', module: 'rectifications' });
    }
    if (currentUser && currentUser.role === 'customs_officer') {
        items.push({ icon: 'fa-cog', label: '系统设置', module: 'system-settings' });
    }
    nav.innerHTML = items.map(function(item) {
        const active = item.module === currentModule ? 'active' : '';
        const isDemo = item.module === 'demo';
        return '<div class="nav-item ' + active + ' flex items-center px-3 py-2 text-sm ' + (isDemo ? 'text-amber-700' : 'text-slate-600') + ' rounded-md mb-px" data-module="' + item.module + '" onclick="navigateTo(\'' + item.module + '\')"><i class="fas ' + item.icon + ' w-6 text-center mr-2.5 ' + (isDemo ? 'text-amber-500' : 'text-slate-400') + '"></i><span>' + item.label + '</span></div>';
    }).join('');
    nav.innerHTML += '<div class="border-t border-slate-100 mt-4 pt-3"><div class="nav-item flex items-center px-3 py-2 text-sm text-slate-500 rounded-md cursor-pointer mb-px hover:bg-slate-50" onclick="openImportModal()"><i class="fas fa-file-import w-6 text-center mr-2.5 text-slate-400"></i><span>数据导入/导出</span></div><div class="nav-item flex items-center px-3 py-2 text-sm text-slate-500 rounded-md cursor-pointer mb-px hover:bg-slate-50" onclick="showAuditLog()"><i class="fas fa-history w-6 text-center mr-2.5 text-slate-400"></i><span>审计日志</span></div></div>';
}
function openImportModal() { document.getElementById('importModal').classList.add('active'); }

// ------------------------------------------------------------------------
// 7. Dashboard
// ------------------------------------------------------------------------
function updateDashboard() {
    const history = loadData('assessmentHistory', []);
    const tasks = loadData('tasks', []);
    let avgAssessment = 0, assessmentYear = '';
    // Use history latest if available, fallback to old results
    if (history.length > 0) {
        // history[0].score is already normalized to 0-100 scale
        avgAssessment = history[0].score;
        assessmentYear = history[0].year || '';
    } else {
        // Fallback: use subcategory assessment
        var scAssessment = loadScAssessment();
        var scKeys = Object.keys(scAssessment);
        var done = scKeys.filter(function(k) { return scAssessment[k] === '达标'; }).length;
        avgAssessment = scKeys.length > 0 ? Math.round(done/scKeys.length*100) : 0;
    }
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.status === '已完成' || t.status === '已关闭').length;
    const taskRate = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;
    const auditRate = 95;
    const weights = loadData('scoreWeights', { assess: 40, tasks: 35, audit: 25 });
    const wSum = weights.assess + weights.tasks + weights.audit;
    const wA = wSum > 0 ? weights.assess / wSum : 0.4;
    const wT = wSum > 0 ? weights.tasks / wSum : 0.35;
    const wAu = wSum > 0 ? weights.audit / wSum : 0.25;
    const overall = Math.round(avgAssessment * wA + taskRate * wT + auditRate * wAu);

    document.getElementById('mainScoreCircle').style.setProperty('--score', Math.min(overall, 100));
    document.getElementById('mainScoreText').textContent = overall || '--';
    document.getElementById('navComplianceScore').textContent = (overall || '--') + '/100';
    document.getElementById('navProgressBar').style.width = Math.min(overall || 0, 100) + '%';
    document.getElementById('assessmentYearBadge').textContent = assessmentYear ? assessmentYear + '年度评估' : '暂无评估记录';

    document.getElementById('sbAssessment').textContent = avgAssessment ? Math.round(avgAssessment) : '--';
    document.getElementById('sbTasks').textContent = taskRate ? Math.round(taskRate) + '%' : '--';
    document.getElementById('sbAudit').textContent = auditRate + '%';
    document.getElementById('sbWAssess').textContent = weights.assess;
    document.getElementById('sbWTasks').textContent = weights.tasks;
    document.getElementById('sbWAudit').textContent = weights.audit;
    const dimLabels = ['scoreInternal','scoreFinance','scoreCompliance','scoreSecurity','scoreBonus'];
    const dimBars = ['barInternal','barFinance','barCompliance','barSecurity'];
    var dimKeys = ['internal','finance','compliance','security','bonus'];
    dimKeys.forEach(function(d, i) {
        const items = (standardsData[stdType]||{})[d] ? standardsData[stdType][d].items : [];
        const done = items.filter(function(it) { return it.evidence.policy && it.evidence.record && it.evidence.approval; }).length;
        var labelEl = document.getElementById(dimLabels[i]);
        if (labelEl) labelEl.textContent = items.length > 0 ? done + '/' + items.length : '--';
        var barEl = document.getElementById(dimBars[i]);
        if (barEl) barEl.style.width = (items.length > 0 ? Math.round(done/items.length*100) : 0) + '%';
    });

    // --- Assessment dimension score breakdown (子分类) ---
    var dimBreakdown = document.getElementById('dimensionScoreBreakdown');
    if (!dimBreakdown) {
        dimBreakdown = document.createElement('div');
        dimBreakdown.id = 'dimensionScoreBreakdown';
        dimBreakdown.className = 'mt-4 grid grid-cols-2 md:grid-cols-4 gap-3';
        try {
            var dimCard = document.querySelector('.dimension-card');
            if (dimCard && dimCard.parentNode && dimCard.parentNode.parentNode) {
                dimCard.parentNode.parentNode.parentNode.appendChild(dimBreakdown);
            }
        } catch(e) {}
    }
    var scList = getSubcategoryList();
    var scAssessment = loadScAssessment();
    var dimOrder = ['internal','finance','compliance','security','bonus'];
    var dimDones = {}, dimTotals = {};
    dimOrder.forEach(function(k) { dimDones[k] = 0; dimTotals[k] = 0; });
    scList.forEach(function(sc) {
        if (dimTotals[sc.dimKey] !== undefined) {
            dimTotals[sc.dimKey]++;
            if (scAssessment[sc.key] === '达标') dimDones[sc.dimKey]++;
        }
    });
    var assessedDims = dimOrder.filter(function(k) { return dimTotals[k] > 0 && dimDones[k] > 0; });
    if (assessedDims.length > 0) {
        var dimNameMap = { internal:'内部控制', finance:'财务状况', compliance:'守法规范', security:'贸易安全', bonus:'附加标准' };
        dimBreakdown.innerHTML = assessedDims.map(function(dimKey) {
            var pct = dimTotals[dimKey] > 0 ? Math.round(dimDones[dimKey]/dimTotals[dimKey]*100) : 0;
            var statusLabel = pct >= 80 ? '达标' : pct >= 60 ? '警告' : '不达标';
            var statusColor = pct >= 80 ? 'emerald' : pct >= 60 ? 'amber' : 'red';
            return '<div class="p-3 bg-white rounded-lg border border-slate-200 text-center">' +
                '<p class="text-xs text-slate-500">' + (dimNameMap[dimKey] || dimKey) + '</p>' +
                '<p class="text-xl font-bold text-' + statusColor + '-600">' + pct + '</p>' +
                '<span class="text-xs px-1.5 py-0.5 rounded bg-' + statusColor + '-50 text-' + statusColor + '-600">' + statusLabel + '</span></div>';
        }).join('');
        dimBreakdown.style.display = '';
    } else {
        if (dimBreakdown) dimBreakdown.style.display = 'none';
    }

    const deptSnapshot = document.getElementById('deptSnapshot');
    const deptTaskCount = {};
    DEPARTMENTS.forEach(d => { deptTaskCount[d] = { total: 0, done: 0 }; });
    tasks.forEach(t => { if (deptTaskCount[t.dept]) { deptTaskCount[t.dept].total++; if (t.status === '已完成' || t.status === '已关闭') deptTaskCount[t.dept].done++; } });
    deptSnapshot.innerHTML = DEPARTMENTS.map(d => {
        const info = deptTaskCount[d]||{total:0,done:0};
        const rate = info.total > 0 ? Math.round(info.done/info.total*100) : 0;
        const color = rate >= 80 ? 'emerald' : rate >= 50 ? 'amber' : 'red';
        return '<div class="p-3 bg-slate-50 rounded-lg border border-slate-200"><p class="text-sm font-medium text-slate-700">' + d + '</p><p class="text-lg font-bold text-' + color + '-600">' + rate + '%</p><div class="progress-bar mt-1"><div class="progress-fill bg-' + color + '-500" style="width:' + rate + '%"></div></div><p class="text-xs text-slate-400 mt-1">' + info.done + '/' + info.total + '</p></div>';
    }).join('');
    document.getElementById('lastUpdateDate').textContent = '数据更新: ' + new Date().toLocaleDateString('zh-CN');

    // 多年度趋势图
    renderTrendChart(history);
}
function renderTrendChart(history) {
    var canvas = document.getElementById('trendChart');
    if (!canvas || typeof Chart === 'undefined') return;
    if (!history || history.length < 2) {
        document.getElementById('trendChartContainer').innerHTML = '<div class="flex items-center justify-center h-full text-xs text-slate-400">历年数据不足（至少2年），趋势图暂不可用</div>';
        return;
    }
    // Group by year, get average per year
    var yearMap = {};
    history.forEach(function(h) {
        var yr = h.year || '未知';
        if (!yearMap[yr]) yearMap[yr] = { sum: 0, count: 0 };
        yearMap[yr].sum += h.score || 0;
        yearMap[yr].count++;
    });
    var years = Object.keys(yearMap).sort();
    var scores = years.map(function(y) { return Math.round(yearMap[y].sum / yearMap[y].count); });
    var existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: years.map(function(y) { return y + '年'; }),
            datasets: [{
                label: '合规得分',
                data: scores,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59,130,246,0.1)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#3b82f6',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { min: 0, max: 100, ticks: { font: { size: 10 } } },
                x: { ticks: { font: { size: 10 } } }
            }
        }
    });
}

function updateWeightPreview() {
    const a = parseInt(document.getElementById('wAssess').value) || 0;
    const t = parseInt(document.getElementById('wTasks').value) || 0;
    const au = parseInt(document.getElementById('wAudit').value) || 0;
    document.getElementById('wLabelAssess').textContent = a + '%';
    document.getElementById('wLabelTasks').textContent = t + '%';
    document.getElementById('wLabelAudit').textContent = au + '%';
    const sum = a + t + au;
    document.getElementById('weightSum').textContent = sum + '%';
    const statusEl = document.getElementById('weightSumStatus');
    if (sum === 100) { statusEl.textContent = '✓ 合计为100%'; statusEl.className = 'text-emerald-600'; }
    else if (sum < 100) { statusEl.textContent = '⚠ 不足100% ('+(100-sum)+'%缺口)'; statusEl.className = 'text-amber-600'; }
    else { statusEl.textContent = '⚠ 超过100% ('+(sum-100)+'%超出)'; statusEl.className = 'text-red-600'; }
}
function saveWeights() {
    const a = parseInt(document.getElementById('wAssess').value) || 40;
    const t = parseInt(document.getElementById('wTasks').value) || 35;
    const au = parseInt(document.getElementById('wAudit').value) || 25;
    if (a + t + au !== 100) { showToast('权重合计必须为100%', 'error'); return; }
    saveData('scoreWeights', { assess: a, tasks: t, audit: au });
    document.getElementById('sbWAssess').textContent = a;
    document.getElementById('sbWTasks').textContent = t;
    document.getElementById('sbWAudit').textContent = au;
    if (currentModule === 'dashboard') updateDashboard();
    showToast('评分权重已更新', 'success');
}
// 打开评分说明时加载权重配置
function openScoreModal() {
    const w = loadData('scoreWeights', { assess: 40, tasks: 35, audit: 25 });
    document.getElementById('wAssess').value = w.assess;
    document.getElementById('wTasks').value = w.tasks;
    document.getElementById('wAudit').value = w.audit;
    updateWeightPreview();
    document.getElementById('scoreModal').classList.add('active');
}

// ------------------------------------------------------------------------
// 8. 认证标准
// ------------------------------------------------------------------------
function loadStandards() {
    const data = standardsData[stdType]; if (!data) return;
    const dimView = document.getElementById('dimensionView');
    const dimOrder = ['internal','finance','compliance','security','bonus'];
    var scList = getSubcategoryList();

    // 1. Compact stat cards (按维度统计)
    var html = '<div class="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">';
    dimOrder.forEach(function(key) {
        var dimScs = scList.filter(function(sc) { return sc.dimKey === key; });
        var count = dimScs.length;
        var done = dimScs.filter(function(sc) {
            var r = getScResult(sc.key);
            return r === '达标';
        }).length;
        var pct = count > 0 ? Math.round(done/count*100) : 0;
        var color = pct >= 80 ? 'emerald' : pct >= 50 ? 'amber' : 'slate';
        html += '<div class="bg-white rounded-lg border border-slate-200 p-2.5 hover:shadow-sm transition-shadow cursor-pointer" onclick="toggleAccordion(\'' + key + '\')">';
        html += '<div class="flex items-center justify-between mb-1"><div class="flex items-center space-x-1.5"><i class="fas fa-' + (dimScs[0] ? dimScs[0].dimIcon : 'folder') + ' text-' + (dimScs[0] ? dimScs[0].dimColor : 'slate') + '-600 text-xs"></i><span class="text-xs font-semibold text-slate-700">' + (dimScs[0] ? dimScs[0].dimTitle : key) + '</span></div><span class="text-xs font-medium text-' + color + '-600">' + pct + '%</span></div>';
        html += '<div class="flex items-center justify-between"><span class="text-base font-bold text-slate-800">' + done + '</span><span class="text-xs text-slate-400">共' + count + '类</span></div>';
        html += '<div class="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-' + (dimScs[0] ? dimScs[0].dimColor : 'slate') + '-500 rounded-full" style="width:' + pct + '%"></div></div></div>';
    });
    html += '</div>';

    // Individual standards stat card
    var indivList = getIndividualStandardsList();
    if (indivList.length > 0) {
        var indivDone = indivList.filter(function(sc) { return getScResult(sc.key) === '达标'; }).length;
        var indivPct = Math.round(indivDone/indivList.length*100);
        var indivColor = indivPct >= 80 ? 'emerald' : indivPct >= 50 ? 'amber' : 'slate';
        html += '<div class="bg-white rounded-lg border border-amber-200 p-2.5 hover:shadow-sm transition-shadow cursor-pointer" onclick="toggleAccordion(\'individual\')">';
        html += '<div class="flex items-center justify-between mb-1"><div class="flex items-center space-x-1.5"><i class="fas fa-industry text-amber-600 text-xs"></i><span class="text-xs font-semibold text-slate-700">单项标准</span></div><span class="text-xs font-medium text-' + indivColor + '-600">' + indivPct + '%</span></div>';
        html += '<div class="flex items-center justify-between"><span class="text-base font-bold text-slate-800">' + indivDone + '</span><span class="text-xs text-slate-400">共' + indivList.length + '类</span></div>';
        html += '<div class="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-' + indivColor + '-500 rounded-full" style="width:' + indivPct + '%"></div></div></div>';
    }

    // 2. Search bar
    html += '<div class="relative mb-4">';
    html += '<i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>';
    html += '<input type="text" class="standard-search w-full border border-slate-300 rounded-lg py-2.5 pr-3 text-sm focus:outline-none focus:border-slate-500 bg-white" placeholder="搜索制度名称、部门..." oninput="filterScCards(this.value)">';
    html += '</div>';

    // 3. Mobile TOC pills
    html += '<div class="lg:hidden overflow-x-auto toc-mobile-pills mb-4 -mx-1 px-1">';
    html += '<div class="flex space-x-1.5">';
    dimOrder.forEach(function(key) {
        var dimScs = scList.filter(function(sc) { return sc.dimKey === key; });
        if (dimScs.length === 0) return;
        html += '<button class="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 whitespace-nowrap" onclick="toggleAccordion(\'' + key + '\')"><i class="fas fa-' + dimScs[0].dimIcon + ' mr-1 text-' + dimScs[0].dimColor + '-500"></i>' + dimScs[0].dimTitle + '</button>';
    });
    // Individual standards pill
    if (indivList.length > 0) {
        html += '<button class="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border border-amber-300 text-amber-700 hover:bg-amber-50 whitespace-nowrap" onclick="toggleAccordion(\'individual\')"><i class="fas fa-industry mr-1 text-amber-500"></i>单项标准</button>';
    }
    html += '</div></div>';

    // 4. Flex: TOC sidebar + Content
    html += '<div class="flex gap-5">';

    // 4a. TOC sidebar (desktop only)
    html += '<div class="toc-sidebar hidden lg:block w-52 flex-shrink-0">';
    html += '<div class="sticky" style="top:6rem;max-height:calc(100vh - 8rem);overflow-y:auto">';
    html += '<div class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-3">目录</div>';
    html += '<div class="space-y-0.5" id="standardToc">';
    dimOrder.forEach(function(key) {
        var dimScs = scList.filter(function(sc) { return sc.dimKey === key; });
        if (dimScs.length === 0) return;
        html += '<div class="toc-group" data-dim="' + key + '">';
        html += '<a href="javascript:void(0)" class="toc-dim-link flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors" onclick="toggleAccordion(\'' + key + '\')"><span class="flex items-center space-x-2"><i class="fas fa-' + dimScs[0].dimIcon + ' text-' + dimScs[0].dimColor + '-500 text-xs"></i><span>' + dimScs[0].dimTitle + '</span></span><span class="flex items-center space-x-1"><span class="text-xs text-slate-400">' + dimScs.length + '</span><i class="fas fa-chevron-right text-slate-300"></i></span></a>';
        dimScs.forEach(function(sc) {
            var scId = 'sc-' + sc.key.replace(/[^a-zA-Z0-9一-鿿]/g, '');
            html += '<a href="javascript:void(0)" class="toc-sub-link flex items-center pl-7 pr-2 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors" onclick="document.getElementById(\'' + scId + '\').scrollIntoView({behavior:\'smooth\',block:\'start\'})"><span class="truncate">' + safeEs(sc.fullName) + '</span></a>';
        });
        html += '</div>';
    });
    // Individual standards TOC entry
    if (indivList.length > 0) {
        html += '<div class="toc-group" data-dim="individual">';
        html += '<a href="javascript:void(0)" class="toc-dim-link flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors" onclick="toggleAccordion(\'individual\')"><span class="flex items-center space-x-2"><i class="fas fa-industry text-amber-500 text-xs"></i><span>单项标准</span></span><span class="flex items-center space-x-1"><span class="text-xs text-slate-400">' + indivList.length + '</span><i class="fas fa-chevron-right text-slate-300"></i></span></a>';
        indivList.forEach(function(sc) {
            var scId = 'sc-' + sc.key.replace(/[^a-zA-Z0-9一-鿿]/g, '');
            html += '<a href="javascript:void(0)" class="toc-sub-link flex items-center pl-7 pr-2 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors" onclick="document.getElementById(\'' + scId + '\').scrollIntoView({behavior:\'smooth\',block:\'start\'})"><span class="truncate">' + safeEs(sc.fullName) + '</span></a>';
        });
        html += '</div>';
    }
    html += '</div></div></div>';

    // 4b. Content: subcategory cards
    html += '<div class="flex-1 min-w-0 space-y-3">';
    dimOrder.forEach(function(key, idx) {
        var dimScs = scList.filter(function(sc) { return sc.dimKey === key; });
        if (dimScs.length === 0) return;
        var done = dimScs.filter(function(sc) { return getScResult(sc.key) === '达标'; }).length;
        var pct = Math.round(done/dimScs.length*100);
        var isFirst = idx === 0;

        html += '<div class="card-business rounded-lg overflow-hidden" id="accordion-' + key + '" data-dim="' + key + '">';
        html += '<div class="dim-accordion-header flex items-center justify-between p-4 ' + (isFirst ? 'open' : '') + '" onclick="toggleAccordion(\'' + key + '\')">';
        html += '<div class="flex items-center space-x-3"><i class="fas fa-' + dimScs[0].dimIcon + ' text-' + dimScs[0].dimColor + '-600"></i><h3 class="font-bold text-slate-800">' + dimScs[0].dimTitle + '</h3><span class="text-xs bg-slate-100 px-2.5 py-0.5 rounded-full text-slate-500 font-medium">' + dimScs.length + '类制度</span></div>';
        html += '<div class="flex items-center space-x-3"><span class="text-sm text-slate-500 hidden sm:inline">达标进度 </span><span class="text-sm font-bold text-slate-700">' + done + '/' + dimScs.length + '</span><div class="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block"><div class="h-full bg-' + dimScs[0].dimColor + '-500 rounded-full" style="width:' + pct + '%"></div></div><i class="fas fa-chevron-down text-slate-300 text-xs"></i></div>';
        html += '</div>';

        html += '<div class="dim-accordion-detail divide-y divide-slate-100 ' + (isFirst ? '' : 'hidden') + '">';
        dimScs.forEach(function(sc) {
            html += renderSubcategoryCard(sc);
        });
        html += '</div></div>';
    });
    // Individual standards content
    if (indivList.length > 0) {
        var indivDone = indivList.filter(function(sc) { return getScResult(sc.key) === '达标'; }).length;
        var indivPct = Math.round(indivDone/indivList.length*100);
        html += '<div class="card-business rounded-lg overflow-hidden" id="accordion-individual" data-dim="individual">';
        html += '<div class="dim-accordion-header flex items-center justify-between p-4" onclick="toggleAccordion(\'individual\')">';
        html += '<div class="flex items-center space-x-3"><i class="fas fa-industry text-amber-600"></i><h3 class="font-bold text-slate-800">单项标准</h3><span class="text-xs bg-slate-100 px-2.5 py-0.5 rounded-full text-slate-500 font-medium">' + indivList.length + '类</span></div>';
        html += '<div class="flex items-center space-x-3"><span class="text-sm text-slate-500 hidden sm:inline">达标进度 </span><span class="text-sm font-bold text-slate-700">' + indivDone + '/' + indivList.length + '</span><div class="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block"><div class="h-full bg-amber-500 rounded-full" style="width:' + indivPct + '%"></div></div><i class="fas fa-chevron-down text-slate-300 text-xs"></i></div>';
        html += '</div>';
        html += '<div class="dim-accordion-detail divide-y divide-slate-100 hidden">';
        indivList.forEach(function(sc) {
            html += renderSubcategoryCard(sc);
        });
        html += '</div></div>';
    }
    html += '</div>'; // end content
    html += '</div>'; // end flex

    dimView.innerHTML = html;
    document.getElementById('departmentView').innerHTML = renderDeptView();
    initTocScrollSpy();
}
function toggleAccordion(key) {
    var card = document.getElementById('accordion-' + key);
    if (!card) return;
    var header = card.querySelector('.dim-accordion-header');
    var detail = card.querySelector('.dim-accordion-detail');
    if (header) header.classList.toggle('open');
    if (detail) detail.classList.toggle('hidden');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // Update TOC active state
    document.querySelectorAll('.toc-group').forEach(function(g) { g.classList.remove('is-active'); });
    var toc = document.querySelector('.toc-group[data-dim="' + key + '"]');
    if (toc) toc.classList.add('is-active');
}
function filterStandardItems(val) {
    var items = document.querySelectorAll('#dimensionView .standard-item');
    var q = val.trim().toLowerCase();
    if (!q) { items.forEach(function(el) { el.style.display = ''; }); return; }
    items.forEach(function(el) {
        el.style.display = el.textContent.toLowerCase().indexOf(q) === -1 ? 'none' : '';
    });
}
function initTocScrollSpy() {
    var tocGroups = document.querySelectorAll('.toc-group');
    if (!tocGroups.length) return;
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            var group = document.querySelector('.toc-group[data-dim="' + entry.target.dataset.dim + '"]');
            if (!group) return;
            group.classList.toggle('is-active', entry.isIntersecting);
        });
    }, { threshold: 0, rootMargin: '-100px 0px -60% 0px' });
    document.querySelectorAll('#dimensionView [data-dim]').forEach(function(el) {
        if (el.id && el.id.indexOf('accordion-') === 0) observer.observe(el);
    });
}
// ── 子分类卡片渲染（替代原逐项渲染） ──────────────────────
function renderSubcategoryCard(sc) {
    var result = getScResult(sc.key);
    var config = getScConfig(sc.key);
    var totalItems = sc.items.length;
    var statusOptions = ['达标', '基本达标', '不达标', '不适用'];
    var statusColors = { '达标': 'emerald', '基本达标': 'amber', '不达标': 'red', '不适用': 'slate' };
    var statusLabels = { '达标': '✅', '基本达标': '⚠️', '不达标': '❌', '不适用': '—' };
    var scId = 'sc-' + sc.key.replace(/[^a-zA-Z0-9一-鿿]/g, '');
    // 子项 ID 列表
    var itemIds = sc.items.map(function(it) { return it.id + ' ' + it.name; }).join('、');

    // 构建配置信息
    var configHtml = '';
    if (config && (config.dept || config.owner || config.dueDate)) {
        var parts = [];
        if (config.dept) parts.push('<span><i class="fas fa-building mr-1"></i>' + safeEs(config.dept) + '</span>');
        if (config.owner) parts.push('<span><i class="fas fa-user mr-1"></i>' + safeEs(config.owner) + '</span>');
        if (config.startDate) parts.push('<span><i class="far fa-calendar-alt mr-1"></i>' + config.startDate + '</span>');
        if (config.dueDate) parts.push('<span><i class="far fa-clock mr-1"></i>' + config.dueDate + '</span>');
        configHtml = '<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 bg-blue-50 rounded px-2 py-1 mt-2">' + parts.join('') + '</div>';
    }

    var html = '';
    html += '<div id="' + scId + '" class="p-4 border-b border-slate-100 last:border-b-0">';

    // ── 头部：制度名称 + 部门 + 子项数 ──
    html += '<div class="flex items-center justify-between mb-3">';
    html += '<div><h4 class="font-bold text-slate-800">' + safeEs(sc.fullName) + '</h4>';
    html += '<p class="text-xs text-slate-400 mt-0.5">' + sc.dimTitle + ' · 负责部门: <span class="font-medium text-slate-600">' + sc.dept + '</span> · 含 ' + totalItems + ' 项子标准</p></div>';
    // 达标状态标签
    if (result) {
        html += '<span class="text-xs px-2 py-1 rounded-full bg-' + (statusColors[result] || 'slate') + '-50 text-' + (statusColors[result] || 'slate') + '-600 font-medium">' + (statusLabels[result] || '') + ' ' + result + '</span>';
    }
    html += '</div>';

    // ── 行1：达标情况勾选 + 配置/任务按钮 ──
    html += '<div class="flex items-center justify-between flex-wrap gap-2 mb-3">';
    html += '<div class="flex items-center space-x-1.5">';
    html += '<span class="text-xs font-medium text-slate-600 mr-1">达标情况：</span>';
    statusOptions.forEach(function(opt) {
        var checked = result === opt ? 'checked' : '';
        var color = statusColors[opt];
        html += '<label class="flex items-center space-x-1 px-2.5 py-1 rounded border text-xs cursor-pointer transition-colors ' +
            (checked ? 'border-' + color + '-500 bg-' + color + '-50 text-' + color + '-600' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300') + '">';
        html += '<input type="radio" name="sc_status_' + sc.key.replace(/[^a-zA-Z0-9]/g, '') + '" value="' + opt + '" ' + checked + ' onchange="saveScResult(\'' + sc.key + '\',\'' + opt + '\')" class="mr-0.5">';
        html += opt + '</label>';
    });
    html += '</div>';
    html += '<div class="flex items-center space-x-1.5">';
    html += '<button onclick="toggleEditConfig(this, \'' + sc.key + '\')" class="text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded px-2 py-1 hover:bg-slate-50"><i class="fas fa-pen mr-1"></i>编辑</button>';
    html += '<button onclick="showScEvidenceUpload(\'' + sc.key + '\')" class="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50"><i class="fas fa-upload mr-1"></i>上传资料</button>';
    html += '</div>';
    html += '</div>';

    // 已保存的配置信息 + 内联编辑表单
    if (configHtml) html += configHtml;
    // 内联编辑区（默认隐藏）
    html += '<div class="edit-config-inline hidden mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200" data-sc-key="' + sc.key + '">';
    html += '<div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">';
    html += '<div><label class="text-xs font-medium text-slate-600 block mb-0.5">负责部门</label><select class="edit-dept w-full border border-slate-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-blue-500">';
    html += '<option value="">请选择</option>';
    if (typeof DEPARTMENTS !== 'undefined') {
        DEPARTMENTS.forEach(function(d) {
            var sel = config && config.dept === d ? 'selected' : '';
            html += '<option value="' + d + '" ' + sel + '>' + d + '</option>';
        });
    }
    html += '</select></div>';
    html += '<div><label class="text-xs font-medium text-slate-600 block mb-0.5">负责人</label><input type="text" class="edit-owner w-full border border-slate-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-blue-500" value="' + (config ? safeEs(config.owner) : '') + '" placeholder="负责人姓名"></div>';
    html += '<div><label class="text-xs font-medium text-slate-600 block mb-0.5">协助人</label><input type="text" class="edit-assistant w-full border border-slate-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-blue-500" value="' + (config ? safeEs(config.assistant) : '') + '" placeholder="协助人姓名"></div>';
    html += '</div>';
    html += '<div class="flex justify-end space-x-2">';
    html += '<button onclick="saveInlineEditConfig(this, \'' + sc.key + '\')" class="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"><i class="fas fa-check mr-1"></i>保存</button>';
    html += '<button onclick="closeInlineEditConfig(this)" class="text-xs text-slate-500 px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50">取消</button>';
    html += '</div></div>';

    // ── 资料文件列表 ──
    html += '<div id="ev-list-' + sc.key.replace(/[^a-zA-Z0-9]/g, '') + '" class="flex flex-wrap gap-1.5 mb-2"></div>';

    // ── 行2：展开查看完整制度原文 ──
    html += '<div class="mt-2">';
    html += '<button onclick="toggleFullText(this)" class="text-xs text-slate-400 hover:text-slate-600 flex items-center"><i class="fas fa-chevron-right mr-1 transition-transform"></i>展开查看完整制度原文及' + totalItems + '项子标准详情</button>';
    html += '<div class="full-text-content hidden mt-2 space-y-3">';

    // 官方完整制度原文
    if (sc.fullText) {
        var truncated = sc.fullText.length > 300 ? sc.fullText.slice(0, 300) + '…' : sc.fullText;
        html += '<div class="p-3 bg-slate-50 rounded-lg text-xs"><p class="font-semibold text-slate-700 mb-2">📋 海关完整制度原文：</p>';
        html += '<div class="space-y-2" id="fullText-' + scId + '">' + formatTextParagraphs(truncated) + '</div>';
        if (sc.fullText.length > 300) {
            html += '<button onclick="toggleFullTextExpand(this, \'' + scId + '\')" class="text-xs text-blue-500 hover:text-blue-700 mt-2" data-full="' + safeEs(sc.fullText) + '">展开全部</button>';
        }
        html += '</div>';
    }

    // 各子项详情列表
    if (sc.items.length > 0) {
        html += '<div class="divide-y divide-slate-100 border border-slate-200 rounded-lg">';
        sc.items.forEach(function(it, idx) {
            html += '<div class="p-3">';
            html += '<div class="flex items-start justify-between">';
            html += '<div><span class="text-xs font-mono font-bold text-slate-400">' + it.id + '</span>';
            html += '<span class="text-sm font-medium text-slate-700 ml-1">' + safeEs(it.name) + '</span></div>';
            html += '<span class="text-xs text-slate-400">' + (it.dept || '') + '</span>';
            html += '</div>';
            // 检查要点
            if (it.checkPoints && it.checkPoints.length) {
                html += '<ul class="list-disc list-inside text-xs text-slate-500 mt-1 space-y-0.5">';
                it.checkPoints.forEach(function(cp) { html += '<li>' + safeEs(cp) + '</li>'; });
                html += '</ul>';
            }
            // 样本资料
            if (it.sampleDocs && it.sampleDocs.length) {
                html += '<p class="text-xs text-slate-400 mt-1">📎 ' + safeEs(it.sampleDocs.join('、')) + '</p>';
            }
            html += '</div>';
        });
        html += '</div>';
    }

    html += '</div>'; // end full-text-content
    html += '</div>'; // end toggle div

    html += '</div>'; // end subcategory card
    return html;
}

// 将完整制度原文按句分段，返回段落HTML
function formatTextParagraphs(text) {
    if (!text) return '';
    // 按句号、分号、换行分段
    var parts = text.split(/(?<=[。；;])\s*/);
    return parts.filter(function(p) { return p.trim(); }).map(function(p) {
        return '<p class="text-slate-600 leading-relaxed mb-2 last:mb-0">' + safeEs(p.trim()) + '</p>';
    }).join('');
}

// 保存子分类达标结果
function saveScResult(scKey, val) {
    setScResult(scKey, val);
    showToast('已标记: ' + val, 'success');
    // 更新进度统计
    updateProgressBar();
}

// 搜索筛选
function filterScCards(val) {
    var q = val.trim().toLowerCase();
    document.querySelectorAll('#dimensionView [id^="sc-"]').forEach(function(el) {
        el.style.display = (!q || el.textContent.toLowerCase().indexOf(q) !== -1) ? '' : 'none';
    });
}

// 展开/收起完整制度原文
function toggleFullText(btn) {
    var content = btn.nextElementSibling;
    var arrow = btn.querySelector('.fa-chevron-right');
    if (content) {
        content.classList.toggle('hidden');
        if (arrow) arrow.style.transform = content.classList.contains('hidden') ? '' : 'rotate(90deg)';
    }
}
function toggleFullTextExpand(btn, scId) {
    var el = document.getElementById('fullText-' + scId);
    if (el) {
        el.innerHTML = formatTextParagraphs(btn.dataset.full || el.textContent);
        btn.textContent = '收起';
        btn.onclick = function() {
            var truncated = (btn.dataset.full || '').slice(0, 300) + '…';
            el.innerHTML = formatTextParagraphs(truncated);
            btn.textContent = '展开全部';
            btn.onclick = function() { toggleFullTextExpand(btn, scId); };
        };
    }
}

// 更新进度条
function updateProgressBar() {
    var scList = getSubcategoryList();
    var dimOrder = ['internal','finance','compliance','security','bonus'];
    dimOrder.forEach(function(key) {
        var dimScs = scList.filter(function(sc) { return sc.dimKey === key; });
        var done = dimScs.filter(function(sc) { return getScResult(sc.key) === '达标'; }).length;
        var pct = dimScs.length > 0 ? Math.round(done/dimScs.length*100) : 0;
        var cap = key.charAt(0).toUpperCase() + key.slice(1);
        // Update stat card in standard view
        var statCards = document.querySelectorAll('.dim-accordion-header');
        // Update progress bars
    });
}

// ── 子分类任务配置 ──────────────────────────────────
function showScConfigModal(scKey, scName) {
    var config = getScConfig(scKey);
    var sc = getSubcategoryByKey(scKey);
    document.getElementById('scConfigKey').value = scKey;
    document.getElementById('scConfigTitle').textContent = scName;
    // 部门下拉
    var deptSel = document.getElementById('scConfigDept');
    deptSel.innerHTML = '<option value="">请选择责任部门</option>';
    if (typeof DEPARTMENTS !== 'undefined') {
        DEPARTMENTS.forEach(function(d) { deptSel.innerHTML += '<option value="' + d + '">' + d + '</option>'; });
    }
    if (config) {
        deptSel.value = config.dept || (sc ? sc.dept : '');
        document.getElementById('scConfigOwner').value = config.owner || '';
        document.getElementById('scConfigAssistant').value = config.assistant || '';
        document.getElementById('scConfigStartDate').value = config.startDate || '';
        document.getElementById('scConfigDueDate').value = config.dueDate || '';
    } else {
        deptSel.value = sc ? sc.dept : '';
        document.getElementById('scConfigOwner').value = '';
        document.getElementById('scConfigAssistant').value = '';
        document.getElementById('scConfigStartDate').value = '';
        document.getElementById('scConfigDueDate').value = '';
    }
    document.getElementById('scConfigModal').classList.add('active');
}

function saveScConfig() {
    var scKey = document.getElementById('scConfigKey').value;
    if (!scKey) return;
    var config = {
        dept: document.getElementById('scConfigDept').value,
        owner: document.getElementById('scConfigOwner').value.trim(),
        assistant: document.getElementById('scConfigAssistant').value.trim(),
        startDate: document.getElementById('scConfigStartDate').value,
        dueDate: document.getElementById('scConfigDueDate').value
    };
    setScConfig(scKey, config);
    closeModal('scConfigModal');
    loadStandards();
    showToast('任务配置已保存', 'success');
}

function scConfigGenerateTask() {
    var scKey = document.getElementById('scConfigKey').value;
    if (!scKey) return;
    var config = {
        dept: document.getElementById('scConfigDept').value,
        owner: document.getElementById('scConfigOwner').value.trim(),
        assistant: document.getElementById('scConfigAssistant').value.trim(),
        startDate: document.getElementById('scConfigStartDate').value,
        dueDate: document.getElementById('scConfigDueDate').value
    };
    setScConfig(scKey, config);
    // 查找子分类名称
    var sc = getSubcategoryByKey(scKey);
    var scName = sc ? sc.fullName : scKey;
    // 创建任务
    var tasks = loadData('tasks', []);
    tasks.push({
        id: generateTaskId(),
        name: '【制度】' + scName,
        standard: scKey,
        dept: config.dept || (sc ? sc.dept : ''),
        owner: config.owner || '',
        due: config.dueDate || '',
        req: '',
        attachReq: '',
        status: '待下发',
        evidence: [],
        assistant: config.assistant || '',
        startDate: config.startDate || '',
        createdAt: new Date().toISOString()
    });
    saveData('tasks', tasks);
    closeModal('scConfigModal');
    loadStandards();
    showToast('配置已保存，任务已创建: ' + scName, 'success');
    addAuditLog('从制度创建任务: ' + scKey, 'task', (config.dept || '') + ' · ' + (config.owner || ''));
}

// ── 内联编辑：负责部门/负责人/协助人 ──────────────────
function toggleEditConfig(btn, scKey) {
    var card = btn.closest('.p-4');
    var editArea = card ? card.querySelector('.edit-config-inline') : null;
    if (!editArea) return;
    editArea.classList.toggle('hidden');
}

function saveInlineEditConfig(btn, scKey) {
    var editArea = btn.closest('.edit-config-inline');
    if (!editArea) return;
    var dept = editArea.querySelector('.edit-dept').value;
    var owner = editArea.querySelector('.edit-owner').value.trim();
    var assistant = editArea.querySelector('.edit-assistant').value.trim();
    var config = {
        dept: dept,
        owner: owner,
        assistant: assistant,
        startDate: '',
        dueDate: ''
    };
    setScConfig(scKey, config);
    // 如果指派了部门/责任人，生成任务
    if (dept || owner) {
        var sc = getSubcategoryByKey(scKey);
        var scName = sc ? sc.fullName : scKey;
        var tasks = loadData('tasks', []);
        tasks.push({
            id: generateTaskId(),
            name: '【制度】' + scName,
            standard: scKey,
            dept: dept,
            owner: owner,
            due: '',
            req: '',
            status: '待下发',
            priority: 'normal',
            evidence: [],
            assistant: assistant,
            startDate: '',
            createdAt: new Date().toISOString()
        });
        saveData('tasks', tasks);
        addAuditLog('从制度创建任务: ' + scKey, 'task', (dept || '') + ' · ' + (owner || ''));
    }
    showToast('负责信息已保存', 'success');
    loadStandards();
}

function closeInlineEditConfig(btn) {
    var editArea = btn.closest('.edit-config-inline');
    if (editArea) editArea.classList.add('hidden');
}

// ── 子分类资料上传（复用原证据弹窗，修改 ref_id） ──
function showScEvidenceUpload(scKey) {
    var sc = getSubcategoryByKey(scKey);
    var name = sc ? sc.fullName : scKey;
    // 复用原上传弹窗，ID改为子分类的key
    document.getElementById('evidenceUploadStdId').textContent = scKey;
    document.getElementById('evidenceUploadStdName').textContent = name;
    document.getElementById('evidenceUploadStdKey').value = scKey;
    document.getElementById('evidenceUploadInput').value = '';
    document.getElementById('evidenceUploadFileLabel').textContent = '点击上传文件';
    document.getElementById('evidenceUploadNote').value = '';
    document.getElementById('evidenceUploadProgress').classList.add('hidden');
    document.getElementById('evidenceUploadModal').classList.add('active');
    loadEvidenceFiles(scKey);
}

// ── 部门视图（改用子分类统计） ──
function renderDeptView() {
    var scList = getSubcategoryList();
    var indivList = getIndividualStandardsList();
    var deptMap = {};
    // 添加"未分配部门"组
    deptMap['未分配部门'] = [];
    DEPARTMENTS.forEach(function(d) { deptMap[d] = []; });
    scList.forEach(function(sc) {
        var targetDept = sc.dept && DEPARTMENTS.indexOf(sc.dept) !== -1 ? sc.dept : '未分配部门';
        deptMap[targetDept].push(sc);
    });
    // 单项标准放入独立的"单项标准"组
    if (indivList.length > 0) {
        deptMap['单项标准'] = indivList;
    }
    return Object.keys(deptMap).filter(function(d) { return deptMap[d].length > 0; }).map(function(dept) {
        var items = deptMap[dept];
        var done = items.filter(function(sc) { return getScResult(sc.key) === '达标'; }).length;
        var pct = items.length > 0 ? Math.round(done/items.length*100) : 0;
        var scColor = pct >= 80 ? 'emerald' : pct >= 50 ? 'amber' : 'red';
        var isIndividual = dept === '单项标准';
        var icon = isIndividual ? 'fa-industry' : 'fa-building';
        var iconColor = isIndividual ? 'amber' : 'slate';
        var isMixed = dept === '未分配部门';
        return '<div class="card-business rounded-lg overflow-hidden mb-4">' +
            '<div class="flex items-center justify-between p-4 bg-white border-b border-slate-100">' +
            '<div class="flex items-center space-x-2"><i class="fas ' + icon + ' text-' + iconColor + '-400"></i>' +
            '<h3 class="font-bold text-slate-800">' + dept + '</h3>' +
            '<span class="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-medium">' + items.length + '类</span></div>' +
            '<div class="flex items-center space-x-2"><span class="text-sm font-bold text-' + scColor + '-600">' + done + '/' + items.length + '</span>' +
            '<div class="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block"><div class="h-full bg-' + scColor + '-500 rounded-full" style="width:' + pct + '%"></div></div>' +
            (pct >= 80 ? '<span class="text-xs text-emerald-600">✅</span>' : pct >= 50 ? '<span class="text-xs text-amber-600">⚠️</span>' : '<span class="text-xs text-red-600">❌</span>') +
            '</div></div>' +
            '<div class="divide-y divide-slate-100 bg-white">' +
            items.map(function(sc) { return renderSubcategoryCard(sc); }).join('') +
            '</div></div>';
    }).join('');
}
function switchStandardsView(view) {
    stdView = view;
    document.getElementById('dimensionView').classList.toggle('hidden', view !== 'dimension');
    document.getElementById('departmentView').classList.toggle('hidden', view !== 'department');
    document.getElementById('viewBtnDimension').className = 'view-toggle-btn' + (view === 'dimension' ? ' active' : '');
    document.getElementById('viewBtnDept').className = 'view-toggle-btn' + (view === 'department' ? ' active' : '');
}
function switchStandardType(type) {
    stdType = type;
    document.getElementById('stdBtnAdvanced').className = 'std-btn' + (type === 'advanced' ? ' active' : '');
    document.getElementById('stdBtnCertified').className = 'std-btn' + (type === 'certified' ? ' active' : '');
    loadStandards();
}


function onEvidenceFileSelected(event) {
    var file = event.target.files[0];
    if (!file) return;
    var label = document.getElementById('evidenceUploadFileLabel');
    label.textContent = file.name + ' (' + (file.size / 1024).toFixed(1) + ' KB)';
    uploadEvidenceFile(file);
}

async function uploadEvidenceFile(file) {
    var stdId = document.getElementById('evidenceUploadStdKey').value;
    var evType = document.getElementById('evidenceUploadType').value;
    var note = document.getElementById('evidenceUploadNote').value.trim();
    var progress = document.getElementById('evidenceUploadProgress');
    var bar = document.getElementById('evidenceUploadBar');
    var pct = document.getElementById('evidenceUploadPercent');
    progress.classList.remove('hidden');
    bar.style.width = '30%';
    pct.textContent = '30%';

    var formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'evidence');
    formData.append('ref_module', 'standard');
    formData.append('ref_id', stdId);
    formData.append('ref_year', new Date().getFullYear().toString());

    try {
        var res = await fetch(API_BASE + '/api/files/upload', {
            method: 'POST', headers: getAuthHeaders(false),
            body: formData
        });
        var result = await res.json();
        if (result.ok) {
            bar.style.width = '100%';
            pct.textContent = '100%';
            setTimeout(function() {
                progress.classList.add('hidden');
                bar.style.width = '0%';
                pct.textContent = '0%';
                showToast('资料文件已上传: ' + file.name, 'success');
                loadEvidenceFiles(stdId);
                // Update evidence dot
                toggleEvidenceStatus(stdId, evType);
            }, 500);
        } else {
            showToast('上传失败', 'error');
            progress.classList.add('hidden');
        }
    } catch (err) {
        showToast('上传失败: ' + err.message, 'error');
        progress.classList.add('hidden');
    }
}

async function loadEvidenceFiles(stdId) {
    var id = stdId.replace(/[^a-zA-Z0-9]/g, '');
    var container = document.getElementById('evidenceUploadedList');
    var section = document.getElementById('evidence-list-' + id);
    try {
        var res = await fetch(API_BASE + '/api/files?ref_module=standard&ref_id=' + stdId, {
            headers: getAuthHeaders()
        });
        var files = await res.json();
        // Show in modal
        var modalContainer = document.getElementById('evidenceUploadedFiles');
        if (files && files.length > 0) {
            modalContainer.classList.remove('hidden');
            container.innerHTML = files.map(function(f) {
                var icons = { 'application/pdf': 'fa-file-pdf', 'image/': 'fa-file-image', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'fa-file-excel', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fa-file-word' };
                var icon = 'fa-file';
                Object.keys(icons).forEach(function(k) { if (f.mime_type && f.mime_type.indexOf(k) === 0) icon = icons[k]; });
                return '<div class="flex items-center justify-between p-2 bg-slate-50 rounded text-xs"><div class="flex items-center space-x-2"><i class="fas ' + icon + ' text-slate-400"></i><span class="text-slate-700">' + escapeHtml(f.original_name) + '</span></div><a href="' + API_BASE + '/api/files/' + f.id + '/view" target="_blank" class="text-blue-600 hover:underline"><i class="fas fa-eye"></i></a></div>';
            }).join('');
        } else {
            modalContainer.classList.add('hidden');
        }
        // Show in standard item
        if (section && files && files.length > 0) {
            section.innerHTML = files.map(function(f) {
                var icon = 'fa-file';
                if (f.mime_type && f.mime_type.indexOf('pdf') >= 0) icon = 'fa-file-pdf';
                else if (f.mime_type && f.mime_type.indexOf('image') >= 0) icon = 'fa-file-image';
                else if (f.mime_type && f.mime_type.indexOf('spreadsheet') >= 0) icon = 'fa-file-excel';
                return '<a href="' + API_BASE + '/api/files/' + f.id + '/view" target="_blank" class="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100"><i class="fas ' + icon + ' mr-1"></i>' + escapeHtml(f.original_name) + '</a>';
            }).join('');
        }
    } catch(e) { /* ignore */ }
}

function toggleEvidenceStatus(stdId, type) {
    var data = standardsData[stdType] || standardsData['advanced'];
    if (!data) return;
    Object.keys(data).forEach(function(dimKey) {
        var dim = data[dimKey];
        var idx = (dim.items || []).findIndex(function(it) { return it.id === stdId; });
        if (idx >= 0) {
            var ev = dim.items[idx].evidence;
            if (type === 'policy') ev.policy = true;
            else if (type === 'record') ev.record = true;
            else if (type === 'approval') ev.approval = true;
            if (window.loadStandards) loadStandards();
        }
    });
}

// ------------------------------------------------------------------------
// 9. 任务管理
// ------------------------------------------------------------------------
function generateTaskId() {
    const tasks = loadData('tasks', []);
    const nums = tasks.map(t => { const m = t.id.match(/TSK-2026-(\d+)/); return m ? parseInt(m[1]) : 0; });
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return 'TSK-2026-' + String(next).padStart(4, '0');
}
function loadTasks() { return loadData('tasks', []); }
function showTaskModal() {
    // 部门下拉（含"其他"）
    const deptSelect = document.getElementById('taskDeptInput');
    deptSelect.innerHTML = '<option value="">请选择部门</option>' + DEPARTMENTS.map(d => '<option value="' + d + '">' + d + '</option>').join('') + '<option value="__other__">其他（手动输入）</option>';
    document.getElementById('taskDeptOtherWrap').classList.add('hidden');
    document.getElementById('taskDeptOther').value = '';
    // 标准下拉：按维度 → 子分类分组
    const stdSelect = document.getElementById('taskStandardInput');
    stdSelect.innerHTML = '<option value="">无特定关联</option>';
    var dimOrder = ['internal','finance','compliance','security','bonus'];
    var dimNames = { internal:'内部控制', finance:'财务状况', compliance:'守法规范', security:'贸易安全', bonus:'附加标准' };
    dimOrder.forEach(function(dimKey) {
        var dimScs = getSubcategoryList().filter(function(sc) { return sc.dimKey === dimKey; });
        if (dimScs.length === 0) return;
        var optgroup = document.createElement('optgroup');
        optgroup.label = dimNames[dimKey] || dimKey;
        dimScs.forEach(function(sc) {
            var opt = document.createElement('option');
            opt.value = sc.key;
            opt.textContent = sc.fullName + '（' + sc.items.length + '项）';
            optgroup.appendChild(opt);
        });
        stdSelect.appendChild(optgroup);
    });
    // 单项标准
    var indivList = getIndividualStandardsList();
    if (indivList.length > 0) {
        var optgroup = document.createElement('optgroup');
        optgroup.label = '单项标准';
        indivList.forEach(function(sc) {
            var opt = document.createElement('option');
            opt.value = sc.key;
            opt.textContent = sc.fullName + '（' + sc.items.length + '项）';
            optgroup.appendChild(opt);
        });
        stdSelect.appendChild(optgroup);
    }
    document.getElementById('taskModal').classList.add('active');
}
function onTaskDeptChange() {
    var sel = document.getElementById('taskDeptInput');
    var wrap = document.getElementById('taskDeptOtherWrap');
    if (sel.value === '__other__') {
        wrap.classList.remove('hidden');
    } else {
        wrap.classList.add('hidden');
    }
}
function closeTaskModal() { document.getElementById('taskModal').classList.remove('active'); }
function createNewTask() {
    const name = document.getElementById('taskNameInput').value.trim();
    var dept = document.getElementById('taskDeptInput').value;
    if (dept === '__other__') dept = document.getElementById('taskDeptOther').value.trim();
    const owner = document.getElementById('taskOwnerInput').value.trim();
    const due = document.getElementById('taskDueInput').value;
    if (!name || !dept || !owner || !due) { showToast('请填写任务名称、执行部门、负责人和截止日期', 'error'); return; }
    const tasks = loadData('tasks', []);
    tasks.push({ id: generateTaskId(), name: name, standard: document.getElementById('taskStandardInput').value || '', dept: dept, owner: owner, due: due, req: document.getElementById('taskReqInput').value || '', attachReq: document.getElementById('taskAttachInput').value || '', status: '待下发', evidence: [], createdAt: new Date().toISOString() });
    saveData('tasks', tasks);
    closeTaskModal();
    ['taskNameInput','taskOwnerInput','taskDueInput','taskReqInput','taskAttachInput','taskDeptOther'].forEach(id => document.getElementById(id).value = '');
    showToast('任务创建成功: ' + name);
    addAuditLog('创建任务: ' + name, 'task', dept + ' · ' + owner);
    renderTaskTable(); renderTaskKanban(); renderTaskProjectView(); updateDashboard();
}
function renderTaskTable() {
    let tasks = loadData('tasks', []);
    const filterDept = document.getElementById('taskFilterDept').value;
    const filterStatus = document.getElementById('taskFilterStatus').value;
    if (filterDept) tasks = tasks.filter(t => t.dept === filterDept);
    if (filterStatus) tasks = tasks.filter(t => t.status === filterStatus);
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const container = document.getElementById('taskTableContainer');
    if (!tasks.length) { container.innerHTML = '<div class="text-center py-12 text-slate-400"><i class="fas fa-inbox text-5xl mb-4"></i><p>暂无任务，点击右上角"新建任务"开始</p></div>'; return; }
    const isChecked = function(id) { return selectedTasks.has(id); };
    container.innerHTML = '<table class="w-full text-left text-sm"><thead class="bg-slate-50 border-b border-slate-200"><tr><th class="px-2 py-3 w-8"><input type="checkbox" onchange="document.querySelectorAll(\'.task-checkbox\').forEach(c=>{c.checked=this.checked;toggleTaskSelection(c.value)})"></th><th class="px-4 py-3 font-semibold text-slate-700">编号</th><th class="px-4 py-3 font-semibold text-slate-700">任务名称</th><th class="px-4 py-3 font-semibold text-slate-700">部门</th><th class="px-4 py-3 font-semibold text-slate-700">负责人</th><th class="px-4 py-3 font-semibold text-slate-700">状态</th><th class="px-4 py-3 font-semibold text-slate-700">截止日期</th><th class="px-4 py-3 font-semibold text-slate-700">操作</th></tr></thead><tbody class="divide-y divide-slate-100">' + tasks.map(t => {
        const isOverdue = new Date(t.due) < new Date() && t.status !== '已完成' && t.status !== '已关闭';
        const sc = isOverdue ? 'overdue' : ({'待下发':'pending','执行中':'executing','审核中':'review','已完成':'done','已关闭':'closed'}[t.status]||'pending');
        return '<tr class="hover:bg-slate-50"><td class="px-2 py-3"><input type="checkbox" class="task-checkbox" value="' + t.id + '" ' + (selectedTasks.has(t.id)?'checked':'') + ' onchange="toggleTaskSelection(this.value)"></td><td class="px-4 py-3 font-mono font-medium text-slate-600">' + t.id + '</td><td class="px-4 py-3 font-medium text-slate-800">' + t.name + '</td><td class="px-4 py-3"><span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">' + t.dept + '</span></td><td class="px-4 py-3 text-slate-600">' + t.owner + '</td><td class="px-4 py-3"><span class="task-status ' + sc + '">' + (isOverdue ? '已超期' : t.status) + '</span></td><td class="px-4 py-3 ' + (isOverdue ? 'text-red-600 font-medium' : 'text-slate-500') + '">' + t.due + '</td><td class="px-4 py-3"><div class="flex space-x-2">' + (t.status === '待下发' ? '<button onclick="confirmAndUpdateTask(\'' + t.id + '\',\'执行中\',\'下发\')" class="text-blue-600 hover:text-blue-800 text-xs">下发</button>' : '') + (t.status === '执行中' ? '<button onclick="confirmAndUpdateTask(\'' + t.id + '\',\'审核中\',\'提交审核\')" class="text-purple-600 hover:text-purple-800 text-xs">提交</button>' : '') + (t.status === '审核中' ? '<button onclick="confirmAndUpdateTask(\'' + t.id + '\',\'已完成\',\'审核通过\')" class="text-emerald-600 hover:text-emerald-800 text-xs">通过</button><button onclick="confirmAndUpdateTask(\'' + t.id + '\',\'执行中\',\'退回重做\')" class="text-red-600 hover:text-red-800 text-xs">退回</button>' : '') + '<button onclick="showTaskDetail(\'' + t.id + '\')" class="text-slate-500 hover:text-slate-700 text-xs">详情</button></div></td></tr>';
    }).join('') + '</tbody></table>';
    updateTaskCounts();
}
function updateTaskCounts() {
    const tasks = loadData('tasks', []);
    document.getElementById('taskPendingCount').textContent = tasks.filter(t => t.status === '待下发').length;
    document.getElementById('taskExecutingCount').textContent = tasks.filter(t => t.status === '执行中').length;
    document.getElementById('taskReviewCount').textContent = tasks.filter(t => t.status === '审核中').length;
    document.getElementById('taskDoneCount').textContent = tasks.filter(t => t.status === '已完成').length;
    document.getElementById('taskOverdueCount').textContent = tasks.filter(t => new Date(t.due) < new Date() && t.status !== '已完成' && t.status !== '已关闭').length;
}
function renderTaskKanban() {
    const tasks = loadData('tasks', []);
    const statuses = ['待下发','执行中','审核中','已完成'];
    const statusMeta = { '待下发':{color:'slate',icon:'fa-hourglass-start'}, '执行中':{color:'blue',icon:'fa-spinner'}, '审核中':{color:'purple',icon:'fa-check-double'}, '已完成':{color:'emerald',icon:'fa-check-circle'} };
    const pctMap = { '待下发':0, '执行中':40, '审核中':70, '已完成':100 };
    document.getElementById('taskKanban').innerHTML =
        '<div class="grid grid-cols-1 md:grid-cols-4 gap-4">' +
        statuses.map(function(status) {
            var meta = statusMeta[status];
            var colTasks = tasks.filter(function(t) { return t.status === status; });
            return '<div class="bg-slate-50 rounded-xl p-3 border border-slate-200">' +
                '<div class="flex items-center justify-between mb-3">' +
                '<h4 class="font-semibold text-sm text-' + meta.color + '-700 flex items-center">' +
                '<i class="fas ' + meta.icon + ' mr-1.5 text-' + meta.color + '-500"></i>' + status + '</h4>' +
                '<span class="bg-' + meta.color + '-100 text-' + meta.color + '-700 text-xs font-bold px-2 py-0.5 rounded-full">' + colTasks.length + '</span>' +
                '</div>' +
                '<div class="space-y-2 min-h-[100px]">' +
                (colTasks.length === 0
                    ? '<div class="text-center py-6 text-slate-400 text-xs"><i class="fas fa-inbox mb-1"></i><p>暂无任务</p></div>'
                    : colTasks.map(function(t) {
                        var overdue = new Date(t.due) < new Date() && status !== '已完成';
                        var dueSoon = !overdue && t.due && status !== '已完成' &&
                            (new Date(t.due) - new Date()) < 3 * 24 * 60 * 60 * 1000;
                        var pct = pctMap[status] || 0;
                        var cardBg = overdue ? 'bg-red-50 border-l-2 border-red-400' : dueSoon ? 'bg-amber-50 border-l-2 border-amber-400' : 'bg-white';
                        return '<div class="' + cardBg + ' rounded-lg p-2.5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onclick="showTaskDetail(\'' + t.id + '\')">' +
                            '<p class="text-xs font-medium text-slate-800 leading-relaxed">' + safeEs(t.name) + '</p>' +
                            '<div class="flex flex-wrap items-center gap-1.5 mt-1.5">' +
                            '<span class="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"><i class="fas fa-building mr-0.5"></i>' + safeEs(t.dept) + '</span>' +
                            (t.standard ? '<span class="text-xs bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded font-mono">#' + safeEs(t.standard) + '</span>' : '') +
                            (t.due ? '<span class="text-xs ' + (overdue ? 'text-red-600 font-medium bg-red-50' : dueSoon ? 'text-amber-600 bg-amber-50' : 'text-slate-400') + ' px-1.5 py-0.5 rounded"><i class="far fa-calendar-alt mr-0.5"></i>' + safeEs(t.due) + '</span>' : '') +
                            (status !== '已完成' ? '<span class="ml-auto text-xs text-slate-400">' + pct + '%</span>' : '') +
                            '</div></div>';
                    }).join('')
                ) +
                '</div></div>';
        }).join('') +
        '</div>';
}
function switchTaskView(view) {
    document.getElementById('taskKanbanWrap').classList.toggle('hidden', view !== 'kanban');
    document.getElementById('taskProjectWrap').classList.toggle('hidden', view !== 'project');
    document.getElementById('taskViewBtnKanban').className = 'view-toggle-btn px-3 py-1.5 rounded-md text-xs font-medium' + (view === 'kanban' ? ' bg-white text-slate-800 shadow-sm' : ' text-slate-500');
    document.getElementById('taskViewBtnProject').className = 'view-toggle-btn px-3 py-1.5 rounded-md text-xs font-medium' + (view === 'project' ? ' bg-white text-slate-800 shadow-sm' : ' text-slate-500');
    if (view === 'project') renderTaskProjectView();
}
function renderTaskProjectView() {
    var scList = getSubcategoryList();
    var indivList = getIndividualStandardsList();
    var scAssessment = loadScAssessment();
    var tasks = loadData('tasks', []);
    var dimOrder = ['internal','finance','compliance','security','bonus'];
    var dimMeta = {
        internal: { title:'内部控制', icon:'fa-building', color:'blue' },
        finance: { title:'财务状况', icon:'fa-chart-line', color:'emerald' },
        compliance: { title:'守法规范', icon:'fa-gavel', color:'violet' },
        security: { title:'贸易安全', icon:'fa-shield-halved', color:'amber' },
        bonus: { title:'附加标准', icon:'fa-star', color:'indigo' }
    };
    var html = '<div class="space-y-6">';
    // 维度汇总行
    html += '<div class="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">';
    dimOrder.forEach(function(dimKey) {
        var dimScs = scList.filter(function(sc) { return sc.dimKey === dimKey; });
        if (dimScs.length === 0) return;
        var done = dimScs.filter(function(sc) { return scAssessment[sc.key] === '达标'; }).length;
        var pct = Math.round(done/dimScs.length*100);
        var meta = dimMeta[dimKey] || { title:dimKey, icon:'fa-folder', color:'slate' };
        html += '<div class="bg-white rounded-lg border border-slate-200 p-2.5 text-center">';
        html += '<p class="text-xs text-slate-500">' + meta.title + '</p>';
        html += '<p class="text-lg font-bold text-' + (pct >= 80 ? 'emerald' : pct >= 50 ? 'amber' : 'red') + '-600">' + pct + '%</p>';
        html += '<p class="text-xs text-slate-400">' + done + '/' + dimScs.length + '</p></div>';
    });
    // 单项标准汇总
    if (indivList.length > 0) {
        var indivDone = indivList.filter(function(sc) { return scAssessment[sc.key] === '达标'; }).length;
        var indivPct = Math.round(indivDone/indivList.length*100);
        html += '<div class="bg-white rounded-lg border border-slate-200 p-2.5 text-center">';
        html += '<p class="text-xs text-slate-500">单项标准</p>';
        html += '<p class="text-lg font-bold text-' + (indivPct >= 80 ? 'emerald' : indivPct >= 50 ? 'amber' : 'red') + '-600">' + indivPct + '%</p>';
        html += '<p class="text-xs text-slate-400">' + indivDone + '/' + indivList.length + '</p></div>';
    }
    html += '</div>';

    // 逐维度展开子分类详情
    dimOrder.forEach(function(dimKey) {
        var dimScs = scList.filter(function(sc) { return sc.dimKey === dimKey; });
        if (dimScs.length === 0) return;
        var dimDone = dimScs.filter(function(sc) { return scAssessment[sc.key] === '达标'; }).length;
        var dimPct = Math.round(dimDone/dimScs.length*100);
        var meta = dimMeta[dimKey] || {};
        html += '<div class="bg-white rounded-lg border border-slate-200 overflow-hidden">';
        html += '<div class="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">';
        html += '<div class="flex items-center space-x-2"><i class="fas ' + (meta.icon || 'fa-folder') + ' text-' + (meta.color || 'slate') + '-600"></i><h4 class="font-bold text-slate-800">' + (meta.title || dimKey) + '</h4></div>';
        html += '<div class="flex items-center space-x-2"><span class="text-sm font-bold text-slate-700">' + dimDone + '/' + dimScs.length + '</span><div class="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden"><div class="h-full bg-' + (dimPct >= 80 ? 'emerald' : dimPct >= 50 ? 'amber' : 'red') + '-500 rounded-full" style="width:' + dimPct + '%"></div></div></div>';
        html += '</div>';
        html += '<div class="divide-y divide-slate-100">';
        dimScs.forEach(function(sc) {
            var result = scAssessment[sc.key] || '';
            var config = getScConfig(sc.key);
            // 查找关联任务
            var scTasks = tasks.filter(function(t) { return t.standard === sc.key; });
            var lastTask = scTasks.length > 0 ? scTasks.sort(function(a,b) { return new Date(b.createdAt)-new Date(a.createdAt); })[0] : null;
            var taskStatus = lastTask ? lastTask.status : '—';
            var isOverdue = lastTask && lastTask.due && new Date(lastTask.due) < new Date() && lastTask.status !== '已完成' && lastTask.status !== '已关闭';

            var resultColor = result === '达标' ? 'emerald' : result === '基本达标' ? 'amber' : result === '不达标' ? 'red' : 'slate';
            var resultIcon = result === '达标' ? '✅' : result === '基本达标' ? '⚠️' : result === '不达标' ? '❌' : '—';
            html += '<div class="px-4 py-3 hover:bg-slate-50 transition-colors">';
            html += '<div class="flex items-center justify-between flex-wrap gap-1">';
            html += '<div class="flex items-center space-x-2 flex-1 min-w-0">';
            html += '<span class="text-xs font-semibold text-' + resultColor + '-600 bg-' + resultColor + '-50 px-2 py-0.5 rounded whitespace-nowrap">' + resultIcon + ' ' + (result || '未评估') + '</span>';
            html += '<span class="text-sm font-medium text-slate-800 truncate">' + safeEs(sc.fullName) + '</span>';
            html += '</div>';
            html += '<div class="flex items-center gap-2 text-xs text-slate-500 flex-shrink-0">';
            html += '<span class="bg-slate-100 px-2 py-0.5 rounded"><i class="fas fa-building mr-0.5"></i>' + safeEs(config ? config.dept || sc.dept : sc.dept) + '</span>';
            html += '<span class="' + (config && config.owner ? 'text-slate-700' : 'text-slate-400') + '"><i class="fas fa-user mr-0.5"></i>' + safeEs(config ? config.owner || '未指派' : '未指派') + '</span>';
            html += '<span class="' + (taskStatus !== '—' ? (isOverdue ? 'text-red-600 font-medium' : 'text-slate-600') : 'text-slate-400') + '"><i class="fas fa-tasks mr-0.5"></i>' + taskStatus + '</span>';
            html += '</div></div></div>';
        });
        html += '</div></div>';
    });
    // 单项标准
    if (indivList.length > 0) {
        var indivDone = indivList.filter(function(sc) { return scAssessment[sc.key] === '达标'; }).length;
        var indivPct = Math.round(indivDone/indivList.length*100);
        html += '<div class="bg-white rounded-lg border border-amber-200 overflow-hidden">';
        html += '<div class="flex items-center justify-between px-4 py-3 bg-amber-50 border-b border-amber-200">';
        html += '<div class="flex items-center space-x-2"><i class="fas fa-industry text-amber-600"></i><h4 class="font-bold text-slate-800">单项标准</h4></div>';
        html += '<div class="flex items-center space-x-2"><span class="text-sm font-bold text-slate-700">' + indivDone + '/' + indivList.length + '</span><div class="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden"><div class="h-full bg-' + (indivPct >= 80 ? 'emerald' : indivPct >= 50 ? 'amber' : 'red') + '-500 rounded-full" style="width:' + indivPct + '%"></div></div></div>';
        html += '</div>';
        html += '<div class="divide-y divide-slate-100">';
        indivList.forEach(function(sc) {
            var result = scAssessment[sc.key] || '';
            var config = getScConfig(sc.key);
            var resultColor = result === '达标' ? 'emerald' : result === '基本达标' ? 'amber' : result === '不达标' ? 'red' : 'slate';
            var resultIcon = result === '达标' ? '✅' : result === '基本达标' ? '⚠️' : result === '不达标' ? '❌' : '—';
            html += '<div class="px-4 py-3 hover:bg-slate-50 transition-colors">';
            html += '<div class="flex items-center justify-between flex-wrap gap-1">';
            html += '<div class="flex items-center space-x-2 flex-1 min-w-0">';
            html += '<span class="text-xs font-semibold text-' + resultColor + '-600 bg-' + resultColor + '-50 px-2 py-0.5 rounded whitespace-nowrap">' + resultIcon + ' ' + (result || '未评估') + '</span>';
            html += '<span class="text-sm font-medium text-slate-800 truncate">' + safeEs(sc.fullName) + '</span>';
            html += '</div>';
            html += '<div class="flex items-center gap-2 text-xs text-slate-500 flex-shrink-0">';
            html += '<span class="bg-slate-100 px-2 py-0.5 rounded"><i class="fas fa-building mr-0.5"></i>' + safeEs(config ? config.dept || sc.dept : sc.dept) + '</span>';
            html += '<span class="' + (config && config.owner ? 'text-slate-700' : 'text-slate-400') + '"><i class="fas fa-user mr-0.5"></i>' + safeEs(config ? config.owner || '未指派' : '未指派') + '</span>';
            html += '</div></div></div>';
        });
        html += '</div></div>';
    }
    html += '</div>';
    document.getElementById('taskProjectView').innerHTML = html;
}
function updateTaskStatus(id, newStatus) {
    const tasks = loadData('tasks', []);
    const task = tasks.find(t => t.id === id);
    if (task) { task.status = newStatus; saveData('tasks', tasks); addAuditLog('更新任务状态: ' + task.name + ' → ' + newStatus, 'task', task.id + ' ' + task.dept); showToast('任务状态已更新: ' + task.name + ' → ' + newStatus); }
    renderTaskTable(); renderTaskKanban(); renderTaskProjectView(); updateDashboard();
}
function showTaskDetail(id) {
    const t = loadData('tasks', []).find(task => task.id === id);
    if (t) showToast('任务 ' + t.id + ': ' + t.name + ' [' + t.status + ']', 'success');
}

// ------------------------------------------------------------------------
// 10. 企业合规自评
// ------------------------------------------------------------------------
function loadAssessment() {
    assessmentType = document.getElementById('assessmentType').value;
    populateAssessmentYears();
    var scList = getSubcategoryList();
    var scAssessment = loadScAssessment();
    var container = document.getElementById('questionnaireContainer');

    // 按维度分组展示子分类评估
    var dimOrder = ['internal','finance','compliance','security','bonus'];
    container.innerHTML = dimOrder.map(function(dimKey) {
        var dimScs = scList.filter(function(sc) { return sc.dimKey === dimKey; });
        if (dimScs.length === 0) return '';
        var dimColor = dimScs[0].dimColor, dimIcon = dimScs[0].dimIcon, dimTitle = dimScs[0].dimTitle;
        return '<div class="card-business rounded-lg p-4 mb-6">' +
            '<h3 class="font-bold text-slate-800 mb-4"><i class="fas fa-' + dimIcon + ' text-' + dimColor + '-600 mr-2"></i>' + dimTitle + '（' + dimScs.length + '类制度）</h3>' +
            '<div class="space-y-4">' +
            dimScs.map(function(sc) {
                var saved = scAssessment[sc.key] || '';
                var statusOptions = ['达标','基本达标','不达标','不适用'];
                var statusColors = {'达标':'emerald','基本达标':'amber','不达标':'red','不适用':'slate'};
                return '<div class="border border-slate-200 rounded-lg p-4 bg-white">' +
                    '<div class="flex items-start justify-between mb-2">' +
                    '<div><p class="font-medium text-slate-700 text-sm">' + safeEs(sc.fullName) + '</p>' +
                    '<p class="text-xs text-slate-400 mt-0.5">负责部门: ' + sc.dept + ' · ' + sc.items.length + '项子标准</p></div>' +
                    '<button onclick="toggleAssessmentText(this)" class="text-xs text-slate-400 hover:text-slate-600 flex-shrink-0" data-key="' + sc.key.replace(/[^a-zA-Z0-9]/g, '') + '">查看制度原文 <i class="fas fa-chevron-down ml-1 text-xs"></i></button></div>' +
                    // 折叠的制度原文
                    '<div class="assessment-full-text hidden mb-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 max-h-40 overflow-y-auto">' + formatTextParagraphs(sc.fullText) + '</div>' +
                    '<div class="flex flex-wrap gap-2">' +
                    statusOptions.map(function(opt) {
                        var checked = saved === opt ? 'checked' : '';
                        var color = statusColors[opt];
                        return '<label class="flex items-center space-x-1 px-3 py-1.5 rounded border text-sm cursor-pointer transition-colors ' +
                            (checked ? 'border-' + color + '-500 bg-' + color + '-50 text-' + color + '-600' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300') + '">' +
                            '<input type="radio" name="asc_' + sc.key.replace(/[^a-zA-Z0-9]/g, '') + '" value="' + opt + '" ' + checked + ' onchange="saveAssessmentSubcategory(\'' + sc.key + '\',\'' + opt + '\')" class="mr-0.5">' + opt + '</label>';
                    }).join('') + '</div></div>';
            }).join('') + '</div></div>';
    }).join('') +
    // 单项标准
    (function() {
        var indivList = getIndividualStandardsList();
        if (indivList.length === 0) return '';
        var html = '<div class="card-business rounded-lg p-4 mb-6">';
        html += '<h3 class="font-bold text-slate-800 mb-4"><i class="fas fa-industry text-amber-600 mr-2"></i>单项标准（' + indivList.length + '类业务类型）</h3>';
        html += '<div class="space-y-4">';
        indivList.forEach(function(sc) {
            var saved = scAssessment[sc.key] || '';
            html += '<div class="border border-slate-200 rounded-lg p-4 bg-white">' +
                '<div class="flex items-start justify-between mb-2">' +
                '<div><p class="font-medium text-slate-700 text-sm">' + safeEs(sc.fullName) + '</p>' +
                '<p class="text-xs text-slate-400 mt-0.5">' + sc.items.length + '项标准</p></div>' +
                '<button onclick="toggleAssessmentText(this)" class="text-xs text-slate-400 hover:text-slate-600 flex-shrink-0" data-key="' + sc.key.replace(/[^a-zA-Z0-9]/g, '') + '">查看标准原文 <i class="fas fa-chevron-down ml-1 text-xs"></i></button></div>' +
                '<div class="assessment-full-text hidden mb-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 max-h-40 overflow-y-auto">' + formatTextParagraphs(sc.fullText) + '</div>' +
                '<div class="flex flex-wrap gap-2">' +
                ['达标','基本达标','不达标','不适用'].map(function(opt) {
                    var checked = saved === opt ? 'checked' : '';
                    var colors = {'达标':'emerald','基本达标':'amber','不达标':'red','不适用':'slate'};
                    var color = colors[opt];
                    return '<label class="flex items-center space-x-1 px-3 py-1.5 rounded border text-sm cursor-pointer transition-colors ' +
                        (checked ? 'border-' + color + '-500 bg-' + color + '-50 text-' + color + '-600' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300') + '">' +
                        '<input type="radio" name="asc_' + sc.key.replace(/[^a-zA-Z0-9]/g, '') + '" value="' + opt + '" ' + checked + ' onchange="saveAssessmentSubcategory(\'' + sc.key + '\',\'' + opt + '\')" class="mr-0.5">' + opt + '</label>';
                }).join('') + '</div></div>';
        });
        html += '</div></div>';
        return html;
    })();
    updateAssessmentProgress();
}
function toggleAssessmentText(btn) {
    var content = btn.parentNode.parentNode.querySelector('.assessment-full-text');
    var arrow = btn.querySelector('.fa-chevron-down');
    if (content) {
        content.classList.toggle('hidden');
        if (arrow) arrow.style.transform = content.classList.contains('hidden') ? '' : 'rotate(180deg)';
    }
}
function saveAssessmentSubcategory(scKey, val) {
    setScResult(scKey, val);
    updateAssessmentProgress();
}
function updateAssessmentProgress() {
    var scList = getSubcategoryList();
    var indivList = getIndividualStandardsList();
    var scAssessment = loadScAssessment();
    var dimOrder = ['internal','finance','compliance','security','bonus'];
    var totalScore = 0, totalScs = 0;
    dimOrder.forEach(function(dimKey) {
        var dimScs = scList.filter(function(sc) { return sc.dimKey === dimKey; });
        var answered = dimScs.filter(function(sc) { return scAssessment[sc.key] && scAssessment[sc.key] !== ''; }).length;
        var done = dimScs.filter(function(sc) { return scAssessment[sc.key] === '达标'; }).length;
        totalScs += dimScs.length;
        totalScore += done;
        var cap = dimKey.charAt(0).toUpperCase() + dimKey.slice(1);
        var elProgress = document.getElementById('progress' + cap);
        var elBar = document.getElementById('progressBar' + cap);
        if (elProgress) elProgress.textContent = answered + '/' + dimScs.length;
        if (elBar) elBar.style.width = (dimScs.length > 0 ? Math.round(answered/dimScs.length*100) : 0) + '%';
    });
    // 单项标准计入总分
    if (indivList.length > 0) {
        totalScs += indivList.length;
        totalScore += indivList.filter(function(sc) { return scAssessment[sc.key] === '达标'; }).length;
    }
    document.getElementById('estimatedScore').textContent = totalScs > 0 ? Math.round(totalScore/totalScs*100) : 0;
}
function switchAssessmentType() { loadAssessment(); }
function submitAssessment() {
    var scList = getSubcategoryList();
    var indivList = getIndividualStandardsList();
    var scAssessment = loadScAssessment();
    var year = document.getElementById('assessmentYear').value;
    var officer = document.getElementById('assessmentOfficer').value.trim();
    var reviewer = document.getElementById('assessmentReviewer').value.trim();
    if (!year) { showToast('请选择评估年度', 'error'); return; }
    if (!officer) { showToast('请填写关务人员', 'error'); return; }
    var allScs = scList.concat(indivList);
    var done = allScs.filter(function(sc) { return scAssessment[sc.key] === '达标'; }).length;
    var score = allScs.length > 0 ? Math.round(done/allScs.length*100) : 0;
    // Save to history
    var history = loadData('assessmentHistory', []);
    var id = 'ASMT-' + year + '-' + String(history.filter(function(h) { return h.year === year; }).length + 1).padStart(3, '0');
    history.unshift({
        id: id, year: year, type: assessmentType,
        officer: officer, reviewer: reviewer || '',
        score: score,
        answers: JSON.parse(JSON.stringify(scAssessment)),
        submittedAt: new Date().toISOString()
    });
    saveData('assessmentHistory', history);
    // Save current results
    saveScAssessment(scAssessment);
    saveData('lastAssessmentScore', score);
    saveData('lastAssessmentDate', new Date().toISOString());
    addAuditLog('提交企业合规自评', 'assessment', '编号: ' + id + ' 类型: ' + (assessmentType === 'advanced' ? '高级认证' : '认证企业') + ' 得分: ' + score + ' 年度: ' + year + ' 关务: ' + officer);
    showToast('评估已提交！编号: ' + id + ' 综合达标率: ' + score + '%', 'success');
    updateDashboard();
    renderAssessmentHistory();
}
function resetAssessment() {
    if (!confirm('确定要重置所有评估答案吗？')) return;
    saveScAssessment({});
    loadAssessment();
    showToast('评估问卷已重置', 'warning');
}

// ── 评估问卷打印导出（子分类版） ──
function printAssessment() {
    var scList = getSubcategoryList();
    var indivList = getIndividualStandardsList();
    if (scList.length === 0 && indivList.length === 0) { showToast('请先加载评估问卷', 'warning'); return; }
    var scAssessment = loadScAssessment();
    var year = document.getElementById('assessmentYear').value || new Date().getFullYear();
    var officer = document.getElementById('assessmentOfficer').value || '______';
    var reviewer = document.getElementById('assessmentReviewer').value || '______';
    var typeName = assessmentType === 'advanced' ? '高级认证企业标准' : '认证企业标准';
    var allScs = scList.concat(indivList);
    var done = allScs.filter(function(sc) { return scAssessment[sc.key] === '达标'; }).length;
    var pct = allScs.length > 0 ? Math.round(done/allScs.length*100) : 0;
    var statusLabels = {'达标':'✅ 达标','基本达标':'⚠️ 基本达标','不达标':'❌ 不达标','不适用':'— 不适用'};

    var html = '<div class="print-assessment-wrapper active" id="printAssessmentWrap">';
    html += '<div class="print-actions"><button onclick="window.print()" style="background:#1a365d;color:white;border:none;"><i class="fas fa-print mr-1"></i>打印</button><button onclick="closePrintAssessment()" style="background:#e2e8f0;color:#333;border:1px solid #ccc;"><i class="fas fa-times mr-1"></i>关闭</button></div>';
    html += '<div class="pa-header"><h1>AEO企业合规自评问卷</h1><p>' + typeName + ' | ' + year + '年度</p><div class="pa-info"><span>关务人员: ' + officer + '</span><span>复审人员: ' + reviewer + '</span><span>提交日期: ________</span></div></div>';

    var dimOrder = ['internal','finance','compliance','security','bonus'];
    var dimNameMap = { internal:'内部控制', finance:'财务状况', compliance:'守法规范', security:'贸易安全', bonus:'附加标准' };
    dimOrder.forEach(function(dimKey) {
        var dimScs = scList.filter(function(sc) { return sc.dimKey === dimKey; });
        if (dimScs.length === 0) return;
        var dimAnswered = dimScs.filter(function(sc) { return scAssessment[sc.key] && scAssessment[sc.key] !== ''; }).length;
        html += '<div class="pa-dim"><h2>' + (dimNameMap[dimKey] || dimKey) + ' &mdash; ' + dimAnswered + '/' + dimScs.length + ' 类已评</h2>';
        dimScs.forEach(function(sc) {
            var val = scAssessment[sc.key] || '';
            var optText = statusLabels[val] || '未评估';
            html += '<div class="pa-q"><div class="q-text">' + safeEs(sc.fullName) + '（' + sc.dept + '）</div><div class="q-answer">' + optText + '</div></div>';
        });
        html += '</div>';
    });

    // 单项标准
    if (indivList.length > 0) {
        var indivAnswered = indivList.filter(function(sc) { return scAssessment[sc.key] && scAssessment[sc.key] !== ''; }).length;
        html += '<div class="pa-dim"><h2>单项标准 &mdash; ' + indivAnswered + '/' + indivList.length + ' 类已评</h2>';
        indivList.forEach(function(sc) {
            var val = scAssessment[sc.key] || '';
            var optText = statusLabels[val] || '未评估';
            html += '<div class="pa-q"><div class="q-text">' + safeEs(sc.fullName) + '</div><div class="q-answer">' + optText + '</div></div>';
        });
        html += '</div>';
    }

    html += '<div class="pa-score"><div class="big">' + pct + '%</div><p>综合达标率</p><p style="font-size:0.75rem;color:#999;margin-top:0.5rem;">达标=' + done + '类 / 总计' + allScs.length + '类制度</p></div>';
    html += '</div>';
    var existing = document.getElementById('printAssessmentWrap');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', html);
    setTimeout(function() { window.print(); }, 500);
}
function closePrintAssessment() {
    var el = document.getElementById('printAssessmentWrap');
    if (el) el.remove();
}

// ── 供应商问卷评估数据 ──
function loadSupplierAssessments() { return loadData('supplierAssessments', []); }
function saveSupplierAssessments(list) { saveData('supplierAssessments', list); }
function getSupplierAssessment(supplierId) {
    var list = loadSupplierAssessments();
    return list.find(function(a) { return a.supplierId === supplierId; }) || null;
}
function sendAssessmentToSupplier(supplierId, method) {
    var suppliers = loadSuppliers();
    var sup = suppliers.find(function(s) { return s.id === supplierId; });
    if (!sup) { showToast('供应商不存在', 'error'); return; }
    var list = loadSupplierAssessments();
    var existing = list.find(function(a) { return a.supplierId === supplierId; });
    if (existing) { showToast('该供应商已有问卷记录', 'warning'); return; }
    var id = 'SA-' + Date.now().toString(36).toUpperCase();
    list.unshift({
        id: id, supplierId: supplierId, supplierName: sup.name,
        sentDate: new Date().toISOString().slice(0,10),
        method: method || 'email', status: 'sent',
        score: null, answers: null, receivedDate: null, notes: ''
    });
    saveSupplierAssessments(list);
    showToast('问卷已通过' + (method === 'feishu' ? '飞书' : '邮件') + '发送给 ' + sup.name, 'success');
    renderSuppliers();
}
function receiveSupplierAssessment(supplierId, answers, score) {
    var list = loadSupplierAssessments();
    var rec = list.find(function(a) { return a.supplierId === supplierId; });
    if (!rec) { showToast('未找到该供应商的问卷记录', 'error'); return; }
    rec.status = 'received';
    rec.answers = answers || {};
    rec.score = score || 0;
    rec.receivedDate = new Date().toISOString().slice(0,10);
    saveSupplierAssessments(list);
    renderSuppliers();
    showToast('已回收 ' + rec.supplierName + ' 的问卷，得分: ' + rec.score, 'success');
}

// ── 供应商问卷 弹窗交互 ──
function showSendSaModal(supplierId) {
    var suppliers = loadSuppliers();
    var sup = suppliers.find(function(s) { return s.id === supplierId; });
    if (!sup) { showToast('供应商不存在', 'error'); return; }
    var existingList = loadSupplierAssessments();
    var existing = existingList.find(function(a) { return a.supplierId === supplierId; });
    if (existing) {
        if (existing.status === 'sent') { showToast('问卷已发送，请先回收或刷新', 'warning'); return; }
        if (existing.status === 'received') { showToast('该供应商问卷已完成回收', 'info'); return; }
    }
    document.getElementById('saSendSupplierId').value = supplierId;
    document.getElementById('saSendSupplierName').textContent = sup.name;
    document.getElementById('saSendEmail').value = 'contact@' + (sup.name.replace(/[公司有限]/g,'').trim() || 'supplier') + '.com';
    document.getElementById('saSendFeishuContact').value = sup.name.replace(/[公司有限]/g,'').trim() || '供应商对接人';
    selectSaMethod('email');
    document.getElementById('supplierSaSendModal').classList.add('active');
}
function selectSaMethod(method) {
    var emailBox = document.getElementById('saMethodEmail');
    var feishuBox = document.getElementById('saMethodFeishu');
    var emailFields = document.getElementById('saSendEmailFields');
    var feishuFields = document.getElementById('saSendFeishuFields');
    emailBox.style.borderColor = method === 'email' ? 'var(--clr-primary)' : 'var(--clr-border)';
    emailBox.style.background = method === 'email' ? 'var(--clr-primary-light)' : 'white';
    feishuBox.style.borderColor = method === 'feishu' ? 'var(--clr-primary)' : 'var(--clr-border)';
    feishuBox.style.background = method === 'feishu' ? 'var(--clr-primary-light)' : 'white';
    emailFields.classList.toggle('hidden', method !== 'email');
    feishuFields.classList.toggle('hidden', method !== 'feishu');
    var radios = document.getElementsByName('saMethod');
    for (var i = 0; i < radios.length; i++) radios[i].checked = radios[i].value === method;
}
function confirmSendSa() {
    var supplierId = document.getElementById('saSendSupplierId').value;
    if (!supplierId) return;
    var methodEl = document.querySelector('input[name="saMethod"]:checked');
    var method = methodEl ? methodEl.value : 'email';
    sendAssessmentToSupplier(supplierId, method);
    closeModal('supplierSaSendModal');
}
function showReceiveSaModal(supplierId) {
    var list = loadSupplierAssessments();
    var sa = list.find(function(a) { return a.supplierId === supplierId; });
    if (!sa) { showToast('请先向该供应商发起问卷', 'warning'); return; }
    if (sa.status !== 'sent') { showToast('该问卷已被回收', 'info'); return; }
    document.getElementById('saRecvSupplierId').value = supplierId;
    document.getElementById('saRecvSupplierName').textContent = sa.supplierName;
    document.getElementById('saRecvScore').value = 85;
    document.getElementById('saRecvDate').value = new Date().toISOString().slice(0,10);
    document.getElementById('saRecvNotes').value = '';
    // Reset selection
    document.getElementById('saResultPass').style.borderColor = 'var(--clr-success)';
    document.getElementById('saResultPass').style.background = 'var(--clr-success-bg)';
    document.getElementById('saResultPartial').style.borderColor = 'var(--clr-border)';
    document.getElementById('saResultPartial').style.background = 'white';
    document.getElementById('saResultFail').style.borderColor = 'var(--clr-border)';
    document.getElementById('saResultFail').style.background = 'white';
    document.getElementById('supplierSaReceiveModal').classList.add('active');
}
function confirmReceiveSa() {
    var supplierId = document.getElementById('saRecvSupplierId').value;
    if (!supplierId) return;
    var score = parseInt(document.getElementById('saRecvScore').value) || 0;
    if (score < 0 || score > 100) { showToast('请输入0-100之间的分数', 'warning'); return; }
    var date = document.getElementById('saRecvDate').value;
    var notes = document.getElementById('saRecvNotes').value.trim();
    receiveSupplierAssessment(supplierId, {}, score);
    // Update notes
    var list = loadSupplierAssessments();
    var rec = list.find(function(a) { return a.supplierId === supplierId; });
    if (rec) { rec.notes = notes; rec.receivedDate = date || rec.receivedDate; saveSupplierAssessments(list); }
    closeModal('supplierSaReceiveModal');
}

function switchAssessmentView(view) {
    document.getElementById('assessmentFormView').classList.toggle('hidden', view !== 'form');
    document.getElementById('assessmentHistoryView').classList.toggle('hidden', view !== 'history');
    document.getElementById('assessmentTabForm').className = 'tab-btn' + (view === 'form' ? ' active' : '');
    document.getElementById('assessmentTabHistory').className = 'tab-btn' + (view === 'history' ? ' active' : '');
    if (view === 'history') renderAssessmentHistory();
}
function populateAssessmentYears() {
    const cur = new Date().getFullYear();
    const sel = document.getElementById('assessmentYear');
    const filter = document.getElementById('assessmentHistoryYearFilter');
    let opts = '<option value="">全部</option>';
    for (let y = cur; y >= 2024; y--) {
        sel.innerHTML += '<option value="' + y + '"' + (y === cur ? ' selected' : '') + '>' + y + '年</option>';
        opts += '<option value="' + y + '">' + y + '年</option>';
    }
    filter.innerHTML = opts;
}
function renderAssessmentHistory() {
    const history = loadData('assessmentHistory', []);
    const yearFilter = document.getElementById('assessmentHistoryYearFilter').value;
    const filtered = yearFilter ? history.filter(h => h.year === yearFilter) : history;
    const container = document.getElementById('assessmentHistoryList');
    if (filtered.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-slate-400"><i class="fas fa-inbox text-3xl mb-2"></i><p>暂无历史评估记录</p></div>';
        return;
    }
    container.innerHTML = '<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-slate-200 text-left text-slate-500"><th class="pb-2 pr-3">编号</th><th class="pb-2 pr-3">年度</th><th class="pb-2 pr-3">类型</th><th class="pb-2 pr-3">关务人员</th><th class="pb-2 pr-3">复审人员</th><th class="pb-2 pr-3">得分</th><th class="pb-2 pr-3">提交时间</th><th class="pb-2">操作</th></tr></thead><tbody>' +
        filtered.map(h => '<tr class="border-b border-slate-100 hover:bg-slate-50"><td class="py-2 pr-3 font-medium text-slate-700">' + h.id + '</td><td class="py-2 pr-3">' + h.year + '年</td><td class="py-2 pr-3"><span class="text-xs px-2 py-0.5 rounded ' + (h.type === 'advanced' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600') + '">' + (h.type === 'advanced' ? '高级认证' : '认证企业') + '</span></td><td class="py-2 pr-3">' + escapeHtml(h.officer) + '</td><td class="py-2 pr-3">' + escapeHtml(h.reviewer || '-') + '</td><td class="py-2 pr-3"><span class="font-bold ' + (h.score >= 80 ? 'text-emerald-600' : h.score >= 60 ? 'text-amber-600' : 'text-red-600') + '">' + h.score + '</span></td><td class="py-2 pr-3 text-slate-400 text-xs">' + new Date(h.submittedAt).toLocaleString() + '</td><td class="py-2"><button onclick="viewPastAssessment(\'' + h.id + '\')" class="text-blue-600 hover:text-blue-800 text-xs underline">查看</button> <button onclick="deleteAssessmentRecord(\'' + h.id + '\')" class="text-red-400 hover:text-red-600 text-xs underline">删除</button></td></tr>').join('') +
        '</tbody></table></div>';
}
function viewPastAssessment(id) {
    const history = loadData('assessmentHistory', []);
    const rec = history.find(h => h.id === id);
    if (!rec) { showToast('记录未找到', 'error'); return; }
    const typeLabel = rec.type === 'advanced' ? '高级认证企业标准' : '认证企业标准';
    const dimLabels = { internal: '内部控制', finance: '财务状况', compliance: '守法规范', security: '贸易安全', bonus: '附加标准' };
    const dimIcons = { internal: 'fa-building', finance: 'fa-chart-line', compliance: 'fa-gavel', security: 'fa-shield-halved', bonus: 'fa-star' };
    const dimColors = { internal: 'blue', finance: 'emerald', compliance: 'violet', security: 'amber', bonus: 'indigo' };
    const statusLabels = {'达标':'✅ 达标','基本达标':'⚠️ 基本达标','不达标':'❌ 不达标','不适用':'— 不适用'};
    const answers = rec.answers || {};
    let bodyHtml = '<div class="mb-4 p-4 bg-slate-50 rounded-lg grid grid-cols-2 md:grid-cols-5 gap-3 text-sm"><div><span class="text-slate-500">编号</span><p class="font-medium">' + rec.id + '</p></div><div><span class="text-slate-500">年度</span><p class="font-medium">' + rec.year + '年</p></div><div><span class="text-slate-500">类型</span><p class="font-medium">' + typeLabel + '</p></div><div><span class="text-slate-500">关务人员</span><p class="font-medium">' + escapeHtml(rec.officer) + '</p></div><div><span class="text-slate-500">复审人员</span><p class="font-medium">' + escapeHtml(rec.reviewer || '-') + '</p></div></div>' +
        '<div class="mb-4 text-center"><span class="text-4xl font-bold ' + (rec.score >= 80 ? 'text-emerald-600' : rec.score >= 60 ? 'text-amber-600' : 'text-red-600') + '">' + rec.score + '</span><span class="text-slate-400 text-sm">%</span></div>';
    // 按维度展示子分类评估结果
    var dimOrder = ['internal','finance','compliance','security','bonus'];
    var scList = typeof getSubcategoryList === 'function' ? getSubcategoryList() : [];
    dimOrder.forEach(function(dimKey) {
        var dimScs = scList.filter(function(sc) { return sc.dimKey === dimKey; });
        if (dimScs.length === 0) return;
        bodyHtml += '<div class="mb-4"><h4 class="font-bold text-sm text-slate-700 mb-2"><i class="fas ' + (dimIcons[dimKey] || 'fa-folder') + ' text-' + (dimColors[dimKey] || 'slate') + '-600 mr-1"></i>' + (dimLabels[dimKey] || dimKey) + '</h4>';
        dimScs.forEach(function(sc) {
            var val = answers[sc.key] || '';
            var optText = statusLabels[val] || '<span class="text-slate-400">未评估</span>';
            bodyHtml += '<div class="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0"><span class="text-sm text-slate-600">' + safeEs(sc.fullName) + '</span><span class="text-xs whitespace-nowrap ' + (val ? 'text-slate-700 bg-slate-100 px-2 py-0.5 rounded' : 'text-red-400') + '">' + optText + '</span></div>';
        });
        bodyHtml += '</div>';
    });
    bodyHtml += '<div class="text-xs text-slate-400 text-right">提交时间: ' + new Date(rec.submittedAt).toLocaleString() + '</div>';
    showCustomModal('评估详情 - ' + rec.id, bodyHtml);
}
function deleteAssessmentRecord(id) {
    if (!confirm('确定要删除评估记录 ' + id + ' 吗？')) return;
    let history = loadData('assessmentHistory', []);
    history = history.filter(h => h.id !== id);
    saveData('assessmentHistory', history);
    renderAssessmentHistory();
    showToast('评估记录 ' + id + ' 已删除', 'warning');
}


// 10. 海关认证检查标准自查（74项逐项对照，7维度24子分类）
// ------------------------------------------------------------------------
const AEO_CATS = [
  { key: 'all', label: '全部标准', icon: 'fas fa-list', color: 'slate' },
  { key: 'internal', label: '内部控制（11项）', icon: 'fas fa-sitemap', color: 'blue' },
  { key: 'finance', label: '财务状况（4项）', icon: 'fas fa-chart-line', color: 'emerald' },
  { key: 'compliance', label: '守法规范（28项）', icon: 'fas fa-balance-scale', color: 'violet' },
  { key: 'security', label: '贸易安全（25项）', icon: 'fas fa-shield-alt', color: 'amber' },
  { key: 'bonus', label: '附加标准（6项）', icon: 'fas fa-star', color: 'indigo' }
];

function safeEs(s) {
  if (s == null) return '';
  var d = document.createElement('div');
  d.textContent = String(s);
  return d.innerHTML;
}

function getAllAeoStandards() {
  var data = standardsData && standardsData.advanced;
  if (!data) return [];
  var all = [];
  var order = ['internal','finance','compliance','security','bonus'];
  order.forEach(function(k) {
    var cat = data[k];
    if (!cat || !cat.items) return;
    cat.items.forEach(function(it) {
      all.push({ catKey: k, catTitle: cat.title, catColor: cat.color, id: it.id, name: it.name, desc: it.desc, dept: it.dept, supportDept: it.supportDept, frequency: it.frequency, standard: it.standard, checkFile: it.checkFile, checkInterview: it.checkInterview, sampleDocs: it.sampleDocs, checkPoints: it.checkPoints });
    });
  });
  return all;
}

function getAeoStorage(year) {
  var all = loadData('standardChecks', {});
  if (!all[year]) all[year] = {};
  return all;
}

function renderAeoCheck() {
  renderAeoCheckYearSelector();
  renderAeoCheckOverview();
  renderAeoCheckCatTabs();
  var tabs = document.querySelectorAll('.aeo-cat-tab');
  if (tabs.length > 0) tabs[0].click();
}

function renderAeoCheckYearSelector() {
  var sel = document.getElementById('aeoCheckYear');
  if (!sel) return;
  var currentYear = new Date().getFullYear();
  var opts = '';
  for (var y = currentYear; y >= 2020; y--) {
    opts += '<option value="' + y + '"' + (y === currentYear ? ' selected' : '') + '>' + y + '年</option>';
  }
  sel.innerHTML = opts;
}

function renderAeoCheckOverview() {
  var container = document.getElementById('aeoCheckOverview');
  if (!container) return;
  var yearEl = document.getElementById('aeoCheckYear');
  var year = yearEl ? yearEl.value : new Date().getFullYear();
  var standards = getAllAeoStandards();
  var storage = getAeoStorage(year);
  var yearData = storage[year] || {};

  var catDefs = [
    { key: 'all', label: '全部74项', color: 'slate', icon: 'list', count: standards.length },
    { key: 'internal', label: '内部控制', color: 'blue', icon: 'sitemap', count: standards.filter(function(s) { return s.catKey === 'internal'; }).length },
    { key: 'finance', label: '财务状况', color: 'emerald', icon: 'chart-line', count: standards.filter(function(s) { return s.catKey === 'finance'; }).length },
    { key: 'compliance', label: '守法规范', color: 'violet', icon: 'balance-scale', count: standards.filter(function(s) { return s.catKey === 'compliance'; }).length },
    { key: 'security', label: '贸易安全', color: 'amber', icon: 'shield-alt', count: standards.filter(function(s) { return s.catKey === 'security'; }).length },
    { key: 'bonus', label: '附加标准', color: 'indigo', icon: 'star', count: standards.filter(function(s) { return s.catKey === 'bonus'; }).length }
  ];

  var html = '';
  catDefs.forEach(function(cat) {
    var items = cat.key === 'all' ? standards : standards.filter(function(s) { return s.catKey === cat.key; });
    var total = items.length;
    var checked = items.filter(function(s) {
      var sd = yearData[s.id];
      return sd && sd.checkpoints && sd.checkpoints.some(function(c) { return c !== 'pending'; });
    }).length;
    var allCompliant = items.filter(function(s) {
      var sd = yearData[s.id];
      if (!sd || !sd.checkpoints || !sd.checkpoints.length) return false;
      return sd.checkpoints.every(function(c) { return c === 'compliant'; });
    }).length;
    var pct = total > 0 ? Math.round(allCompliant / total * 100) : 0;

    html += '<div class="bg-white rounded-xl border border-slate-200 p-3 hover:shadow-sm transition-shadow cursor-pointer" onclick="switchAeoCheckTab(\'' + cat.key + '\')">';
    html += '<div class="flex items-center justify-between mb-2">';
    html += '<span class="text-xs font-medium text-' + cat.color + '-600 bg-' + cat.color + '-50 px-2 py-0.5 rounded-full">' + cat.label + '</span>';
    html += '<span class="text-xs text-slate-400">' + total + '项</span></div>';
    html += '<div class="flex items-end justify-between">';
    html += '<div><span class="text-lg font-bold text-slate-800">' + allCompliant + '</span><span class="text-xs text-slate-400"> / ' + total + '</span></div>';
    html += '<span class="text-xs text-slate-500">已检' + checked + '</span></div>';
    html += '<div class="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">';
    html += '<div class="h-full bg-' + cat.color + '-500 rounded-full transition-all" style="width:' + pct + '%"></div></div></div>';
  });
  container.innerHTML = html;
}

function renderAeoCheckCatTabs() {
  var container = document.getElementById('aeoCheckCatTabs');
  if (!container) return;
  var html = '';
  AEO_CATS.forEach(function(c) {
    html += '<button class="aeo-cat-tab px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 border-transparent hover:text-' + c.color + '-600 hover:border-' + c.color + '-400 transition-all" data-cat="' + c.key + '" onclick="switchAeoCheckTab(\'' + c.key + '\')">';
    html += '<i class="' + c.icon + ' mr-1"></i>' + c.label + '</button>';
  });
  container.innerHTML = html;
}

function switchAeoCheckTab(catKey) {
  document.querySelectorAll('.aeo-cat-tab').forEach(function(el) {
    var active = el.dataset.cat === catKey;
    var cat = null;
    AEO_CATS.forEach(function(c) { if (c.key === catKey) cat = c; });
    var color = cat ? cat.color : 'slate';
    el.className = 'aeo-cat-tab px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-all';
    if (active) {
      el.className += ' text-' + color + '-600 border-' + color + '-500 bg-' + color + '-50 active';
    } else {
      el.className += ' border-transparent text-slate-500 hover:text-slate-700';
    }
  });

  var container = document.getElementById('aeoCheckList');
  if (!container) return;
  var yearEl = document.getElementById('aeoCheckYear');
  var year = yearEl ? yearEl.value : new Date().getFullYear();
  var standards = getAllAeoStandards();
  var storage = getAeoStorage(year);
  var yearData = storage[year] || {};

  var filtered = catKey === 'all' ? standards : standards.filter(function(s) { return s.catKey === catKey; });

  if (!filtered.length) {
    container.innerHTML = '<div class="text-center py-8 text-slate-400"><i class="fas fa-inbox text-3xl mb-2"></i><p>暂无认证标准数据</p></div>';
    return;
  }

  var html = '';
  filtered.forEach(function(std) {
    var sd = yearData[std.id] || {};
    var checkpoints = sd.checkpoints || [];
    var points = std.checkPoints || [];
    var total = points.length;
    var done = checkpoints.filter(function(s) { return s === 'compliant'; }).length;
    var hasIssues = checkpoints.some(function(s) { return s === 'non-compliant'; });
    var allDone = total > 0 && done === total;
    var pct = total > 0 ? Math.round(done / total * 100) : 0;

    var badge = '';
    if (allDone) badge = '<span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">合规</span>';
    else if (hasIssues) badge = '<span class="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">不合规</span>';
    else if (done > 0) badge = '<span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">部分完成 ' + done + '/' + total + '</span>';
    else badge = '<span class="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">待检查</span>';

    html += '<div class="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow">';
    html += '<div class="p-4 cursor-pointer" onclick="toggleAeoCheckDetail(this)">';
    html += '<div class="flex items-start justify-between">';
    html += '<div class="flex items-start space-x-3 flex-1 min-w-0">';
    html += '<div class="w-9 h-9 rounded-lg bg-' + std.catColor + '-50 flex items-center justify-center flex-shrink-0">';
    html += '<i class="fas fa-' + (points.length ? 'check-double' : 'file') + ' text-' + std.catColor + '-500 text-sm"></i></div>';
    html += '<div class="min-w-0">';
    html += '<div class="flex items-center space-x-2">';
    html += '<span class="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">' + safeEs(std.id) + '</span>';
    html += '<span class="font-medium text-slate-800 text-sm">' + safeEs(std.name) + '</span></div>';
    html += '<p class="text-xs text-slate-500 mt-0.5 truncate">' + safeEs(std.desc) + '</p>';
    html += '<div class="flex items-center space-x-3 mt-1.5 text-xs text-slate-400">';
    html += '<span><i class="fas fa-building mr-0.5"></i>' + safeEs(std.dept) + '</span>';
    if (std.frequency) html += '<span><i class="far fa-clock mr-0.5"></i>' + safeEs(std.frequency) + '</span>';
    html += '</div></div></div>';
    html += '<div class="flex items-center space-x-2 flex-shrink-0 ml-2">' + badge;
    html += '<i class="fas fa-chevron-down text-slate-300 text-xs transition-transform"></i></div></div>';
    if (total > 0) {
      var barColor = allDone ? 'bg-emerald-500' : (hasIssues ? 'bg-red-400' : 'bg-amber-400');
      html += '<div class="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">';
      html += '<div class="h-full rounded-full transition-all ' + barColor + '" style="width:' + pct + '%"></div></div>';
    }
    html += '</div>'; // end header

    // Detail section
    html += '<div class="aeo-check-detail hidden border-t border-slate-100">';
    html += '<div class="p-4 space-y-4">';

    // Standard requirement
    if (std.standard) {
      html += '<div class="p-3 bg-blue-50 rounded-lg border border-blue-100">';
      html += '<p class="text-xs font-medium text-blue-700 mb-1"><i class="fas fa-book mr-1"></i>标准要求</p>';
      html += '<p class="text-xs text-blue-600">' + safeEs(std.standard) + '</p></div>';
    }

    // Check points
    if (points.length) {
      html += '<div><p class="text-xs font-medium text-slate-600 mb-2">检查要点（点击切换状态：待检查→合规→不合规→不适用）</p>';
      html += '<div class="space-y-1.5">';
      points.forEach(function(cp, i) {
        var st = checkpoints[i] || 'pending';
        var stMap = {
          pending: { cls: 'border-slate-200 bg-white text-slate-500', icon: 'far fa-circle', label: '待检查' },
          compliant: { cls: 'border-emerald-300 bg-emerald-50 text-emerald-700', icon: 'fas fa-check-circle', label: '合规' },
          'non-compliant': { cls: 'border-red-300 bg-red-50 text-red-700', icon: 'fas fa-times-circle', label: '不合规' },
          na: { cls: 'border-slate-200 bg-slate-50 text-slate-400', icon: 'fas fa-minus-circle', label: '不适用' }
        };
        var s = stMap[st] || stMap.pending;
        html += '<div class="flex items-center justify-between p-2.5 rounded-lg border cursor-pointer hover:shadow-sm transition-all ' + s.cls + '" onclick="setAeoCheckStatus(\'' + year + '\',\'' + std.id + '\',' + i + ')">';
        html += '<span class="text-xs flex items-center space-x-2"><span class="font-mono text-slate-400">' + (i + 1) + '.</span><span>' + safeEs(cp) + '</span></span>';
        html += '<span class="text-xs font-medium whitespace-nowrap flex items-center space-x-1"><i class="' + s.icon + '"></i><span>' + s.label + '</span></span></div>';
      });
      html += '</div></div>';
    } else {
      html += '<div class="p-3 bg-slate-50 rounded-lg text-center"><p class="text-xs text-slate-400">此标准暂无细分检查要点，请在备注中记录</p></div>';
    }

    // Check file & interview
    if (std.checkFile || std.checkInterview) {
      html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-3">';
      if (std.checkFile) {
        html += '<div class="p-3 bg-slate-50 rounded-lg border border-slate-200">';
        html += '<p class="text-xs font-medium text-slate-600 mb-1"><i class="fas fa-file-alt mr-1"></i>检查文件</p>';
        html += '<p class="text-xs text-slate-500">' + safeEs(std.checkFile) + '</p></div>';
      }
      if (std.checkInterview) {
        html += '<div class="p-3 bg-slate-50 rounded-lg border border-slate-200">';
        html += '<p class="text-xs font-medium text-slate-600 mb-1"><i class="fas fa-comments mr-1"></i>询问内容</p>';
        html += '<p class="text-xs text-slate-500">' + safeEs(std.checkInterview) + '</p></div>';
      }
      html += '</div>';
    }

    // Sample docs
    if (std.sampleDocs && std.sampleDocs.length) {
      html += '<div><p class="text-xs font-medium text-slate-600 mb-1.5"><i class="fas fa-paperclip mr-1"></i>样本资料</p>';
      html += '<div class="flex flex-wrap gap-1.5">';
      std.sampleDocs.forEach(function(doc) {
        html += '<span class="text-xs bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded">' + safeEs(doc) + '</span>';
      });
      html += '</div></div>';
    }

    // Notes
    html += '<div><p class="text-xs font-medium text-slate-600 mb-1.5"><i class="fas fa-pencil-alt mr-1"></i>自查备注</p>';
    html += '<textarea class="aeo-notes-input w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-slate-500" rows="2" placeholder="记录此项标准的自查情况、发现的问题、整改措施等..." onchange="saveAeoCheckNotes(\'' + year + '\',\'' + std.id + '\',this.value)">' + safeEs(sd.notes || '') + '</textarea></div>';

    // Evidence upload
    html += '<div><div class="flex items-center justify-between mb-1.5">';
    html += '<p class="text-xs font-medium text-slate-600"><i class="fas fa-upload mr-1"></i>资料文件</p>';
    html += '<button onclick="uploadAeoCheckEvidence(\'' + year + '\',\'' + std.id + '\')" class="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 bg-blue-50 px-2 py-1 rounded"><i class="fas fa-plus mr-0.5"></i>上传文件</button></div>';
    html += '<div class="aeo-evidence-list space-y-1">';
    if (sd.evidenceFiles && sd.evidenceFiles.length) {
      sd.evidenceFiles.forEach(function(f) {
        html += '<div class="flex items-center justify-between p-2 bg-white rounded border border-slate-200">';
        html += '<div class="flex items-center space-x-2 min-w-0">';
        html += '<i class="fas fa-file text-blue-400 text-xs"></i>';
        html += '<span class="text-xs text-slate-600 truncate">' + safeEs(f.name) + '</span>';
        if (f.size) html += '<span class="text-xs text-slate-400">' + Math.round(f.size / 1024) + 'KB</span>';
        html += '</div>';
        html += '<button onclick="deleteAeoCheckEvidence(\'' + year + '\',\'' + std.id + '\',' + f.id + ')" class="text-slate-400 hover:text-red-500 text-xs p-1"><i class="fas fa-trash-alt"></i></button></div>';
      });
    } else {
      html += '<p class="text-xs text-slate-400 text-center py-2">暂无资料文件</p>';
    }
    html += '</div></div>'; // end evidence

    html += '</div></div></div>'; // end detail, end card
  });
  container.innerHTML = html;
}

function toggleAeoCheckDetail(el) {
  var detail = el.parentElement.querySelector('.aeo-check-detail');
  var chevron = el.querySelector('.fa-chevron-down');
  if (detail) {
    detail.classList.toggle('hidden');
    if (chevron) chevron.style.transform = detail.classList.contains('hidden') ? '' : 'rotate(180deg)';
  }
}

function setAeoCheckStatus(year, stdId, idx) {
  var storage = getAeoStorage(year);
  var yearData = storage[year];
  if (!yearData[stdId]) yearData[stdId] = { checkpoints: [], evidenceFiles: [], notes: '', operatorLog: [] };
  if (!yearData[stdId].checkpoints) yearData[stdId].checkpoints = [];

  var order = ['pending', 'compliant', 'non-compliant', 'na'];
  var labels = { pending: '待检查', compliant: '合规', 'non-compliant': '不合规', na: '不适用' };
  var current = yearData[stdId].checkpoints[idx] || 'pending';
  var nextIdx = (order.indexOf(current) + 1) % order.length;
  yearData[stdId].checkpoints[idx] = order[nextIdx];
  yearData[stdId].lastCheckDate = new Date().toISOString();

  var total = yearData[stdId].checkpoints.length;
  var done = yearData[stdId].checkpoints.filter(function(s) { return s === 'compliant'; }).length;
  var hasIssues = yearData[stdId].checkpoints.some(function(s) { return s === 'non-compliant'; });
  yearData[stdId].overallStatus = total > 0 && done === total ? 'compliant' : hasIssues ? 'non-compliant' : done > 0 ? 'partial' : 'pending';

  // Log
  if (!yearData[stdId].operatorLog) yearData[stdId].operatorLog = [];
  var user = currentUser ? currentUser.name : 'system';
  yearData[stdId].operatorLog.unshift({
    action: '标记检查点',
    user: user,
    detail: '检查点' + (idx + 1) + ': ' + labels[current] + '→' + labels[order[nextIdx]],
    at: new Date().toISOString()
  });
  if (yearData[stdId].operatorLog.length > 50) yearData[stdId].operatorLog.length = 50;
  saveData('standardChecks', storage);

  var activeTab = document.querySelector('.aeo-cat-tab.active');
  switchAeoCheckTab(activeTab ? activeTab.dataset.cat : 'all');
}

function saveAeoCheckNotes(year, stdId, val) {
  var storage = getAeoStorage(year);
  var yearData = storage[year];
  if (!yearData[stdId]) yearData[stdId] = { checkpoints: [], evidenceFiles: [], notes: '', operatorLog: [] };
  yearData[stdId].notes = val.trim();
  yearData[stdId].lastCheckDate = new Date().toISOString();
  saveData('standardChecks', storage);
}

async function uploadAeoCheckEvidence(year, stdId) {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.txt,.zip,.rar';
  input.onchange = async function(e) {
    var file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { showToast('文件不能超过50MB', 'error'); return; }
    try {
      var info = await saveFileToDB(file, 'aeo_evidence');
      var storage = getAeoStorage(year);
      if (!storage[year][stdId]) storage[year][stdId] = { checkpoints: [], evidenceFiles: [], notes: '', operatorLog: [] };
      if (!storage[year][stdId].evidenceFiles) storage[year][stdId].evidenceFiles = [];
      storage[year][stdId].evidenceFiles.push({ id: info.id, name: info.name, size: info.size, uploadedAt: new Date().toISOString() });
      storage[year][stdId].lastCheckDate = new Date().toISOString();
      saveData('standardChecks', storage);
      showToast('资料文件已上传: ' + info.name, 'success');
      var activeTab = document.querySelector('.aeo-cat-tab.active');
      switchAeoCheckTab(activeTab ? activeTab.dataset.cat : 'all');
    } catch (err) { showToast('上传失败: ' + err.message, 'error'); }
  };
  input.click();
}

async function deleteAeoCheckEvidence(year, stdId, fileId) {
  if (!confirm('确定删除此资料文件？')) return;
  var storage = getAeoStorage(year);
  if (storage[year][stdId] && storage[year][stdId].evidenceFiles) {
    storage[year][stdId].evidenceFiles = storage[year][stdId].evidenceFiles.filter(function(f) { return f.id !== fileId; });
    saveData('standardChecks', storage);
  }
  deleteFileFromDB(fileId).catch(function() {});
  showToast('资料文件已删除', 'warning');
  var activeTab = document.querySelector('.aeo-cat-tab.active');
  switchAeoCheckTab(activeTab ? activeTab.dataset.cat : 'all');
}

function exportAeoCheckReport() {
  var yearEl = document.getElementById('aeoCheckYear');
  var year = yearEl ? yearEl.value : new Date().getFullYear();
  var standards = getAllAeoStandards();
  var storage = getAeoStorage(year);
  var yearData = storage[year] || {};
  var now = new Date().toLocaleDateString('zh-CN');

  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>AEO认证检查标准自查报告</title>';
  html += '<style>body{font-family:"Noto Sans SC",sans-serif;padding:40px;color:#333;max-width:1000px;margin:auto}';
  html += 'h1{font-size:22px;border-bottom:2px solid #1e3a5f;padding-bottom:10px}';
  html += 'h2{font-size:16px;color:#1e3a5f;margin-top:24px;padding:8px 0;border-bottom:1px solid #e2e8f0}';
  html += 'h3{font-size:14px;color:#334155;margin-top:16px}';
  html += 'table{width:100%;border-collapse:collapse;margin:8px 0}';
  html += 'th,td{border:1px solid #ddd;padding:6px 10px;text-align:left;font-size:12px}';
  html += 'th{background:#f1f5f9;color:#475569}';
  html += '.meta{color:#64748b;font-size:13px;margin-bottom:20px}';
  html += '.ok{color:#059669;font-weight:600}.warn{color:#d97706;font-weight:600}.err{color:#dc2626;font-weight:600}.na2{color:#94a3b8}';
  html += '@media print{body{padding:20px}}';
  html += '</style></head><body>';
  html += '<h1>AEO认证检查标准自查报告</h1>';
  html += '<div class="meta"><p>年度: ' + year + '年 | 生成日期: ' + now + ' | 共 ' + standards.length + ' 项认证标准</p></div>';

  var cats = ['internal', 'finance', 'compliance', 'security', 'bonus'];
  var catNames = { internal: '内部控制', finance: '财务状况', compliance: '守法规范', security: '贸易安全', bonus: '附加标准' };
  var labels = { pending: '待检查', compliant: '合规', 'non-compliant': '不合规', na: '不适用' };

  cats.forEach(function(catKey) {
    var items = standards.filter(function(s) { return s.catKey === catKey; });
    if (!items.length) return;
    html += '<h2>' + catNames[catKey] + '（' + items.length + '项）</h2>';
    items.forEach(function(std) {
      var sd = yearData[std.id] || {};
      var checkpoints = sd.checkpoints || [];
      var notes = sd.notes || '';
      html += '<h3>[' + std.id + '] ' + safeEs(std.name) + '</h3>';
      html += '<p style="font-size:12px;color:#64748b;margin:4px 0"><b>主责部门：</b>' + safeEs(std.dept) +
        (std.frequency ? ' | <b>频次：</b>' + safeEs(std.frequency) : '') + '</p>';

      if (std.checkPoints && std.checkPoints.length) {
        html += '<table><thead><tr><th style="width:30px">#</th><th>检查要点</th><th style="width:80px">状态</th></tr></thead><tbody>';
        std.checkPoints.forEach(function(cp, idx) {
          var st = checkpoints[idx] || 'pending';
          var cls = { compliant: 'ok', 'non-compliant': 'err', na: 'na2' }[st] || '';
          html += '<tr><td>' + (idx + 1) + '</td><td>' + safeEs(cp) + '</td><td class="' + cls + '">' + labels[st] + '</td></tr>';
        });
        html += '</tbody></table>';
      }

      if (notes) html += '<p style="font-size:12px;background:#f8fafc;padding:8px 12px;border-radius:4px;margin:4px 0"><b>自查备注：</b>' + safeEs(notes) + '</p>';
      if (sd.evidenceFiles && sd.evidenceFiles.length) {
        html += '<p style="font-size:11px;color:#64748b;margin:2px 0">📎 资料文件：' + sd.evidenceFiles.map(function(f) { return safeEs(f.name); }).join('、') + '</p>';
      }
    });
  });

  html += '<p style="text-align:center;color:#94a3b8;font-size:11px;margin-top:40px;border-top:1px solid #e2e8f0;padding-top:16px">AEO海关认证管理系统 &middot; ' + year + '年度自查报告 &middot; ' + now + '</p>';
  html += '</body></html>';

  var win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    setTimeout(function() { win.print(); }, 500);
  } else {
    showToast('请允许弹出窗口以打印', 'warning');
  }
}

// ------------------------------------------------------------------------
// AEO合规综合报告导出 (HTML)
// ------------------------------------------------------------------------
function generateAeoReport() {
  // --- Gather data ---
  var companyInfo = loadData('companyInfo', getDefaultCompanyInfo());
  var history = loadData('assessmentHistory', []);
  var tasks = loadData('tasks', []);
  var now = new Date();
  var dateStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  var timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  // --- Compute scores (same logic as updateDashboard) ---
  var avgAssessment = 0;
  if (history.length > 0) {
    avgAssessment = history[0].score;
  } else {
    var scAssessment = loadScAssessment();
    var scList = getSubcategoryList();
    var done = scList.filter(function(sc) { return scAssessment[sc.key] === '达标'; }).length;
    avgAssessment = scList.length > 0 ? Math.round(done / scList.length * 100) : 0;
  }
  var totalTasks = tasks.length;
  var doneTasks = tasks.filter(function(t) { return t.status === '已完成' || t.status === '已关闭'; }).length;
  var overdueTasks = tasks.filter(function(t) {
    if (t.status === '已完成' || t.status === '已关闭') return false;
    var due = new Date(t.due);
    return due < now;
  }).length;
  var taskRate = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;
  var auditRate = 95;
  var weights = loadData('scoreWeights', { assess: 40, tasks: 35, audit: 25 });
  var wSum = weights.assess + weights.tasks + weights.audit;
  var wA = wSum > 0 ? weights.assess / wSum : 0.4;
  var wT = wSum > 0 ? weights.tasks / wSum : 0.35;
  var wAu = wSum > 0 ? weights.audit / wSum : 0.25;
  var overall = Math.round(avgAssessment * wA + taskRate * wT + auditRate * wAu);
  var overallClamped = Math.min(overall, 100);

  // --- Per-dimension status ---
  var dimOrder = ['internal','finance','compliance','security','bonus'];
  var dimLabelsMap = {
    internal: '内部控制', finance: '财务状况', compliance: '守法规范',
    security: '贸易安全', bonus: '附加标准', it: '信息系统与安全', audit: '内部审计与改进'
  };
  var dimData = [];
  dimOrder.forEach(function(k) {
    var cat = (standardsData.advanced || {})[k];
    if (!cat || !cat.items) return;
    var items = cat.items;
    var done = items.filter(function(it) { return it.evidence && it.evidence.policy && it.evidence.record && it.evidence.approval; }).length;
    var rate = items.length > 0 ? Math.round(done / items.length * 100) : 0;
    var statusText = rate >= 80 ? '良好' : rate >= 50 ? '待改进' : '薄弱';
    var statusColor = rate >= 80 ? '#059669' : rate >= 50 ? '#d97706' : '#dc2626';
    dimData.push({ key: k, label: dimLabelsMap[k] || k, total: items.length, done: done, rate: rate, statusText: statusText, statusColor: statusColor });
  });

  // --- Overall status ---
  var overallStatus = overallClamped >= 80 ? '良好' : overallClamped >= 60 ? '待改进' : '薄弱';
  var overallColor = overallClamped >= 80 ? '#059669' : overallClamped >= 60 ? '#d97706' : '#dc2626';

  // --- Build HTML ---
  var html = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">';
  html += '<title>AEO合规综合报告</title>';
  html += '<style>';
  html += '* { margin: 0; padding: 0; box-sizing: border-box; }';
  html += 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif; color: #1e293b; background: #fff; padding: 0; }';
  html += '.report-wrapper { max-width: 900px; margin: 0 auto; padding: 40px 32px; }';
  html += '.report-header { text-align: center; padding-bottom: 24px; border-bottom: 3px solid #1e3a5f; margin-bottom: 28px; }';
  html += '.report-header h1 { font-size: 24px; color: #1e3a5f; margin-bottom: 6px; }';
  html += '.report-header .subtitle { font-size: 13px; color: #64748b; }';
  html += '.company-block { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px 24px; margin-bottom: 24px; }';
  html += '.company-block h2 { font-size: 15px; color: #1e3a5f; margin-bottom: 12px; }';
  html += '.company-block .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; font-size: 13px; }';
  html += '.company-block .grid .label { color: #94a3b8; }';
  html += '.company-block .grid .value { color: #334155; font-weight: 500; }';
  html += '.score-hero { text-align: center; padding: 28px 0 32px; margin-bottom: 24px; }';
  html += '.score-hero .big-score { font-size: 56px; font-weight: 800; color: ' + overallColor + '; line-height: 1; }';
  html += '.score-hero .score-label { font-size: 14px; color: #64748b; margin-top: 4px; }';
  html += '.score-hero .score-status { display: inline-block; margin-top: 8px; padding: 4px 18px; border-radius: 20px; font-size: 13px; font-weight: 600; color: #fff; background: ' + overallColor + '; }';
  html += '.section-title { font-size: 16px; font-weight: 700; color: #1e3a5f; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0; margin-bottom: 16px; }';
  html += '.dim-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }';
  html += '.dim-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background: #fff; }';
  html += '.dim-card .dim-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }';
  html += '.dim-card .dim-name { font-size: 14px; font-weight: 600; color: #334155; }';
  html += '.dim-card .dim-rate { font-size: 20px; font-weight: 700; }';
  html += '.dim-card .dim-bar { height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; margin-bottom: 4px; }';
  html += '.dim-card .dim-bar-fill { height: 100%; border-radius: 3px; transition: width 0.5s; }';
  html += '.dim-card .dim-meta { font-size: 11px; color: #94a3b8; }';
  html += '.dim-card .dim-status { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 10px; display: inline-block; }';
  html += '.summary-row { display: flex; gap: 16px; margin-bottom: 24px; }';
  html += '.summary-box { flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; }';
  html += '.summary-box .num { font-size: 28px; font-weight: 700; color: #1e3a5f; }';
  html += '.summary-box .lbl { font-size: 12px; color: #94a3b8; margin-top: 2px; }';
  html += '.summary-box.warn .num { color: #d97706; }';
  html += '.summary-box.danger .num { color: #dc2626; }';
  html += '.footer { text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0; margin-top: 28px; font-size: 11px; color: #94a3b8; }';
  html += '@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .report-wrapper { padding: 20px; } }';
  html += '@media (max-width: 640px) { .report-wrapper { padding: 16px; } .company-block .grid { grid-template-columns: 1fr; } .dim-grid { grid-template-columns: 1fr; } .summary-row { flex-direction: column; } .score-hero .big-score { font-size: 40px; } }';
  html += '</style></head><body>';
  html += '<div class="report-wrapper">';

  // --- Header ---
  html += '<div class="report-header">';
  html += '<h1>AEO合规综合评估报告</h1>';
  html += '<p class="subtitle">AEO海关认证管理系统 &middot; 报告生成日期: ' + dateStr + ' ' + timeStr + '</p>';
  html += '</div>';

  // --- Company Info ---
  html += '<div class="company-block">';
  html += '<h2><i class="fa-regular fa-building"></i> 企业基本信息</h2>';
  html += '<div class="grid">';
  html += '<div><span class="label">企业名称</span><br><span class="value">' + safeEs(companyInfo.name) + '</span></div>';
  html += '<div><span class="label">统一社会信用代码</span><br><span class="value">' + safeEs(companyInfo.creditCode) + '</span></div>';
  html += '<div><span class="label">海关注册编码</span><br><span class="value">' + safeEs(companyInfo.customsCode) + '</span></div>';
  html += '<div><span class="label">主管海关</span><br><span class="value">' + safeEs(companyInfo.customsOffice) + '</span></div>';
  html += '<div><span class="label">企业类型</span><br><span class="value">' + safeEs(companyInfo.enterpriseType) + '</span></div>';
  html += '<div><span class="label">认证等级</span><br><span class="value">' + safeEs(companyInfo.certLevel) + '</span></div>';
  html += '<div><span class="label">法定代表人</span><br><span class="value">' + safeEs(companyInfo.legalPerson) + '</span></div>';
  html += '<div><span class="label">关务负责人</span><br><span class="value">' + safeEs(companyInfo.customsContact) + '</span></div>';
  html += '</div></div>';

  // --- Overall Score ---
  html += '<div class="score-hero">';
  html += '<div class="big-score">' + overallClamped + '</div>';
  html += '<div class="score-label">综合合规得分（满分100分）</div>';
  html += '<div class="score-status">评级: ' + overallStatus + '</div>';
  if (history.length > 0) {
    html += '<p style="font-size:12px;color:#94a3b8;margin-top:6px;">评估基准: ' + (history[0].year || '') + '年度自评</p>';
  }
  html += '</div>';

  // --- Per-dimension Scores ---
  html += '<div class="section-title">各维度合规分析</div>';
  html += '<div class="dim-grid">';
  dimData.forEach(function(d) {
    html += '<div class="dim-card">';
    html += '<div class="dim-header">';
    html += '<span class="dim-name">' + d.label + '</span>';
    html += '<span class="dim-rate" style="color:' + d.statusColor + '">' + d.rate + '%</span>';
    html += '</div>';
    html += '<div class="dim-bar"><div class="dim-bar-fill" style="width:' + d.rate + '%;background:' + d.statusColor + '"></div></div>';
    html += '<div class="dim-meta">' + d.done + '/' + d.total + ' 项通过 &middot; <span class="dim-status" style="background:' + d.statusColor + '20;color:' + d.statusColor + '">' + d.statusText + '</span></div>';
    html += '</div>';
  });
  html += '</div>';

  // --- Tasks Summary ---
  html += '<div class="section-title">任务执行情况</div>';
  html += '<div class="summary-row">';
  html += '<div class="summary-box"><div class="num">' + totalTasks + '</div><div class="lbl">任务总数</div></div>';
  html += '<div class="summary-box"><div class="num" style="color:#059669">' + doneTasks + '</div><div class="lbl">已完成</div></div>';
  html += '<div class="summary-box' + (overdueTasks > 0 ? ' danger' : '') + '"><div class="num">' + overdueTasks + '</div><div class="lbl">已超期</div></div>';
  html += '<div class="summary-box"><div class="num" style="color:#2563eb">' + Math.round(taskRate) + '%</div><div class="lbl">完成率</div></div>';
  html += '</div>';

  // --- Score breakdown ---
  html += '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:24px;">';
  html += '<p style="font-size:13px;font-weight:600;color:#475569;margin-bottom:8px;">评分构成</p>';
  html += '<div style="font-size:12px;color:#64748b;line-height:1.8;">';
  html += '自评得分: ' + Math.round(avgAssessment) + ' 分（权重 ' + weights.assess + '%）<br>';
  html += '任务完成率: ' + Math.round(taskRate) + '%（权重 ' + weights.tasks + '%）<br>';
  html += '审计合规率: ' + auditRate + '%（权重 ' + weights.audit + '%）';
  html += '</div></div>';

  // --- Footer ---
  html += '<div class="footer">';
  html += '本报告由 AEO海关认证管理系统 自动生成 &middot; ' + dateStr + '<br>';
  html += '报告仅供参考，实际认证结果以海关审核为准';
  html += '</div>';

  html += '</div></body></html>';

  // --- Open print window ---
  var win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    setTimeout(function() { win.print(); }, 600);
  } else {
    showToast('请允许弹出窗口以打印报告', 'warning');
  }
  addAuditLog('导出合规综合报告', 'data', '');
}

// Backward compat
function renderSelfCheck() { renderAeoCheck(); }


// 11. 海关演示模式
// ------------------------------------------------------------------------
function toggleDemoMode() {
    document.body.classList.toggle('demo-mode');
    document.getElementById('demoWatermark').classList.toggle('hidden');
    showToast(document.body.classList.contains('demo-mode') ? '已进入全屏演示模式' : '已退出演示模式', 'success');
}
function switchDemoTab(tab) {
    currentDemoTab = tab;
    document.querySelectorAll('.demo-tab').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));
    renderDemoContent();
}
function renderDemoContent() {
    const data = standardsData['advanced']; if (!data || !data[currentDemoTab]) return;
    const dim = data[currentDemoTab];
    document.getElementById('demoContent').innerHTML = '<div class="bg-white rounded-lg border border-slate-200 overflow-hidden"><div class="p-4 ' + ({blue:'bg-blue-50',emerald:'bg-emerald-50',violet:'bg-violet-50',amber:'bg-amber-50',indigo:'bg-indigo-50'}[dim.color]||'bg-slate-50') + ' flex items-center justify-between"><div class="flex items-center space-x-2"><i class="fas fa-' + dim.icon + ' text-' + dim.color + '-600"></i><h3 class="font-bold text-slate-800">' + dim.title + '</h3></div><span class="text-sm text-slate-500">' + dim.items.length + '项标准 · 资料全覆盖</span></div><div class="divide-y divide-slate-100">' + dim.items.map(it => {
        const allDone = it.evidence.policy && it.evidence.record && it.evidence.approval;
        return '<div class="p-4 hover:bg-slate-50 cursor-pointer" onclick="toggleDemoDetail(this)"><div class="flex items-start justify-between"><div class="flex items-start space-x-3"><div class="w-8 h-8 ' + (allDone ? 'bg-emerald-100' : 'bg-amber-100') + ' rounded flex items-center justify-center flex-shrink-0"><i class="fas ' + (allDone ? 'fa-check text-emerald-600' : 'fa-exclamation text-amber-600') + '"></i></div><div><div class="flex items-center space-x-2"><span class="text-xs font-mono text-slate-400">' + it.id + '</span><span class="font-medium text-slate-800">' + it.name + '</span></div><p class="text-sm text-slate-500 mt-0.5">' + it.desc + '</p></div></div><span class="text-sm font-bold ' + (allDone ? 'text-emerald-600' : 'text-amber-600') + '">' + (allDone ? '✅ 齐全' : '⚠️ 部分缺失') + '</span></div><div class="demo-detail hidden mt-3 pl-11"><div class="p-3 bg-slate-50 rounded-lg border border-slate-200"><div class="grid grid-cols-3 gap-3 text-sm">' +
        '<div class="p-2 bg-white rounded border ' + (it.evidence.policy ? 'border-emerald-200' : 'border-red-200') + '"><p class="text-xs text-slate-500">制度文件</p><p class="font-medium ' + (it.evidence.policy ? 'text-emerald-600' : 'text-red-500') + '">' + (it.evidence.policy ? '✅ 已制定' : '❌ 缺失') + '</p></div>' +
        '<div class="p-2 bg-white rounded border ' + (it.evidence.record ? 'border-emerald-200' : 'border-red-200') + '"><p class="text-xs text-slate-500">执行记录</p><p class="font-medium ' + (it.evidence.record ? 'text-emerald-600' : 'text-red-500') + '">' + (it.evidence.record ? '✅ 有记录' : '❌ 缺失') + '</p></div>' +
        '<div class="p-2 bg-white rounded border ' + (it.evidence.approval ? 'border-emerald-200' : 'border-red-200') + '"><p class="text-xs text-slate-500">审批留痕</p><p class="font-medium ' + (it.evidence.approval ? 'text-emerald-600' : 'text-red-500') + '">' + (it.evidence.approval ? '✅ 已审批' : '❌ 缺失') + '</p></div>' +
        '</div><p class="text-xs text-slate-400 mt-2"><i class="fas fa-paperclip mr-1"></i>资料要求: ' + it.evidenceDesc + '</p>' +
        '<div class="mt-2 pt-2 border-t border-slate-200 text-xs space-y-1">' +
        (it.checkFile ? '<p><span class="font-semibold text-slate-600">📄 检查文件：</span><span class="text-slate-500">' + it.checkFile + '</span></p>' : '') +
        (it.checkInterview ? '<p><span class="font-semibold text-slate-600">💬 询问：</span><span class="text-slate-500">' + it.checkInterview + '</span></p>' : '') +
        (it.sampleDocs && it.sampleDocs.length ? '<p><span class="font-semibold text-slate-600">📎 样本资料：</span><span class="text-slate-500">' + it.sampleDocs.join('、') + '</span></p>' : '') +
        '</div></div></div></div>';
    }).join('') + '</div></div>';
}
function toggleDemoDetail(el) { const d = el.querySelector('.demo-detail'); if (d) d.classList.toggle('hidden'); }
function renderEvidenceTimeline() {
    const months = ['2026-01','2026-02','2026-03','2026-04','2026-05','2026-06'];
    const data = standardsData['advanced']; if (!data) return;
    const allItems = Object.values(data).reduce((a, d) => a.concat(d.items), []);
    document.getElementById('evidenceTimeline').innerHTML = '<div class="flex items-center gap-4 text-xs text-slate-500 mb-2"><span class="w-28">标准编号</span><span class="w-32">标准名称</span>' + months.map(m => '<span class="w-14 text-center">' + m.slice(-2) + '月</span>').join('') + '<span class="w-16 text-center">连续性</span></div>' + allItems.slice(0, 10).map(it => {
        const cells = months.map(() => { const base = (it.evidence.policy?1:0)+(it.evidence.record?1:0)+(it.evidence.approval?1:0); const r=Math.random(); return base>=2&&r>0.2?'green':base>0&&r>0.5?'green':r>0.7?'gray':'red'; });
        return '<div class="flex items-center gap-4 text-xs"><span class="w-28 font-mono text-slate-400">' + it.id + '</span><span class="w-32 text-slate-700 truncate">' + it.name + '</span>' + cells.map(c => '<span class="w-14 flex justify-center"><span class="evidence-cell ' + c + '"></span></span>').join('') + '<span class="w-16 text-center"><i class="fas ' + (cells.every(c=>c==='green') ? 'fa-check-circle text-emerald-500' : 'fa-exclamation-circle text-amber-500') + '"></i></span></div>';
    }).join('');
}
function exportDemoReport() {
    var content = document.getElementById('demoContent').innerHTML;
    var w = window.open('', '_blank');
    var d = w.document;
    d.write('<html><head><title>AEO合规演示报告</title>');
    d.write('<style>body{font-family:sans-serif;padding:40px;color:#333;}');
    d.write('table{width:100%;border-collapse:collapse}');
    d.write('th,td{border:1px solid #ddd;padding:8px;text-align:left}');
    d.write('.header{text-align:center;margin-bottom:30px;border-bottom:3px solid #1e3a5f;padding-bottom:20px}</style></head>');
    d.write('<body><div class=header>');
    d.write('<h1>AEO合规资料全景演示报告</h1>');
    d.write('<p>上海XX进出口有限公司 · 高级认证企业</p>');
    d.write('<p>报告日期: ' + new Date().toLocaleDateString('zh-CN') + '</p></div>');
    d.write('<div id=reportContent>' + content + '</div>');
    d.write('</body></html>');
    d.close();
    var s = d.createElement('script');
    s.textContent = 'window.print();';
    d.body.appendChild(s);
    addAuditLog('导出演示报告', 'data', '');
}

// ------------------------------------------------------------------------
// 12. 通知系统
// ------------------------------------------------------------------------
function checkOverdueTasks() {
    const tasks = loadData('tasks', []);
    const notifications = [];
    const now = new Date();
    tasks.forEach(t => {
        const due = new Date(t.due);
        if (due < now && t.status !== '已完成' && t.status !== '已关闭') {
            notifications.push({ msg: '任务 ' + t.id + ' ' + t.name + ' 已超期 ' + Math.ceil((now-due)/(1000*60*60*24)) + ' 天', severity: 'warning' });
        }
        const diff = Math.ceil((due-now)/(1000*60*60*24));
        if (diff > 0 && diff <= 3 && t.status !== '已完成' && t.status !== '已关闭') {
            notifications.push({ msg: '任务 ' + t.id + ' ' + t.name + ' 将在 ' + diff + ' 天后到期', severity: 'info' });
        }
    });
    saveData('notifications', notifications);
    const badge = document.getElementById('notifBadge');
    if (badge) badge.textContent = notifications.length;
    return notifications;
}
function showNotifications() {
    const notifications = loadData('notifications', []);
    const list = document.getElementById('notifList');
    if (!notifications.length) { list.innerHTML = '<div class="text-center py-8 text-slate-400"><i class="fas fa-bell text-4xl mb-3"></i><p>暂无通知</p></div>'; }
    else { list.innerHTML = notifications.map(n => '<div class="p-3 bg-slate-50 border border-slate-200 rounded-lg mb-2 text-sm">' + n.msg + '</div>').join(''); }
    document.getElementById('notifModal').classList.add('active');
}

// ------------------------------------------------------------------------
// 13. 评分说明
// ------------------------------------------------------------------------
function showScoreBreakdown() {
    openScoreModal();
}

// ------------------------------------------------------------------------
// 14. 数据导入/导出
// ------------------------------------------------------------------------
function exportData(format) {
    const data = { exportTime: new Date().toISOString(), user: currentUser ? currentUser.name : 'system', standards: standardsData, tasks: loadData('tasks', []), scAssessment: loadScAssessment(), scTaskConfig: loadScTaskConfig(), scEvidence: loadScEvidence(), assessmentHistory: loadData('assessmentHistory', []), customLaws: loadData('customLaws', []), internalAudits: loadData('internalAudits', []), auditLogs: loadData('auditLogs', []) };
    if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'aeo_export_' + new Date().toISOString().slice(0,10) + '.json'; a.click();
        URL.revokeObjectURL(url);
    } else if (format === 'csv') {
        const tasks = data.tasks;
        let csv = '任务编号,任务名称,执行部门,负责人,状态,截止日期\n';
        tasks.forEach(t => { csv += '"' + t.id + '","' + t.name + '","' + t.dept + '","' + t.owner + '","' + t.status + '","' + t.due + '"\n'; });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'aeo_tasks_' + new Date().toISOString().slice(0,10) + '.csv'; a.click();
        URL.revokeObjectURL(url);
    }
    addAuditLog('导出数据 (' + format.toUpperCase() + ')', 'data', '');
    showToast('数据已导出 (' + format.toUpperCase() + ')', 'success');
}
function importData() {
    const input = document.getElementById('importFileInput');
    if (!input.files.length) { showToast('请先选择要导入的文件', 'error'); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.tasks) { saveData('tasks', data.tasks); showToast('成功导入 ' + data.tasks.length + ' 条任务数据'); }
            if (data.auditLogs) saveData('auditLogs', data.auditLogs);
            addAuditLog('导入数据', 'data', input.files[0].name);
            renderTaskTable(); renderTaskKanban(); renderTaskProjectView(); updateDashboard();
        } catch(err) { showToast('导入失败: ' + err.message, 'error'); }
    };
    reader.readAsText(input.files[0]);
}
function resetAllData() {
    if (!confirm('确定要重置所有数据吗？此操作不可恢复！')) return;
    if (!confirm('再次确认：删除所有本地数据？')) return;
    ['tasks','assessmentResults','assessmentAnswers','lastAssessmentScore','auditLogs','notifications','assessmentHistory','customLaws','internalAudits'].forEach(k => localStorage.removeItem('aeo_' + k));
    addAuditLog('重置所有数据', 'data', '全部数据已清空');
    showToast('所有本地数据已重置', 'warning');
    renderTaskTable(); renderTaskKanban(); renderTaskProjectView(); updateDashboard();
}

// ── 系统备份 + 健康检查 ──────────────────────────────
async function triggerBackup() {
    try {
        const resp = await fetch('/api/backup', { method: 'POST', headers: getAuthHeaders() });
        const result = await resp.json();
        if (result.ok) {
            addAuditLog('触发系统备份', 'data', result.backupFile);
            showToast('数据备份完成: ' + result.backupFile, 'success');
        } else {
            showToast('备份失败', 'error');
        }
    } catch(e) {
        // 离线模式：本地导出
        exportData('json');
        showToast('服务端不可用，已导出本地备份', 'warning');
    }
}
async function showSystemHealth() {
    const panel = document.getElementById('systemHealthPanel');
    panel.classList.toggle('hidden');
    if (panel.classList.contains('hidden')) return;
    panel.innerHTML = '<div class="text-center py-2"><i class="fas fa-spinner fa-spin"></i> 检查中...</div>';
    try {
        const resp = await fetch('/api/health', { headers: getAuthHeaders() });
        const h = await resp.json();
        const st = h.status === 'ok' ? '<span class="text-emerald-600 font-medium">✓ 正常</span>' : '<span class="text-red-600 font-medium">⚠ 异常</span>';
        panel.innerHTML = '<p><span class="font-medium">系统状态:</span> ' + st + '</p>' +
            '<p><span class="font-medium">运行时间:</span> ' + Math.round(h.uptime / 60) + ' 分钟</p>' +
            '<p><span class="font-medium">数据文件:</span> ' + h.dataFiles + ' 个</p>' +
            '<p><span class="font-medium">备份数量:</span> ' + h.backupFiles + ' 个</p>' +
            '<p><span class="font-medium">最近备份:</span> ' + (h.lastBackup ? new Date(h.lastBackup.time).toLocaleString('zh-CN') : '从未备份') + '</p>' +
            '<p><span class="font-medium">服务器时间:</span> ' + new Date(h.serverTime).toLocaleString('zh-CN') + '</p>' +
            (h.integrityIssues.length ? '<p class="text-red-600"><span class="font-medium">数据异常:</span> ' + h.integrityIssues.join('; ') + '</p>' : '<p class="text-emerald-600"><i class="fas fa-check-circle mr-1"></i>数据完整性正常</p>');
    } catch(e) {
        panel.innerHTML = '<p class="text-amber-600"><i class="fas fa-exclamation-triangle mr-1"></i>无法连接服务器。您处于离线模式，数据仅保存在本地浏览器。</p><p class="text-xs mt-1">建议: 启动服务器后数据将自动同步</p>';
    }
}

// ------------------------------------------------------------------------
// 15. 其他模块
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// 15a. IndexedDB 文件存储 + 预览
// ------------------------------------------------------------------------
let _fileDB = null;
function openFileDB() {
    return new Promise((resolve, reject) => {
        if (_fileDB) return resolve(_fileDB);
        const req = indexedDB.open('AEOFileStore', 1);
        req.onupgradeneeded = function(e) {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('files')) {
                const store = db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
                store.createIndex('category', 'category', { unique: false });
                store.createIndex('name', 'name', { unique: false });
            }
        };
        req.onsuccess = function(e) { _fileDB = e.target.result; resolve(_fileDB); };
        req.onerror = function(e) { reject(e.target.error); };
    });
}
async function saveFileToDB(file, category) {
    const db = await openFileDB();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const tx = db.transaction('files', 'readwrite');
            const store = tx.objectStore('files');
            const entry = { name: file.name, size: file.size, type: file.type, category: category || 'general', data: e.target.result, uploadedAt: new Date().toISOString() };
            const req = store.add(entry);
            req.onsuccess = function() { resolve({ id: req.result, name: file.name, size: file.size, type: file.type }); };
            req.onerror = function() { reject(req.error); };
        };
        reader.onerror = function() { reject(reader.error); };
        reader.readAsDataURL(file);
    });
}
async function deleteFileFromDB(id) {
    const db = await openFileDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('files', 'readwrite');
        const req = tx.objectStore('files').delete(Number(id));
        req.onsuccess = function() { resolve(); };
        req.onerror = function() { reject(req.error); };
    });
}
async function listFilesFromDB(category) {
    const db = await openFileDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('files', 'readonly');
        const store = tx.objectStore('files');
        const req = category ? store.index('category').getAll(category) : store.getAll();
        req.onsuccess = function() {
            resolve((req.result||[]).map(f => ({ id: f.id, name: f.name, size: f.size, type: f.type, uploadedAt: f.uploadedAt })));
        };
        req.onerror = function() { reject(req.error); };
    });
}
async function getFileDataFromDB(id) {
    const db = await openFileDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('files', 'readonly');
        const req = tx.objectStore('files').get(Number(id));
        req.onsuccess = function() { resolve(req.result ? req.result.data : null); };
        req.onerror = function() { reject(req.error); };
    });
}
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1048576) return (bytes/1024).toFixed(1) + 'KB';
    return (bytes/1048576).toFixed(1) + 'MB';
}
async function previewFile(id, name) {
    try {
        const dataUrl = await getFileDataFromDB(id);
        if (!dataUrl) { showToast('文件数据未找到', 'error'); return; }
        if (dataUrl.startsWith('data:application/pdf') || dataUrl.startsWith('data:image/')) {
            const win = window.open('', '_blank');
            if (win) {
                win.document.write('<!DOCTYPE html><html><head><title>'+escapeHtml(name)+'</title><style>body{margin:0;display:flex;height:100vh} embed{flex:1;border:none}</style></head><body><embed src="'+dataUrl+'" type="application/pdf" /></body></html>');
                win.document.close();
            } else { downloadFile(dataUrl, name); }
        } else { downloadFile(dataUrl, name); }
    } catch(e) { showToast('文件预览失败', 'error'); }
}
function downloadFile(dataUrl, name) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = name;
    a.click();
}
function getFileIcon(type) {
    if (!type) return 'fa-file';
    if (type.includes('pdf')) return 'fa-file-pdf text-red-500';
    if (type.includes('powerpoint')||type.includes('presentation')) return 'fa-file-powerpoint text-orange-500';
    if (type.includes('word')||type.includes('document')) return 'fa-file-word text-blue-500';
    if (type.includes('video')||type.includes('mp4')) return 'fa-file-video text-purple-500';
    if (type.includes('image')) return 'fa-file-image text-green-500';
    if (type.includes('excel')||type.includes('spreadsheet')) return 'fa-file-excel text-emerald-500';
    return 'fa-file text-slate-400';
}

// ------------------------------------------------------------------------
// 15b. 制度文件 & 财务指标
// ------------------------------------------------------------------------
async function uploadDocument() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png,.txt';
    input.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 50*1024*1024) { showToast('文件大小不能超过50MB', 'error'); return; }
        try {
            const info = await saveFileToDB(file, 'document');
            addAuditLog('上传制度文件: ' + info.name, 'general', formatFileSize(info.size));
            showToast('文件上传成功: ' + info.name, 'success');
            renderDocFiles();
        } catch(err) { showToast('上传失败: ' + err.message, 'error'); }
    };
    input.click();
}
async function renderDocFiles() {
    try {
        const files = await listFilesFromDB('document');
        const cats = [
            { id: 'internal', label: '内部控制制度', icon: 'sitemap', color: 'blue' },
            { id: 'trade', label: '贸易安全制度', icon: 'shield-alt', color: 'emerald' },
            { id: 'finance', label: '财务指标档案', icon: 'chart-line', color: 'purple' },
            { id: 'training', label: '培训记录档案', icon: 'graduation-cap', color: 'amber' }
        ];
        const grid = document.querySelector('#documents .grid-cols-2');
        if (!grid) return;
        const counts = [0,0,0,0];
        files.forEach(function() { counts[Math.floor(Math.random() * 4)]++; });
        var html = '';
        for (var i = 0; i < cats.length; i++) {
            var cat = cats[i];
            var borderColor = cat.color + '-300';
            html += '<div class="card-business rounded-lg p-4 cursor-pointer hover:shadow-md border-2 border-transparent hover:border-' + borderColor + '" onclick="filterDocs(\'' + cat.id + '\')">';
            html += '<div class="flex items-center justify-between mb-2">';
            html += '<i class="fas fa-' + cat.icon + ' text-' + cat.color + '-700 text-2xl"></i>';
            html += '<span class="bg-' + cat.color + '-100 text-' + cat.color + '-700 px-2 py-1 rounded text-xs">' + counts[i] + '份</span>';
            html += '</div>';
            html += '<h4 class="font-semibold text-slate-800">' + cat.label + '</h4>';
            html += '<p class="text-xs text-slate-500 mt-1">共 ' + files.length + ' 份文档</p>';
            html += '</div>';
        }
        grid.innerHTML = html;
    } catch(e) { console.log('renderDocFiles error:', e); }
}
async function filterDocs(cat) {
    try {
        const files = await listFilesFromDB('document');
        const filtered = files.filter(() => true);
        if (filtered.length === 0) { showToast('该分类暂无文件', 'info'); return; }
        const names = filtered.map(f => '  • ' + f.name + ' (' + formatFileSize(f.size) + ')').join('\n');
        showToast('共 ' + filtered.length + ' 份文件\n' + names, 'info');
    } catch(e) { showToast('查询失败', 'error'); }
}
// ------------------------------------------------------------------------
// 15b.2 财务指标管理（独立模块）
// ------------------------------------------------------------------------
// ── 财务指标数据（年度列表版）──
const FIN_INDICATORS = [
    { id: 'debtRatio', label: '资产负债率', unit: '%', standard: '≤60%', passFn: v => v <= 60, group: 'solvency' },
    { id: 'cashRatio', label: '现金比率', unit: '%', standard: '≥20%', passFn: v => v >= 20, group: 'solvency' },
    { id: 'cashFlowDebt', label: '经营现金流负债比', unit: '', standard: '≥0.5', passFn: v => v >= 0.5, group: 'solvency' },
    { id: 'currentRatio', label: '流动比率', unit: '%', standard: '≥100%', passFn: v => v >= 100, group: 'solvency' },
    { id: 'netProfit', label: '净利润', unit: '万元', standard: '—', passFn: null, group: 'profit' },
    { id: 'opProfitRate', label: '营业利润率', unit: '%', standard: '—', passFn: null, group: 'profit' },
    { id: 'grossRate', label: '毛利率', unit: '%', standard: '—', passFn: null, group: 'profit' },
    { id: 'opCashFlow', label: '经营性现金流', unit: '万元', standard: '—', passFn: null, group: 'profit' },
    { id: 'totalAssetReturn', label: '总资产报酬率', unit: '%', standard: '—', passFn: null, group: 'profit' }
];

let _financeCurrentYear = new Date().getFullYear().toString();

function renderFinance() {
    const allData = loadData('financeData', {});
    let years = Object.keys(allData).filter(k => /^\d{4}$/.test(k)).sort();
    if (years.length === 0) years = [new Date().getFullYear().toString()];
    renderFinanceYearTabs(years);
    const summaryView = document.getElementById('financeSummaryView');
    const yearPanel = document.getElementById('financeYearPanel');
    const noData = document.getElementById('financeNoData');
    if (_financeShowSummary) {
        if (summaryView) summaryView.classList.remove('hidden');
        if (yearPanel) yearPanel.classList.add('hidden');
        if (noData) noData.classList.add('hidden');
        renderFinanceSummary();
    } else {
        if (summaryView) summaryView.classList.add('hidden');
        const year = _financeCurrentYear && years.includes(_financeCurrentYear) ? _financeCurrentYear : years[years.length - 1];
        renderFinanceYearPanel(year);
    }
}

function renderFinanceYearTabs(years) {
    const container = document.getElementById('financeYearTabs');
    if (!years.length) {
        container.innerHTML = '<span class="text-xs text-slate-400 py-2">暂未添加年度</span>';
        return;
    }
    container.innerHTML = years.map(y =>
        '<button class="tab-btn' + (_financeCurrentYear === y ? ' active' : '') +
        '" onclick="switchFinanceYear(\'' + y + '\')">' + y + '年' +
        '<span class="ml-1.5 text-xs ' + (getYearCompliance(y) ? 'text-emerald-500' : 'text-slate-400') + '">' + (getYearCompliance(y) ? '✅' : '') + '</span></button>'
    ).join('');
}

function getYearCompliance(year) {
    const allData = loadData('financeData', {});
    const yearData = allData[year] || {};
    let passCount = 0, totalCheckable = 0;
    FIN_INDICATORS.filter(ind => ind.passFn).forEach(ind => {
        const val = parseFloat(yearData[ind.label]);
        if (!isNaN(val)) {
            totalCheckable++;
            if (ind.passFn(val)) passCount++;
        }
    });
    return totalCheckable > 0 && passCount === totalCheckable;
}

function switchFinanceYear(year) {
    _financeCurrentYear = year;
    renderFinance();
}

function addFinanceYear() {
    const allData = loadData('financeData', {});
    const existingYears = Object.keys(allData).filter(k => /^\d{4}$/.test(k));
    const input = prompt('请输入要添加的年度（如 2023、2024、2025）：');
    if (!input || !input.trim()) return;
    const year = input.trim();
    if (!/^\d{4}$/.test(year)) { showToast('请输入有效的4位年份', 'error'); return; }
    if (existingYears.includes(year)) { showToast(year + '年度已存在', 'warning'); return; }
    allData[year] = {};
    saveData('financeData', allData);
    _financeCurrentYear = year;
    showToast('已添加 ' + year + ' 年度', 'success');
    renderFinance();
}

function renderFinanceYearPanel(year) {
    const panel = document.getElementById('financeYearPanel');
    const noData = document.getElementById('financeNoData');
    if (!year) { panel.classList.add('hidden'); noData.classList.remove('hidden'); return; }
    panel.classList.remove('hidden'); noData.classList.add('hidden');
    const allData = loadData('financeData', {});
    const yearData = allData[year] || {};

    // Compliance summary
    const summary = document.getElementById('financeComplianceSummary');
    let totalPass = 0, totalCheckable = 0;
    FIN_INDICATORS.filter(ind => ind.passFn).forEach(ind => {
        const val = parseFloat(yearData[ind.label]);
        if (!isNaN(val)) {
            totalCheckable++;
            if (ind.passFn(val)) totalPass++;
        }
    });
    const overallCompliant = totalCheckable > 0 && totalPass === totalCheckable;
    const checkableCount = FIN_INDICATORS.filter(ind => ind.passFn).length;
    summary.innerHTML =
        '<div class="card-business rounded-lg p-3 ' + (totalCheckable > 0 ? (overallCompliant ? 'bg-emerald-100 border-emerald-300' : 'bg-amber-100 border-amber-300') : 'bg-slate-100 border-slate-300') + '"><p class="text-xs text-slate-500">' + year + '年度达标情况</p><p class="text-lg font-bold mt-1 ' + (totalCheckable > 0 ? (overallCompliant ? 'text-emerald-700' : 'text-amber-700') : 'text-slate-500') + '">' + (totalCheckable > 0 ? (overallCompliant ? '✅ ' + totalPass + '/' + checkableCount + ' 全部达标' : '⚠️ ' + totalPass + '/' + totalCheckable + ' 达标') : '尚未录入数据') + '</p></div>' +
        '<div class="card-business rounded-lg p-3 bg-slate-50 border-slate-200"><p class="text-xs text-slate-500">录入状态</p><p class="text-lg font-bold mt-1 text-slate-600">' + FIN_INDICATORS.filter(ind => yearData[ind.label] !== undefined && yearData[ind.label] !== '').length + '/' + FIN_INDICATORS.length + ' 项已录入</p></div>';

    // Data table
    const tbody = document.getElementById('financeDataBody');
    tbody.innerHTML = FIN_INDICATORS.map(ind => {
        const isCheckable = !!ind.passFn;
        const val = yearData[ind.label];
        const numVal = parseFloat(val);
        const hasVal = val !== undefined && val !== '';
        const pass = isCheckable && hasVal && !isNaN(numVal) && ind.passFn(numVal);
        const fail = isCheckable && hasVal && !isNaN(numVal) && !ind.passFn(numVal);
        const cellClass = pass ? 'bg-emerald-50 text-emerald-700' : (fail ? 'bg-red-50 text-red-700' : '');
        const icon = pass ? ' ✅' : (fail ? ' ❌' : '');
        let assessText = '—';
        if (hasVal && isNaN(numVal)) assessText = '<span class="text-xs text-amber-600">格式错误</span>';
        else if (isCheckable && hasVal && !isNaN(numVal)) assessText = pass ? '<span class="text-xs font-medium text-emerald-600">✅ 达标</span>' : '<span class="text-xs font-medium text-red-600">❌ 未达标</span>';
        else if (!isCheckable && hasVal) assessText = '<span class="text-xs text-slate-500">已录入</span>';

        return '<tr class="border-b border-slate-100 hover:bg-slate-50">' +
            '<td class="px-3 py-2.5"><span class="text-sm font-medium text-slate-700">' + ind.label + '</span></td>' +
            '<td class="px-3 py-2.5 text-center text-xs text-slate-500">' + ind.standard + '</td>' +
            '<td class="px-3 py-2.5 text-center ' + cellClass + '"><input type="text" class="w-full text-center bg-transparent border-0 text-sm focus:outline-none" placeholder="—" value="' + (val || '') + '" onchange="saveFinanceCell(\'' + year + '\',\'' + ind.label.replace(/'/g, "\\'") + '\',this.value)" style="min-width:80px">' + (hasVal && !isNaN(numVal) ? icon : '') + '</td>' +
            '<td class="px-3 py-2.5 text-center text-xs text-slate-400">' + ind.unit + '</td>' +
            '<td class="px-3 py-2.5 text-center" id="finAssess_' + ind.id + '">' + assessText + '</td></tr>';
    }).join('');

    // Metadata fields
    document.getElementById('finRecordedBy').value = yearData._recordedBy || '';
    document.getElementById('finRecordedAt').value = yearData._recordedAt ? yearData._recordedAt.slice(0, 10) : '';
    document.getElementById('finOfficer').value = yearData._officer || '';

    renderFinanceReports2(year);
}

let _financeShowSummary = false;

function toggleFinanceView() {
    _financeShowSummary = !_financeShowSummary;
    var btn = document.getElementById('btnFinanceSummary');
    if (_financeShowSummary) {
        btn.innerHTML = '<i class="fas fa-calendar-alt"></i><span>按年查看</span>';
        btn.className = 'bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2';
    } else {
        btn.innerHTML = '<i class="fas fa-table"></i><span>汇总表</span>';
        btn.className = 'bg-white border border-slate-300 text-slate-600 px-4 py-2 rounded-lg text-sm hover:bg-slate-50 flex items-center space-x-2';
    }
    renderFinance();
}

function renderFinanceSummary() {
    const allData = loadData('financeData', {});
    const years = Object.keys(allData).filter(k => /^\d{4}$/.test(k)).sort();
    const container = document.getElementById('financeSummaryView');
    if (!years.length) {
        container.innerHTML = '<div class="text-center py-16 text-slate-400"><i class="fas fa-chart-line text-5xl mb-4"></i><p>暂无财务数据</p></div>';
        return;
    }
    var html = '<div class="overflow-x-auto"><table class="w-full text-sm">';
    html += '<thead><tr class="table-header-dark">';
    html += '<th class="px-3 py-3 text-left font-medium text-xs">年度</th>';
    FIN_INDICATORS.forEach(function(ind) {
        html += '<th class="px-3 py-3 text-center font-medium text-xs" title="' + ind.label + '">' + ind.label + '<br><span class="text-xs font-normal" style="color:rgba(255,255,255,0.6)">' + ind.standard + '</span></th>';
    });
    html += '<th class="px-3 py-3 text-center font-medium text-xs">偿债指标</th>';
    html += '<th class="px-3 py-3 text-center font-medium text-xs">填写人员</th>';
    html += '<th class="px-3 py-3 text-center font-medium text-xs">财务负责人</th>';
    html += '</tr></thead><tbody>';

    years.forEach(function(year) {
        var yearData = allData[year] || {};
        var passCount = 0, totalCheckable = 0;
        FIN_INDICATORS.filter(function(i) { return i.passFn; }).forEach(function(ind) {
            var val = parseFloat(yearData[ind.label]);
            if (!isNaN(val)) { totalCheckable++; if (ind.passFn(val)) passCount++; }
        });
        var overallPass = totalCheckable > 0 && passCount === totalCheckable;
        var rowBg = overallPass ? '' : 'bg-amber-50';

        html += '<tr class="border-b border-slate-100 hover:bg-slate-50 ' + rowBg + '">';
        html += '<td class="px-3 py-3 font-medium text-slate-700 text-sm">' + year + '年</td>';

        FIN_INDICATORS.forEach(function(ind) {
            var val = yearData[ind.label];
            var numVal = parseFloat(val);
            var hasVal = val !== undefined && val !== '';
            var isCheckable = !!ind.passFn;
            var pass = isCheckable && hasVal && !isNaN(numVal) && ind.passFn(numVal);
            var fail = isCheckable && hasVal && !isNaN(numVal) && !ind.passFn(numVal);
            var displayVal = hasVal ? val : '—';
            var cls = pass ? 'text-emerald-700 font-medium' : (fail ? 'text-red-600 font-medium' : 'text-slate-500');
            var dot = pass ? ' ✅' : (fail ? ' ❌' : '');
            html += '<td class="px-3 py-3 text-center text-xs ' + cls + '">' + displayVal + dot + '</td>';
        });

        var solvencyLabel = totalCheckable > 0 ? (overallPass ? '<span class="text-emerald-600 font-medium">✅ ' + passCount + '/' + totalCheckable + '</span>' : '<span class="text-amber-600 font-medium">⚠️ ' + passCount + '/' + totalCheckable + '</span>') : '<span class="text-slate-500">—</span>';
        html += '<td class="px-3 py-3 text-center text-xs">' + solvencyLabel + '</td>';
        html += '<td class="px-3 py-3 text-center text-xs text-slate-500">' + (yearData._recordedBy || '—') + '</td>';
        html += '<td class="px-3 py-3 text-center text-xs text-slate-500">' + (yearData._officer || '—') + '</td>';
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function getAnnualAssessment(year, indicator) {
    const allData = loadData('financeData', {});
    const quarters = ['Q1','Q2','Q3','Q4'];
    const vals = quarters.map(q => {
        const qData = allData[year + '-' + q] || {};
        return parseFloat(qData[indicator.label]);
    }).filter(v => !isNaN(v));
    if (!vals.length) return '<span class="text-xs text-slate-400">—</span>';
    if (!indicator.passFn) return '<span class="text-xs text-slate-500">仅记录</span>';
    const allPass = vals.every(v => indicator.passFn(v));
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return '<span class="text-xs font-medium ' + (allPass ? 'text-emerald-600' : 'text-red-600') + '">' + (allPass ? '✅ 达标' : '❌ 未达标') + '<br><span class="text-slate-400">年均 ' + avg.toFixed(1) + '</span></span>';
}

function saveFinanceCell(year, label, value) {
    const allData = loadData('financeData', {});
    if (!allData[year]) allData[year] = {};
    allData[year][label] = value.trim();
    saveData('financeData', allData);
    renderFinanceYearPanel(year);
}

function saveFinanceYear() {
    const year = _financeCurrentYear;
    if (!year) { showToast('请先选择年度', 'warning'); return; }
    const recordedBy = document.getElementById('finRecordedBy').value.trim();
    const recordedAt = document.getElementById('finRecordedAt').value;
    const officer = document.getElementById('finOfficer').value.trim();
    const allData = loadData('financeData', {});
    if (!allData[year]) allData[year] = {};
    if (recordedBy) allData[year]._recordedBy = recordedBy;
    if (recordedAt) allData[year]._recordedAt = recordedAt;
    if (officer) allData[year]._officer = officer;
    saveData('financeData', allData);
    addAuditLog('保存财务数据: ' + year + '年', 'general', '填写: ' + (recordedBy || '未记录'));
    showToast(year + '年财务数据已保存', 'success');
    renderFinance();
}

async function uploadFinanceReport() {
    const year = _financeCurrentYear;
    if (!year) { showToast('请先选择年度', 'warning'); return; }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 50*1024*1024) { showToast('文件大小不能超过50MB', 'error'); return; }
        try {
            const info = await saveFileToDB(file, 'finance_report');
            const allData = loadData('financeData', {});
            if (!allData[year]) allData[year] = {};
            if (!allData[year]._reports) allData[year]._reports = [];
            allData[year]._reports.push({ id: info.id, name: info.name, size: info.size, uploadedAt: new Date().toISOString() });
            saveData('financeData', allData);
            addAuditLog('上传审计报告: ' + year, 'general', info.name);
            showToast('审计报告上传成功: ' + info.name, 'success');
            renderFinanceReports2(year);
        } catch(err) { showToast('上传失败: ' + err.message, 'error'); }
    };
    input.click();
}

async function renderFinanceReports2(year) {
    const list = document.getElementById('financeReportList');
    if (!year) { list.innerHTML = '<div class="text-center py-4 text-slate-400"><p class="text-xs">请先选择年度</p></div>'; return; }
    const allData = loadData('financeData', {});
    const reports = (allData[year] && allData[year]._reports) || [];
    if (!reports.length) {
        list.innerHTML = '<div class="text-center py-4 text-slate-400"><i class="fas fa-inbox text-2xl mb-1"></i><p class="text-xs">暂无上传报告</p></div>';
        return;
    }
    list.innerHTML = reports.slice().reverse().map(r => {
        const date = new Date(r.uploadedAt).toLocaleDateString('zh-CN');
        return '<div class="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200"><div class="flex items-center space-x-2"><i class="fas fa-file-pdf text-red-500"></i><div><p class="text-xs font-medium text-slate-700">' + escapeHtml(r.name) + '</p><p class="text-xs text-slate-400">' + date + ' | ' + formatFileSize(r.size) + '</p></div></div><button class="p-1.5 text-slate-400 hover:text-red-600 text-xs" onclick="deleteFinanceReport2(\'' + year + '\',\'' + r.id + '\')"><i class="fas fa-trash-alt"></i></button></div>';
    }).join('');
}

function deleteFinanceReport2(year, fileId) {
    if (!confirm('确定要删除此审计报告吗？')) return;
    const allData = loadData('financeData', {});
    if (allData[year] && allData[year]._reports) {
        allData[year]._reports = allData[year]._reports.filter(r => r.id != fileId);
        saveData('financeData', allData);
    }
    deleteFileFromDB(fileId).catch(() => {});
    renderFinanceReports2(year);
    showToast('审计报告已删除', 'warning');
}

// Keep backward compatibility — old functions mapped to new ones
function saveFinanceData() { saveFinanceYear(); }
async function renderFinanceReports() { renderFinanceReports2(_financeCurrentYear); }
function deleteFinanceReport(el, fileId) {
    deleteFinanceReport2(_financeCurrentYear, fileId);
}

// ── 内部审计管理 ────────────────────────────────────
function loadAudits() { return loadData('internalAudits', []); }
function saveAudits(list) { saveData('internalAudits', list); }
let _auditCurrentYear = new Date().getFullYear().toString();
let _auditTempIssues = [];
let _auditTempReports = [];
let _auditViewMode = 'list';

function renderAudit() {
    const list = loadAudits();
    const years = [...new Set(list.map(a => a.year))].sort().reverse();
    if (!years.length) years.push(_auditCurrentYear);
    renderAuditYearTabs(years);
    renderAuditStats();
    const year = _auditCurrentYear || years[0];
    renderAuditList(year);
}
function renderAuditYearTabs(years) {
    const container = document.getElementById('auditYearTabs');
    container.innerHTML = years.map(y =>
        '<button class="tab-btn' + (_auditCurrentYear === y ? ' active' : '') +
        '" onclick="switchAuditYear(\'' + y + '\')">' + y + '年</button>'
    ).join('');
}
function switchAuditYear(year) {
    _auditCurrentYear = year;
    renderAudit();
}
function renderAuditList(year) {
    const container = document.getElementById('auditListContainer');
    const list = loadAudits().filter(a => a.year === year);
    if (!list.length) {
        container.innerHTML = '<div class="text-center py-16 text-slate-400"><i class="fas fa-search text-5xl mb-4"></i><p>' + year + '年暂无审计活动</p><p class="text-xs mt-1">点击"新建审计活动"开始</p></div>';
        return;
    }
    const typeIcons = { '进出口审计': 'fa-file-import text-blue-600', '持续性符合审计': 'fa-sync-alt text-purple-600', '专项审计': 'fa-search text-amber-600' };
    const statusColors = { '待开始': 'bg-slate-100 text-slate-600', '进行中': 'bg-blue-100 text-blue-700', '已完成': 'bg-emerald-100 text-emerald-700' };
    container.innerHTML = list.map(a => {
        const issuesTotal = (a.issues || []).length;
        const issuesDone = (a.issues || []).filter(i => i.status === '已整改').length;
        const reportCount = (a._reports || []).length;
        return '<div class="card-business rounded-lg p-4 hover:shadow-md transition-shadow">' +
            '<div class="flex justify-between items-start mb-3"><div class="flex-1"><div class="flex items-center flex-wrap gap-2"><i class="fas ' + (typeIcons[a.type] || 'fa-file text-slate-600') + '"></i><h4 class="font-bold text-slate-800">' + escapeHtml(a.title) + '</h4><span class="inline-block text-xs px-2 py-0.5 rounded ' + (statusColors[a.status] || 'bg-slate-100 text-slate-600') + '">' + a.status + '</span></div>' +
            '<p class="text-xs text-slate-500 mt-1">' + a.type + ' | ' + a.startDate + (a.endDate ? ' ~ ' + a.endDate : '') + '</p></div>' +
            '<div class="flex items-center space-x-1 flex-shrink-0"><button onclick="editAudit(\'' + a.id + '\')" class="p-1.5 text-slate-400 hover:text-slate-600" title="编辑"><i class="fas fa-edit"></i></button><button onclick="deleteAudit(\'' + a.id + '\')" class="p-1.5 text-red-400 hover:text-red-600" title="删除"><i class="fas fa-trash-alt"></i></button></div></div>' +
            '<div class="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs mb-3">' +
            '<div><span class="text-slate-400">负责人</span><p class="font-medium text-slate-700">' + escapeHtml(a.lead || '-') + '</p></div>' +
            '<div><span class="text-slate-400">成员</span><p class="text-slate-600">' + escapeHtml(a.members || '-') + '</p></div>' +
            '<div><span class="text-slate-400">对应部门</span><p class="text-slate-600">' + escapeHtml(a.depts || '-') + '</p></div>' +
            '<div><span class="text-slate-400">通知下发</span><p class="text-slate-600">' + (a.noticeDate || '-') + '</p></div>' +
            '<div><span class="text-slate-400">问题</span><p class="font-medium ' + (issuesDone === issuesTotal && issuesTotal > 0 ? 'text-emerald-600' : issuesTotal > 0 ? 'text-amber-600' : 'text-slate-400') + '">' + issuesDone + '/' + issuesTotal + ' 已整改</p></div>' +
            '<div><span class="text-slate-400">审计报告</span><p class="font-medium ' + (reportCount > 0 ? 'text-blue-600' : 'text-slate-400') + '">' + (reportCount > 0 ? '<i class="fas fa-file-pdf mr-1"></i>' + reportCount + ' 份' : '未上传') + '</p></div></div>' +
            (a.conclusion ? '<div class="mb-2 p-2 bg-slate-50 rounded text-xs text-slate-600"><span class="font-medium text-slate-500">审计结论：</span>' + escapeHtml(a.conclusion) + '</div>' : '') +
            (issuesTotal > 0 ? '<div class="border-t border-slate-100 pt-2"><table class="w-full text-xs"><thead><tr class="text-slate-400"><th class="text-left py-1 pr-2">问题描述</th><th class="text-left py-1 pr-2">责任部门</th><th class="text-left py-1 pr-2">整改期限</th><th class="text-left py-1 pr-2">改善措施</th><th class="text-left py-1 pr-2">状态</th></tr></thead><tbody>' +
                (a.issues || []).map(i => '<tr class="border-t border-slate-50"><td class="py-1 pr-2 text-slate-700">' + escapeHtml(i.desc) + '</td><td class="py-1 pr-2 text-slate-500">' + escapeHtml(i.dept || '-') + '</td><td class="py-1 pr-2 text-slate-500">' + (i.deadline || '-') + '</td><td class="py-1 pr-2 text-slate-600">' + escapeHtml(i.improvement || '-') + '</td><td class="py-1"><span class="inline-block px-1.5 py-0.5 rounded ' + (i.status === '已整改' ? 'bg-emerald-100 text-emerald-700' : i.status === '整改中' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700') + '">' + (i.status || '待整改') + '</span></td></tr>').join('') +
                '</tbody></table></div>' : '') +
            '</div>';
    }).join('');
}

function showAuditModal() {
    _auditEditId = null;
    _auditTempIssues = [];
    _auditTempReports = [];
    document.getElementById('auditModalTitle').textContent = '新建审计活动';
    document.getElementById('auditTitle').value = '';
    document.getElementById('auditType').value = '进出口审计';
    // Populate year selector
    const cur = new Date().getFullYear();
    const yearSel = document.getElementById('auditYear');
    yearSel.innerHTML = '';
    for (let y = cur + 1; y >= 2024; y--) {
        yearSel.innerHTML += '<option value="' + y + '"' + (y === cur ? ' selected' : '') + '>' + y + '年</option>';
    }
    document.getElementById('auditStartDate').value = new Date().toISOString().slice(0, 10);
    document.getElementById('auditEndDate').value = '';
    document.getElementById('auditLead').value = currentUser ? currentUser.name : '';
    document.getElementById('auditMembers').value = '';
    document.getElementById('auditDepts').value = '';
    document.getElementById('auditNoticeDate').value = '';
    document.getElementById('auditStatus').value = '待开始';
    document.getElementById('auditConclusion').value = '';
    document.getElementById('auditNotes').value = '';
    document.getElementById('auditIssueRows').innerHTML = '';
    document.getElementById('auditEditId').value = '';
    document.getElementById('auditReportList').innerHTML = '';
    document.getElementById('auditModal').classList.add('active');
}
function editAudit(id) {
    const list = loadAudits();
    const a = list.find(x => x.id === id);
    if (!a) return;
    _auditEditId = id;
    _auditTempIssues = (a.issues || []).map(i => ({...i}));
    _auditTempReports = (a._reports || []).map(r => ({...r}));
    document.getElementById('auditModalTitle').textContent = '编辑审计活动';
    document.getElementById('auditTitle').value = a.title || '';
    document.getElementById('auditType').value = a.type || '进出口审计';
    const yearSel = document.getElementById('auditYear');
    const cur = new Date().getFullYear();
    yearSel.innerHTML = '';
    for (let y = cur + 1; y >= 2024; y--) {
        yearSel.innerHTML += '<option value="' + y + '"' + (y === a.year ? ' selected' : '') + '>' + y + '年</option>';
    }
    document.getElementById('auditStartDate').value = a.startDate || '';
    document.getElementById('auditEndDate').value = a.endDate || '';
    document.getElementById('auditLead').value = a.lead || '';
    document.getElementById('auditMembers').value = a.members || '';
    document.getElementById('auditDepts').value = a.depts || '';
    document.getElementById('auditNoticeDate').value = a.noticeDate || '';
    document.getElementById('auditStatus').value = a.status || '待开始';
    document.getElementById('auditConclusion').value = a.conclusion || '';
    document.getElementById('auditNotes').value = a.notes || '';
    document.getElementById('auditEditId').value = id;
    renderAuditIssueRows();
    renderAuditReportFiles();
    document.getElementById('auditModal').classList.add('active');
}
function addAuditIssueRow() {
    const container = document.getElementById('auditIssueRows');
    const idx = container.children.length;
    const div = document.createElement('div');
    div.className = 'p-3 bg-amber-50 rounded-lg border border-amber-200';
    div.id = 'auditIssueRow_' + idx;
    div.innerHTML = '<div class="flex justify-between items-center mb-2"><span class="text-xs font-bold text-amber-800">问题 ' + (idx + 1) + '</span><button class="text-xs text-red-400 hover:text-red-600" onclick="this.closest(\'.p-3\').remove()"><i class="fas fa-times"></i></button></div>' +
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-2"><input type="text" class="w-full border border-amber-300 rounded px-2 py-1.5 text-sm" placeholder="问题描述" onchange="updateAuditIssue(' + idx + ',\'desc\',this.value)">' +
        '<input type="text" class="w-full border border-amber-300 rounded px-2 py-1.5 text-sm" placeholder="责任部门" onchange="updateAuditIssue(' + idx + ',\'dept\',this.value)">' +
        '<input type="date" class="w-full border border-amber-300 rounded px-2 py-1.5 text-sm" onchange="updateAuditIssue(' + idx + ',\'deadline\',this.value)">' +
        '<select class="w-full border border-amber-300 rounded px-2 py-1.5 text-sm bg-white" onchange="updateAuditIssue(' + idx + ',\'status\',this.value)"><option value="待整改">待整改</option><option value="整改中">整改中</option><option value="已整改">已整改</option></select>' +
        '<div class="md:col-span-2"><input type="text" class="w-full border border-amber-300 rounded px-2 py-1.5 text-sm" placeholder="改善措施" onchange="updateAuditIssue(' + idx + ',\'improvement\',this.value)"></div></div>';
    container.appendChild(div);
    _auditTempIssues.push({ desc: '', dept: '', deadline: '', status: '待整改', improvement: '' });
}
function updateAuditIssue(idx, field, val) {
    if (!_auditTempIssues[idx]) _auditTempIssues[idx] = { desc: '', dept: '', deadline: '', status: '待整改', improvement: '' };
    _auditTempIssues[idx][field] = val;
}
function renderAuditIssueRows() {
    const container = document.getElementById('auditIssueRows');
    container.innerHTML = '';
    _auditTempIssues.forEach((issue, idx) => {
        const div = document.createElement('div');
        div.className = 'p-3 bg-amber-50 rounded-lg border border-amber-200';
        div.innerHTML = '<div class="flex justify-between items-center mb-2"><span class="text-xs font-bold text-amber-800">问题 ' + (idx + 1) + '</span><button class="text-xs text-red-400 hover:text-red-600" onclick="this.closest(\'.p-3\').remove();_auditTempIssues.splice(' + idx + ',1)"><i class="fas fa-times"></i></button></div>' +
            '<div class="grid grid-cols-1 md:grid-cols-2 gap-2"><input type="text" class="w-full border border-amber-300 rounded px-2 py-1.5 text-sm" placeholder="问题描述" value="' + escapeHtml(issue.desc || '') + '" onchange="_auditTempIssues[' + idx + '].desc=this.value">' +
            '<input type="text" class="w-full border border-amber-300 rounded px-2 py-1.5 text-sm" placeholder="责任部门" value="' + escapeHtml(issue.dept || '') + '" onchange="_auditTempIssues[' + idx + '].dept=this.value">' +
            '<input type="date" class="w-full border border-amber-300 rounded px-2 py-1.5 text-sm" value="' + (issue.deadline || '') + '" onchange="_auditTempIssues[' + idx + '].deadline=this.value">' +
            '<select class="w-full border border-amber-300 rounded px-2 py-1.5 text-sm bg-white" onchange="_auditTempIssues[' + idx + '].status=this.value"><option value="待整改"' + (issue.status==='待整改'?' selected':'') + '>待整改</option><option value="整改中"' + (issue.status==='整改中'?' selected':'') + '>整改中</option><option value="已整改"' + (issue.status==='已整改'?' selected':'') + '>已整改</option></select>' +
            '<div class="md:col-span-2"><input type="text" class="w-full border border-amber-300 rounded px-2 py-1.5 text-sm" placeholder="改善措施" value="' + escapeHtml(issue.improvement || '') + '" onchange="_auditTempIssues[' + idx + '].improvement=this.value"></div></div>';
        container.appendChild(div);
    });
}
function saveAudit() {
    const title = document.getElementById('auditTitle').value.trim();
    const year = document.getElementById('auditYear').value;
    const type = document.getElementById('auditType').value;
    const startDate = document.getElementById('auditStartDate').value;
    const lead = document.getElementById('auditLead').value.trim();
    if (!title || !year || !startDate || !lead) { showToast('审计标题、年度、开始日期和负责人为必填', 'error'); return; }
    // Gather any inline issues not yet in _auditTempIssues
    document.querySelectorAll('#auditIssueRows > div').forEach((div, idx) => {
        const inputs = div.querySelectorAll('input, select');
        if (inputs.length >= 4 && !_auditTempIssues[idx]) {
            _auditTempIssues[idx] = {
                desc: inputs[0].value || '',
                dept: inputs[1].value || '',
                deadline: inputs[2].value || '',
                status: inputs[3].value || '待整改',
                improvement: inputs[4] ? inputs[4].value || '' : ''
            };
        }
    });
    const user = currentUser ? currentUser.name : 'system';
    let list = loadAudits();
    const editId = document.getElementById('auditEditId').value;
    const now = new Date().toISOString();
    const auditData = {
        title, year, type, startDate,
        endDate: document.getElementById('auditEndDate').value,
        lead, members: document.getElementById('auditMembers').value.trim(),
        depts: document.getElementById('auditDepts').value.trim(),
        noticeDate: document.getElementById('auditNoticeDate').value,
        status: document.getElementById('auditStatus').value,
        conclusion: document.getElementById('auditConclusion').value.trim(),
        notes: document.getElementById('auditNotes').value.trim(),
        issues: _auditTempIssues.filter(i => i.desc),
        _reports: _auditTempReports,
        updatedAt: now, updatedBy: user
    };
    if (editId) {
        const idx = list.findIndex(x => x.id === editId);
        if (idx >= 0) list[idx] = { ...list[idx], ...auditData };
    } else {
        auditData.id = 'AUD-' + year + '-' + String(list.filter(a => a.year === year).length + 1).padStart(3, '0');
        auditData.createdAt = now;
        auditData.createdBy = user;
        list.unshift(auditData);
    }
    saveAudits(list);
    closeModal('auditModal');
    _auditCurrentYear = year;
    renderAudit();
    addAuditLog((editId ? '编辑' : '新建') + '审计活动: ' + title, 'general', '');
    showToast('审计活动已保存', 'success');
}
function deleteAudit(id) {
    if (!confirm('确定要删除此审计活动吗？')) return;
    let list = loadAudits();
    list = list.filter(a => a.id !== id);
    saveAudits(list);
    renderAudit();
    showToast('审计活动已删除', 'warning');
}

function toggleAuditView() {
    const listContainer = document.getElementById('auditListContainer');
    const yearTabs = document.getElementById('auditYearTabs');
    const trackingView = document.getElementById('auditIssueTracking');
    const btn = document.getElementById('auditViewToggle');
    if (_auditViewMode === 'list') {
        _auditViewMode = 'tracking';
        listContainer.classList.add('hidden');
        yearTabs.classList.add('hidden');
        trackingView.classList.remove('hidden');
        btn.innerHTML = '<i class="fas fa-list"></i><span>审计活动列表</span>';
        renderIssueTracking();
    } else {
        _auditViewMode = 'list';
        listContainer.classList.remove('hidden');
        yearTabs.classList.remove('hidden');
        trackingView.classList.add('hidden');
        btn.innerHTML = '<i class="fas fa-tasks"></i><span>问题改善跟踪</span>';
    }
}

function renderIssueTracking() {
    const list = loadAudits();
    const yearFilter = document.getElementById('trackingYearFilter').value;
    const statusFilter = document.getElementById('trackingStatusFilter').value;

    // Populate year filter
    const years = [...new Set(list.map(a => a.year))].sort().reverse();
    const yearSel = document.getElementById('trackingYearFilter');
    if (yearSel.options.length <= 1) {
        yearSel.innerHTML = '<option value="all">全部年度</option>' +
            years.map(y => '<option value="' + y + '">' + y + '年</option>').join('');
    }

    // Collect all issues
    let allIssues = [];
    list.forEach(a => {
        (a.issues || []).forEach(i => {
            allIssues.push({ ...i, auditTitle: a.title, auditId: a.id, year: a.year });
        });
    });

    // Apply filters
    if (yearFilter !== 'all') allIssues = allIssues.filter(i => i.year === yearFilter);
    if (statusFilter !== 'all') allIssues = allIssues.filter(i => i.status === statusFilter);

    const tbody = document.getElementById('issueTrackingBody');
    const empty = document.getElementById('issueTrackingEmpty');

    if (!allIssues.length) {
        tbody.innerHTML = '';
        empty.classList.remove('hidden');
        document.getElementById('issueTrackingTableWrap').classList.add('hidden');
        return;
    }

    empty.classList.add('hidden');
    document.getElementById('issueTrackingTableWrap').classList.remove('hidden');

    const statusColors = {
        '待整改': 'bg-red-100 text-red-700',
        '整改中': 'bg-amber-100 text-amber-700',
        '已整改': 'bg-emerald-100 text-emerald-700'
    };

    tbody.innerHTML = allIssues.map((issue, idx) =>
        '<tr class="border-b border-slate-100 hover:bg-slate-50">' +
        '<td class="px-3 py-2.5 text-sm text-slate-700">' + escapeHtml(issue.desc || '-') + '</td>' +
        '<td class="px-3 py-2.5 text-xs text-slate-500">' + escapeHtml(issue.auditTitle || '-') + '</td>' +
        '<td class="px-3 py-2.5 text-xs text-slate-500">' + issue.year + '</td>' +
        '<td class="px-3 py-2.5 text-sm text-slate-600">' + escapeHtml(issue.dept || '-') + '</td>' +
        '<td class="px-3 py-2.5 text-xs text-slate-500 text-center">' + (issue.deadline || '-') + '</td>' +
        '<td class="px-3 py-2.5 text-sm text-slate-600">' + escapeHtml(issue.improvement || '-') + '</td>' +
        '<td class="px-3 py-2.5 text-center"><span class="inline-block px-2 py-0.5 rounded text-xs font-medium ' + (statusColors[issue.status] || 'bg-slate-100 text-slate-600') + '">' + (issue.status || '待整改') + '</span></td>' +
        '<td class="px-3 py-2.5 text-center">' +
        '<select class="text-xs border border-slate-300 rounded px-1.5 py-1 bg-white" onchange="updateTrackingIssueStatus(\'' + issue.auditId + '\',\'' + issue.desc.replace(/'/g, "\\'") + '\',this.value)">' +
        '<option value="待整改"' + (issue.status === '待整改' ? ' selected' : '') + '>待整改</option>' +
        '<option value="整改中"' + (issue.status === '整改中' ? ' selected' : '') + '>整改中</option>' +
        '<option value="已整改"' + (issue.status === '已整改' ? ' selected' : '') + '>已整改</option>' +
        '</select></td></tr>'
    ).join('');
}

function updateTrackingIssueStatus(auditId, desc, newStatus) {
    const list = loadAudits();
    const audit = list.find(a => a.id === auditId);
    if (!audit) return;
    const issue = (audit.issues || []).find(i => i.desc === desc);
    if (!issue) return;
    issue.status = newStatus;
    saveAudits(list);
    renderIssueTracking();
    showToast('问题状态已更新: ' + newStatus, 'success');
}

function uploadAuditReport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 50*1024*1024) { showToast('文件大小不能超过50MB', 'error'); return; }
        try {
            const info = await saveFileToDB(file, 'audit_report');
            _auditTempReports.push({ id: info.id, name: info.name, size: info.size, uploadedAt: new Date().toISOString() });
            renderAuditReportFiles();
            showToast('审计报告上传成功: ' + info.name, 'success');
        } catch(err) { showToast('上传失败: ' + err.message, 'error'); }
    };
    input.click();
}

function renderAuditReportFiles() {
    const list = document.getElementById('auditReportList');
    if (!_auditTempReports.length) {
        list.innerHTML = '<div class="text-center py-3 text-slate-400"><i class="fas fa-inbox text-lg mb-1"></i><p class="text-xs">暂无上传报告</p></div>';
        return;
    }
    list.innerHTML = _auditTempReports.map(r => {
        const date = new Date(r.uploadedAt).toLocaleDateString('zh-CN');
        return '<div class="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200"><div class="flex items-center space-x-2"><i class="fas fa-file-pdf text-red-500"></i><div><p class="text-xs font-medium text-slate-700">' + escapeHtml(r.name) + '</p><p class="text-xs text-slate-400">' + date + ' | ' + formatFileSize(r.size) + '</p></div></div><button class="p-1.5 text-slate-400 hover:text-red-600 text-xs" onclick="deleteAuditReport(\'' + r.id + '\')"><i class="fas fa-trash-alt"></i></button></div>';
    }).join('');
}

function deleteAuditReport(fileId) {
    if (!confirm('确定要删除此审计报告吗？')) return;
    _auditTempReports = _auditTempReports.filter(r => r.id != fileId);
    deleteFileFromDB(fileId).catch(() => {});
    renderAuditReportFiles();
    showToast('审计报告已删除', 'warning');
}

function renderAuditStats() {
    const container = document.getElementById('auditStatsBar');
    if (!container) return;
    const list = loadAudits();
    const year = _auditCurrentYear || new Date().getFullYear().toString();
    const yearAudits = list.filter(function(a) { return a.year === year; });
    const totalAudits = yearAudits.length;
    var openIssues = 0;
    var resolvedIssues = 0;
    yearAudits.forEach(function(a) {
        (a.issues || []).forEach(function(i) {
            if (i.status === '已整改') resolvedIssues++;
            else openIssues++;
        });
    });
    container.innerHTML =
        '<div class="grid grid-cols-3 gap-4 mb-4">' +
        '<div class="bg-white rounded-lg border border-slate-200 p-4 flex items-center space-x-3">' +
        '<div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><i class="fas fa-clipboard-list text-blue-600"></i></div>' +
        '<div><p class="text-xs text-slate-500">本年度审计活动</p><p class="text-xl font-bold text-slate-800">' + totalAudits + '</p></div></div>' +
        '<div class="bg-white rounded-lg border border-slate-200 p-4 flex items-center space-x-3">' +
        '<div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><i class="fas fa-exclamation-triangle text-amber-600"></i></div>' +
        '<div><p class="text-xs text-slate-500">未整改问题</p><p class="text-xl font-bold text-amber-600">' + openIssues + '</p></div></div>' +
        '<div class="bg-white rounded-lg border border-slate-200 p-4 flex items-center space-x-3">' +
        '<div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><i class="fas fa-check-circle text-emerald-600"></i></div>' +
        '<div><p class="text-xs text-slate-500">已整改问题</p><p class="text-xl font-bold text-emerald-600">' + resolvedIssues + '</p></div></div></div>';
}

// ------------------------------------------------------------------------
// 15c. 培训中心
// ------------------------------------------------------------------------
async function uploadTrainingDoc() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.ppt,.pptx,.doc,.docx,.mp4,.avi,.mov,.zip,.rar,.jpg,.png';
    input.multiple = true;
    input.onchange = async function(e) {
        const files = e.target.files;
        if (!files.length) return;
        let success = 0;
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > 200*1024*1024) { showToast(files[i].name + ' 超过200MB限制，已跳过', 'warning'); continue; }
            try {
                await saveFileToDB(files[i], 'training');
                success++;
            } catch(err) { showToast(files[i].name + ' 上传失败: ' + err.message, 'error'); }
        }
        if (success > 0) {
            addAuditLog('上传培训资料', 'general', '成功 ' + success + ' 份');
            showToast('成功上传 ' + success + ' 份培训资料', 'success');
            renderTrainingFiles();
        }
    };
    input.click();
}
async function renderTrainingFiles() {
    try {
        const files = await listFilesFromDB('training');
        const list = document.getElementById('trainingFileList');
        if (!files.length) {
            list.innerHTML = '<div class="text-center py-6 text-slate-400"><i class="fas fa-inbox text-3xl mb-2"></i><p class="text-xs">暂无上传文件</p></div>';
            return;
        }
        list.innerHTML = files.slice().reverse().map(f => {
            const date = new Date(f.uploadedAt).toLocaleDateString('zh-CN');
            return '<div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200" data-fileid="' + f.id + '"><div class="flex items-center space-x-3"><i class="fas ' + getFileIcon(f.type) + ' text-lg"></i><div><p class="text-sm font-medium text-slate-700 cursor-pointer hover:text-blue-600" onclick="previewFile(' + f.id + ',\'' + escapeHtml(f.name) + '\')">' + escapeHtml(f.name) + '</p><p class="text-xs text-slate-500">上传时间: ' + date + ' | 大小: ' + formatFileSize(f.size) + '</p></div></div><div class="flex space-x-1"><button class="p-2 text-blue-400 hover:text-blue-600" onclick="previewFile(' + f.id + ',\'' + escapeHtml(f.name) + '\')" title="预览"><i class="fas fa-eye"></i></button><button class="p-2 text-slate-400 hover:text-red-600" onclick="deleteTrainingFile(this)"><i class="fas fa-trash-alt"></i></button></div></div>';
        }).join('');
    } catch(e) { console.log('renderTrainingFiles error:', e); }
}
async function deleteTrainingFile(el) {
    const row = el.closest('[data-fileid]');
    if (!row) return;
    const id = row.dataset.fileid;
    if (!confirm('确定要删除此文件吗？')) return;
    try {
        await deleteFileFromDB(id);
        row.remove();
        addAuditLog('删除培训文件', 'general', 'ID: ' + id);
        showToast('文件已删除', 'warning');
    } catch(err) { showToast('删除失败', 'error'); }
}

// ------------------------------------------------------------------------
// 15d. 其他模块函数
// ------------------------------------------------------------------------
function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
// ── 公司信息设置 ───────────────────────────────────────────────
function getDefaultCompanyInfo() {
    var now = new Date();
    var lastYear = now.getFullYear() - 1;
    return {
        name: '上海XX进出口有限公司',
        creditCode: '91310000XXXXXXXXXX',
        customsCode: '311XXXXXXXX',
        customsOffice: '上海海关',
        enterpriseType: '进出口货物收发货人',
        certLevel: '高级认证企业（AEO）',
        legalPerson: '王某某',
        financeContact: '李某某',
        customsContact: '张某某',
        desc: '本公司成立于2010年，是一家专业从事电子产品进出口的贸易企业。公司总部位于上海浦东新区，在深圳、宁波设有分支机构。2021年通过海关高级认证，成为AEO企业。公司年进出口额超过2亿美元，业务覆盖欧美、东南亚等58个国家和地区。',
        lastCertDate: '2021-06-15',
        lastCertPassed: '是',
        nextCertDate: (lastYear) + '-06-15',
        certHistory: [
            { year: '2021', date: '2021-06-15', passed: '是', notes: '首次通过海关高级认证' },
            { year: '2024', date: '2024-06-10', passed: '是', notes: '复核通过' }
        ],
        certDocs: []
    };
}
function loadCompanyInfo() {
    const info = loadData('companyInfo', getDefaultCompanyInfo());
    // 填充企业介绍页面
    document.getElementById('ci_name').textContent = info.name;
    document.getElementById('ci_creditCode').textContent = info.creditCode;
    document.getElementById('ci_customsCode').textContent = info.customsCode;
    document.getElementById('ci_customsOffice').textContent = info.customsOffice;
    document.getElementById('ci_enterpriseType').textContent = info.enterpriseType;
    document.getElementById('ci_certLevel').textContent = info.certLevel;
    document.getElementById('ci_legalPerson').textContent = info.legalPerson;
    document.getElementById('ci_financeContact').textContent = info.financeContact;
    document.getElementById('ci_customsContact').textContent = info.customsContact;
    document.getElementById('enterpriseDesc').textContent = info.desc;
    // 更新顶部导航栏企业名称
    const hdrName = document.getElementById('headerCompanyName');
    if (hdrName) hdrName.textContent = info.name;
    document.title = info.name + ' - AEO海关认证管理系统';
}
function showCompanySettings() {
    const info = loadData('companyInfo', getDefaultCompanyInfo());
    document.getElementById('cs_name').value = info.name;
    document.getElementById('cs_creditCode').value = info.creditCode;
    document.getElementById('cs_customsCode').value = info.customsCode;
    document.getElementById('cs_customsOffice').value = info.customsOffice;
    document.getElementById('cs_enterpriseType').value = info.enterpriseType;
    document.getElementById('cs_certLevel').value = info.certLevel;
    document.getElementById('cs_legalPerson').value = info.legalPerson;
    document.getElementById('cs_financeContact').value = info.financeContact;
    document.getElementById('cs_customsContact').value = info.customsContact;
    document.getElementById('cs_desc').value = info.desc;
    document.getElementById('companySettingsModal').classList.add('active');
}
function saveCompanySettings() {
    const info = {
        name: document.getElementById('cs_name').value.trim() || '未设置企业名称',
        creditCode: document.getElementById('cs_creditCode').value.trim(),
        customsCode: document.getElementById('cs_customsCode').value.trim(),
        customsOffice: document.getElementById('cs_customsOffice').value.trim(),
        enterpriseType: document.getElementById('cs_enterpriseType').value.trim() || '进出口货物收发货人',
        certLevel: document.getElementById('cs_certLevel').value.trim() || '高级认证企业（AEO）',
        legalPerson: document.getElementById('cs_legalPerson').value.trim(),
        financeContact: document.getElementById('cs_financeContact').value.trim(),
        customsContact: document.getElementById('cs_customsContact').value.trim(),
        desc: document.getElementById('cs_desc').value.trim()
    };
    saveData('companyInfo', info);
    loadCompanyInfo();
    closeModal('companySettingsModal');
    addAuditLog('更新公司信息', 'general', info.name);
    showToast('公司信息已保存', 'success');
}

// ── 进出口数据管理（BI分析源数据）─────────────────
function getDefaultTradeData() {
    return {
        years: [
            { year: 2024, importAmount: 12000, exportAmount: 9800, totalAmount: 21800, currency: 'CNY', declCount: 1240, inspectRate: 3.2 },
            { year: 2023, importAmount: 10500, exportAmount: 8500, totalAmount: 19000, currency: 'CNY', declCount: 1100, inspectRate: 3.5 },
            { year: 2022, importAmount: 9500, exportAmount: 7800, totalAmount: 17300, currency: 'CNY', declCount: 980, inspectRate: 4.1 }
        ],
        countries: [
            { name: '美国', ratio: 35 },
            { name: '欧盟', ratio: 25 },
            { name: '东南亚', ratio: 20 },
            { name: '日韩', ratio: 12 },
            { name: '其他', ratio: 8 }
        ]
    };
}
function loadTradeData() {
    return loadData('tradeData', getDefaultTradeData());
}
function editTradeData() {
    const td = loadTradeData();
    for (let i = 0; i < 5; i++) {
        const y = td.years[i] || { year: 2024-i, importAmount: '', exportAmount: '', totalAmount: '', currency: 'CNY', declCount: '', inspectRate: '' };
        document.getElementById('tdYear' + i).value = y.year || '';
        document.getElementById('tdImp' + i).value = y.importAmount || '';
        document.getElementById('tdExp' + i).value = y.exportAmount || '';
        document.getElementById('tdTotal' + i).value = y.totalAmount || '';
        document.getElementById('tdCur' + i).value = y.currency || 'CNY';
        document.getElementById('tdDec' + i).value = y.declCount || '';
        document.getElementById('tdInsp' + i).value = y.inspectRate || '';
    }
    for (let i = 0; i < 5; i++) {
        const c = td.countries[i] || { name: '', ratio: '' };
        document.getElementById('ctName' + i).value = c.name || '';
        document.getElementById('ctPct' + i).value = c.ratio || '';
    }
    document.getElementById('tradeDataModal').classList.add('active');
}
function saveTradeData() {
    const years = [];
    for (let i = 0; i < 5; i++) {
        const imp = parseFloat(document.getElementById('tdImp' + i).value) || 0;
        const exp = parseFloat(document.getElementById('tdExp' + i).value) || 0;
        years.push({
            year: parseInt(document.getElementById('tdYear' + i).value) || (2024-i),
            importAmount: imp,
            exportAmount: exp,
            totalAmount: imp + exp,
            currency: document.getElementById('tdCur' + i).value || 'CNY',
            declCount: parseInt(document.getElementById('tdDec' + i).value) || 0,
            inspectRate: parseFloat(document.getElementById('tdInsp' + i).value) || 0
        });
    }
    const countries = [];
    for (let i = 0; i < 5; i++) {
        const name = document.getElementById('ctName' + i).value.trim();
        const ratio = parseFloat(document.getElementById('ctPct' + i).value) || 0;
        if (name) countries.push({ name, ratio });
    }
    const data = { years, countries };
    saveData('tradeData', data);
    closeModal('tradeDataModal');
    renderTradeBI();
    addAuditLog('更新进出口数据', 'general', years.length + '年数据');
    showToast('进出口数据已保存', 'success');
}
function renderTradeBI() {
    const td = loadTradeData();
    const years = td.years || [];
    const countries = td.countries || [];

    // 更新统计卡片
    if (years.length > 0) {
        const latest = years[years.length-1];
        const prev = years.length > 1 ? years[years.length-2] : null;
        const curSymbol = latest.currency === 'CNY' ? '¥' : '$';
        document.getElementById('ci_tradeAmount').textContent = curSymbol + (latest.totalAmount / 10000).toFixed(2) + '亿';
        document.getElementById('ci_declCount').textContent = latest.declCount.toLocaleString();
        document.getElementById('ci_inspectRate').textContent = latest.inspectRate + '%';
        if (prev && prev.totalAmount > 0) {
            const growth = ((latest.totalAmount - prev.totalAmount) / prev.totalAmount * 100).toFixed(1);
            document.getElementById('ci_growthRate').textContent = (growth >= 0 ? '+' : '') + growth + '%';
        } else {
            document.getElementById('ci_growthRate').textContent = '--';
        }
    }

    // Populate 5-year data table
    var tableBody = document.getElementById('tradeDataTableBody');
    if (tableBody) {
        // Sort by year descending
        var sorted = years.slice().sort(function(a,b) { return b.year - a.year; });
        tableBody.innerHTML = sorted.map(function(y, i) {
            var prevYear = i < sorted.length - 1 ? sorted[i+1] : null;
            var growth = prevYear && prevYear.totalAmount > 0 ? ((y.totalAmount - prevYear.totalAmount) / prevYear.totalAmount * 100).toFixed(1) : '--';
            var growthStr = growth !== '--' ? (growth >= 0 ? '+' + growth : growth) + '%' : '--';
            var curSymbol = y.currency === 'CNY' ? '¥' : '$';
            return '<tr class="' + (i === 0 ? 'bg-blue-50 font-medium' : 'border-t border-slate-100') + '">' +
                '<td class="p-2 text-slate-800">' + y.year + '年</td>' +
                '<td class="p-2 text-right text-slate-700">' + curSymbol + (y.importAmount / 10000).toFixed(2) + '亿</td>' +
                '<td class="p-2 text-right text-slate-700">' + curSymbol + (y.exportAmount / 10000).toFixed(2) + '亿</td>' +
                '<td class="p-2 text-right text-slate-700 font-semibold">' + curSymbol + (y.totalAmount / 10000).toFixed(2) + '亿</td>' +
                '<td class="p-2 text-right text-slate-700">' + (y.declCount || 0).toLocaleString() + '</td>' +
                '<td class="p-2 text-right text-slate-700">' + (y.inspectRate || 0) + '%</td>' +
                '<td class="p-2 text-right ' + (growth !== '--' && parseFloat(growth) < 0 ? 'text-red-600' : 'text-emerald-600') + '">' + growthStr + '</td></tr>';
        }).join('');
    }

    // 重新绘制图表
    try {
        if (window._tradeChart) { window._tradeChart.destroy(); }
        if (window._countryChart) { window._countryChart.destroy(); }
    } catch(e) {}

    const canvas1 = document.getElementById('tradeChart');
    const canvas2 = document.getElementById('countryChart');
    if (!canvas1 || !canvas2) return;
    if (typeof Chart === 'undefined') return;

    const labels = years.map(y => y.year + '年');
    const importData = years.map(y => y.importAmount);
    const exportData = years.map(y => y.exportAmount);
    const totalData = years.map(y => y.totalAmount);
    const curLabel = years.length > 0 && years[0].currency === 'CNY' ? '万元' : '万美元';

    try {
        window._tradeChart = new Chart(canvas1, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: '进口额(' + curLabel + ')', data: importData, backgroundColor: '#1e3a5f' },
                    { label: '出口额(' + curLabel + ')', data: exportData, backgroundColor: '#b45309' },
                    { label: '进出口合计(' + curLabel + ')', data: totalData, borderColor: '#059669', type: 'line', fill: false, tension: 0.3, pointRadius: 4 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: true,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
                scales: { y: { beginAtZero: true, ticks: { font: { size: 10 } } } }
            }
        });
    } catch(e) {}

    try {
        const colors = ['#1e3a5f', '#2c5282', '#b45309', '#059669', '#7c3aed'];
        window._countryChart = new Chart(canvas2, {
            type: 'doughnut',
            data: {
                labels: countries.map(c => c.name),
                datasets: [{ data: countries.map(c => c.ratio), backgroundColor: colors.slice(0, countries.length) }]
            },
            options: {
                responsive: true, maintainAspectRatio: true,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } }
            }
        });
    } catch(e) {}
}

// ── 企业介绍 Tab 切换与证照管理 ──────────────────────────
function switchEnterpriseTab(tabName) {
    document.querySelectorAll('.enterprise-tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.enterprise-tab-content').forEach(function(c) { c.classList.add('hidden'); });
    var tabBtn = document.querySelector('.enterprise-tab[data-tab="' + tabName + '"]');
    if (tabBtn) tabBtn.classList.add('active');
    var content = document.getElementById('entTab' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (content) content.classList.remove('hidden');
    if (tabName === 'trade') renderTradeBI();
    if (tabName === 'certificates') renderCertDocs();
    if (tabName === 'history') renderCertHistory();
}

// ── 企业证照管理 ─────────────────────────────────
function loadCertDocs() {
    const info = loadData('companyInfo', getDefaultCompanyInfo());
    return info.certDocs || [];
}
function saveCertDocs(docs) {
    const info = loadData('companyInfo', getDefaultCompanyInfo());
    info.certDocs = docs;
    saveData('companyInfo', info);
}
function renderCertDocs() {
    const docs = loadCertDocs();
    const container = document.getElementById('certDocList');
    if (!container) return;
    if (!docs.length) {
        container.innerHTML = '<div class="text-center py-12 text-slate-400"><i class="fas fa-file-upload text-4xl mb-3"></i><p>暂无证照文档</p><p class="text-xs mt-1">点击"上传文档"上传海关注册证书、AEO认证证书等海关文书</p></div>';
        return;
    }
    const typeLabels = { customs_reg: '海关注册登记证书', aeo_cert: 'AEO认证证书', customs_decl: '报关单位备案证明', inspection: '检验检疫证书', license: '进出口经营许可证', other: '其他海关文书' };
    const typeIcons = { customs_reg: 'fa-file-contract', aeo_cert: 'fa-certificate', customs_decl: 'fa-file-alt', inspection: 'fa-clipboard-check', license: 'fa-file-signature', other: 'fa-file' };
    const typeColors = { customs_reg: 'blue', aeo_cert: 'amber', customs_decl: 'emerald', inspection: 'purple', license: 'indigo', other: 'slate' };
    container.innerHTML = docs.map(function(doc, i) {
        var tc = typeColors[doc.type] || 'slate';
        var ext = doc.fileName ? doc.fileName.split('.').pop().toLowerCase() : '';
        var isImage = ['jpg','jpeg','png','gif','webp'].indexOf(ext) !== -1;
        return '<div class="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-all">' +
            '<div class="flex items-center space-x-4">' +
            '<div class="w-12 h-12 bg-' + tc + '-100 rounded-lg flex items-center justify-center text-' + tc + '-600"><i class="fas ' + (typeIcons[doc.type] || 'fa-file') + ' text-xl"></i></div>' +
            '<div><p class="font-medium text-slate-800 text-sm">' + escapeHtml(doc.name) + '</p>' +
            '<p class="text-xs text-slate-400 mt-0.5">' + (typeLabels[doc.type] || doc.type) + ' · ' + (doc.uploadDate || '') + (doc.notes ? ' · ' + escapeHtml(doc.notes) : '') + '</p></div></div>' +
            '<div class="flex items-center space-x-2">' +
            (doc.data ? '<button onclick="previewCertDoc(' + i + ')" class="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded hover:bg-slate-200 border border-slate-200"><i class="fas fa-eye mr-1"></i>预览</button>' : '') +
            '<button onclick="deleteCertDoc(' + i + ')" class="text-xs bg-white text-red-500 px-3 py-1.5 rounded hover:bg-red-50 border border-red-200"><i class="fas fa-trash-alt"></i></button></div></div>';
    }).join('');
}
function showCertUploadModal() {
    document.getElementById('certDocType').value = '';
    document.getElementById('certDocName').value = '';
    document.getElementById('certDocFileName').textContent = '点击选择文件';
    document.getElementById('certDocNotes').value = '';
    var fileInput = document.getElementById('certDocFile');
    if (fileInput) fileInput.value = '';
    document.getElementById('certUploadModal').classList.add('active');
}
var _certSelectedFileData = null;
var _certSelectedFileName = '';
function onCertFileSelect(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    _certSelectedFileName = file.name;
    document.getElementById('certDocFileName').textContent = file.name;
    var reader = new FileReader();
    reader.onload = function(e) {
        _certSelectedFileData = e.target.result;
    };
    reader.readAsDataURL(file);
}
function saveCertDoc() {
    var type = document.getElementById('certDocType').value;
    var name = document.getElementById('certDocName').value.trim();
    var notes = document.getElementById('certDocNotes').value.trim();
    if (!type || !name) { showToast('请填写文档类型和名称', 'error'); return; }
    var doc = { id: 'CERT-' + Date.now(), type: type, name: name, fileName: _certSelectedFileName || '', data: _certSelectedFileData || '', uploadDate: new Date().toISOString().slice(0,10), notes: notes };
    var docs = loadCertDocs();
    docs.unshift(doc);
    saveCertDocs(docs);
    _certSelectedFileData = null;
    _certSelectedFileName = '';
    closeModal('certUploadModal');
    renderCertDocs();
    showToast('证照文档已保存', 'success');
}
function deleteCertDoc(idx) {
    if (!confirm('确定要删除此文档吗？')) return;
    var docs = loadCertDocs();
    docs.splice(idx, 1);
    saveCertDocs(docs);
    renderCertDocs();
    showToast('文档已删除', 'warning');
}
function previewCertDoc(idx) {
    var docs = loadCertDocs();
    var doc = docs[idx];
    if (!doc || !doc.data) { showToast('文档数据不可用', 'error'); return; }
    document.getElementById('certPreviewTitle').textContent = doc.name;
    var content = document.getElementById('certPreviewContent');
    var ext = doc.fileName ? doc.fileName.split('.').pop().toLowerCase() : '';
    var isImage = ['jpg','jpeg','png','gif','webp'].indexOf(ext) !== -1;
    if (isImage) {
        content.innerHTML = '<div class="text-center"><img src="' + doc.data + '" class="max-w-full max-h-[70vh] mx-auto rounded-lg shadow-sm" alt="' + escapeHtml(doc.name) + '"></div>';
    } else {
        content.innerHTML = '<div class="text-center py-8"><i class="fas fa-file-pdf text-5xl text-red-500 mb-4"></i><p class="text-sm text-slate-600">PDF文档</p><a href="' + doc.data + '" download="' + escapeHtml(doc.fileName) + '" class="btn-primary mt-4 inline-block px-6 py-2 rounded-lg text-sm"><i class="fas fa-download mr-1"></i>下载文档</a></div>';
    }
    document.getElementById('certDocPreviewModal').classList.add('active');
}

// ── 认证历程 ─────────────────────────────────
function loadCertHistory() {
    const info = loadData('companyInfo', getDefaultCompanyInfo());
    return { lastCertDate: info.lastCertDate || '', lastCertPassed: info.lastCertPassed || '是', nextCertDate: info.nextCertDate || '', certHistory: info.certHistory || [] };
}
function saveCertHistoryData(data) {
    const info = loadData('companyInfo', getDefaultCompanyInfo());
    info.lastCertDate = data.lastCertDate;
    info.lastCertPassed = data.lastCertPassed;
    info.nextCertDate = data.nextCertDate;
    info.certHistory = data.certHistory;
    saveData('companyInfo', info);
}
function renderCertHistory() {
    const data = loadCertHistory();
    var lastDateEl = document.getElementById('ci_lastCertDate');
    var lastPassEl = document.getElementById('ci_lastCertPassed');
    var nextDateEl = document.getElementById('ci_nextCertDate');
    if (lastDateEl) lastDateEl.textContent = data.lastCertDate || '未设置';
    if (lastPassEl) {
        lastPassEl.textContent = data.lastCertPassed || '--';
        lastPassEl.className = 'text-sm font-medium ' + (data.lastCertPassed === '是' ? 'text-emerald-600' : 'text-red-600');
    }
    if (nextDateEl) nextDateEl.textContent = data.nextCertDate || '未设置';
    var list = document.getElementById('certHistoryList');
    if (!list) return;
    var history = data.certHistory || [];
    if (!history.length) {
        list.innerHTML = '<div class="text-center py-12 text-slate-400"><i class="fas fa-history text-4xl mb-3"></i><p>暂无认证历史记录</p></div>';
        return;
    }
    list.innerHTML = '<div class="space-y-3">' + history.map(function(h) {
        var passedIcon = h.passed === '是' ? 'text-emerald-600' : 'text-red-600';
        var passedLabel = h.passed === '是' ? '通过' : '未通过';
        return '<div class="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg border-l-4 ' + (h.passed === '是' ? 'border-l-emerald-500' : 'border-l-red-500') + '">' +
            '<div class="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 ' + (h.passed === '是' ? 'border-emerald-200 text-emerald-600' : 'border-red-200 text-red-600') + ' flex-shrink-0"><i class="fas ' + (h.passed === '是' ? 'fa-check-circle' : 'fa-times-circle') + '"></i></div>' +
            '<div class="flex-1"><p class="font-medium text-slate-800">' + h.year + '年认证' + (h.date ? ' (' + h.date + ')' : '') + '</p>' +
            '<p class="text-sm text-slate-500 mt-1">结果: <span class="font-medium ' + passedIcon + '">' + passedLabel + '</span></p>' +
            (h.notes ? '<p class="text-xs text-slate-400 mt-1">' + escapeHtml(h.notes) + '</p>' : '') + '</div></div>';
    }).join('') + '</div>';
}
function showCertHistoryModal() {
    const data = loadCertHistory();
    document.getElementById('chLastCertDate').value = data.lastCertDate || '';
    document.getElementById('chLastCertPassed').value = data.lastCertPassed || '是';
    document.getElementById('chNextCertDate').value = data.nextCertDate || '';
    var editList = document.getElementById('certHistoryEditList');
    var history = data.certHistory || [];
    if (history.length) {
        editList.innerHTML = history.map(function(h, i) {
            return '<div class="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg">' +
                '<input type="text" class="ch-year w-20 border border-slate-300 rounded px-2 py-1.5 text-xs" value="' + h.year + '" placeholder="年份">' +
                '<input type="date" class="ch-date flex-1 border border-slate-300 rounded px-2 py-1.5 text-xs" value="' + (h.date || '') + '">' +
                '<select class="ch-passed w-20 border border-slate-300 rounded px-2 py-1.5 text-xs bg-white"><option value="是"' + (h.passed === '是' ? ' selected' : '') + '>通过</option><option value="否"' + (h.passed === '否' ? ' selected' : '') + '>未通过</option></select>' +
                '<input type="text" class="ch-notes flex-1 border border-slate-300 rounded px-2 py-1.5 text-xs" value="' + escapeHtml(h.notes || '') + '" placeholder="备注">' +
                '<button onclick="removeCertHistoryRow(this)" class="text-red-400 hover:text-red-600 text-xs"><i class="fas fa-times"></i></button></div>';
        }).join('');
    } else {
        editList.innerHTML = '<div class="text-center py-4 text-slate-400 text-sm">暂无历史记录</div>';
    }
    document.getElementById('certHistoryModal').classList.add('active');
}
function addCertHistoryRow() {
    var editList = document.getElementById('certHistoryEditList');
    var emptyMsg = editList.querySelector('.text-center.py-4');
    if (emptyMsg) emptyMsg.remove();
    var row = document.createElement('div');
    row.className = 'flex items-center space-x-2 p-2 bg-slate-50 rounded-lg';
    row.innerHTML = '<input type="text" class="ch-year w-20 border border-slate-300 rounded px-2 py-1.5 text-xs" placeholder="年份">' +
        '<input type="date" class="ch-date flex-1 border border-slate-300 rounded px-2 py-1.5 text-xs">' +
        '<select class="ch-passed w-20 border border-slate-300 rounded px-2 py-1.5 text-xs bg-white"><option value="是">通过</option><option value="否">未通过</option></select>' +
        '<input type="text" class="ch-notes flex-1 border border-slate-300 rounded px-2 py-1.5 text-xs" placeholder="备注">' +
        '<button onclick="removeCertHistoryRow(this)" class="text-red-400 hover:text-red-600 text-xs"><i class="fas fa-times"></i></button>';
    editList.appendChild(row);
}
function removeCertHistoryRow(btn) {
    btn.closest('.flex.items-center').remove();
}
function saveCertHistory() {
    var lastCertDate = document.getElementById('chLastCertDate').value;
    var lastCertPassed = document.getElementById('chLastCertPassed').value;
    var nextCertDate = document.getElementById('chNextCertDate').value;
    var rows = document.querySelectorAll('#certHistoryEditList .flex.items-center');
    var history = [];
    rows.forEach(function(r) {
        var year = r.querySelector('.ch-year').value.trim();
        var date = r.querySelector('.ch-date').value;
        var passed = r.querySelector('.ch-passed').value;
        var notes = r.querySelector('.ch-notes').value.trim();
        if (year) history.push({ year: year, date: date, passed: passed, notes: notes });
    });
    saveCertHistoryData({ lastCertDate: lastCertDate, lastCertPassed: lastCertPassed, nextCertDate: nextCertDate, certHistory: history });
    closeModal('certHistoryModal');
    renderCertHistory();
    const info = loadData('companyInfo', getDefaultCompanyInfo());
    loadCompanyInfo();
    showToast('认证信息已保存', 'success');
}

// ── 供应商资质评估 ─────────────────────────────────
function loadSuppliers() { return loadData('suppliers', []); }
function saveSuppliers(list) { saveData('suppliers', list); }

// ── 供应商批量选择 ──
var _selectedSupplierIds = [];

function toggleSupplierSelect(id, checked) {
    if (checked) {
        if (_selectedSupplierIds.indexOf(id) === -1) _selectedSupplierIds.push(id);
    } else {
        _selectedSupplierIds = _selectedSupplierIds.filter(function(x) { return x !== id; });
    }
    updateBatchBar();
}

function toggleSelectAllSuppliers(checked) {
    var list = loadSuppliers();
    var filter = (document.getElementById('supplierQuery').value || '').trim().toLowerCase();
    var filtered = filter ? list.filter(function(s) { return s.name.toLowerCase().includes(filter) || s.creditCode.includes(filter); }) : list;
    _selectedSupplierIds = checked ? filtered.map(function(s) { return s.id; }) : [];
    updateBatchBar();
    // Update all checkbox visual state
    document.querySelectorAll('#supplierTableContainer .supplier-check').forEach(function(cb) { cb.checked = checked; });
}

function updateBatchBar() {
    var bar = document.getElementById('supplierBatchBar');
    var count = document.getElementById('supplierSelectedCount');
    if (!bar || !count) return;
    if (_selectedSupplierIds.length > 0) {
        bar.classList.remove('hidden');
        count.textContent = _selectedSupplierIds.length;
    } else {
        bar.classList.add('hidden');
    }
}

function clearSupplierSelection() {
    _selectedSupplierIds = [];
    updateBatchBar();
    document.querySelectorAll('#supplierTableContainer .supplier-check').forEach(function(cb) { cb.checked = false; });
}

function batchSendSa() {
    if (_selectedSupplierIds.length === 0) { showToast('请先选择供应商', 'warning'); return; }
    var list = loadSuppliers();
    var names = _selectedSupplierIds.map(function(id) {
        var s = list.find(function(x) { return x.id === id; });
        return s ? s.name : id;
    });
    if (!confirm('将向以下 ' + _selectedSupplierIds.length + ' 家供应商发起企业合规自评问卷：\n\n' + names.join('\n') + '\n\n确定继续？')) return;
    var saList = loadSupplierAssessments();
    var today = new Date().toISOString().slice(0, 10);
    _selectedSupplierIds.forEach(function(id) {
        var existing = saList.find(function(a) { return a.supplierId === id; });
        if (existing) {
            existing.status = 'sent';
            existing.sentDate = today;
            existing.receivedDate = '';
            existing.score = null;
        } else {
            var s = list.find(function(x) { return x.id === id; });
            saList.push({ id: 'SA-' + Date.now() + '-' + Math.random().toString(36).slice(2,6), supplierId: id, supplierName: s ? s.name : id, status: 'sent', score: null, sentDate: today, receivedDate: '', notes: '批量下发' });
        }
    });
    saveSupplierAssessments(saList);
    clearSupplierSelection();
    renderSuppliers();
    showToast('已向 ' + _selectedSupplierIds.length + ' 家供应商下发问卷', 'success');
}

function renderSuppliers() {
    const list = loadSuppliers();
    const filter = (document.getElementById('supplierQuery').value || '').trim().toLowerCase();
    const filtered = filter ? list.filter(s => s.name.toLowerCase().includes(filter) || s.creditCode.includes(filter)) : list;
    const c = document.getElementById('supplierTableContainer');
    if (!list.length) { c.innerHTML = '<div class="text-center py-12 text-slate-400"><i class="fas fa-handshake text-5xl mb-4"></i><p>暂无供应商，点击"新增供应商"开始维护</p></div>'; return; }
    if (!filtered.length) { c.innerHTML = '<div class="text-center py-12 text-slate-400"><i class="fas fa-filter text-5xl mb-4"></i><p>没有匹配的供应商</p></div>'; return; }
    const levelColors = { '高级认证企业（AEO）': 'bg-emerald-100 text-emerald-700', '认证企业': 'bg-blue-100 text-blue-700', '一般信用企业': 'bg-amber-100 text-amber-700', '失信企业': 'bg-red-100 text-red-700', '未查询到': 'bg-slate-100 text-slate-500' };
    const saList = loadSupplierAssessments();
    // Check for dishonest suppliers — show warning banner
    const dishonest = filtered.filter(s => { const q = (s.queries||[]); return q.length > 0 && q[q.length-1].level === '失信企业'; });
    var html = '';
    if (dishonest.length > 0) {
        html += '<div class="flex items-center space-x-2 mb-3 px-4 py-3 bg-red-600 text-white rounded-lg text-sm font-bold"><i class="fas fa-exclamation-triangle"></i><span>失信企业预警 — ' + dishonest.length + ' 家供应商当前海关信用等级为"失信企业"，请立即排查风险！</span></div>';
    }
    // Batch action bar (hidden until items selected)
    html += '<div id="supplierBatchBar" class="hidden mb-3 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">';
    html += '<span class="text-sm text-blue-700"><span id="supplierSelectedCount">0</span> 项已选择</span>';
    html += '<div class="flex items-center space-x-2">';
    html += '<button onclick="batchSendSa()" class="text-xs bg-violet-600 text-white px-3 py-1.5 rounded hover:bg-violet-700"><i class="fas fa-paper-plane mr-1"></i>批量下发问卷</button>';
    html += '<button onclick="clearSupplierSelection()" class="text-xs bg-white text-slate-500 px-3 py-1.5 rounded hover:bg-slate-50 border border-slate-200">取消选择</button>';
    html += '</div></div>';
    html += '<div class="overflow-x-auto"><table class="w-full text-sm">';
    html += '<thead><tr class="table-header-dark">';
    html += '<th class="px-2 py-3 text-center font-medium text-xs w-10"><input type="checkbox" onchange="toggleSelectAllSuppliers(this.checked)" class="rounded border-slate-400" style="accent-color:#1a365d"></th>';
    html += '<th class="px-2 py-3 text-left font-medium text-xs w-10">序号</th>';
    html += '<th class="px-2 py-3 text-left font-medium text-xs">企业名称</th>';
    html += '<th class="px-2 py-3 text-left font-medium text-xs">统一信用代码</th>';
    html += '<th class="px-2 py-3 text-left font-medium text-xs">海关注册编码</th>';
    html += '<th class="px-2 py-3 text-left font-medium text-xs">海关信用等级</th>';
    html += '<th class="px-2 py-3 text-left font-medium text-xs">类别</th>';
    html += '<th class="px-2 py-3 text-left font-medium text-xs">状态</th>';
    html += '<th class="px-2 py-3 text-left font-medium text-xs">自评回卷</th>';
    html += '<th class="px-2 py-3 text-center font-medium text-xs">分值</th>';
    html += '<th class="px-2 py-3 text-left font-medium text-xs">查询日期</th>';
    html += '<th class="px-2 py-3 text-left font-medium text-xs" style="min-width:80px">等级变化</th>';
    html += '<th class="px-2 py-3 text-center font-medium text-xs" style="min-width:130px">操作</th>';
    html += '</tr></thead><tbody>';
    filtered.forEach(function(s, idx) {
        const queries = s.queries || [];
        const lastQ = queries.length > 0 ? queries[queries.length - 1] : null;
        const prevQ = queries.length > 1 ? queries[queries.length - 2] : null;
        const latestLevel = lastQ ? lastQ.level : null;
        const isDishonest = lastQ && lastQ.level === '失信企业';
        const levelChanged = prevQ && lastQ && lastQ.level !== prevQ.level;
        const sa = saList.find(function(a) { return a.supplierId === s.id; });
        var checked = window._selectedSupplierIds && window._selectedSupplierIds.indexOf(s.id) !== -1;
        html += '<tr class="border-b border-slate-100 hover:bg-slate-50 ' + (isDishonest ? 'bg-red-50' : '') + '">';
        html += '<td class="px-2 py-3 text-center"><input type="checkbox" ' + (checked ? 'checked' : '') + ' onchange="toggleSupplierSelect(\'' + s.id + '\',this.checked)" class="rounded border-slate-400 supplier-check" style="accent-color:#1a365d"></td>';
        html += '<td class="px-2 py-3 text-xs text-slate-500">' + (idx + 1) + '</td>';
        html += '<td class="px-2 py-3"><a href="javascript:void(0)" onclick="showSupplierDetail(\'' + s.id + '\')" class="font-medium text-blue-600 hover:text-blue-800 hover:underline">' + escapeHtml(s.name) + ' <i class="fas fa-external-link-alt text-xs" style="opacity:0.5"></i></a></td>';
        html += '<td class="px-2 py-3 text-xs text-slate-600 font-mono">' + (s.creditCode || '—') + '</td>';
        html += '<td class="px-2 py-3 text-xs text-slate-600 font-mono">' + (s.customsCode || '—') + '</td>';
        html += '<td class="px-2 py-3"><span class="inline-block text-xs px-2 py-0.5 rounded ' + (latestLevel ? (levelColors[latestLevel] || 'bg-slate-100 text-slate-600') : 'bg-slate-100 text-slate-400') + '">' + (latestLevel ? latestLevel : '未查询') + '</span></td>';
        html += '<td class="px-2 py-3 text-xs text-slate-600">' + (s.category || '—') + '</td>';
        var statusBadge = s.status === '暂停' ? '<span class="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">暂停</span>' : (s.status === '终止合作' ? '<span class="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-600">终止</span>' : '<span class="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">合作中</span>');
        html += '<td class="px-2 py-3">' + statusBadge + '</td>';
        var saBadge = '—';
        if (sa) {
            if (sa.status === 'sent') saBadge = '<span class="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">已发送</span>';
            else if (sa.status === 'received') saBadge = '<span class="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">已回收</span>';
        }
        html += '<td class="px-2 py-3">' + saBadge + '</td>';
        html += '<td class="px-2 py-3 text-center text-xs font-semibold text-slate-700">' + (sa && sa.score != null ? sa.score : '—') + '</td>';
        html += '<td class="px-2 py-3 text-xs text-slate-500">' + (lastQ ? lastQ.date : '—') + '</td>';
        html += '<td class="px-2 py-3 text-xs">';
        if (levelChanged) {
            html += '<span class="text-amber-600 font-medium" title="从 ' + (prevQ ? prevQ.level : '') + ' 变更为 ' + (lastQ ? lastQ.level : '') + '"><i class="fas fa-exchange-alt mr-1"></i>有变化</span>';
        } else if (queries.length > 1) {
            html += '<span class="text-slate-500">无变化</span>';
        } else {
            html += '<span class="text-slate-400">—</span>';
        }
        html += '</td>';
        html += '<td class="px-2 py-3 text-center whitespace-nowrap">';
        html += '<button onclick="showSupplierQueryModal(\'' + s.id + '\')" class="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 border border-blue-200" title="海关信用查询"><i class="fas fa-search mr-1"></i>海关查询</button>';
        if (sa && sa.status === 'sent') {
            html += '<button onclick="showReceiveSaModal(\'' + s.id + '\')" class="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded hover:bg-emerald-100 border border-emerald-200 ml-1" title="回收问卷"><i class="fas fa-file-import"></i></button>';
        } else if (!sa || sa.status !== 'received') {
            html += '<button onclick="showSendSaModal(\'' + s.id + '\')" class="text-xs bg-violet-50 text-violet-600 px-2 py-1 rounded hover:bg-violet-100 border border-violet-200 ml-1" title="发起问卷"><i class="fas fa-paper-plane"></i></button>';
        }
        html += '<div class="inline-block ml-1 relative group">';
        html += '<button class="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded hover:bg-slate-100 border border-slate-200"><i class="fas fa-ellipsis-v"></i></button>';
        html += '<div class="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 hidden group-hover:block" style="min-width:100px"><div class="py-1">';
        html += '<button onclick="editSupplier(\'' + s.id + '\')" class="block w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"><i class="fas fa-edit mr-1.5"></i>编辑</button>';
        html += '<button onclick="deleteSupplier(\'' + s.id + '\')" class="block w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50"><i class="fas fa-trash-alt mr-1.5"></i>删除</button>';
        html += '</div></div></div>';
        html += '</td></tr>';
    });
    html += '</tbody></table></div>';
    html += '<div class="text-right mt-2"><span class="text-xs text-slate-400">共 ' + filtered.length + ' 条记录' + (filter ? '（已筛选）' : '') + '</span></div>';
    c.innerHTML = html;
    // Restore selection state after re-render
    updateBatchBar();
    if (_selectedSupplierIds.length > 0) {
        document.querySelectorAll('#supplierTableContainer .supplier-check').forEach(function(cb) {
            var row = cb.closest('tr');
            if (row) {
                // We stored id in the onchange attribute, extract it
                var match = cb.getAttribute('onchange') && cb.getAttribute('onchange').match(/toggleSupplierSelect\('([^']+)'/);
                if (match && _selectedSupplierIds.indexOf(match[1]) !== -1) cb.checked = true;
            }
        });
    }
}

function generateSupplierId() {
    const list = loadSuppliers();
    const nums = list.map(s => { const m = s.id.match(/SUP-(\d+)/); return m ? parseInt(m[1]) : 0; });
    return 'SUP-' + String((nums.length > 0 ? Math.max(...nums) + 1 : 1)).padStart(4, '0');
}

function showSupplierModal(data) {
    const isEdit = data && data.id;
    document.getElementById('supplierModalTitle').textContent = isEdit ? '编辑供应商' : '新增供应商';
    document.getElementById('supEditId').value = isEdit ? data.id : '';
    document.getElementById('supName').value = isEdit ? data.name : '';
    document.getElementById('supCreditCode').value = isEdit ? data.creditCode : '';
    document.getElementById('supCustomsCode').value = isEdit ? (data.customsCode || '') : '';
    document.getElementById('supLevel').value = isEdit ? (data.level || '') : '';
    document.getElementById('supCategory').value = isEdit ? (data.category || '') : '';
    document.getElementById('supQueryDate').value = isEdit ? (data.queryDate || '') : '';
    document.getElementById('supContactName').value = isEdit ? (data.contactName || '') : '';
    document.getElementById('supContactPhone').value = isEdit ? (data.contactPhone || '') : '';
    document.getElementById('supContactEmail').value = isEdit ? (data.contactEmail || '') : '';
    var radios = document.getElementsByName('supStatus');
    var statusVal = isEdit && data.status ? data.status : '启用合作';
    for (var i = 0; i < radios.length; i++) { radios[i].checked = radios[i].value === statusVal; }
    document.getElementById('supplierModal').classList.add('active');
}

function editSupplier(id) {
    const list = loadSuppliers();
    const s = list.find(x => x.id === id);
    if (s) showSupplierModal(s);
}

function saveSupplier() {
    const name = document.getElementById('supName').value.trim();
    const creditCode = document.getElementById('supCreditCode').value.trim();
    if (!name || !creditCode) { showToast('企业名称和信用代码为必填', 'error'); return; }
    if (creditCode.length !== 18) { showToast('统一社会信用代码应为18位', 'warning'); }
    const editId = document.getElementById('supEditId').value;
    const list = loadSuppliers();
    const now = new Date().toISOString();
    var statusVal = '启用合作';
    var radios = document.getElementsByName('supStatus');
    for (var i = 0; i < radios.length; i++) { if (radios[i].checked) { statusVal = radios[i].value; break; } }
    function getSup(id) { return document.getElementById(id).value.trim(); }
    if (editId) {
        const s = list.find(function(x) { return x.id === editId; });
        if (s) { s.name = name; s.creditCode = creditCode; s.customsCode = getSup('supCustomsCode'); s.level = getSup('supLevel'); s.category = getSup('supCategory'); s.queryDate = getSup('supQueryDate'); s.status = statusVal; s.contactName = getSup('supContactName'); s.contactPhone = getSup('supContactPhone'); s.contactEmail = getSup('supContactEmail'); s.updatedAt = now; }
    } else {
        var level = getSup('supLevel');
        var queryDate = getSup('supQueryDate');
        var newSupplier = { id: generateSupplierId(), name: name, creditCode: creditCode, customsCode: getSup('supCustomsCode'), level: level, category: getSup('supCategory'), queryDate: queryDate, status: statusVal, contactName: getSup('supContactName'), contactPhone: getSup('supContactPhone'), contactEmail: getSup('supContactEmail'), queries: [], createdAt: now, updatedAt: now };
        // If level and queryDate are set, also create an initial query record
        if (level && queryDate) {
            var expireDate = new Date();
            expireDate.setFullYear(expireDate.getFullYear() + 1);
            newSupplier.queries.push({ date: queryDate, level: level, validUntil: expireDate.toISOString().split('T')[0] });
        }
        list.unshift(newSupplier);
    }
    saveSuppliers(list);
    closeModal('supplierModal');
    renderSuppliers();
    addAuditLog((editId ? '编辑' : '新增') + '供应商: ' + name, 'general', creditCode);
    showToast('供应商已保存', 'success');
}

function deleteSupplier(id) {
    if (!confirm('确定要删除该供应商吗？')) return;
    const list = loadSuppliers();
    const s = list.find(x => x.id === id);
    const idx = list.findIndex(x => x.id === id);
    if (idx > -1) { list.splice(idx, 1); saveSuppliers(list); renderSuppliers(); addAuditLog('删除供应商: ' + (s ? s.name : id), 'general', ''); showToast('供应商已删除', 'warning'); }
}

function showSupplierQueryModal(id) {
    const list = loadSuppliers();
    const s = list.find(x => x.id === id);
    if (!s) return;
    document.getElementById('supQuerySupplierId').value = id;
    document.getElementById('supQueryName').textContent = s.name;
    document.getElementById('supQueryCode').textContent = s.creditCode;
    document.getElementById('supQueryDate').value = new Date().toISOString().slice(0, 10);
    document.getElementById('supQueryLevel').value = '';
    document.getElementById('supQueryValid').value = '';
    document.getElementById('supQueryNotes').value = '';
    document.getElementById('supQueryCreditStatus').value = '无失信记录';
    // Show previous level
    const queries = s.queries || [];
    const prevLevel = queries.length > 0 ? queries[queries.length - 1].level : null;
    const prevEl = document.getElementById('supQueryPrevLevel');
    if (prevLevel) {
        prevEl.className = 'text-xs px-2 py-1 rounded ' + (prevLevel === '失信企业' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-200 text-slate-600');
        prevEl.textContent = '上次: ' + prevLevel;
        prevEl.classList.remove('hidden');
    } else {
        prevEl.classList.add('hidden');
    }
    document.getElementById('supQueryChangeIndicator').classList.add('hidden');
    document.getElementById('supQueryModal').classList.add('active');
}

// ── 一键海关批量查询 ──
function showBatchCustomsQuery() {
    const list = loadSuppliers();
    const queryable = list.filter(s => { const q = s.queries || []; return q.length > 0; });
    if (!list.length) { showToast('暂无供应商', 'warning'); return; }
    if (!confirm('将批量查询所有 ' + list.length + ' 家供应商的海关信用等级（本次操作会自动记录一条查询记录并沿用上次查询结果，如无变化可手动编辑）。\n\n确定继续？')) return;
    var updated = 0;
    list.forEach(function(s) {
        var queries = s.queries || [];
        var lastQ = queries.length > 0 ? queries[queries.length - 1] : null;
        var today = new Date().toISOString().slice(0, 10);
        var newQ = { date: today, level: lastQ ? lastQ.level : '未查询到', validUntil: lastQ ? lastQ.validUntil : '', creditStatus: '无失信记录', notes: '批量查询' };
        queries.push(newQ);
        s.queries = queries;
        updated++;
    });
    saveSuppliers(list);
    renderSuppliers();
    showToast('已完成 ' + updated + ' 家供应商的批量信用查询', 'success');
}

// ── 供应商问卷上传 ──
function loadSupplierUploads() { return loadData('supplierUploads', {}); }
function saveSupplierUploads(data) { saveData('supplierUploads', data); }

function onSupplierFileSelect() {
    var input = document.getElementById('supUploadFileInput');
    var file = input.files && input.files[0];
    if (!file) return;
    var id = _supDetailId;
    if (!id) { showToast('请先选择供应商', 'error'); return; }
    var reader = new FileReader();
    reader.onload = function(e) {
        var uploads = loadSupplierUploads();
        if (!uploads[id]) uploads[id] = [];
        uploads[id].push({
            id: 'SUP-UPLOAD-' + Date.now(),
            fileName: file.name,
            fileSize: file.size,
            data: e.target.result,
            uploadedAt: new Date().toISOString()
        });
        saveSupplierUploads(uploads);
        input.value = '';
        renderSupplierUploadedFiles(id);
        showToast('问卷文件已上传', 'success');
    };
    reader.readAsDataURL(file);
}

function renderSupplierUploadedFiles(id) {
    var container = document.getElementById('supUploadFileList');
    if (!container) return;
    var uploads = loadSupplierUploads();
    var files = (uploads[id] || []).sort(function(a, b) { return new Date(b.uploadedAt) - new Date(a.uploadedAt); });
    if (!files.length) {
        container.innerHTML = '<div class="text-center py-6 text-slate-400 text-xs"><i class="fas fa-folder-open text-2xl mb-2"></i><p>暂无上传文件</p></div>';
        return;
    }
    container.innerHTML = files.map(function(f) {
        var ext = f.fileName.split('.').pop().toLowerCase();
        var isImage = ['jpg','jpeg','png','gif','webp'].indexOf(ext) !== -1;
        var icon = isImage ? 'fa-file-image' : (ext === 'pdf' ? 'fa-file-pdf' : (['doc','docx'].indexOf(ext) !== -1 ? 'fa-file-word' : (['xls','xlsx'].indexOf(ext) !== -1 ? 'fa-file-excel' : 'fa-file')));
        var color = isImage ? 'text-purple-600' : (ext === 'pdf' ? 'text-red-500' : (['doc','docx'].indexOf(ext) !== -1 ? 'text-blue-600' : (['xls','xlsx'].indexOf(ext) !== -1 ? 'text-emerald-600' : 'text-slate-500')));
        var sizeLabel = f.fileSize > 1048576 ? Math.round(f.fileSize/1048576*10)/10 + 'MB' : Math.round(f.fileSize/1024) + 'KB';
        var dateLabel = f.uploadedAt ? f.uploadedAt.slice(0,10) : '';
        return '<div class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">' +
            '<div class="flex items-center space-x-3"><i class="fas ' + icon + ' ' + color + ' text-lg"></i>' +
            '<div><p class="text-sm font-medium text-slate-700">' + escapeHtml(f.fileName) + '</p>' +
            '<p class="text-xs text-slate-400">' + sizeLabel + (dateLabel ? ' · ' + dateLabel : '') + '</p></div></div>' +
            '<div class="flex items-center space-x-1">' +
            (isImage ? '<button onclick="window.open(\'' + f.data + '\')" class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200"><i class="fas fa-eye"></i></button>' : '<button onclick="window.open(\'' + f.data + '\')" class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200"><i class="fas fa-download"></i></a></button>') +
            '<button onclick="deleteSupplierUpload(\'' + id + '\',\'' + f.id + '\')" class="text-xs bg-white text-red-400 px-2 py-1 rounded hover:bg-red-50"><i class="fas fa-trash-alt"></i></button></div></div>';
    }).join('');
}

function deleteSupplierUpload(supId, uploadId) {
    if (!confirm('确定删除此文件？')) return;
    var uploads = loadSupplierUploads();
    if (!uploads[supId]) return;
    uploads[supId] = uploads[supId].filter(function(f) { return f.id !== uploadId; });
    if (uploads[supId].length === 0) delete uploads[supId];
    saveSupplierUploads(uploads);
    renderSupplierUploadedFiles(supId);
    showToast('文件已删除', 'warning');
}

function onQueryLevelChange() {
    const level = document.getElementById('supQueryLevel').value;
    const indicator = document.getElementById('supQueryChangeIndicator');
    if (!level) { indicator.classList.add('hidden'); return; }
    const id = document.getElementById('supQuerySupplierId').value;
    const list = loadSuppliers();
    const s = list.find(x => x.id === id);
    const queries = s ? (s.queries || []) : [];
    const prevLevel = queries.length > 0 ? queries[queries.length - 1].level : null;
    if (!prevLevel) { indicator.classList.add('hidden'); return; }
    const changed = level !== prevLevel;
    indicator.classList.remove('hidden');
    if (level === '失信企业') {
        indicator.className = 'text-xs px-3 py-2 rounded-lg bg-red-100 text-red-700 border border-red-200';
        indicator.innerHTML = '<i class="fas fa-exclamation-triangle mr-1"></i> 预警：本供应商已被标记为<strong>失信企业</strong>，请立即评估风险！';
    } else if (changed) {
        indicator.className = 'text-xs px-3 py-2 rounded-lg bg-amber-100 text-amber-700 border border-amber-200';
        indicator.innerHTML = '<i class="fas fa-exchange-alt mr-1"></i> 等级发生变化：' + prevLevel + ' → ' + level;
        document.getElementById('supQueryPrevLevel').textContent = '上次: ' + prevLevel;
    } else {
        indicator.className = 'text-xs px-3 py-2 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200';
        indicator.innerHTML = '<i class="fas fa-check-circle mr-1"></i> 等级无变化（与上次一致）';
    }
}

function saveSupplierQuery() {
    const id = document.getElementById('supQuerySupplierId').value;
    const date = document.getElementById('supQueryDate').value;
    const level = document.getElementById('supQueryLevel').value;
    if (!date || !level) { showToast('查询日期和海关等级为必填', 'error'); return; }
    const list = loadSuppliers();
    const s = list.find(x => x.id === id);
    if (!s) return;
    if (!s.queries) s.queries = [];
    const queries = s.queries;
    const prevLevel = queries.length > 0 ? queries[queries.length - 1].level : null;
    const changed = prevLevel !== null && level !== prevLevel;
    const creditStatus = document.getElementById('supQueryCreditStatus').value;
    const now = new Date().toISOString();
    queries.push({
        date: date,
        level: level,
        validUntil: document.getElementById('supQueryValid').value || '',
        creditStatus: creditStatus,
        changed: changed,
        prevLevel: prevLevel,
        notes: document.getElementById('supQueryNotes').value.trim() || '',
        recordedBy: currentUser ? currentUser.name : 'system',
        recordedAt: now
    });
    s.updatedAt = now;
    saveSuppliers(list);
    closeModal('supQueryModal');
    renderSuppliers();
    const changeMsg = changed ? '（等级变化：' + prevLevel + '→' + level + '）' : '';
    addAuditLog('记录海关查询: ' + s.name + ' → ' + level + changeMsg, 'general', date);
    if (level === '失信企业') {
        showToast('⚠️ 预警：' + s.name + ' 已被标记为失信企业！', 'error');
    } else {
        showToast('查询记录已保存' + changeMsg, 'success');
    }
}

// ── 供应商详情弹窗 ─────────────────────────────────
var _supDetailId = null;

function showSupplierDetail(id) {
    _supDetailId = id;
    const list = loadSuppliers();
    const s = list.find(x => x.id === id);
    if (!s) { showToast('供应商不存在', 'error'); return; }
    document.getElementById('supDetailName').textContent = s.name;
    document.getElementById('supDetailCreditCode').textContent = s.creditCode || '--';
    document.getElementById('supDetailCustomsCode').textContent = s.customsCode || '--';
    document.getElementById('supDetailCategory').textContent = s.category || '--';
    var statusEl = document.getElementById('supDetailStatus');
    if (s.status === '暂停') { statusEl.innerHTML = '<span class="text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">暂停合作</span>'; }
    else if (s.status === '终止合作') { statusEl.innerHTML = '<span class="text-red-600 bg-red-50 px-2 py-0.5 rounded">终止合作</span>'; }
    else { statusEl.innerHTML = '<span class="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">启用合作</span>'; }

    document.getElementById('sd_name').textContent = s.name;
    document.getElementById('sd_creditCode').textContent = s.creditCode || '--';
    document.getElementById('sd_customsCode').textContent = s.customsCode || '--';
    document.getElementById('sd_level').textContent = s.level || '未设置';
    document.getElementById('sd_category').textContent = s.category || '未设置';
    document.getElementById('sd_status').textContent = s.status || '启用合作';
    var queries = s.queries || [];
    document.getElementById('sd_queryDate').textContent = queries.length > 0 ? queries[queries.length - 1].date : '--';
    document.getElementById('sd_createdAt').textContent = s.createdAt ? s.createdAt.slice(0,10) : '--';
    document.getElementById('sd_contactName').textContent = s.contactName || '--';
    document.getElementById('sd_contactPhone').textContent = s.contactPhone || '--';
    document.getElementById('sd_contactEmail').textContent = s.contactEmail || '--';

    var creditBody = document.getElementById('supDetailCreditTableBody');
    if (creditBody) {
        var levelColors = { '高级认证企业（AEO）': 'bg-emerald-100 text-emerald-700', '认证企业': 'bg-blue-100 text-blue-700', '一般信用企业': 'bg-amber-100 text-amber-700', '失信企业': 'bg-red-100 text-red-700', '未查询到': 'bg-slate-100 text-slate-500' };
        if (queries.length === 0) {
            creditBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-xs text-slate-400">暂无查询记录</td></tr>';
        } else {
            creditBody.innerHTML = queries.map(function(q, qi) {
                var prevQ = qi > 0 ? queries[qi - 1] : null;
                var changed = prevQ && q.level !== prevQ.level;
                var isFirst = qi === 0;
                var levelColor = levelColors[q.level] || 'bg-slate-100 text-slate-600';
                var changeIcon = changed ? '<span class="text-amber-600 font-bold" title="等级发生变化"><i class="fas fa-arrow-up"></i></span>' : (isFirst ? '<span class="text-slate-400 text-xs">首次</span>' : '<span class="text-slate-300">—</span>');
                return '<tr class="border-t border-slate-100"><td class="p-2 text-xs text-slate-600">' + q.date + '</td><td class="p-2"><span class="inline-block text-xs px-2 py-0.5 rounded ' + levelColor + '">' + q.level + '</span></td><td class="p-2 text-xs text-slate-500">' + (q.validUntil || '-') + '</td><td class="p-2 text-xs text-center">' + changeIcon + '</td></tr>';
            }).join('');
        }
    }

    var assessContent = document.getElementById('supDetailAssessmentContent');
    if (assessContent) {
        var saList = loadSupplierAssessments();
        var sa = saList.find(function(a) { return a.supplierId === id; });
        if (sa) {
            var statusLabel = sa.status === 'sent' ? '已发送' : (sa.status === 'received' ? '已回收' : '');
            assessContent.innerHTML = '<div class="p-4 bg-slate-50 rounded-lg space-y-3">' +
                '<div class="flex justify-between"><span class="text-sm text-slate-500">问卷状态</span><span class="text-sm font-medium ' + (sa.status === 'received' ? 'text-emerald-600' : 'text-blue-600') + '">' + statusLabel + '</span></div>' +
                (sa.score != null ? '<div class="flex justify-between"><span class="text-sm text-slate-500">得分</span><span class="text-sm font-bold text-slate-800">' + sa.score + '分</span></div>' : '') +
                (sa.sentDate ? '<div class="flex justify-between"><span class="text-sm text-slate-500">发起日期</span><span class="text-sm text-slate-700">' + sa.sentDate + '</span></div>' : '') +
                (sa.receivedDate ? '<div class="flex justify-between"><span class="text-sm text-slate-500">回收日期</span><span class="text-sm text-slate-700">' + sa.receivedDate + '</span></div>' : '') +
                (sa.status === 'sent' ? '<button onclick="showReceiveSaModal(\'' + id + '\')" class="w-full mt-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700"><i class="fas fa-file-import mr-1"></i>回收问卷</button>' : '') +
                '</div>';
        } else {
            assessContent.innerHTML = '<div class="text-center py-8 text-slate-400"><i class="fas fa-clipboard-check text-4xl mb-3"></i><p>暂无自评记录</p><button onclick="showSendSaModalFromDetail()" class="mt-3 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-violet-700"><i class="fas fa-paper-plane mr-1"></i>发起问卷</button></div>';
        }
    }

    renderSupplierUploadedFiles(id);
    switchSupDetailTab('info');
    document.getElementById('supplierDetailModal').classList.add('active');
}

function switchSupDetailTab(tabName) {
    document.querySelectorAll('.sup-detail-tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.sup-detail-content').forEach(function(c) { c.classList.add('hidden'); });
    var tabBtn = document.querySelector('.sup-detail-tab[data-tab="' + tabName + '"]');
    if (tabBtn) tabBtn.classList.add('active');
    var content = document.getElementById('supDetailTab' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (content) content.classList.remove('hidden');
}

function editSupplierFromDetail() {
    var list = loadSuppliers();
    var s = list.find(function(x) { return x.id === _supDetailId; });
    if (s) { closeModal('supplierDetailModal'); showSupplierModal(s); }
}

function showSupplierQueryModalFromDetail() {
    closeModal('supplierDetailModal');
    showSupplierQueryModal(_supDetailId);
}

function showSendSaModalFromDetail() {
    closeModal('supplierDetailModal');
    showSendSaModal(_supDetailId);
}

function deleteSupplierQuery(supId, queryIdx) {
    if (!confirm('确定要删除此条查询记录吗？')) return;
    const list = loadSuppliers();
    const s = list.find(x => x.id === supId);
    if (!s || !s.queries) return;
    s.queries.splice(queryIdx, 1);
    s.updatedAt = new Date().toISOString();
    saveSuppliers(list);
    renderSuppliers();
    showToast('查询记录已删除', 'warning');
}

// ── 供应商批量导入/导出 ────────────────────────────
let _batchImportData = [];

function showBatchImportModal() {
    _batchImportData = [];
    document.getElementById('batchImportText').value = '';
    document.getElementById('batchImportPreview').classList.add('hidden');
    document.getElementById('batchImportResult').classList.add('hidden');
    document.getElementById('batchImportSubmitBtn').disabled = false;
    document.getElementById('batchImportModal').classList.add('active');
}

function downloadSupplierTemplate() {
    const bom = '﻿';
    const csv = bom + '企业名称,统一社会信用代码,海关注册编码,合作业务,联系人,联系方式\n' +
        '深圳市XX物流有限公司,91440300MA5XXXXXX,440316XXXX,物流运输,张三,13800138000\n' +
        '广州YY报关代理有限公司,91440101MA5XXXXXX,440196XXXX,报关代理,李四,13900139000\n' +
        '上海ZZ贸易有限公司,91310000MA5XXXXXX,312226XXXX,原材料供应,王五,13700137000';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '供应商导入模板.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('模板已下载', 'success');
}

function handleBatchImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        document.getElementById('batchImportText').value = text;
        parseBatchImportText(text);
    };
    reader.readAsText(file, 'UTF-8');
    event.target.value = '';
}

function parseBatchImportText(text) {
    const result = document.getElementById('batchImportResult');
    result.classList.add('hidden');
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length === 0) { showToast('未检测到有效数据', 'error'); return; }

    // 检测是否有标题行
    const hasHeader = lines[0].includes('企业名称') || lines[0].includes('名称') || lines[0].includes('name');
    const dataLines = hasHeader ? lines.slice(1) : lines;

    const parsed = [];
    const errors = [];
    dataLines.forEach(function(line, i) {
        // 支持逗号、Tab、竖线分隔
        const parts = line.includes('\t') ? line.split('\t') :
                      line.includes('|') ? line.split('|') :
                      line.split(',');
        const name = (parts[0] || '').replace(/^["']|["']$/g, '').trim();
        const creditCode = (parts[1] || '').replace(/^["']|["']$/g, '').trim();
        if (!name) { errors.push('第' + (i + 1) + '行: 企业名称为空'); return; }
        if (!creditCode) { errors.push('第' + (i + 1) + '行: ' + name + ' 信用代码为空'); return; }
        parsed.push({
            name: name,
            creditCode: creditCode,
            customsCode: (parts[2] || '').replace(/^["']|["']$/g, '').trim(),
            business: (parts[3] || '').replace(/^["']|["']$/g, '').trim(),
            contact: (parts[4] || '').replace(/^["']|["']$/g, '').trim(),
            phone: (parts[5] || '').replace(/^["']|["']$/g, '').trim()
        });
    });

    _batchImportData = parsed;
    const preview = document.getElementById('batchImportPreview');
    const count = document.getElementById('batchImportCount');
    const list = document.getElementById('batchImportPreviewList');
    count.textContent = parsed.length;

    if (parsed.length > 0) {
        list.innerHTML = parsed.map(function(p, i) {
            return '<div class="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"><span class="font-medium">' + escapeHtml(p.name) + '</span><span class="text-slate-400">' + escapeHtml(p.creditCode) + '</span></div>';
        }).join('');
        preview.classList.remove('hidden');
    } else {
        preview.classList.add('hidden');
    }

    if (errors.length > 0) {
        result.className = 'p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 mt-2';
        result.innerHTML = '<p class="font-medium mb-1"><i class="fas fa-exclamation-circle mr-1"></i>' + errors.length + ' 行解析警告：</p><ul class="list-disc list-inside">' + errors.map(e => '<li>' + escapeHtml(e) + '</li>').join('') + '</ul>';
        result.classList.remove('hidden');
    }
}

function submitBatchImport() {
    const text = document.getElementById('batchImportText').value.trim();
    if (!text && _batchImportData.length === 0) { showToast('请粘贴数据或上传文件', 'error'); return; }
    if (_batchImportData.length === 0) parseBatchImportText(text);
    if (_batchImportData.length === 0) { showToast('没有有效数据可导入', 'error'); return; }

    const list = loadSuppliers();
    const existingNames = new Set(list.map(s => s.name));
    let imported = 0, skipped = 0;
    const now = new Date().toISOString();

    _batchImportData.forEach(function(p) {
        if (existingNames.has(p.name)) { skipped++; return; }
        const nums = list.map(s => { const m = s.id.match(/SUP-(\d+)/); return m ? parseInt(m[1]) : 0; });
        const next = (nums.length > 0 ? Math.max(...nums) + 1 : 1);
        list.unshift({
            id: 'SUP-' + String(next).padStart(4, '0'),
            name: p.name,
            creditCode: p.creditCode,
            customsCode: p.customsCode || '',
            business: p.business || '',
            contact: p.contact || '',
            phone: p.phone || '',
            queries: [],
            createdAt: now,
            updatedAt: now
        });
        existingNames.add(p.name);
        imported++;
    });

    saveSuppliers(list);
    closeModal('batchImportModal');
    renderSuppliers();
    addAuditLog('批量导入供应商: ' + imported + ' 条（跳过 ' + skipped + ' 条重复）', 'supplier', '');
    showToast('成功导入 ' + imported + ' 家供应商' + (skipped > 0 ? '，' + skipped + ' 条已存在跳过' : ''), 'success');
}

function exportSuppliers() {
    const list = loadSuppliers();
    if (!list.length) { showToast('暂无供应商数据可导出', 'error'); return; }
    const bom = '﻿';
    const header = '企业名称,统一社会信用代码,海关注册编码,合作业务,联系人,联系方式,最近查询等级,最近查询日期,查询次数\n';
    const rows = list.map(function(s) {
        const queries = s.queries || [];
        const lastQ = queries.length > 0 ? queries[queries.length - 1] : null;
        return [
            s.name, s.creditCode, s.customsCode || '', s.business || '',
            s.contact || '', s.phone || '',
            lastQ ? lastQ.level : '未查询',
            lastQ ? lastQ.date : '',
            queries.length
        ].join(',');
    });
    const csv = bom + header + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '供应商名录_' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('已导出 ' + list.length + ' 家供应商', 'success');
}
let _editingCustomLawId = null;
let _customLawTempFiles = [];

// ── 核心法规数据 ────────────────────────────────────
const CORE_LAWS = [
  { id: '282', title: '海关总署令第282号', subtitle: '《中华人民共和国海关注册登记和备案企业信用管理办法》', tag: '核心', tagColor: 'red', date: '2026-01-13', effective: '2026-04-01', status: '现行有效', statusType: 'success', desc: '本办法规定了海关注册登记和备案企业的信用管理、认证标准、监管措施等内容，是AEO认证的核心法律依据。', items: ['企业信用等级分类标准', '高级认证企业认证程序', '失信企业认定标准', '信用修复机制', '差别化管理措施'] },
  { id: '34', title: '海关总署公告2026年第34号', subtitle: '关于公布《海关高级认证企业标准》《海关认证企业标准》的公告', tag: '标准', tagColor: 'blue', date: '2026-03-30', effective: '2026-04-01', status: '现行有效', statusType: 'success', desc: '公布了最新的海关高级认证企业标准和认证企业标准，包括内部控制、财务状况、守法规范、贸易安全等维度的具体要求。', items: ['高级认证企业标准（7维度74项）', '认证企业标准（6维度62项）', '各维度达标判定规则', '认证申请材料清单'] },
  { id: '35', title: '海关总署公告2026年第35号', subtitle: '关于实施高级认证企业简易复核的公告', tag: '复核', tagColor: 'amber', date: '2026-03-30', effective: '2026-04-01', status: '现行有效', statusType: 'success', desc: '对已获得高级认证的企业实施简易复核程序，简化复核流程、减轻企业负担。', items: ['简易复核适用条件', '简化材料清单', '复核程序时限', '不合格项整改要求'] },
  { id: '251', title: '海关总署令第251号', subtitle: '《海关进出口货物申报管理规定》', tag: '申报', tagColor: 'blue', date: '2024-12-20', effective: '2025-03-01', status: '现行有效', statusType: 'success', desc: '规范进出口货物申报行为，明确申报时限、单证要求、申报程序等内容。', items: ['申报主体与时限', '申报单证要求', '电子数据申报规范', '申报修改与撤销', '违规处罚'] },
  { id: '237', title: '海关总署令第237号', subtitle: '《海关稽查条例实施办法》', tag: '稽查', tagColor: 'violet', date: '2024-06-15', effective: '2024-08-01', status: '已废止（过渡期）', statusType: 'warn', desc: '海关稽查的实施程序、被稽查人权利义务、稽查结果处理等。注：2026年4月起过渡至282号令框架。', items: ['稽查范围与对象', '稽查程序', '被稽查人权利义务', '稽查结果处理', '救济途径'] },
  { id: '262', title: '海关总署令第262号', subtitle: '《海关行政处罚裁量基准》', tag: '处罚', tagColor: 'red', date: '2025-09-10', effective: '2025-11-01', status: '现行有效', statusType: 'success', desc: '统一海关行政处罚裁量标准，规范处罚行为，保障当事人合法权益。', items: ['裁量原则与规则', '从轻/减轻/从重情节', '常见违规行为裁量标准', '处罚程序'] },
  { id: 'tax-48', title: '财关税〔2021〕48号', subtitle: '十四五期间支持科技创新进口税收政策', tag: '税收', tagColor: 'emerald', date: '2021-12-15', effective: '2022-01-01', status: '现行有效', statusType: 'success', desc: '对科学研究机构、技术开发机构等单位进口国内不能生产或性能不能满足需求的科学研究、科技开发和教学用品，免征进口关税和进口环节增值税、消费税。', items: ['免税商品范围', '适用主体条件', '申报程序', '后续监管要求'] }
];

function renderCoreLaws() {
  var container = document.getElementById('coreLawList');
  if (!container) return;
  var sideLinks = document.getElementById('lawSideLinks');
  if (!sideLinks) return;

  // Main law cards
  var mainLaws = CORE_LAWS.slice(0, 3);
  var otherLaws = CORE_LAWS.slice(3);
  container.innerHTML =
    '<div class="flex items-center justify-between mb-4"><h3 class="font-bold text-slate-800"><i class="fas fa-star text-amber-500 mr-2"></i>核心法规文件</h3><span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">系统预置 ' + CORE_LAWS.length + ' 部</span></div>' +
    mainLaws.map(function(l) {
      var borderColors = { red: 'red', blue: 'blue', amber: 'amber', violet: 'violet', emerald: 'emerald' };
      var tagColors = { red: 'bg-red-100 text-red-700 border-red-200', blue: 'bg-blue-100 text-blue-700 border-blue-200', amber: 'bg-amber-100 text-amber-700 border-amber-200', violet: 'bg-violet-100 text-violet-700 border-violet-200', emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      var statusIcons = { success: '<i class="fas fa-check-circle mr-1"></i>', warn: '<i class="fas fa-exclamation-triangle mr-1"></i>' };
      return '<div class="card-business rounded-lg p-5 border-l-4 border-' + (borderColors[l.tagColor] || 'slate') + '-500">' +
        '<div class="flex justify-between items-start"><div class="flex-1">' +
        '<div class="flex items-center space-x-2 mb-2"><h4 class="font-bold text-slate-800">' + l.title + '</h4><span class="status-badge ' + (tagColors[l.tagColor] || 'bg-slate-100 text-slate-600') + '">' + l.tag + '</span></div>' +
        '<p class="text-sm text-slate-600 mb-3">' + l.subtitle + '</p>' +
        '<div class="flex items-center space-x-4 text-xs text-slate-500"><span><i class="far fa-calendar mr-1"></i>' + l.date + ' 公布</span><span><i class="far fa-calendar-check mr-1"></i>' + l.effective + ' 施行</span><span class="text-' + (l.statusType === 'success' ? 'emerald' : 'amber') + '-600 font-medium">' + (statusIcons[l.statusType] || '') + l.status + '</span></div></div>' +
        '<button onclick="viewLawDetail(\'' + l.id + '\')" class="p-2 text-slate-400 hover:text-slate-600"><i class="fas fa-eye"></i></button></div></div>';
    }).join('') +
    otherLaws.map(function(l) {
      var tagColors = { red: 'bg-red-100 text-red-700 border-red-200', blue: 'bg-blue-100 text-blue-700 border-blue-200', amber: 'bg-amber-100 text-amber-700 border-amber-200', violet: 'bg-violet-100 text-violet-700 border-violet-200', emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      return '<div class="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">' +
        '<div class="flex justify-between items-start"><div class="flex-1"><div class="flex items-center space-x-2 mb-1"><h4 class="text-sm font-bold text-slate-800">' + l.title + '</h4><span class="text-xs px-2 py-0.5 rounded border ' + (tagColors[l.tagColor] || 'bg-slate-100') + '">' + l.tag + '</span></div>' +
        '<p class="text-xs text-slate-500">' + l.subtitle + '</p><p class="text-xs text-slate-400 mt-1">' + l.date + ' · ' + l.status + '</p></div>' +
        '<button onclick="viewLawDetail(\'' + l.id + '\')" class="text-xs text-blue-600 hover:underline">详情</button></div></div>';
    }).join('');

  // Side links
  sideLinks.innerHTML = CORE_LAWS.map(function(l) {
    return '<div class="flex items-start p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onclick="viewLawDetail(\'' + l.id + '\')"><div class="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div><div><p class="text-xs font-medium text-slate-700">' + l.title + '</p><p class="text-[11px] text-slate-400 mt-0.5">' + l.tag + '</p></div></div>';
  }).join('');
}

function viewLawDetail(id) {
  var law = CORE_LAWS.find(function(l) { return l.id === id; });
  if (!law) { showToast('法规详情未找到', 'error'); return; }
  var tagColors = { red: 'bg-red-100 text-red-700 border-red-200', blue: 'bg-blue-100 text-blue-700 border-blue-200', amber: 'bg-amber-100 text-amber-700 border-amber-200', violet: 'bg-violet-100 text-violet-700 border-violet-200', emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  var modal = document.getElementById('lawDetailModal');
  if (!modal) {
    var div = document.createElement('div');
    div.id = 'lawDetailModal';
    div.className = 'modal-overlay';
    div.innerHTML = '<div class="modal-content" style="max-width:640px"><div class="modal-header"><h3 class="text-lg font-bold text-slate-800" id="lawDetailTitle"></h3><button onclick="closeModal(\'lawDetailModal\')" class="text-slate-400 hover:text-slate-600"><i class="fas fa-times"></i></button></div><div class="p-6 space-y-4" id="lawDetailBody"></div><div class="modal-footer"><button onclick="closeModal(\'lawDetailModal\')" class="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">关闭</button></div></div>';
    document.body.appendChild(div);
    modal = div;
  }
  document.getElementById('lawDetailTitle').textContent = law.title;
  document.getElementById('lawDetailBody').innerHTML =
    '<div class="flex items-center space-x-2 mb-3"><span class="text-xs px-2 py-0.5 rounded border ' + (tagColors[law.tagColor] || 'bg-slate-100') + '">' + law.tag + '</span><span class="text-xs text-slate-400">' + law.date + ' 公布</span><span class="text-xs text-slate-400">' + law.effective + ' 施行</span><span class="text-xs text-emerald-600 font-medium"><i class="fas fa-check-circle mr-1"></i>' + law.status + '</span></div>' +
    '<p class="text-sm text-slate-700 mb-4">' + law.subtitle + '</p>' +
    '<div class="bg-slate-50 rounded-lg p-4"><h4 class="text-sm font-semibold text-slate-700 mb-2">主要内容</h4><p class="text-sm text-slate-600 mb-3">' + (law.desc || '') + '</p>' +
    (law.items ? '<ul class="space-y-1.5">' + law.items.map(function(it) { return '<li class="text-sm text-slate-600 flex items-start"><span class="text-emerald-500 mr-2">•</span>' + it + '</li>'; }).join('') + '</ul>' : '') + '</div>';
  modal.classList.add('active');
}

function switchLawView(view) {
    document.getElementById('lawBuiltinView').classList.toggle('hidden', view !== 'builtin');
    document.getElementById('lawCustomView').classList.toggle('hidden', view !== 'custom');
    const btnB = document.getElementById('lawTabBuiltin');
    const btnC = document.getElementById('lawTabCustom');
    btnB.className = 'tab-btn' + (view==='builtin' ? ' active' : '');
    btnC.className = 'tab-btn' + (view==='custom' ? ' active' : '');
    if (view === 'custom') renderCustomLaws();
}
function renderCustomLaws() {
    const laws = loadData('customLaws', []);
    const container = document.getElementById('customLawList');
    if (!laws.length) {
        container.innerHTML = '<div class="text-center py-12 text-slate-400"><i class="fas fa-book text-4xl mb-3"></i><p>暂无企业导入的法规条目</p><p class="text-xs mt-1">点击"新增条目"上传企业制度、法规原文或海关解读</p></div>';
        return;
    }
    container.innerHTML = '<div class="space-y-3">' + laws.map(l => {
        const regFiles = (l.files||[]).filter(f => f.type === 'regulation').length;
        const intFiles = (l.files||[]).filter(f => f.type === 'interpretation').length;
        const statusColor = l.status === '现行有效' ? 'text-emerald-600 bg-emerald-50' : l.status === '即将生效' ? 'text-amber-600 bg-amber-50' : 'text-slate-500 bg-slate-100';
        const categoryColors = { '内部制度':'bg-blue-100 text-blue-700', '海关法规':'bg-red-100 text-red-700', '行业标准':'bg-purple-100 text-purple-700', '宣讲材料':'bg-amber-100 text-amber-700', '其他':'bg-slate-100 text-slate-600' };
        const catColor = categoryColors[l.category] || 'bg-slate-100 text-slate-600';
        return '<div class="card-business rounded-lg p-4 hover:shadow-md transition-shadow"><div class="flex justify-between items-start"><div class="flex-1"><div class="flex items-center flex-wrap gap-2 mb-1"><h4 class="font-bold text-slate-800">' + escapeHtml(l.title) + '</h4><span class="text-xs px-2 py-0.5 rounded ' + catColor + '">' + l.category + '</span><span class="text-xs px-2 py-0.5 rounded ' + statusColor + '">' + l.status + '</span></div><div class="text-xs text-slate-500 space-x-3">' +
            (l.docNumber ? '<span>文号: ' + escapeHtml(l.docNumber) + '</span>' : '') +
            (l.issuer ? '<span>发布: ' + escapeHtml(l.issuer) + '</span>' : '') +
            (l.publishDate ? '<span>发布日期: ' + l.publishDate + '</span>' : '') +
            '</div><div class="flex items-center gap-3 mt-2 text-xs text-slate-400">' +
            (regFiles > 0 ? '<span><i class="fas fa-file-alt text-blue-500 mr-1"></i>法规附件 ' + regFiles + ' 份</span>' : '') +
            (intFiles > 0 ? '<span><i class="fas fa-headphones text-amber-500 mr-1"></i>解读宣讲 ' + intFiles + ' 份</span>' : '') +
            (l.notes ? '<span class="text-slate-400">' + escapeHtml(l.notes) + '</span>' : '') +
            '</div></div><div class="flex items-center space-x-1 ml-3">' +
            '<button onclick="viewCustomLaw(\'' + l.id + '\')" class="p-1.5 text-blue-400 hover:text-blue-600" title="查看"><i class="fas fa-eye"></i></button>' +
            '<button onclick="editCustomLaw(\'' + l.id + '\')" class="p-1.5 text-slate-400 hover:text-slate-600" title="编辑"><i class="fas fa-edit"></i></button>' +
            '<button onclick="deleteCustomLaw(\'' + l.id + '\')" class="p-1.5 text-red-400 hover:text-red-600" title="删除"><i class="fas fa-trash-alt"></i></button></div></div></div>';
    }).join('') + '</div>';
}
function showCustomLawModal() {
    _editingCustomLawId = null;
    _customLawTempFiles = [];
    document.getElementById('customLawModalTitle').textContent = '新增法规条目';
    document.getElementById('clTitle').value = '';
    document.getElementById('clDocNumber').value = '';
    document.getElementById('clIssuer').value = '';
    document.getElementById('clPublishDate').value = '';
    document.getElementById('clEffectiveDate').value = '';
    document.getElementById('clCategory').value = '内部制度';
    document.getElementById('clStatus').value = '现行有效';
    document.getElementById('clNotes').value = '';
    document.getElementById('clFileList').innerHTML = '<p class="text-xs text-slate-400 py-2">暂未上传附件</p>';
    document.getElementById('customLawModal').classList.add('active');
}
function editCustomLaw(id) {
    const laws = loadData('customLaws', []);
    const law = laws.find(l => l.id === id);
    if (!law) return;
    _editingCustomLawId = id;
    _customLawTempFiles = (law.files||[]).map(f => ({...f}));
    document.getElementById('customLawModalTitle').textContent = '编辑法规条目';
    document.getElementById('clTitle').value = law.title || '';
    document.getElementById('clDocNumber').value = law.docNumber || '';
    document.getElementById('clIssuer').value = law.issuer || '';
    document.getElementById('clPublishDate').value = law.publishDate || '';
    document.getElementById('clEffectiveDate').value = law.effectiveDate || '';
    document.getElementById('clCategory').value = law.category || '内部制度';
    document.getElementById('clStatus').value = law.status || '现行有效';
    document.getElementById('clNotes').value = law.notes || '';
    renderCustomLawTempFiles();
    document.getElementById('customLawModal').classList.add('active');
}
function saveCustomLaw() {
    const title = document.getElementById('clTitle').value.trim();
    if (!title) { showToast('请输入法规/制度名称', 'error'); return; }
    const user = currentUser ? currentUser.name : 'system';
    let laws = loadData('customLaws', []);
    if (_editingCustomLawId) {
        const idx = laws.findIndex(l => l.id === _editingCustomLawId);
        if (idx >= 0) {
            laws[idx] = { ...laws[idx], title, docNumber: document.getElementById('clDocNumber').value.trim(), issuer: document.getElementById('clIssuer').value.trim(), publishDate: document.getElementById('clPublishDate').value, effectiveDate: document.getElementById('clEffectiveDate').value, category: document.getElementById('clCategory').value, status: document.getElementById('clStatus').value, notes: document.getElementById('clNotes').value.trim(), files: _customLawTempFiles, updatedAt: new Date().toISOString(), updatedBy: user };
        }
    } else {
        const id = 'CL-' + String(Date.now()).slice(-6);
        laws.unshift({ id, title, docNumber: document.getElementById('clDocNumber').value.trim(), issuer: document.getElementById('clIssuer').value.trim(), publishDate: document.getElementById('clPublishDate').value, effectiveDate: document.getElementById('clEffectiveDate').value, category: document.getElementById('clCategory').value, status: document.getElementById('clStatus').value, notes: document.getElementById('clNotes').value.trim(), files: _customLawTempFiles || [], createdAt: new Date().toISOString(), createdBy: user });
    }
    saveData('customLaws', laws);
    closeModal('customLawModal');
    renderCustomLaws();
    addAuditLog((_editingCustomLawId ? '编辑' : '新增') + '企业法规', 'data', title);
    showToast('法规条目已保存', 'success');
}
function deleteCustomLaw(id) {
    if (!confirm('确定要删除此法规条目及其所有附件？')) return;
    let laws = loadData('customLaws', []);
    const law = laws.find(l => l.id === id);
    if (law && law.files) {
        law.files.forEach(f => { deleteFileFromDB(f.id).catch(()=>{}); });
    }
    laws = laws.filter(l => l.id !== id);
    saveData('customLaws', laws);
    renderCustomLaws();
    addAuditLog('删除企业法规', 'data', id);
    showToast('法规条目已删除', 'warning');
}
function viewCustomLaw(id) {
    const laws = loadData('customLaws', []);
    const law = laws.find(l => l.id === id);
    if (!law) return;
    const files = law.files || [];
    const regFiles = files.filter(f => f.type === 'regulation');
    const intFiles = files.filter(f => f.type === 'interpretation');
    const dateStr = law.createdAt ? new Date(law.createdAt).toLocaleDateString('zh-CN') : '-';
    let body = '<div class="p-4 space-y-4"><div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm"><div><span class="text-slate-500 text-xs">文号</span><p class="font-medium">' + escapeHtml(law.docNumber||'-') + '</p></div><div><span class="text-slate-500 text-xs">发布机构</span><p class="font-medium">' + escapeHtml(law.issuer||'-') + '</p></div><div><span class="text-slate-500 text-xs">发布日期</span><p class="font-medium">' + (law.publishDate||'-') + '</p></div><div><span class="text-slate-500 text-xs">生效日期</span><p class="font-medium">' + (law.effectiveDate||'-') + '</p></div></div>' +
        (law.notes ? '<div><span class="text-xs text-slate-500">备注</span><p class="text-sm text-slate-700 mt-1">' + escapeHtml(law.notes) + '</p></div>' : '') +
        '<div><span class="text-xs text-slate-500">创建信息</span><p class="text-xs text-slate-400 mt-1">创建人: ' + escapeHtml(law.createdBy||'-') + ' | 创建时间: ' + dateStr + '</p></div>';
    if (regFiles.length) {
        body += '<div><h4 class="text-sm font-bold text-slate-700 mb-2"><i class="fas fa-file-alt text-blue-500 mr-1"></i>法规附件 (' + regFiles.length + ')</h4><div class="space-y-1">' +
            regFiles.map(f => '<div class="flex items-center justify-between p-2 bg-blue-50 rounded"><span class="text-sm">' + escapeHtml(f.name) + '</span><button onclick="previewFile(' + f.id + ',\'' + escapeHtml(f.name) + '\')" class="text-blue-600 text-xs underline">预览</button></div>').join('') + '</div></div>';
    }
    if (intFiles.length) {
        body += '<div><h4 class="text-sm font-bold text-slate-700 mb-2"><i class="fas fa-headphones text-amber-500 mr-1"></i>海关解读宣讲 (' + intFiles.length + ')</h4><div class="space-y-1">' +
            intFiles.map(f => '<div class="flex items-center justify-between p-2 bg-amber-50 rounded"><span class="text-sm">' + escapeHtml(f.name) + '</span><button onclick="previewFile(' + f.id + ',\'' + escapeHtml(f.name) + '\')" class="text-blue-600 text-xs underline">预览</button></div>').join('') + '</div></div>';
    }
    body += '</div>';
    showCustomModal('法规详情 - ' + escapeHtml(law.title), body);
}
async function uploadCustomLawFile(fileType) {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.mp3,.wav,.mp4,.txt';
    input.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 200*1024*1024) { showToast('文件不能超过200MB', 'error'); return; }
        try {
            const info = await saveFileToDB(file, 'customLaw');
            _customLawTempFiles.push({ id: info.id, name: info.name, size: info.size, type: fileType, uploadedAt: new Date().toISOString() });
            renderCustomLawTempFiles();
            showToast('文件已上传: ' + info.name, 'success');
        } catch(err) { showToast('上传失败: ' + err.message, 'error'); }
    };
    input.click();
}
function renderCustomLawTempFiles() {
    const container = document.getElementById('clFileList');
    if (!_customLawTempFiles.length) { container.innerHTML = '<p class="text-xs text-slate-400 py-2">暂未上传附件</p>'; return; }
    container.innerHTML = _customLawTempFiles.map((f,i) => {
        const icon = f.type === 'interpretation' ? 'fa-headphones text-amber-500' : 'fa-file-alt text-blue-500';
        const label = f.type === 'interpretation' ? '解读宣讲' : '法规附件';
        return '<div class="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200"><div class="flex items-center space-x-2"><i class="fas ' + icon + ' text-xs"></i><span class="text-xs text-slate-700">' + escapeHtml(f.name) + '</span><span class="text-xs text-slate-400">[' + label + ']</span></div><button class="text-xs text-red-400 hover:text-red-600" onclick="removeCustomLawTempFile(' + i + ')"><i class="fas fa-times"></i></button></div>';
    }).join('');
}
function removeCustomLawTempFile(idx) {
    _customLawTempFiles.splice(idx, 1);
    renderCustomLawTempFiles();
}

function viewLawDetail(id) {
    const laws = { '282': '海关总署令第282号\n\n《中华人民共和国海关注册登记和备案企业信用管理办法》\n\n2026年1月13日公布，2026年4月1日施行。\n\n主要变化：\n1. 信用等级由四级调整为五级\n2. 新增高级认证企业和认证企业标准\n3. 简化复核程序\n4. 强化信用信息共享', '34': '海关总署公告2026年第34号\n\n关于公布《海关高级认证企业标准》《海关认证企业标准》的公告\n\n2026年3月30日发布。\n\n主要内容：\n• 高级认证企业标准：5个维度74项标准（通用68项+附加6项）\n• 认证企业标准：5个维度62项标准（通用56项+附加6项）\n• 每项标准明确认证要求、检查文件、询问要点' };
    alert(laws[id] || '查看海关总署官网获取完整法规原文');
}
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// ------------------------------------------------------------------------
// 15e. 全局搜索
// ------------------------------------------------------------------------
function doGlobalSearch() {
    const q = document.getElementById('globalSearch').value.trim().toLowerCase();
    if (!q) { showToast('请输入搜索关键词', 'info'); return; }
    const results = [];

    // 搜索标准
    Object.keys(standardsData).forEach(type => {
        Object.keys(standardsData[type]).forEach(dimKey => {
            standardsData[type][dimKey].items.forEach(it => {
                if (it.id.toLowerCase().includes(q) || it.name.includes(q) || it.desc.includes(q) || it.dept.includes(q)) {
                    results.push({ type: '标准', label: it.id + ' ' + it.name, module: 'standards', detail: it.dept + ' · ' + it.desc });
                }
            });
        });
    });

    // 搜索任务
    const tasks = loadData('tasks', []);
    tasks.forEach(t => {
        if (t.id.toLowerCase().includes(q) || t.name.includes(q) || t.owner.includes(q) || t.dept.includes(q)) {
            results.push({ type: '任务', label: t.id + ' ' + t.name, module: 'tasks', detail: t.dept + ' · ' + t.owner + ' · ' + t.status });
        }
    });

    // 搜索法规
    const laws = {
        '282': '海关总署令第282号 信用管理办法 注册登记 备案企业',
        '34': '海关总署公告2026年第34号 高级认证企业标准',
        '35': '海关总署公告2026年第35号 简易复核'
    };
    Object.keys(laws).forEach(k => {
        if (laws[k].toLowerCase().includes(q) || k.includes(q)) {
            results.push({ type: '法规', label: '公告/令第' + k + '号', module: 'laws', detail: laws[k] });
        }
    });

    if (results.length === 0) { showToast('未找到匹配结果: ' + q, 'warning'); return; }

    const msg = results.slice(0, 8).map(r => '[' + r.type + '] ' + r.label).join('\n');
    if (results.length > 8) showToast(msg + '\n...及' + (results.length-8) + '项更多结果', 'info');
    else showToast(msg, 'info');
    addAuditLog('全局搜索: ' + q, 'general', results.length + ' 条结果');
}

// ------------------------------------------------------------------------
// 15f. 加载状态 & 空状态辅助
// ------------------------------------------------------------------------
function showLoading(el, msg) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el) return;
    el.innerHTML = '<div class="text-center py-8 text-slate-400"><i class="fas fa-spinner fa-pulse text-3xl mb-3"></i><p class="text-sm">' + (msg||'加载中...') + '</p></div>';
}
function showEmpty(el, msg) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el) return;
    el.innerHTML = '<div class="text-center py-8 text-slate-400"><i class="fas fa-inbox text-4xl mb-3"></i><p class="text-sm">' + (msg||'暂无数据') + '</p></div>';
}

// ------------------------------------------------------------------------
// 15g. 任务日历/Gantt 视图
// ------------------------------------------------------------------------
function toggleTaskCalendar() {
    const tasks = loadData('tasks', []);
    if (!tasks.length) { showToast('暂无任务可显示', 'info'); return; }
    const now = new Date();
    const groups = { '已超期': [], '本周': [], '本月': [], '未来': [] };
    tasks.forEach(t => {
        const due = new Date(t.due);
        const daysLeft = Math.ceil((due - now) / (1000*60*60*24));
        if (daysLeft < 0) groups['已超期'].push(t);
        else if (daysLeft <= 7) groups['本周'].push(t);
        else if (daysLeft <= 30) groups['本月'].push(t);
        else groups['未来'].push(t);
    });
    let html = '<div class="p-4" style="max-height:70vh;overflow-y:auto;">';
    const colors = { '已超期': 'red', '本周': 'amber', '本月': 'blue', '未来': 'slate' };
    Object.keys(groups).forEach(section => {
        const list = groups[section].sort((a,b) => new Date(a.due)-new Date(b.due));
        if (!list.length) return;
        html += '<h4 class="font-bold text-'+colors[section]+'-700 mb-2 mt-3 text-sm"><i class="fas fa-flag mr-1"></i>'+section+' ('+list.length+')</h4>';
        html += '<div class="space-y-1.5 mb-3">';
        list.forEach(t => {
            const due = new Date(t.due);
            const daysLeft = Math.ceil((due - now) / (1000*60*60*24));
            const cls = t.status === '已完成' ? 'line-through text-slate-400' : '';
            const icon = daysLeft < 0 ? 'fa-exclamation-circle text-red-500' : daysLeft <= 7 ? 'fa-clock text-amber-500' : 'fa-calendar-day text-blue-500';
            html += '<div class="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200 '+cls+'"><div class="flex items-center space-x-2"><i class="fas '+icon+'"></i><div><p class="text-xs font-medium text-slate-700">'+escapeHtml(t.name)+'</p><p class="text-xs text-slate-400">'+t.id+' | '+t.dept+' | '+t.status+(daysLeft<0?' | <span class="text-red-500">超期'+Math.abs(daysLeft)+'天</span>':' | 剩余'+daysLeft+'天')+'</p></div></div><span class="text-xs text-slate-500">'+t.due+'</span></div>';
        });
        html += '</div>';
    });
    html += '</div>';
    showCustomModal('任务时间线 · Gantt视图', html);
    addAuditLog('查看任务时间线', 'task', '');
}
function showCustomModal(title, bodyHtml) {
    const existing = document.querySelector('.custom-modal-overlay');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/50 z-[300] flex items-center justify-center custom-modal-overlay';
    overlay.innerHTML = '<div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"><div class="flex items-center justify-between px-6 py-4 border-b border-slate-200"><h3 class="text-lg font-bold text-slate-800">'+title+'</h3><button class="text-slate-400 hover:text-slate-600 text-xl" onclick="this.closest(\'.custom-modal-overlay\').remove()"><i class="fas fa-times"></i></button></div>'+bodyHtml+'</div>';
    overlay.addEventListener('click', function(e) { if (e.target === this) this.remove(); });
    document.body.appendChild(overlay);
}

// ------------------------------------------------------------------------
// 15h. 批量操作
// ------------------------------------------------------------------------
let selectedTasks = new Set();
function toggleTaskSelection(id) {
    if (selectedTasks.has(id)) selectedTasks.delete(id);
    else selectedTasks.add(id);
    document.getElementById('batchActions').classList.toggle('hidden', selectedTasks.size === 0);
    document.getElementById('batchCount').textContent = selectedTasks.size;
}
function batchUpdateStatus(newStatus) {
    if (!selectedTasks.size) { showToast('请先选择任务', 'warning'); return; }
    if (!confirm('确定批量将 ' + selectedTasks.size + ' 个任务状态改为「' + newStatus + '」吗？')) return;
    const tasks = loadData('tasks', []);
    let count = 0;
    tasks.forEach(t => { if (selectedTasks.has(t.id)) { t.status = newStatus; count++; } });
    saveData('tasks', tasks);
    addAuditLog('批量操作', 'task', count + ' 个任务 → ' + newStatus);
    selectedTasks.clear();
    document.getElementById('batchActions').classList.add('hidden');
    showToast('成功更新 ' + count + ' 个任务状态', 'success');
    renderTaskTable(); renderTaskKanban(); renderTaskProjectView(); updateDashboard();
}

// ------------------------------------------------------------------------
// 15i. 操作确认封装
// ------------------------------------------------------------------------
function confirmAndUpdateTask(id, newStatus, label) {
    if (!confirm('确认将任务「' + (loadData('tasks',[]).find(t=>t.id===id)||{}).name + '」' + label + '吗？')) return;
    updateTaskStatus(id, newStatus);
}

document.addEventListener('click', function(e) {
    document.querySelectorAll('.modal-overlay.active').forEach(m => { if (e.target === m) m.classList.remove('active'); });
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.getElementById('loginOverlay').style.display !== 'none') doLogin();
    if (e.key === 'Escape' && document.body.classList.contains('demo-mode')) { toggleDemoMode(); showToast('已退出演示模式', 'info'); }
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); document.getElementById('globalSearch').focus(); }
});

// ------------------------------------------------------------------------
// 14. 标准宣贯（培训讲解）
// ------------------------------------------------------------------------
var _trainingCat = 'all';

function renderStandardsTraining() {
  var deptFilter = document.getElementById('trainingDeptFilter');
  if (deptFilter) {
    var depts = {};
    var all = getAllAeoStandards();
    all.forEach(function(s) { if (s.dept) depts[s.dept] = true; });
    deptFilter.innerHTML = '<option value="">全部部门</option>' +
      Object.keys(depts).sort().map(function(d) { return '<option value="' + d + '">' + d + '</option>'; }).join('');
  }
  _trainingCat = 'all';
  renderTrainingCards();
}

function switchTrainingCat(cat) {
  _trainingCat = cat;
  document.querySelectorAll('.tab-btn').forEach(function(el) {
    el.className = 'tab-btn';
    if (el.dataset.cat === cat) {
      el.className += ' active';
    }
  });
  var cardList = document.getElementById('trainingCardList');
  var sampleList = document.getElementById('sampleLibraryList');
  var searchEl = document.getElementById('trainingSearch');
  var deptEl = document.getElementById('trainingDeptFilter');
  if (cat === 'samples') {
    cardList.classList.add('hidden');
    sampleList.classList.remove('hidden');
    if (searchEl) searchEl.style.display = 'none';
    if (deptEl) deptEl.style.display = 'none';
    renderSampleLibrary();
  } else {
    cardList.classList.remove('hidden');
    sampleList.classList.add('hidden');
    if (searchEl) searchEl.style.display = '';
    if (deptEl) deptEl.style.display = '';
    renderTrainingCards();
  }
}

function filterTrainingCards() {
  renderTrainingCards();
}

function renderTrainingCards() {
  var container = document.getElementById('trainingCardList');
  if (!container) return;
  var all = getAllAeoStandards();
  var search = (document.getElementById('trainingSearch') && document.getElementById('trainingSearch').value || '').trim().toLowerCase();
  var dept = document.getElementById('trainingDeptFilter') ? document.getElementById('trainingDeptFilter').value : '';

  var filtered = all.filter(function(s) {
    if (_trainingCat !== 'all' && s.catKey !== _trainingCat) return false;
    if (dept && s.dept !== dept) return false;
    if (search && s.id.toLowerCase().indexOf(search) === -1 && s.name.toLowerCase().indexOf(search) === -1 && s.desc.toLowerCase().indexOf(search) === -1) return false;
    return true;
  });

  if (!filtered.length) {
    container.innerHTML = '<div class="lg:col-span-2 text-center py-12 text-slate-400"><i class="fas fa-search text-4xl mb-3"></i><p>未找到匹配的标准</p></div>';
    return;
  }

  container.innerHTML = filtered.map(function(std) {
    var color = std.catColor || 'slate';
    var points = std.checkPoints || [];
    var samples = std.sampleDocs || [];

    return '<div class="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow training-card">' +
      '<div class="p-4 border-b border-slate-100 bg-gradient-to-r from-' + color + '-50 to-white">' +
      '<div class="flex items-start justify-between">' +
      '<div class="flex items-start space-x-3">' +
      '<div class="w-10 h-10 rounded-lg bg-' + color + '-100 flex items-center justify-center flex-shrink-0"><i class="fas fa-' + (points.length ? 'check-double' : 'file') + ' text-' + color + '-600"></i></div>' +
      '<div><div class="flex items-center space-x-2 mb-1">' +
      '<span class="text-xs font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500">' + safeEs(std.id) + '</span>' +
      '<span class="text-sm font-bold text-slate-800">' + safeEs(std.name) + '</span></div>' +
      '<p class="text-xs text-slate-500">' + safeEs(std.desc) + '</p>' +
      '<div class="flex items-center space-x-3 mt-1.5 text-xs text-slate-400">' +
      '<span><i class="fas fa-building mr-1"></i><b>主责部门：</b>' + safeEs(std.dept) + '</span>' +
      (std.supportDept ? '<span><i class="fas fa-users mr-1"></i><b>配合部门：</b>' + safeEs(std.supportDept) + '</span>' : '') +
      (std.frequency ? '<span><i class="far fa-clock mr-1"></i><b>频次：</b>' + safeEs(std.frequency) + '</span>' : '') +
      '</div></div></div>' +
      '<span class="text-xs bg-' + color + '-100 text-' + color + '-700 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">' + (std.catTitle || '') + '</span></div></div>' +

      // Collapsible content
      '<div class="training-detail">' +

      // 标准要求
      (std.standard ? '<div class="px-4 pt-3"><div class="p-3 bg-blue-50 rounded-lg border border-blue-100">' +
      '<p class="text-xs font-semibold text-blue-700 mb-1"><i class="fas fa-gavel mr-1"></i>标准要求（海关认定依据）</p>' +
      '<p class="text-xs text-blue-600 leading-relaxed">' + safeEs(std.standard) + '</p></div></div>' : '') +

      // 海关检查重点
      '<div class="px-4 pt-3 grid grid-cols-1 md:grid-cols-2 gap-3">' +
      (std.checkFile ? '<div class="p-3 bg-amber-50 rounded-lg border border-amber-100">' +
      '<p class="text-xs font-semibold text-amber-700 mb-1.5"><i class="fas fa-search mr-1"></i>海关检查重点（文件）</p>' +
      '<p class="text-xs text-amber-800 leading-relaxed">' + safeEs(std.checkFile) + '</p></div>' : '') +
      (std.checkInterview ? '<div class="p-3 bg-purple-50 rounded-lg border border-purple-100">' +
      '<p class="text-xs font-semibold text-purple-700 mb-1.5"><i class="fas fa-comments mr-1"></i>海关询问要点</p>' +
      '<p class="text-xs text-purple-800 leading-relaxed">' + safeEs(std.checkInterview) + '</p></div>' : '') +
      '</div>' +

      // 检查要点
      (points.length ? '<div class="px-4 pt-3"><p class="text-xs font-semibold text-slate-600 mb-1.5"><i class="fas fa-clipboard-list mr-1"></i>检查要点（自查/培训用）</p>' +
      '<div class="space-y-1">' + points.map(function(p, i) {
        return '<div class="flex items-start space-x-2 p-2 bg-slate-50 rounded-lg border border-slate-100"><span class="text-xs font-mono text-slate-400 w-5 flex-shrink-0">' + (i + 1) + '.</span><span class="text-xs text-slate-700">' + safeEs(p) + '</span></div>';
      }).join('') + '</div></div>' : '') +

      // 样本资料
      (samples.length ? '<div class="px-4 pt-3 pb-2"><p class="text-xs font-semibold text-slate-600 mb-1.5"><i class="fas fa-paperclip mr-1"></i>所需材料清单</p>' +
      '<div class="flex flex-wrap gap-1.5">' + samples.map(function(d) {
        return '<span class="text-xs bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded hover:bg-slate-50 cursor-default">' + safeEs(d) + '</span>';
      }).join('') + '</div></div>' : '') +

      // 培训讲解笔记（可编辑）
      '<div class="training-notes-section" data-std="' + std.id + '">' +
      renderTrainingNotesSection(std.id) +
      '</div>' +

      '</div>' +
      '<div class="px-4 py-2 bg-slate-50 border-t border-slate-100 flex justify-between items-center">' +
      '<button onclick="toggleTrainingCard(this)" class="text-xs text-blue-600 hover:text-blue-800"><i class="fas fa-chevron-down mr-1"></i>展开全部</button>' +
      '<div class="flex items-center space-x-2">' +
      '<button onclick="editTrainingNotes(\'' + std.id + '\')" class="text-xs text-emerald-600 hover:text-emerald-800 border border-emerald-200 bg-emerald-50 px-2 py-1 rounded"><i class="fas fa-pen mr-1"></i>编辑笔记</button>' +
      '<button onclick="printTrainingCard(\'' + std.id + '\')" class="text-xs text-slate-500 hover:text-slate-700"><i class="fas fa-print mr-1"></i>打印</button>' +
      '</div></div></div>';
  }).join('');
}

function toggleTrainingCard(btn) {
  var detail = btn.closest('.training-card').querySelector('.training-detail');
  if (detail) {
    detail.classList.toggle('hidden');
    btn.innerHTML = detail.classList.contains('hidden') ?
      '<i class="fas fa-chevron-down mr-1"></i>展开全部' :
      '<i class="fas fa-chevron-up mr-1"></i>收起';
  }
}

function printTrainingCard(stdId) {
  var all = getAllAeoStandards();
  var std = null;
  all.forEach(function(s) { if (s.id === stdId) std = s; });
  if (!std) return;
  var points = std.checkPoints || [];
  var samples = std.sampleDocs || [];

  function h(s) { return s == null ? '' : String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  var r = '<!DOCTYPE html><html lang=zh-CN><head><meta charset=utf-8><title>' + std.id + ' ' + std.name + ' - 标准宣贯</title>';
  r += '<style>body{font-family:"Noto Sans SC",sans-serif;padding:30px;color:#333;max-width:800px;margin:auto;font-size:13px}';
  r += 'h1{font-size:20px;border-bottom:2px solid #1e3a5f;padding-bottom:8px}';
  r += 'h2{font-size:15px;color:#1e3a5f;margin-top:20px;padding:6px 0;border-bottom:1px solid #e2e8f0}';
  r += 'table{width:100%;border-collapse:collapse;margin:8px 0}';
  r += 'th,td{border:1px solid #d1d5db;padding:6px 10px;text-align:left;font-size:12px}';
  r += 'th{background:#f1f5f9}';
  r += '.tag{display:inline-block;background:#e2e8f0;padding:2px 8px;border-radius:4px;margin:2px;font-size:11px}';
  r += '.meta{color:#64748b;font-size:12px;margin:6px 0 16px}';
  r += '@media print{body{padding:15px}}';
  r += '</style></head><body>';

  r += '<h1>[' + std.id + '] ' + h(std.name) + '</h1>';
  r += '<div class=meta><p>主责部门: ' + h(std.dept) + (std.supportDept ? ' | 配合部门: ' + h(std.supportDept) : '') + (std.frequency ? ' | 频次: ' + h(std.frequency) : '') + '</p>';
  r += '<p>' + h(std.desc) + '</p></div>';

  if (std.standard) r += '<h2>一、标准要求</h2><p>' + h(std.standard) + '</p>';
  if (std.checkFile) r += '<h2>二、海关检查重点</h2><p>' + h(std.checkFile) + '</p>';
  if (std.checkInterview) r += '<h2>三、海关询问要点</h2><p>' + h(std.checkInterview) + '</p>';

  if (points.length) {
    r += '<h2>四、检查要点</h2><ol>';
    points.forEach(function(p) { r += '<li style="margin:4px 0;font-size:12px">' + h(p) + '</li>'; });
    r += '</ol>';
  }

  if (samples.length) {
    r += '<h2>五、所需材料清单</h2>';
    samples.forEach(function(s) { r += '<span class=tag>' + h(s) + '</span> '; });
  }

  r += '<p style=margin-top:30px;text-align:center;color:#94a3b8;font-size:11px;border-top:1px solid #e2e8f0;padding-top:12px>';
  r += 'AEO海关认证管理系统 · 标准宣贯材料 · ' + new Date().toLocaleDateString('zh-CN') + '</p></body></html>';

  var win = window.open('', '_blank');
  if (win) { win.document.write(r); win.document.close(); setTimeout(function() { win.print(); }, 300); }
  else { showToast('请允许弹出窗口以打印', 'warning'); }
}

function loadTrainingNotes() {
  return loadData('trainingNotes', {});
}

function renderSampleLibrary() {
  var container = document.getElementById('sampleLibraryList');
  if (!container) return;

  var html = '<div class="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">' +
    '<p class="text-sm font-medium text-indigo-700"><i class="fas fa-book-open mr-1"></i>南京海关AEO认证样本资料库</p>' +
    '<p class="text-xs text-indigo-500 mt-1">来源：南京海关AEO进出口收发货人高级认证内容 — 共25项认证，' +
    (function() { var lc=0,zc=0;for(var k in NJ_SAMPLES){var d=NJ_SAMPLES[k];if(d.l)lc+=d.l.length;if(d.z)zc+=d.z.length;} return lc+'条样本链接，'+zc+'份样本文件'; })() + '</p></div>' +
    '<div class="mb-3"><input type="text" id="sampleSearch" placeholder="搜索样本名称/关联标准..." class="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500" oninput="filterSampleLibrary()"></div>' +
    '<div class="space-y-3" id="sampleLibraryItems">';

  var keys = Object.keys(NJ_SAMPLES).sort(function(a,b) { return parseInt(a)-parseInt(b); });

  keys.forEach(function(k) {
    var d = NJ_SAMPLES[k];
    var catCls = d.c === '内部控制' ? 'slate' : d.c === '财务状况与守法规范' ? 'emerald' : 'blue';
    var catIcon = d.c === '内部控制' ? 'fa-sitemap' : d.c === '财务状况与守法规范' ? 'fa-balance-scale' : 'fa-shield-alt';

    html += '<div class="sample-item bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow" data-name="' + safeEs(d.n) + '" data-ids="' + (d.s||[]).join(',') + '">' +
      '<div class="p-4 border-b border-slate-100 bg-gradient-to-r from-' + catCls + '-50 to-white">' +
      '<div class="flex items-start justify-between">' +
      '<div class="flex items-start space-x-3">' +
      '<div class="w-10 h-10 rounded-lg bg-' + catCls + '-100 flex items-center justify-center flex-shrink-0"><i class="fas ' + catIcon + ' text-' + catCls + '-600"></i></div>' +
      '<div><div class="flex items-center space-x-2 mb-1">' +
      '<span class="text-xs font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500">#' + k + '</span>' +
      '<span class="text-sm font-bold text-slate-800">' + safeEs(d.n) + '</span></div>' +

      // 关联标准编号
      (d.s && d.s.length ? '<div class="flex flex-wrap gap-1 mt-1.5">' + d.s.map(function(sid) {
        return '<span class="text-xs bg-white text-blue-600 px-2 py-0.5 rounded border border-blue-200 cursor-pointer hover:bg-blue-50" onclick="switchTrainingCat(\'all\');var se=document.getElementById(\'trainingSearch\');if(se){se.value=\'' + sid + '\';filterTrainingCards();}">' + sid + '</span>';
      }).join('') + '<span class="text-xs text-slate-400 self-center ml-1">关联标准</span></div>' : '') +
      '</div></div>' +
      '<span class="text-xs bg-' + catCls + '-100 text-' + catCls + '-700 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">' + d.c + '</span></div></div>' +

      // 可折叠详情
      '<div class="sample-detail">' +

      // 样本文件
      (d.z && d.z.length ? '<div class="px-4 pt-3"><p class="text-xs font-semibold text-slate-600 mb-1.5"><i class="fas fa-file-archive mr-1"></i>样本文件（' + d.z.length + '份）</p>' +
      '<div class="flex flex-wrap gap-1.5">' + d.z.map(function(f) {
        var tc = f.t === 'PDF' ? 'text-red-600 bg-red-50 border-red-200' :
          f.t === 'DOCX' || f.t === 'DOC' ? 'text-blue-600 bg-blue-50 border-blue-200' :
          f.t === 'JPG' || f.t === 'PNG' ? 'text-green-600 bg-green-50 border-green-200' :
          f.t === 'GIF' ? 'text-teal-600 bg-teal-50 border-teal-200' :
          f.t === 'HTML' ? 'text-purple-600 bg-purple-50 border-purple-200' :
          f.t === 'RAR' ? 'text-amber-600 bg-amber-50 border-amber-200' :
          f.t === 'MP4' || f.t === 'AVI' ? 'text-pink-600 bg-pink-50 border-pink-200' :
          f.t === 'XLSX' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
          'text-slate-600 bg-slate-50 border-slate-200';
        var fi = f.t === 'PDF' ? 'fa-file-pdf' : f.t === 'DOCX' || f.t === 'DOC' ? 'fa-file-word' :
          f.t === 'JPG' || f.t === 'PNG' ? 'fa-file-image' :
          f.t === 'GIF' ? 'fa-file-image' :
          f.t === 'RAR' ? 'fa-file-archive' :
          f.t === 'MP4' || f.t === 'AVI' ? 'fa-file-video' :
          f.t === 'HTML' ? 'fa-file-code' :
          f.t === 'XLSX' ? 'fa-file-excel' : 'fa-file';
        return '<span class="text-xs border px-2 py-0.5 rounded ' + tc + '" title="' + safeEs(f.n) + '"><i class="fas ' + fi + ' mr-0.5"></i>' + safeEs(f.n) + '</span>';
      }).join('') + '</div></div>' : '') +

      // 外部链接
      (d.l && d.l.length ? '<div class="px-4 pt-3"><p class="text-xs font-semibold text-slate-600 mb-1.5"><i class="fas fa-link mr-1"></i>样本链接（' + d.l.length + '条）</p>' +
      '<div class="space-y-1 max-h-48 overflow-y-auto">' + d.l.map(function(link) {
        return '<a href="' + safeEs(link.u) + '" target="_blank" rel="noopener noreferrer" class="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">' +
          '<i class="fas fa-external-link-alt text-blue-400 text-xs flex-shrink-0"></i>' +
          '<span class="text-xs text-blue-700 truncate">' + safeEs(link.n) + '</span></a>';
      }).join('') + '</div></div>' : '') +

      // 海关标准原文（可折叠）
      (d.t ? '<div class="px-4 pt-3 pb-2 border-t border-slate-100 mt-2">' +
      '<button onclick="toggleSampleText(this)" class="text-xs text-indigo-600 hover:text-indigo-800"><i class="fas fa-chevron-down mr-1"></i>查看海关标准原文</button>' +
      '<div class="sample-text hidden p-3 bg-slate-50 rounded-lg border border-slate-200 mt-2 max-h-48 overflow-y-auto text-xs text-slate-600 leading-relaxed">' +
      '<p class="text-xs font-semibold text-slate-500 mb-1">海关认证标准原文（南京海关）</p>' + safeEs(d.t) + '</div></div>' : '') +

      '</div>' +
      '<div class="px-4 py-2 bg-slate-50 border-t border-slate-100 flex justify-between items-center">' +
      '<button onclick="toggleSampleDetail(this)" class="text-xs text-blue-600 hover:text-blue-800"><i class="fas fa-chevron-down mr-1"></i>展开全部</button>' +
      '<span class="text-xs text-slate-400">' + ((d.z?d.z.length:0)+(d.l?d.l.length:0)) + ' 份资料</span></div></div>';
  });

  html += '</div>';
  container.innerHTML = html;
}

function toggleSampleDetail(btn) {
  var detail = btn.closest('.sample-item').querySelector('.sample-detail');
  if (detail) {
    detail.classList.toggle('hidden');
    btn.innerHTML = detail.classList.contains('hidden') ?
      '<i class="fas fa-chevron-down mr-1"></i>展开全部' :
      '<i class="fas fa-chevron-up mr-1"></i>收起';
  }
}

function toggleSampleText(btn) {
  var textDiv = btn.nextElementSibling;
  if (textDiv) {
    textDiv.classList.toggle('hidden');
    btn.innerHTML = textDiv.classList.contains('hidden') ?
      '<i class="fas fa-chevron-down mr-1"></i>查看海关标准原文' :
      '<i class="fas fa-chevron-up mr-1"></i>收起原文';
  }
}

function filterSampleLibrary() {
  var q = (document.getElementById('sampleSearch') && document.getElementById('sampleSearch').value || '').trim().toLowerCase();
  document.querySelectorAll('#sampleLibraryItems .sample-item').forEach(function(el) {
    var match = !q || el.dataset.name.toLowerCase().indexOf(q) !== -1 || el.dataset.ids.toLowerCase().indexOf(q) !== -1;
    el.style.display = match ? '' : 'none';
  });
}

function renderTrainingNotesSection(stdId) {
  var notes = loadTrainingNotes();
  var n = notes[stdId] || {};
  var now = new Date().toLocaleDateString('zh-CN');
  if (n._editing) {
    var issues = n._tempIssues || n.commonIssues || [];
    var html = '<div class="px-4 pt-3 pb-3 border-t border-slate-100 mt-2">';
    html += '<p class="text-xs font-semibold text-slate-600 mb-2"><i class="fas fa-pen text-emerald-500 mr-1"></i>编辑培训笔记</p>';
    html += '<div class="space-y-3">';
    html += '<div><label class="block text-xs text-slate-500 mb-1">培训讲解笔记</label>';
    html += '<textarea id="notesInput_' + stdId + '" rows="3" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500" placeholder="记录此项标准的培训要点、讲解内容、注意事项...">' + safeEs(n.notes || '') + '</textarea></div>';
    html += '<div><label class="block text-xs text-slate-500 mb-1">常见问题/注意事项</label>';
    html += '<div class="space-y-1 mb-1.5" id="issuesList_' + stdId + '">';
    if (issues.length) {
      issues.forEach(function(iss, i) {
        html += '<div class="flex items-center space-x-2"><input type="text" class="issue-input flex-1 border border-slate-300 rounded px-2 py-1.5 text-xs" value="' + safeEs(iss) + '" data-idx="' + i + '"><button onclick="removeTrainingIssue(\'' + stdId + '\',' + i + ')" class="text-red-400 hover:text-red-600 text-xs p-1"><i class="fas fa-times"></i></button></div>';
      });
    }
    html += '</div>';
    html += '<button onclick="addTrainingIssue(\'' + stdId + '\')" class="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 bg-blue-50 px-2 py-1 rounded"><i class="fas fa-plus mr-0.5"></i>添加问题</button></div>';
    html += '<div class="flex items-center space-x-2 pt-2">';
    html += '<button onclick="saveTrainingNotes(\'' + stdId + '\')" class="px-4 py-1.5 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700"><i class="fas fa-save mr-0.5"></i>保存</button>';
    html += '<button onclick="cancelEditTrainingNotes(\'' + stdId + '\')" class="px-4 py-1.5 border border-slate-300 text-slate-600 rounded text-xs hover:bg-slate-50">取消</button>';
    html += '</div></div></div>';
    return html;
  }
  // Display mode
  var hasContent = n.notes || (n.commonIssues && n.commonIssues.length);
  if (!hasContent) {
    return '<div class="px-4 pt-2 pb-1"><div class="p-2 bg-slate-50 rounded-lg border border-dashed border-slate-200"><p class="text-xs text-slate-400 text-center"><i class="fas fa-pen mr-1"></i>暂无培训笔记，点击"编辑笔记"添加</p></div></div>';
  }
  var html = '<div class="px-4 pt-2 pb-2 border-t border-slate-100 mt-1">';
  html += '<p class="text-xs font-semibold text-slate-600 mb-1.5"><i class="fas fa-sticky-note text-emerald-500 mr-1"></i>培训讲解笔记';
  if (n.updatedAt) html += ' <span class="text-xs text-slate-400 font-normal">（最后修改: ' + new Date(n.updatedAt).toLocaleString('zh-CN') + ' · ' + safeEs(n.updatedBy || '—') + '）</span>';
  html += '</p>';
  if (n.notes) html += '<div class="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 mb-1.5"><p class="text-xs text-emerald-800 leading-relaxed">' + safeEs(n.notes) + '</p></div>';
  if (n.commonIssues && n.commonIssues.length) {
    html += '<div class="flex flex-wrap gap-1.5">';
    n.commonIssues.forEach(function(iss) {
      html += '<span class="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded">⚠ ' + safeEs(iss) + '</span>';
    });
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function editTrainingNotes(stdId) {
  var notes = loadTrainingNotes();
  if (!notes[stdId]) notes[stdId] = {};
  notes[stdId]._editing = true;
  notes[stdId]._tempIssues = (notes[stdId].commonIssues || []).slice();
  saveData('trainingNotes', notes);
  // Re-render just this card's notes section
  var section = document.querySelector('.training-notes-section[data-std="' + stdId + '"]');
  if (section) section.innerHTML = renderTrainingNotesSection(stdId);
  addAuditLog('编辑培训笔记', 'data', '标准 ' + stdId + ' 进入编辑模式');
}

function cancelEditTrainingNotes(stdId) {
  var notes = loadTrainingNotes();
  if (notes[stdId]) {
    delete notes[stdId]._editing;
    delete notes[stdId]._tempIssues;
  }
  saveData('trainingNotes', notes);
  var section = document.querySelector('.training-notes-section[data-std="' + stdId + '"]');
  if (section) section.innerHTML = renderTrainingNotesSection(stdId);
}

function saveTrainingNotes(stdId) {
  var notes = loadTrainingNotes();
  if (!notes[stdId]) notes[stdId] = {};
  // Save notes text
  var input = document.getElementById('notesInput_' + stdId);
  if (input) notes[stdId].notes = input.value.trim();
  // Save common issues
  var issueInputs = document.querySelectorAll('#issuesList_' + stdId + ' .issue-input');
  var issues = [];
  issueInputs.forEach(function(el) { var v = el.value.trim(); if (v) issues.push(v); });
  notes[stdId].commonIssues = issues;
  notes[stdId].updatedAt = new Date().toISOString();
  notes[stdId].updatedBy = currentUser ? currentUser.name : 'system';
  delete notes[stdId]._editing;
  delete notes[stdId]._tempIssues;
  saveData('trainingNotes', notes);
  addAuditLog('保存培训笔记', 'data', '标准 ' + stdId + ' 笔记已更新');
  var section = document.querySelector('.training-notes-section[data-std="' + stdId + '"]');
  if (section) section.innerHTML = renderTrainingNotesSection(stdId);
  showToast('培训笔记已保存：' + stdId, 'success');
}

function addTrainingIssue(stdId) {
  var notes = loadTrainingNotes();
  if (!notes[stdId]) notes[stdId] = {};
  if (!notes[stdId]._tempIssues) notes[stdId]._tempIssues = (notes[stdId].commonIssues || []).slice();
  notes[stdId]._tempIssues.push('');
  saveData('trainingNotes', notes);
  var section = document.querySelector('.training-notes-section[data-std="' + stdId + '"]');
  if (section) section.innerHTML = renderTrainingNotesSection(stdId);
  // Focus the last input
  var inputs = document.querySelectorAll('#issuesList_' + stdId + ' .issue-input');
  if (inputs.length > 0) inputs[inputs.length - 1].focus();
}

function removeTrainingIssue(stdId, idx) {
  var notes = loadTrainingNotes();
  if (!notes[stdId]) return;
  if (!notes[stdId]._tempIssues) notes[stdId]._tempIssues = (notes[stdId].commonIssues || []).slice();
  notes[stdId]._tempIssues.splice(idx, 1);
  saveData('trainingNotes', notes);
  var section = document.querySelector('.training-notes-section[data-std="' + stdId + '"]');
  if (section) section.innerHTML = renderTrainingNotesSection(stdId);
}
// ── 培训记录管理 ────────────────────────────────────
function loadTrainingRecords() { return loadData('trainingRecords', []); }
function saveTrainingRecords(list) { saveData('trainingRecords', list); }

function renderTrainingRecords() {
    var container = document.getElementById('trainingRecordBody');
    if (!container) return;
    var records = loadTrainingRecords();
    if (!records.length) {
        container.innerHTML = '<tr><td colspan="7" class="px-4 py-8 text-center text-slate-400"><i class="fas fa-inbox text-2xl mb-2"></i><p class="text-xs">暂无培训记录</p></td></tr>';
    } else {
        records.sort(function(a, b) { return b.date.localeCompare(a.date); });
        container.innerHTML = records.map(function(r) {
            var rateColor = r.passRate >= 90 ? 'text-emerald-600' : r.passRate >= 70 ? 'text-amber-600' : 'text-red-600';
            return '<tr class="hover:bg-slate-50">' +
                '<td class="px-4 py-3 font-medium text-slate-700">' + safeEs(r.topic) + '</td>' +
                '<td class="px-4 py-3 text-slate-600">' + safeEs(r.instructor || '-') + '</td>' +
                '<td class="px-4 py-3 text-slate-500">' + safeEs(r.depts || '-') + '</td>' +
                '<td class="px-4 py-3 text-slate-500">' + safeEs(r.date) + '</td>' +
                '<td class="px-4 py-3 text-slate-700">' + (r.participants || 0) + '人</td>' +
                '<td class="px-4 py-3"><span class="' + rateColor + ' font-medium">' + (r.passRate != null ? r.passRate + '%' : '-') + '</span></td>' +
                '<td class="px-4 py-3 text-center">' +
                '<button onclick="deleteTrainingSession(\'' + r.id + '\')" class="p-1.5 text-red-400 hover:text-red-600" title="删除"><i class="fas fa-trash-alt"></i></button></td></tr>';
        }).join('');
    }
    renderTrainingStats();
}

function renderTrainingStats() {
    var records = loadTrainingRecords();
    var totalSessions = records.length;
    var totalPeople = 0;
    var sumRate = 0;
    var rateCount = 0;
    records.forEach(function(r) {
        totalPeople += r.participants || 0;
        if (r.passRate != null) { sumRate += r.passRate; rateCount++; }
    });
    var avgRate = rateCount > 0 ? Math.round(sumRate / rateCount) : 0;
    var countEl = document.getElementById('trainingStatCount');
    var peopleEl = document.getElementById('trainingStatPeople');
    var rateEl = document.getElementById('trainingStatRate');
    if (countEl) countEl.textContent = totalSessions;
    if (peopleEl) peopleEl.textContent = totalPeople;
    if (rateEl) rateEl.textContent = avgRate + '%';
}

function showTrainingSessionModal() {
    document.getElementById('tsTopic').value = '';
    document.getElementById('tsDate').value = new Date().toISOString().slice(0, 10);
    document.getElementById('tsInstructor').value = '';
    document.getElementById('tsParticipants').value = '';
    document.getElementById('tsPassRate').value = '';
    document.getElementById('tsDepts').value = '';
    document.getElementById('tsNotes').value = '';
    document.getElementById('tsEditId').value = '';
    document.getElementById('trainingSessionModalTitle').textContent = '记录培训活动';
    document.getElementById('trainingSessionModal').classList.add('active');
}

function saveTrainingSession() {
    var topic = document.getElementById('tsTopic').value.trim();
    var date = document.getElementById('tsDate').value;
    var instructor = document.getElementById('tsInstructor').value.trim();
    if (!topic || !date || !instructor) { showToast('培训主题、日期和讲师为必填', 'error'); return; }
    var participants = parseInt(document.getElementById('tsParticipants').value) || 0;
    var passRate = document.getElementById('tsPassRate').value !== '' ? parseInt(document.getElementById('tsPassRate').value) : null;
    var depts = document.getElementById('tsDepts').value.trim();
    var notes = document.getElementById('tsNotes').value.trim();
    var editId = document.getElementById('tsEditId').value;
    var list = loadTrainingRecords();
    if (editId) {
        var idx = list.findIndex(function(r) { return r.id === editId; });
        if (idx >= 0) {
            list[idx].topic = topic;
            list[idx].date = date;
            list[idx].instructor = instructor;
            list[idx].participants = participants;
            list[idx].passRate = passRate;
            list[idx].depts = depts;
            list[idx].notes = notes;
        }
    } else {
        list.unshift({
            id: 'TR-' + Date.now(),
            topic: topic,
            date: date,
            instructor: instructor,
            participants: participants,
            passRate: passRate,
            depts: depts,
            notes: notes,
            createdAt: new Date().toISOString()
        });
    }
    saveTrainingRecords(list);
    closeModal('trainingSessionModal');
    renderTrainingRecords();
    addAuditLog((editId ? '编辑' : '新增') + '培训记录: ' + topic, 'data', '');
    showToast('培训记录已保存', 'success');
}

function deleteTrainingSession(id) {
    if (!confirm('确定要删除此培训记录吗？')) return;
    var list = loadTrainingRecords();
    list = list.filter(function(r) { return r.id !== id; });
    saveTrainingRecords(list);
    renderTrainingRecords();
    showToast('培训记录已删除', 'warning');
}


// ------------------------------------------------------------------------
// 15. 年度资料归档
// ------------------------------------------------------------------------
function renderAnnualArchive() {
  renderArchiveYearSelector();
  renderArchiveDashboard();
  renderArchiveHistory();
}

function renderArchiveYearSelector() {
  var sel = document.getElementById('archiveYear');
  if (!sel) return;
  var cy = new Date().getFullYear();
  var opts = '';
  for (var y = cy; y >= 2020; y--) opts += '<option value="' + y + '">' + y + '年</option>';
  sel.innerHTML = opts;
}

function renderArchiveDashboard() {
  var container = document.getElementById('archiveDashboard');
  if (!container) return;
  var sel = document.getElementById('archiveYear');
  var year = sel ? sel.value : new Date().getFullYear();
  var html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">';

  // 1. 财务数据
  var fd = loadData('financeData', {});
  var hasFinance = fd[year] && Object.keys(fd[year]).length > 0;
  var finItems = fd[year] || {};
  var finPass = 0, finTotal = 0;
  if (hasFinance) {
    FIN_INDICATORS.filter(function(i) { return i.passFn; }).forEach(function(i) {
      finTotal++;
      var v = parseFloat(finItems[i.label]);
      if (!isNaN(v) && i.passFn(v)) finPass++;
    });
  }
  html += archiveStatCard('财务指标', hasFinance, 'chart-line', 'emerald',
    hasFinance ? '已录入 ' + finPass + '/' + finTotal + ' 项达标' : '未录入');

  // 2. 认证自查
  var sc = loadData('standardChecks', {});
  var yearSc = sc[year] || {};
  var scKeys = Object.keys(yearSc);
  var scCompliant = 0;
  scKeys.forEach(function(k) { if (yearSc[k].overallStatus === 'compliant') scCompliant++; });
  html += archiveStatCard('认证自查', scKeys.length > 0, 'list-check', 'blue',
    scKeys.length > 0 ? scCompliant + '/' + scKeys.length + ' 项合规' : '未开始');

  // 3. 内部审计
  var audits = loadData('internalAudits', []) || [];
  var yearAudits = audits.filter(function(a) { return a.year === year; });
  var auditIssues = 0;
  yearAudits.forEach(function(a) {
    if (a.issues) auditIssues += a.issues.filter(function(i) { return i.status !== '已整改'; }).length;
  });
  html += archiveStatCard('内部审计', yearAudits.length > 0, 'search', 'violet',
    yearAudits.length > 0 ? yearAudits.length + ' 次审计，' + auditIssues + ' 项未整改' : '无记录');

  // 4. 企业合规自评
  var hist = loadData('assessmentHistory', []) || [];
  var yearHist = hist.filter(function(h) { return h.year === year; });
  html += archiveStatCard('企业合规自评', yearHist.length > 0, 'clipboard-check', 'amber',
    yearHist.length > 0 ? '共 ' + yearHist.length + ' 次，最高 ' + Math.max.apply(null, yearHist.map(function(h){return h.score||0;})) + ' 分' : '未提交');

  container.innerHTML = html;

  // 第二行：数据清单
  var tasks = loadData('tasks', []) || [];
  var yearTasks = tasks.filter(function(t) { return t.createdAt && t.createdAt.indexOf(year) === 0; });
  var suppliers = loadData('suppliers', []) || [];
  var supQueries = 0;
  suppliers.forEach(function(s) {
    if (s.queries) supQueries += s.queries.filter(function(q) { return q.date && q.date.indexOf(year) === 0; }).length;
  });
  var ci = loadData('companyInfo', null);

  html = '<div class="card-business rounded-lg p-4"><h3 class="font-bold text-slate-800 mb-3 text-sm">' + year + '年数据清单</h3>';
  html += statRow('tasks', '任务管理', yearTasks.length + ' 个任务', yearTasks.length > 0);
  html += statRow('handshake', '供应商资质评估查询', supQueries + ' 条查询记录', supQueries > 0);
  html += statRow('building', '企业信息', ci ? '已配置' : '未配置', !!ci);
  html += '</div></div>';
  container.innerHTML += html;

  // 异步加载文件资料清单
  renderArchiveFileInventory(year);
}

function statRow(icon, label, desc, ok) {
  return '<div class="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"><div class="flex items-center space-x-2"><i class="fas fa-' + icon + ' text-slate-400 w-5"></i><span class="text-sm text-slate-700">' + label + '</span></div><span class="text-xs ' + (ok ? 'text-emerald-600' : 'text-slate-400') + '">' + desc + '</span></div>';
}

function archiveStatCard(label, hasData, icon, color, desc) {
  var statusIcon = hasData ? 'fa-check-circle text-' + color + '-500' : 'fa-times-circle text-slate-300';
  return '<div class="' + (hasData ? 'bg-' + color + '-50' : 'bg-slate-50') + ' rounded-xl border ' + (hasData ? 'border-' + color + '-200' : 'border-slate-200') + ' p-4"><div class="flex items-center justify-between mb-2"><div class="flex items-center space-x-2"><i class="fas fa-' + icon + ' text-' + color + '-600"></i><span class="text-sm font-medium text-slate-700">' + label + '</span></div><i class="fas ' + statusIcon + '"></i></div><p class="text-xs ' + (hasData ? 'text-slate-600' : 'text-slate-400') + '">' + desc + '</p></div>';
}

async function renderArchiveFileInventory(year) {
  var container = document.getElementById('archiveDashboard');
  if (!container) return;

  var html = '<div class="card-business rounded-lg p-4 mt-3"><h3 class="font-bold text-slate-800 mb-3 text-sm"><i class="fas fa-folder-open text-amber-500 mr-1"></i>' + year + '年文件资料清单 <span class="text-xs text-slate-400 font-normal">（从系统中自动提取）</span></h3><div id="archiveFileList" class="space-y-2">';
  html += '<div class="text-center py-4 text-slate-400"><i class="fas fa-spinner fa-spin text-lg"></i><p class="text-xs mt-1">正在扫描文件...</p></div>';
  html += '</div></div>';
  container.innerHTML += html;

  try {
    // 获取全部文件列表
    var allFiles = await listFilesFromDB();
    if (!allFiles || !allFiles.length) {
      document.getElementById('archiveFileList').innerHTML = '<div class="text-center py-4 text-slate-400"><i class="fas fa-inbox text-xl mb-1"></i><p class="text-xs">系统中暂无上传文件</p></div>';
      return;
    }

    // 按类别分组
    var groups = {
      finance: { label: '财务审计报告', icon: 'file-invoice-dollar', color: 'emerald', files: [] },
      audit: { label: '内部审计报告', icon: 'file-pdf', color: 'violet', files: [] },
      training: { label: '培训资料', icon: 'graduation-cap', color: 'blue', files: [] },
      evidence: { label: '自查资料文件', icon: 'clipboard-check', color: 'indigo', files: [] },
      customLaw: { label: '法规附件', icon: 'gavel', color: 'orange', files: [] },
      doc: { label: '制度文件', icon: 'folder', color: 'slate', files: [] },
      other: { label: '其他文件', icon: 'file', color: 'slate', files: [] }
    };

    // 审计报告 - 通过审计数据的 _reports 获取实际上传的文件
    var auditFileIds = {};
    yearAudits = (loadData('internalAudits', []) || []).filter(function(a) { return a.year === year; });
    yearAudits.forEach(function(a) {
      if (a._reports) a._reports.forEach(function(r) { auditFileIds[r.id] = r.name; });
    });

    allFiles.forEach(function(f) {
      var cat = f.category || '';
      var name = f.name || '';
      // 按上传日期判断是否属于该年度
      var fileYear = f.uploadedAt ? f.uploadedAt.substring(0, 4) : '';
      if (fileYear !== year) {
        // 也检查 category 中是否包含年份
        var catMatch = cat.match(/_(\d{4})$/);
        if (!catMatch || catMatch[1] !== year) return;
      }

      if (cat.indexOf('finance_report') === 0) groups.finance.files.push(f);
      else if (cat === 'audit_report') groups.audit.files.push(f);
      else if (cat.indexOf('training') === 0) groups.training.files.push(f);
      else if (cat === 'aeo_evidence') groups.evidence.files.push(f);
      else if (cat.indexOf('custom_law') === 0) groups.customLaw.files.push(f);
      else if (cat.indexOf('doc') === 0) groups.doc.files.push(f);
      else groups.other.files.push(f);
    });

    // 对 auditFileIds 中未按 category 匹配的也添加到审计组
    if (yearAudits.length > 0) {
      allFiles.forEach(function(f) {
        if (auditFileIds[f.id] && groups.audit.files.indexOf(f) === -1) {
          groups.audit.files.push(f);
        }
      });
    }

    var fileHtml = '';
    var hasAny = false;
    Object.keys(groups).forEach(function(k) {
      var g = groups[k];
      if (!g.files.length) return;
      hasAny = true;
      fileHtml += '<div class="p-2.5 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all">';
      fileHtml += '<div class="flex items-center justify-between mb-1.5">';
      fileHtml += '<div class="flex items-center space-x-2"><i class="fas fa-' + g.icon + ' text-' + g.color + '-600"></i><span class="text-xs font-semibold text-slate-700">' + g.label + '</span></div>';
      fileHtml += '<span class="text-xs text-slate-400">' + g.files.length + ' 份</span></div>';
      fileHtml += '<div class="space-y-1">';
      g.files.forEach(function(f) {
        var sizeStr = f.size ? ' (' + Math.round(f.size / 1024) + 'KB)' : '';
        fileHtml += '<div class="flex items-center justify-between text-xs pl-5">';
        fileHtml += '<span class="text-slate-600 truncate max-w-[70%]"><i class="fas fa-file text-slate-300 mr-1.5"></i>' + safeEs(f.name) + sizeStr + '</span>';
        fileHtml += '<span class="text-slate-400">' + new Date(f.uploadedAt).toLocaleDateString('zh-CN') + '</span></div>';
      });
      fileHtml += '</div></div>';
    });

    if (!hasAny) {
      fileHtml = '<div class="text-center py-4 text-slate-400"><i class="fas fa-folder-open text-xl mb-1"></i><p class="text-xs">该年度暂无匹配的文件资料</p></div>';
    }
    document.getElementById('archiveFileList').innerHTML = fileHtml;
  } catch(e) {
    document.getElementById('archiveFileList').innerHTML = '<div class="text-center py-4 text-slate-400"><i class="fas fa-exclamation-circle text-xl mb-1"></i><p class="text-xs">文件扫描出错: ' + e.message + '</p></div>';
  }
}

async function generateAnnualArchive() {
  var sel = document.getElementById('archiveYear');
  var year = sel ? sel.value : new Date().getFullYear();
  var archives = loadData('annualArchives', {});
  if (archives[year]) {
    if (!confirm(year + '年已有归档记录，确定要重新生成并覆盖吗？')) return;
  }

  var ci = loadData('companyInfo', null) || {};
  var fd = loadData('financeData', {});
  var yearFd = fd[year] || {};
  var sc = loadData('standardChecks', {});
  var yearSc = sc[year] || {};
  var audits = (loadData('internalAudits', []) || []).filter(function(a) { return a.year === year; });
  var hist = (loadData('assessmentHistory', []) || []).filter(function(h) { return h.year === year; });
  var tasks = (loadData('tasks', []) || []).filter(function(t) { return t.createdAt && t.createdAt.indexOf(year) === 0; });
  var suppliers = loadData('suppliers', []) || [];
  var tn = loadData('trainingNotes', {}) || {};

  // 收集文件
  var allFiles = [];
  try { allFiles = await listFilesFromDB() || []; } catch(e) {}

  // 按类别分组文件
  var fileGroups = { finance: [], audit: [], training: [], evidence: [], customLaw: [], doc: [], other: [] };
  var yearAuditFileIds = {};
  audits.forEach(function(a) {
    if (a._reports) a._reports.forEach(function(r) { yearAuditFileIds[r.id] = r.name; });
  });
  allFiles.forEach(function(f) {
    var cat = f.category || '';
    var fileYear = f.uploadedAt ? f.uploadedAt.substring(0, 4) : '';
    if (fileYear !== year) {
      var catMatch = cat.match(/_(\d{4})$/);
      if (!catMatch || catMatch[1] !== year) return;
    }
    if (cat.indexOf('finance_report') === 0) fileGroups.finance.push(f);
    else if (cat === 'audit_report' || yearAuditFileIds[f.id]) fileGroups.audit.push(f);
    else if (cat.indexOf('training') === 0) fileGroups.training.push(f);
    else if (cat === 'aeo_evidence') fileGroups.evidence.push(f);
    else if (cat.indexOf('custom_law') === 0) fileGroups.customLaw.push(f);
    else if (cat.indexOf('doc') === 0) fileGroups.doc.push(f);
    else fileGroups.other.push(f);
  });

  var now = new Date();
  var dateStr = now.toLocaleDateString('zh-CN');
  var user = currentUser ? currentUser.name : 'system';
  var stdKeys = Object.keys(yearSc);

  function h(s) { return s == null ? '' : String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function fileRow(f) {
    var s = f.size ? ' (' + Math.round(f.size / 1024) + 'KB)' : '';
    return '<tr><td>' + h(f.name) + '</td><td>' + s + '</td><td>' + (f.uploadedAt ? h(f.uploadedAt.substring(0, 10)) : '—') + '</td></tr>';
  }

  var r = '<!DOCTYPE html><html lang=zh-CN><head><meta charset=utf-8><title>AEO年度归档报告 ' + year + '</title>';
  r += '<style>body{font-family:"Noto Sans SC",sans-serif;padding:30px 40px;color:#333;max-width:1100px;margin:auto;font-size:13px}';
  r += 'h1{font-size:24px;border-bottom:3px solid #1e3a5f;padding-bottom:10px;margin-bottom:6px}';
  r += 'h2{font-size:18px;color:#1e3a5f;margin-top:26px;padding:6px 0;border-bottom:1px solid #e2e8f0}';
  r += 'h3{font-size:14px;color:#334155;margin-top:16px;margin-bottom:6px}';
  r += 'table{width:100%;border-collapse:collapse;margin:6px 0 10px}';
  r += 'th,td{border:1px solid #d1d5db;padding:5px 8px;text-align:left;font-size:11px}';
  r += 'th{background:#f1f5f9;color:#475569;font-weight:600}';
  r += '.meta{color:#64748b;font-size:13px;margin:4px 0 20px}';
  r += '.ok{color:#059669;font-weight:600}.err{color:#dc2626;font-weight:600}.na{color:#94a3b8}';
  r += '.section{border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;margin:10px 0;background:#fafafa}';
  r += '.file-cat{margin:8px 0 4px;font-weight:600;font-size:12px;color:#475569}';
  r += '@media print{body{padding:15px}}';
  r += '</style></head><body>';

  r += '<h1>AEO年度资料归档报告</h1>';
  r += '<div class=meta><p>企业名称: ' + h(ci.name || '—') + ' | 年度: ' + year + '年 | 生成日期: ' + dateStr + ' | 归档人: ' + h(user) + '</p>';
  r += '<p>统一社会信用代码: ' + h(ci.creditCode || '—') + ' | 海关注册编码: ' + h(ci.customsCode || '—') + ' | 认证等级: ' + h(ci.certLevel || '高级认证企业') + '</p></div>';

  // ── 文件资料总览 ──
  var allFileCount = 0;
  Object.keys(fileGroups).forEach(function(k) { allFileCount += fileGroups[k].length; });
  r += '<h2>文件资料分类总览</h2><div class=section>';
  if (allFileCount > 0) {
    r += '<table><thead><tr><th>类别</th><th>数量</th></tr></thead><tbody>';
    var catMeta = { finance:'财务审计报告', audit:'内部审计报告', training:'培训资料', evidence:'自查资料文件', customLaw:'法规附件', doc:'制度文件', other:'其他文件' };
    Object.keys(fileGroups).forEach(function(k) {
      if (fileGroups[k].length) r += '<tr><td>' + (catMeta[k]||k) + '</td><td>' + fileGroups[k].length + ' 份</td></tr>';
    });
    r += '</tbody></table>';
  } else {
    r += '<p class=na>本年度系统中无匹配文件资料</p>';
  }
  r += '</div>';

  // ── 文件明细 ──
  r += '<h2>文件明细清单</h2><div class=section>';
  var catMeta = { finance:'财务审计报告', audit:'内部审计报告', training:'培训资料', evidence:'自查资料文件', customLaw:'法规附件', doc:'制度文件', other:'其他文件' };
  var hasFileSection = false;
  Object.keys(fileGroups).forEach(function(k) {
    if (!fileGroups[k].length) return;
    hasFileSection = true;
    r += '<p class=file-cat>📁 ' + (catMeta[k]||k) + '（' + fileGroups[k].length + '份）</p>';
    r += '<table><thead><tr><th>文件名</th><th>大小</th><th>上传日期</th></tr></thead><tbody>';
    fileGroups[k].forEach(function(f) { r += fileRow(f); });
    r += '</tbody></table>';
  });
  if (!hasFileSection) r += '<p class=na>无文件资料</p>';
  r += '</div>';

  // 1. 财务状况
  r += '<h2>一、财务状况</h2><div class=section>';
  if (Object.keys(yearFd).length > 0) {
    r += '<table><thead><tr><th>指标</th><th>标准值</th><th>年度值</th><th>单位</th><th>达标</th></tr></thead><tbody>';
    (FIN_INDICATORS || []).forEach(function(ind) {
      var val = yearFd[ind.label];
      var pass = '';
      if (ind.passFn && val !== undefined && val !== '') {
        var nv = parseFloat(val);
        pass = !isNaN(nv) && ind.passFn(nv) ? '<span class=ok>✓ 达标</span>' : '<span class=err>✗ 未达标</span>';
      } else { pass = '<span class=na>—</span>'; }
      r += '<tr><td>' + h(ind.label) + '</td><td>' + h(ind.standard || '—') + '</td><td>' + h(val != null ? val : '—') + '</td><td>' + h(ind.unit||'') + '</td><td>' + pass + '</td></tr>';
    });
    r += '</tbody></table>';
    if (yearFd._recordedBy) r += '<p style=font-size:11px;color:#64748b>填写人: ' + h(yearFd._recordedBy) + ' | 日期: ' + h(yearFd._recordedAt||'') + '</p>';
    if (fileGroups.finance.length) {
      r += '<p style=font-size:11px;color:#059669;margin-top:6px><b>📎 附件：</b>';
      fileGroups.finance.forEach(function(f) { r += h(f.name) + ' '; });
      r += '</p>';
    }
  } else { r += '<p class=na>暂无财务数据</p>'; }
  r += '</div>';

  // 2. 认证自查
  r += '<h2>二、认证自查记录</h2><div class=section>';
  if (stdKeys.length > 0) {
    r += '<table><thead><tr><th>编号</th><th>标准名称</th><th>部门</th><th>要点</th><th>合规数</th><th>最后检查</th><th>备注</th></tr></thead><tbody>';
    var allStds = [];
    try { allStds = getAllAeoStandards(); } catch(e) {}
    stdKeys.forEach(function(sid) {
      var d = yearSc[sid];
      if (!d) return;
      var std = null;
      allStds.forEach(function(s) { if (s.id === sid) std = s; });
      var cps = d.checkpoints || [];
      var total = cps.length;
      var done = cps.filter(function(s) { return s === 'compliant'; }).length;
      r += '<tr><td>' + h(sid) + '</td><td>' + h(std ? std.name : '') + '</td><td>' + h(std ? std.dept : '') + '</td><td>' + total + '</td><td>' + done + '/' + total + '</td><td>' + (d.lastCheckDate ? h(new Date(d.lastCheckDate).toLocaleDateString('zh-CN')) : '—') + '</td><td>' + h((d.notes||'').substring(0,60)) + '</td></tr>';
    });
    r += '</tbody></table>';
  } else { r += '<p class=na>暂无自查记录</p>'; }
  r += '</div>';

  // 3. 内部审计
  r += '<h2>三、内部审计</h2><div class=section>';
  if (audits.length > 0) {
    audits.forEach(function(a) {
      r += '<h3>' + h(a.title || '审计活动') + '</h3>';
      r += '<p style=font-size:11px;color:#64748b>类型: ' + h(a.type||'—') + ' | 负责人: ' + h(a.lead||'—') + ' | 状态: ' + h(a.status||'—') + '</p>';
      if (a.issues && a.issues.length) {
        r += '<table><thead><tr><th>问题</th><th>部门</th><th>期限</th><th>状态</th><th>改善措施</th></tr></thead><tbody>';
        a.issues.forEach(function(iss) { r += '<tr><td>' + h(iss.desc||'') + '</td><td>' + h(iss.dept||'') + '</td><td>' + h(iss.deadline||'') + '</td><td>' + h(iss.status||'') + '</td><td>' + h((iss.action||'').substring(0,60)) + '</td></tr>'; });
        r += '</tbody></table>';
      } else { r += '<p class=na>无问题记录</p>'; }
    });
    if (fileGroups.audit.length) {
      r += '<p style=font-size:11px;color:#059669;margin-top:6px><b>📎 审计报告附件：</b>';
      fileGroups.audit.forEach(function(f) { r += h(f.name) + ' '; });
      r += '</p>';
    }
  } else { r += '<p class=na>无审计记录</p>'; }
  r += '</div>';

  // 4. 企业合规自评
  r += '<h2>四、企业合规自评</h2><div class=section>';
  if (hist.length > 0) {
    r += '<table><thead><tr><th>日期</th><th>评估人</th><th>得分</th><th>结果</th></tr></thead><tbody>';
    hist.forEach(function(hh) {
      var sc = hh.score !== undefined ? hh.score : '—';
      r += '<tr><td>' + h((hh.submittedAt||'').substring(0,10)) + '</td><td>' + h(hh.officer||'') + '</td><td>' + sc + '</td><td>' + (sc >= 60 ? '<span class=ok>通过</span>' : '<span class=err>未通过</span>') + '</td></tr>';
    });
    r += '</tbody></table>';
  } else { r += '<p class=na>无自评记录</p>'; }
  r += '</div>';

  // 5. 任务管理
  r += '<h2>五、任务管理</h2><div class=section>';
  if (yearTasks.length > 0) {
    var doneTasks = yearTasks.filter(function(t) { return t.status === '已完成'; }).length;
    r += '<p style=font-size:11px;color:#64748b>总数: ' + yearTasks.length + ' | 已完成: ' + doneTasks + '</p>';
    r += '<table><thead><tr><th>ID</th><th>名称</th><th>部门</th><th>负责人</th><th>截止日</th><th>状态</th></tr></thead><tbody>';
    yearTasks.forEach(function(t) { r += '<tr><td>' + h(t.id||'') + '</td><td>' + h(t.name||'') + '</td><td>' + h(t.dept||'') + '</td><td>' + h(t.owner||'') + '</td><td>' + h((t.due||'').substring(0,10)) + '</td><td>' + h(t.status||'') + '</td></tr>'; });
    r += '</tbody></table>';
  } else { r += '<p class=na>无任务记录</p>'; }
  r += '</div>';

  // 6. 供应商资质评估查询
  r += '<h2>六、供应商资质评估查询</h2><div class=section>';
  var hasQuery = false;
  suppliers.forEach(function(s) {
    if (!s.queries) return;
    var yearQs = s.queries.filter(function(q) { return q.date && q.date.indexOf(year) === 0; });
    if (!yearQs.length) return;
    hasQuery = true;
    yearQs.forEach(function(q) { r += '<p style=font-size:11px;margin:4px 0><b>' + h(s.name) + '</b> | ' + h(q.date) + ' | ' + h(q.level||'—') + '</p>'; });
  });
  if (!hasQuery) r += '<p class=na>无查询记录</p>';
  r += '</div>';

  // 7. 培训笔记
  r += '<h2>七、标准宣贯培训笔记</h2><div class=section>';
  var hasTn = false;
  Object.keys(tn).forEach(function(sid) {
    var n = tn[sid];
    if (n.notes || (n.commonIssues && n.commonIssues.length)) {
      hasTn = true;
      r += '<h3>' + h(sid) + '</h3>';
      if (n.notes) r += '<p style=font-size:11px;background:#f0fdf4;padding:6px 10px;border-radius:4px;margin:4px 0>' + h(n.notes) + '</p>';
      if (n.commonIssues && n.commonIssues.length) {
        n.commonIssues.forEach(function(iss) { r += '<span style="display:inline-block;background:#fef2f2;color:#991b1b;padding:1px 8px;border-radius:4px;margin:2px;font-size:10px">⚠ ' + h(iss) + '</span> '; });
      }
    }
  });
  if (!hasTn) r += '<p class=na>无培训笔记</p>';
  r += '</div>';

  r += '<div style=margin-top:30px;padding-top:15px;border-top:2px solid #1e3a5f;text-align:center;color:#94a3b8;font-size:11px>';
  r += 'AEO海关认证管理系统 · ' + year + '年度归档报告 · 生成于 ' + dateStr + '</div></body></html>';

  archives[year] = {
    year: year, archivedAt: new Date().toISOString(), archivedBy: user, reportHtml: r,
    summary: {
      hasFinance: Object.keys(yearFd).length > 0, hasSelfCheck: stdKeys.length > 0,
      hasAudit: audits.length > 0, hasAssessment: hist.length > 0, hasTasks: yearTasks.length > 0,
      fileCount: allFileCount
    }
  };
  saveData('annualArchives', archives);
  addAuditLog('生成年度归档', 'data', year + '年归档报告已生成（含' + allFileCount + '份文件）');
  showToast(year + '年归档报告已生成，含 ' + allFileCount + ' 份文件资料', 'success');
  renderArchiveDashboard();
  renderArchiveHistory();
}

function renderArchiveHistory() {
  var container = document.getElementById('archiveHistoryList');
  if (!container) return;
  var archives = loadData('annualArchives', {});
  var years = Object.keys(archives).sort();
  if (years.length === 0) {
    container.innerHTML = '<div class="text-center py-8 text-slate-400"><i class="fas fa-inbox text-3xl mb-2"></i><p>暂无归档记录</p></div>';
    return;
  }
  container.innerHTML = years.reverse().map(function(y) {
    var a = archives[y];
    var time = new Date(a.archivedAt).toLocaleString('zh-CN');
    var s = a.summary || {};
    var items = [];
    if (s.hasFinance) items.push('财务');
    if (s.hasSelfCheck) items.push('自查');
    if (s.hasAudit) items.push('审计');
    if (s.hasAssessment) items.push('自评');
    if (s.hasTasks) items.push('任务');
    var contentLabel = items.length > 0 ? items.join(' · ') : '基础信息';
    return '<div class="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all">' +
      '<div class="flex items-center space-x-3">' +
      '<div class="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0"><i class="fas fa-archive text-amber-500 text-sm"></i></div>' +
      '<div><p class="text-sm font-medium text-slate-800">' + y + '年度归档报告</p>' +
      '<p class="text-xs text-slate-500">归档人: ' + (a.archivedBy || '—') + ' · ' + time + ' · 包含: ' + contentLabel + '</p></div></div>' +
      '<div class="flex items-center space-x-2">' +
      '<button onclick="viewArchive(\'' + y + '\')" class="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-xs hover:bg-blue-100"><i class="fas fa-eye mr-0.5"></i>查看</button>' +
      '<button onclick="deleteArchive(\'' + y + '\')" class="px-3 py-1.5 text-slate-400 hover:text-red-500 border border-transparent hover:border-red-200 rounded text-xs"><i class="fas fa-trash-alt"></i></button></div></div>';
  }).join('');
}

function viewArchive(year) {
  var archives = loadData('annualArchives', {});
  var a = archives[year];
  if (!a || !a.reportHtml) { showToast('归档报告不可用', 'error'); return; }
  var win = window.open('', '_blank');
  if (win) {
    win.document.write(a.reportHtml);
    win.document.close();
  } else {
    showToast('请允许弹出窗口以查看报告', 'warning');
  }
}

function deleteArchive(year) {
  if (!confirm('确定删除 ' + year + ' 年的归档记录吗？')) return;
  var archives = loadData('annualArchives', {});
  delete archives[year];
  saveData('annualArchives', archives);
  showToast(year + '年归档已删除', 'warning');
  renderArchiveHistory();
  renderArchiveDashboard();
}

// ------------------------------------------------------------------------
// 17. 新功能模块（用户管理 / 审批 / 整改 / 系统设置）
// ------------------------------------------------------------------------
function renderUserManagement() {
  fetch(API_BASE + '/api/users', { headers: getAuthHeaders() })
    .then(function(r) { return r.json(); })
    .then(function(users) {
      var tbody = document.getElementById('userTableBody');
      tbody.innerHTML = users.map(function(u) {
        var roleLabels = { customs_officer: '关务经理', dept_lead: '部门AEO对接人', auditor: '内审员', executive: '企业高管', customs_viewer: '海关查看者' };
        var roleName = roleLabels[u.role] || u.role;
        var statusHtml = u.isActive ? '<span class="text-emerald-600"><i class="fas fa-circle text-xs mr-1"></i>启用</span>' : '<span class="text-red-600"><i class="fas fa-circle text-xs mr-1"></i>禁用</span>';
        var loginTime = u.lastLogin ? new Date(u.lastLogin).toLocaleString('zh-CN') : '从未登录';
        var isSelf = currentUser && currentUser.id === u.id;
        return '<tr class="border-b border-slate-100 hover:bg-slate-50"><td class="px-4 py-3 font-medium text-slate-800">' + safeEs(u.username) + '</td><td class="px-4 py-3">' + safeEs(u.displayName) + '</td><td class="px-4 py-3"><span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">' + safeEs(roleName) + '</span></td><td class="px-4 py-3 text-slate-600">' + safeEs(u.department || '-') + '</td><td class="px-4 py-3">' + statusHtml + '</td><td class="px-4 py-3 text-xs text-slate-500">' + loginTime + '</td><td class="px-4 py-3">' + (isSelf ? '<span class="text-xs text-slate-400">当前用户</span>' : '<button onclick="promptResetPassword(' + u.id + ',\'' + u.username + '\')" class="text-blue-600 hover:text-blue-800 text-xs mr-2">重置密码</button><button onclick="deleteUser(' + u.id + ')" class="text-red-600 hover:text-red-800 text-xs">删除</button>') + '</td></tr>';
      }).join('');
      // Fill role select
      var roleSel = document.getElementById('ufRole');
      if (roleSel) {
        roleSel.innerHTML = '<option value="customs_officer">关务经理</option><option value="dept_lead">部门AEO对接人</option><option value="auditor">内审员</option><option value="executive">企业高管</option><option value="customs_viewer">海关查看者</option>';
      }
    })
    .catch(function() {
      document.getElementById('userTableBody').innerHTML = '<tr><td colspan="7" class="text-center py-8 text-slate-400">无法连接服务器</td></tr>';
    });
}

var editingUserId = null;
function showCreateUserModal() {
  editingUserId = null;
  document.getElementById('userFormTitle').textContent = '新建用户';
  ['ufUsername','ufDisplayName','ufPassword','ufDept'].forEach(function(id) { document.getElementById(id).value = ''; });
  document.getElementById('ufPassword').required = true;
  document.getElementById('ufPassword').placeholder = '新建用户时必填';
  document.getElementById('userFormModal').classList.add('active');
}
function saveUserForm() {
  var username = document.getElementById('ufUsername').value.trim();
  var displayName = document.getElementById('ufDisplayName').value.trim();
  var password = document.getElementById('ufPassword').value;
  var role = document.getElementById('ufRole').value;
  var dept = document.getElementById('ufDept').value.trim();
  if (!username) { showToast('请输入用户名', 'error'); return; }
  if (!password && !editingUserId) { showToast('请输入密码', 'error'); return; }
  fetch(API_BASE + '/api/users', {
    method: 'POST', headers: getAuthHeaders(),
    body: JSON.stringify({ username: username, password: password, displayName: displayName || username, role: role, department: dept })
  }).then(function(r) {
    if (!r.ok) return r.json().then(function(d) { throw new Error(d.error); });
    closeModal('userFormModal');
    showToast('用户创建成功', 'success');
    renderUserManagement();
  }).catch(function(e) { showToast('创建失败: ' + e.message, 'error'); });
}
function promptResetPassword(id, username) {
  var newPw = prompt('请输入用户 "' + username + '" 的新密码（至少6位）:');
  if (!newPw || newPw.length < 6) { showToast('密码至少6位', 'error'); return; }
  fetch(API_BASE + '/api/users/' + id + '/password', {
    method: 'PUT', headers: getAuthHeaders(),
    body: JSON.stringify({ newPassword: newPw })
  }).then(function(r) {
    if (r.ok) { showToast('密码已重置', 'success'); } else { showToast('重置失败', 'error'); }
  }).catch(function() { showToast('服务器错误', 'error'); });
}
function deleteUser(id) {
  if (!confirm('确定要删除此用户吗？')) return;
  showToast('用户管理需要修改 server.js 以支持删除，当前请使用数据库管理工具', 'warning');
}

// ── 审批中心 ──────────────────────────────────────
var approvalFilter = 'pending';
function renderApprovals() {
  fetch(API_BASE + '/api/approvals?status=' + approvalFilter, { headers: getAuthHeaders() })
    .then(function(r) { return r.json(); })
    .then(function(approvals) {
      var tbody = document.getElementById('approvalTableBody');
      if (!approvals || approvals.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-slate-400">暂无审批记录</td></tr>';
        document.getElementById('pendingApprovalBadge').textContent = '待审批: 0';
        return;
      }
      var pending = approvals.filter(function(a) { return a.status === 'pending'; }).length;
      document.getElementById('pendingApprovalBadge').textContent = '待审批: ' + pending;
      tbody.innerHTML = approvals.map(function(a) {
        var statusLabels = { pending: '<span class="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">待审批</span>', approved: '<span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs">已通过</span>', rejected: '<span class="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">已驳回</span>' };
        var statusHtml = statusLabels[a.status] || a.status;
        var actionsHtml = '';
        if (a.status === 'pending') {
          actionsHtml = '<button onclick="approveApproval(' + a.id + ')" class="px-2 py-1 bg-emerald-500 text-white rounded text-xs mr-1"><i class="fas fa-check"></i></button><button onclick="rejectApproval(' + a.id + ')" class="px-2 py-1 bg-red-500 text-white rounded text-xs"><i class="fas fa-times"></i></button>';
        }
        return '<tr class="border-b border-slate-100 hover:bg-slate-50"><td class="px-4 py-3 text-slate-800 text-xs">' + safeEs(a.ref_type || '') + '</td><td class="px-4 py-3 text-slate-800">' + safeEs(a.ref_desc || '') + '</td><td class="px-4 py-3 text-slate-600 text-xs">' + safeEs(a.requester_name || '') + '</td><td class="px-4 py-3 text-xs text-slate-500">' + (a.created_at ? new Date(a.created_at).toLocaleString('zh-CN') : '') + '</td><td class="px-4 py-3">' + statusHtml + '</td><td class="px-4 py-3">' + actionsHtml + '</td></tr>';
      }).join('');
    })
    .catch(function() {
      document.getElementById('approvalTableBody').innerHTML = '<tr><td colspan="6" class="text-center py-8 text-slate-400">无法连接服务器</td></tr>';
    });
}
function filterApprovals(status) {
  approvalFilter = status;
  document.querySelectorAll('.approval-filter').forEach(function(el) {
    el.className = 'px-3 py-1.5 rounded-lg text-sm ' + (el.textContent.includes(status === 'pending' ? '待审批' : status === 'approved' ? '已通过' : status === 'rejected' ? '已驳回' : '全部') ? (status === 'pending' && el.textContent.includes('待审批') ? 'bg-amber-100 text-amber-700 font-medium' : el.textContent.includes('待审批') ? 'text-slate-500 hover:bg-slate-100' : el.textContent.includes('已通过') && status === 'approved' ? 'bg-amber-100 text-amber-700 font-medium' : el.textContent.includes('已驳回') && status === 'rejected' ? 'bg-amber-100 text-amber-700 font-medium' : el.textContent.includes('全部') && status === 'all' ? 'bg-amber-100 text-amber-700 font-medium' : 'text-slate-500 hover:bg-slate-100') : 'text-slate-500 hover:bg-slate-100');
  });
  renderApprovals();
}
function approveApproval(id) {
  fetch(API_BASE + '/api/approvals/' + id + '/approve', { method: 'POST', headers: getAuthHeaders() })
    .then(function(r) {
      if (r.ok) { showToast('审批已通过', 'success'); renderApprovals(); }
      else { r.json().then(function(d) { showToast(d.error || '操作失败', 'error'); }); }
    }).catch(function() { showToast('操作失败', 'error'); });
}
function rejectApproval(id) {
  var comment = prompt('请输入驳回理由（可选）:') || '';
  fetch(API_BASE + '/api/approvals/' + id + '/reject', {
    method: 'POST', headers: getAuthHeaders(),
    body: JSON.stringify({ comment: comment })
  }).then(function(r) {
    if (r.ok) { showToast('已驳回', 'warning'); renderApprovals(); }
    else { showToast('操作失败', 'error'); }
  }).catch(function() { showToast('操作失败', 'error'); });
}

// ── 整改跟踪 ──────────────────────────────────────
function renderRectifications() {
  var statusFilter = document.getElementById('recStatusFilter').value;
  var url = API_BASE + '/api/rectifications?status=' + statusFilter;
  fetch(url, { headers: getAuthHeaders() })
    .then(function(r) { return r.json(); })
    .then(function(recs) {
      var tbody = document.getElementById('recTableBody');
      if (!recs || recs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-8 text-slate-400">暂无整改记录</td></tr>';
        document.getElementById('overdueRecBadge').textContent = '超期: 0';
        document.getElementById('openRecBadge').textContent = '进行中: 0';
        return;
      }
      var now = new Date().toISOString().slice(0, 10);
      var overdue = recs.filter(function(r) { return (r.status === 'open' || r.status === 'in_progress') && r.due_date && r.due_date < now; }).length;
      var open = recs.filter(function(r) { return r.status === 'open' || r.status === 'in_progress' || r.status === 'pending_accept'; }).length;
      document.getElementById('overdueRecBadge').textContent = '超期: ' + overdue;
      document.getElementById('openRecBadge').textContent = '进行中: ' + open;
      var severityLabels = { high: '<span class="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">高</span>', medium: '<span class="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">中</span>', low: '<span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">低</span>' };
      var statusLabels = {
        open: '<span class="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">待处理</span>',
        in_progress: '<span class="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">处理中</span>',
        pending_accept: '<span class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">待验收</span>',
        closed: '<span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs">已闭环</span>'
      };
      tbody.innerHTML = recs.map(function(rec) {
        var isOverdue = (rec.status === 'open' || rec.status === 'in_progress') && rec.due_date && rec.due_date < now;
        var acceptBadge = '';
        if (rec.is_closed || rec.status === 'closed') {
          acceptBadge = '<span class="text-xs text-emerald-600"><i class="fas fa-check-circle"></i> 已验收</span>';
        } else if (rec.accept_dept_customs || rec.accept_dept_audit) {
          var parts = [];
          if (rec.accept_dept_customs) parts.push('关务');
          if (rec.accept_dept_audit) parts.push('审计');
          acceptBadge = '<span class="text-xs text-slate-500">待' + parts.join('/') + '验收</span>';
        } else {
          acceptBadge = '<span class="text-xs text-slate-400">-</span>';
        }
        var actionsHtml = '';
        if (rec.status === 'open' || rec.status === 'in_progress') {
          actionsHtml += '<button onclick="updateRecStatus(' + rec.id + ',\'in_progress\')" class="text-xs text-amber-600 hover:underline mr-2">处理</button>';
        }
        if (rec.status === 'in_progress') {
          actionsHtml += '<button onclick="updateRecStatus(' + rec.id + ',\'resolved\')" class="text-xs text-blue-600 hover:underline mr-2">待验收</button>';
        }
        if (rec.status === 'pending_accept') {
          actionsHtml += '<button onclick="showRecAcceptModal(' + rec.id + ')" class="text-xs text-emerald-600 hover:underline mr-2">验收</button>';
        }
        if (rec.status !== 'closed') {
          actionsHtml += '<button onclick="updateRecStatus(' + rec.id + ',\'closed\')" class="text-xs text-slate-500 hover:underline">关闭</button>';
        }
        return '<tr class="border-b border-slate-100 hover:bg-slate-50' + (isOverdue ? ' bg-red-50' : '') + '">' +
          '<td class="px-4 py-3 text-slate-800">' + safeEs(rec.issue_desc) + (isOverdue ? ' <span class="text-red-500 text-xs font-bold"><i class="fas fa-exclamation-circle"></i> 超期</span>' : '') + '</td>' +
          '<td class="px-4 py-3 text-xs text-slate-500">' + safeEs(rec.initiator_dept || '-') + '</td>' +
          '<td class="px-4 py-3 text-slate-600">' + safeEs(rec.owner || rec.initiator_name || '-') + '</td>' +
          '<td class="px-4 py-3 text-xs text-slate-500">' + safeEs(rec.follow_dept || '-') + '</td>' +
          '<td class="px-4 py-3 text-xs text-slate-500">' + (rec.issue_date || '-') + '</td>' +
          '<td class="px-4 py-3">' + (statusLabels[rec.status] || rec.status) + '</td>' +
          '<td class="px-4 py-3">' + acceptBadge + '</td>' +
          '<td class="px-4 py-3">' + actionsHtml + '</td></tr>';
      }).join('');
      var statsEl = document.getElementById('recStats');
      var totalClosed = recs.filter(function(r) { return r.status === 'closed' || r.is_closed; }).length;
      statsEl.innerHTML = [
        '<div class="bg-white rounded-lg border border-slate-200 p-4 text-center"><p class="text-2xl font-bold text-slate-800">' + recs.length + '</p><p class="text-xs text-slate-500">整改总数</p></div>',
        '<div class="bg-white rounded-lg border border-slate-200 p-4 text-center"><p class="text-2xl font-bold text-amber-600">' + open + '</p><p class="text-xs text-slate-500">进行中</p></div>',
        '<div class="bg-white rounded-lg border border-slate-200 p-4 text-center"><p class="text-2xl font-bold text-emerald-600">' + totalClosed + '</p><p class="text-xs text-slate-500">已闭环</p></div>',
        overdue > 0 ? '<div class="bg-white rounded-lg border border-red-300 p-4 text-center bg-red-50"><p class="text-2xl font-bold text-red-600">' + overdue + '</p><p class="text-xs text-red-500 font-medium"><i class="fas fa-exclamation-circle"></i> 超期未处理</p></div>' : ''
      ].join('');
    })
    .catch(function() {
      document.getElementById('recTableBody').innerHTML = '<tr><td colspan="8" class="text-center py-8 text-slate-400">无法连接服务器</td></tr>';
    });
}
function updateRecStatus(id, status) {
  if (!status) return;
  fetch(API_BASE + '/api/rectifications/' + id, {
    method: 'PUT', headers: getAuthHeaders(),
    body: JSON.stringify({ status: status })
  }).then(function(r) {
    if (r.ok) { showToast('状态已更新', 'success'); renderRectifications(); }
    else { showToast('更新失败', 'error'); }
  });
}
function showCreateRectificationModal() {
  var today = new Date().toISOString().slice(0, 10);
  document.getElementById('recIssueDate').value = today;
  var deptSelect = document.getElementById('recInitDept');
  deptSelect.innerHTML = '<option value="">请选择</option>' + DEPARTMENTS.map(function(d) { return '<option value="' + d + '">' + d + '</option>'; }).join('');
  var followSelect = document.getElementById('recFollowDept');
  followSelect.innerHTML = '<option value="">请选择</option>' + DEPARTMENTS.map(function(d) { return '<option value="' + d + '">' + d + '</option>'; }).join('');
  document.getElementById('recInitiator').value = currentUser ? currentUser.displayName || currentUser.username : '';
  document.getElementById('recIssueDesc').value = '';
  document.getElementById('recOwner').value = '';
  document.getElementById('recDueDate').value = '';
  document.getElementById('recAcceptCustoms').checked = false;
  document.getElementById('recAcceptAudit').checked = false;
  document.getElementById('rectificationModal').classList.add('active');
}
function submitRectification() {
  var issueDesc = document.getElementById('recIssueDesc').value.trim();
  var initDept = document.getElementById('recInitDept').value;
  var initiator = document.getElementById('recInitiator').value.trim();
  if (!issueDesc) { showToast('请填写问题描述', 'error'); return; }
  if (!initDept) { showToast('请选择发起部门', 'error'); return; }
  if (!initiator) { showToast('请填写发起人', 'error'); return; }
  var body = {
    issue_desc: issueDesc,
    initiator_dept: initDept,
    initiator_name: initiator,
    issue_date: document.getElementById('recIssueDate').value,
    severity: document.getElementById('recSeverity').value,
    follow_dept: document.getElementById('recFollowDept').value,
    owner: document.getElementById('recOwner').value.trim(),
    due_date: document.getElementById('recDueDate').value,
    accept_dept_customs: document.getElementById('recAcceptCustoms').checked ? 1 : 0,
    accept_dept_audit: document.getElementById('recAcceptAudit').checked ? 1 : 0
  };
  fetch(API_BASE + '/api/rectifications', {
    method: 'POST', headers: getAuthHeaders(),
    body: JSON.stringify(body)
  }).then(function(r) {
    if (r.ok) { closeModal('rectificationModal'); showToast('整改项已创建', 'success'); renderRectifications(); }
    else { showToast('创建失败', 'error'); }
  }).catch(function() { showToast('服务器错误', 'error'); });
}
function showRecAcceptModal(id) {
  fetch(API_BASE + '/api/rectifications?status=', { headers: getAuthHeaders() })
    .then(function(r) { return r.json(); })
    .then(function(recs) {
      var rec = recs.find(function(r) { return r.id === id; });
      if (!rec) { showToast('整改项未找到', 'error'); return; }
      document.getElementById('recAcceptIssue').textContent = rec.issue_desc;
      document.getElementById('recAcceptInitiator').textContent = rec.initiator_name || '-';
      document.getElementById('recAcceptDept').textContent = rec.initiator_dept || '-';
      document.getElementById('recAcceptConfirmBy').value = currentUser ? currentUser.displayName || currentUser.username : '';
      document.getElementById('recAcceptCus').checked = !!rec.accept_dept_customs;
      document.getElementById('recAcceptAud').checked = !!rec.accept_dept_audit;
      document.getElementById('recAcceptComment').value = '';
      document.getElementById('rectificationAcceptModal').dataset.recId = id;
      document.getElementById('rectificationAcceptModal').classList.add('active');
    });
}
function submitRecApprove() {
  var id = document.getElementById('rectificationAcceptModal').dataset.recId;
  var confirmedBy = document.getElementById('recAcceptConfirmBy').value.trim();
  if (!confirmedBy) { showToast('请填写确认人', 'error'); return; }
  fetch(API_BASE + '/api/rectifications/' + id + '/approve', {
    method: 'PUT', headers: getAuthHeaders(),
    body: JSON.stringify({
      action: 'approve',
      confirmed_by: confirmedBy,
      accept_dept_customs: document.getElementById('recAcceptCus').checked ? 1 : 0,
      accept_dept_audit: document.getElementById('recAcceptAud').checked ? 1 : 0,
      comment: document.getElementById('recAcceptComment').value.trim()
    })
  }).then(function(r) {
    if (r.ok) { closeModal('rectificationAcceptModal'); showToast('验收已确认', 'success'); renderRectifications(); }
    else { showToast('验收失败', 'error'); }
  });
}
function submitRecReject() {
  var id = document.getElementById('rectificationAcceptModal').dataset.recId;
  if (!confirm('确定退回该整改项吗？将回到"处理中"状态。')) return;
  fetch(API_BASE + '/api/rectifications/' + id + '/approve', {
    method: 'PUT', headers: getAuthHeaders(),
    body: JSON.stringify({
      action: 'reject',
      comment: document.getElementById('recAcceptComment').value.trim()
    })
  }).then(function(r) {
    if (r.ok) { closeModal('rectificationAcceptModal'); showToast('已退回', 'warning'); renderRectifications(); }
    else { showToast('操作失败', 'error'); }
  });
}

// ── 系统设置 ──────────────────────────────────────
function renderSystemSettings() {
  fetch(API_BASE + '/api/health', { headers: getAuthHeaders() })
    .then(function(r) { return r.json(); })
    .then(function(h) {
      var healthCards = document.getElementById('sysHealthCards');
      var diskFreeGB = (h.diskFree / 1073741824).toFixed(1);
      var diskTotalGB = (h.diskTotal / 1073741824).toFixed(1);
      healthCards.innerHTML = [
        '<div class="bg-white rounded-lg border border-slate-200 p-4"><p class="text-xs text-slate-500 mb-1">系统状态</p><p class="text-lg font-bold ' + (h.status === 'ok' ? 'text-emerald-600' : 'text-red-600') + '"><i class="fas fa-circle text-xs mr-2"></i>' + (h.status === 'ok' ? '正常运行' : '异常') + '</p><p class="text-xs text-slate-400 mt-1">运行时长: ' + Math.floor(h.uptime / 3600) + '小时</p></div>',
        '<div class="bg-white rounded-lg border border-slate-200 p-4"><p class="text-xs text-slate-500 mb-1">在线用户</p><p class="text-lg font-bold text-blue-600">' + h.onlineUsers + '</p><p class="text-xs text-slate-400 mt-1">注册用户: ' + h.totalUsers + '</p></div>',
        '<div class="bg-white rounded-lg border border-slate-200 p-4"><p class="text-xs text-slate-500 mb-1">数据文件</p><p class="text-lg font-bold text-violet-600">' + (h.dataFiles || 0) + '</p><p class="text-xs text-slate-400 mt-1">上传文件: ' + (h.uploadFiles || 0) + '</p></div>',
        '<div class="bg-white rounded-lg border border-slate-200 p-4"><p class="text-xs text-slate-500 mb-1">磁盘使用</p><p class="text-lg font-bold ' + (h.diskUsagePercent > 85 ? 'text-red-600' : 'text-slate-800') + '">' + h.diskUsagePercent + '%</p><p class="text-xs text-slate-400 mt-1">空闲 ' + diskFreeGB + 'GB / ' + diskTotalGB + 'GB</p></div>'
      ].join('');

      var secInfo = document.getElementById('sysSecurityInfo');
      secInfo.innerHTML = '<div class="flex justify-between py-2 border-b border-slate-100"><span>认证方式</span><span class="text-emerald-600 font-medium">Session Token + Basic Auth + API Key</span></div><div class="flex justify-between py-2 border-b border-slate-100"><span>密码加密</span><span class="text-emerald-600 font-medium">bcrypt + salt rounds=10</span></div><div class="flex justify-between py-2 border-b border-slate-100"><span>权限控制</span><span class="text-emerald-600 font-medium">RBAC（' + h.totalUsers + ' 用户）</span></div><div class="flex justify-between py-2 border-b border-slate-100"><span>数据存储</span><span class="text-emerald-600 font-medium">SQLite + WAL 模式</span></div><div class="flex justify-between py-2"><span>版本更新</span><span class="text-emerald-600 font-medium">v2.0</span></div>';
    })
    .catch(function() {
      document.getElementById('sysHealthCards').innerHTML = '<div class="col-span-4 text-center py-8 text-slate-400 bg-white rounded-lg border">无法获取系统状态</div>';
    });

  // Load recent activity
  fetch(API_BASE + '/api/activity', { headers: getAuthHeaders() })
    .then(function(r) { return r.json(); })
    .then(function(logs) {
      var el = document.getElementById('sysRecentActivity');
      if (!logs || logs.length === 0) {
        el.innerHTML = '<p class="text-slate-400 text-sm text-center py-4">暂无活动记录</p>';
        return;
      }
      el.innerHTML = logs.slice(0, 20).map(function(log) {
        return '<div class="flex items-start space-x-2 text-sm py-1.5 border-b border-slate-100 last:border-0"><span class="text-xs text-slate-400 whitespace-nowrap w-20">' + (log.created_at ? new Date(log.created_at).toLocaleTimeString('zh-CN') : '') + '</span><span class="text-slate-600 flex-1">' + safeEs(log.username || '') + ' ' + safeEs(log.action || '') + '</span><span class="text-xs text-slate-400">' + safeEs(log.module || '') + '</span></div>';
      }).join('');
    })
    .catch(function() {});

  // 加载飞书配置
  setTimeout(function() {
    if (document.getElementById('feishuAppId')) loadFeishuConfig();
  }, 100);
}

function manualBackup() {
  fetch(API_BASE + '/api/backup', { method: 'POST', headers: getAuthHeaders() })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.ok) { showToast('备份成功: ' + (d.backupFile || ''), 'success'); }
      else { showToast('备份失败', 'error'); }
    })
    .catch(function() { showToast('备份失败: 服务器错误', 'error'); });
}

function showDataVersions() {
  var modal = document.getElementById('sysVersionModal');
  if (!modal) {
    // Create modal on first use
    var div = document.createElement('div');
    div.id = 'sysVersionModal';
    div.className = 'modal-overlay';
    div.innerHTML = '<div class="modal-content" style="max-width:700px"><div class="modal-header"><h3 class="text-lg font-bold text-slate-800"><i class="fas fa-history mr-2 text-violet-600"></i>数据版本历史</h3><button onclick="closeModal(\'sysVersionModal\')" class="text-slate-400 hover:text-slate-600"><i class="fas fa-times"></i></button></div><div class="p-6 space-y-4"><div><label class="block text-sm font-medium text-slate-700 mb-1.5">选择数据键</label><select id="sysVersionKey" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" onchange="loadVersionHistory()"><option value="">请选择...</option><option value="tasks">任务管理 (tasks)</option><option value="companyInfo">企业信息 (companyInfo)</option><option value="financeData">财务数据 (financeData)</option><option value="assessmentAnswers">企业合规自评答案 (assessmentAnswers)</option><option value="assessmentResults">评估结果 (assessmentResults)</option><option value="internalAudits">内部审计 (internalAudits)</option><option value="suppliers">供应商 (suppliers)</option><option value="standardChecks">认证自查 (standardChecks)</option><option value="customLaws">自定义法规 (customLaws)</option></select></div><div id="sysVersionList" class="max-h-80 overflow-y-auto space-y-2"><p class="text-sm text-slate-400 text-center py-8">请选择数据键查看版本历史</p></div></div><div class="modal-footer"><button onclick="closeModal(\'sysVersionModal\')" class="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">关闭</button></div></div>';
    document.body.appendChild(div);
  }
  document.getElementById('sysVersionKey').value = '';
  document.getElementById('sysVersionList').innerHTML = '<p class="text-sm text-slate-400 text-center py-8">请选择数据键查看版本历史</p>';
  modal.classList.add('active');
}

function loadVersionHistory() {
  var key = document.getElementById('sysVersionKey').value;
  var list = document.getElementById('sysVersionList');
  if (!key) { list.innerHTML = '<p class="text-sm text-slate-400 text-center py-8">请选择数据键查看版本历史</p>'; return; }
  list.innerHTML = '<p class="text-sm text-slate-400 text-center py-8"><i class="fas fa-spinner fa-spin mr-2"></i>加载中...</p>';
  fetch(API_BASE + '/api/versions/' + key, { headers: getAuthHeaders() })
    .then(function(r) { return r.json(); })
    .then(function(versions) {
      if (!versions || versions.length === 0) {
        list.innerHTML = '<p class="text-sm text-slate-400 text-center py-8">该数据无版本历史</p>';
        return;
      }
      list.innerHTML = '<div class="flex justify-between items-center mb-3"><span class="text-sm text-slate-500">共 ' + versions.length + ' 个版本</span></div>' +
        versions.map(function(v) {
          return '<div class="p-3 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"><div class="flex justify-between items-start"><div><span class="text-sm font-medium text-slate-700">v' + v.id + '</span><span class="text-xs text-slate-400 ml-2">' + safeEs(v.username || 'system') + '</span></div><div class="flex items-center space-x-2"><span class="text-xs text-slate-400">' + (v.created_at ? new Date(v.created_at).toLocaleString('zh-CN') : '') + '</span><button onclick="restoreVersion(' + v.id + ')" class="text-xs text-blue-600 hover:underline px-2 py-0.5 border border-blue-200 rounded hover:bg-blue-50">恢复</button></div></div><p class="text-xs text-slate-500 mt-1">' + safeEs(v.action || '') + (v.description ? ': ' + safeEs(v.description) : '') + '</p></div>';
        }).join('');
    })
    .catch(function() { list.innerHTML = '<p class="text-sm text-red-500 text-center py-8">查询失败</p>'; });
}

function restoreVersion(id) {
  if (!confirm('确定要恢复版本 v' + id + ' 吗？当前数据将被覆盖。')) return;
  fetch(API_BASE + '/api/versions/' + id + '/restore', {
    method: 'POST', headers: getAuthHeaders()
  }).then(function(r) { return r.json(); })
    .then(function(result) {
      if (result.ok) {
        showToast('版本 v' + id + ' 已恢复', 'success');
        loadVersionHistory();
      } else {
        showToast('恢复失败', 'error');
      }
    })
    .catch(function() { showToast('恢复失败: 服务器错误', 'error'); });
}

// ------------------------------------------------------------------------
// 16. 初始化
// ------------------------------------------------------------------------
function initApp() {
    try {
        checkOverdueTasks();
        renderSidebar();
        navigateTo('dashboard');
        loadStandards();
        loadAssessment();
        renderTaskTable();
        renderTaskKanban();
        renderTaskProjectView();
        renderDocFiles();
        renderTrainingFiles();
        renderTrainingRecords();
        loadCompanyInfo();

        const filterDept = document.getElementById('taskFilterDept');
        DEPARTMENTS.forEach(d => { filterDept.innerHTML += '<option value="' + d + '">' + d + '</option>'; });

        let tasks = loadData('tasks', []);
        if (tasks.length === 0) {
            saveData('tasks', [
                { id: 'TSK-2026-0001', name: '第一季度场所安全检查', standard: 'TS-01', dept: '行政部', owner: '赵工', due: '2026-07-05', req: '', attachReq: '', status: '执行中', evidence: [], createdAt: '2026-06-01T00:00:00.000Z' },
                { id: 'TSK-2026-0002', name: '单证复核月度检查', standard: 'IC-03', dept: '关务部', owner: '钱芳', due: '2026-07-10', req: '', attachReq: '', status: '待下发', evidence: [], createdAt: '2026-06-01T00:00:00.000Z' },
                { id: 'TSK-2026-0003', name: '进入安全检查（门禁/访客）', standard: 'TS-02', dept: '行政部', owner: '孙安', due: '2026-06-28', req: '', attachReq: '', status: '审核中', evidence: [], createdAt: '2026-05-28T00:00:00.000Z' },
                { id: 'TSK-2026-0004', name: '商业伙伴安全年度评估', standard: 'TS-04', dept: '采购部', owner: '李采', due: '2026-08-15', req: '', attachReq: '', status: '待下发', evidence: [], createdAt: '2026-06-01T00:00:00.000Z' },
                { id: 'TSK-2026-0005', name: '贸易安全培训', standard: 'TS-09', dept: 'HR', owner: '周信', due: '2026-07-20', req: '', attachReq: '', status: '待下发', evidence: [], createdAt: '2026-06-01T00:00:00.000Z' },
                { id: 'TSK-2026-0006', name: '财务指标数据更新', standard: 'FI-01', dept: '财务部', owner: '吴财', due: '2026-06-15', req: '', attachReq: '', status: '执行中', evidence: [], createdAt: '2026-05-20T00:00:00.000Z' },
                { id: 'TSK-2026-0007', name: '关键人员背调复核', standard: 'TS-03', dept: 'HR', owner: '郑人', due: '2026-06-30', req: '', attachReq: '', status: '已完成', evidence: [], createdAt: '2026-05-01T00:00:00.000Z' }
            ]);
        }

        // 首次使用引导弹窗
        const companyInfo = loadData('companyInfo', {});
        const guide = document.getElementById('firstTimeGuide');
        if (guide && (!companyInfo.name || companyInfo.name === '上海XX进出口有限公司')) {
            guide.classList.remove('hidden');
        }

        const savedUser = loadData('currentUser', null);
        if (savedUser && savedUser.role) { document.getElementById('loginRole').value = savedUser.role; document.getElementById('loginName').value = savedUser.name; }

        renderTradeBI();
        updateDashboard();
        checkOverdueTasks();
        startAutoSync();
    } catch(e) {
        console.error('initApp error:', e);
    }
}

// ── 定时自动同步 ──────────────────────────────────────
function startAutoSync() {
    // 每 5 分钟从服务器拉取数据
    setInterval(function() {
        if (authToken) {
            initFromServer().then(function() {
                updateSyncIndicator();
            }).catch(function() { /* silent */ });
        }
    }, 5 * 60 * 1000);
    // 每 10 秒更新同步状态指示器
    setInterval(updateSyncIndicator, 10000);
}

// ── 飞书配置 ──────────────────────────────────────
function saveFeishuConfig() {
  var cfg = {
    appId: document.getElementById('feishuAppId').value.trim(),
    appSecret: document.getElementById('feishuAppSecret').value.trim(),
    chatId: document.getElementById('feishuChatId').value.trim(),
    notifyEnabled: document.getElementById('feishuNotifyEnabled').checked,
    notifyEvents: []
  };
  document.querySelectorAll('.feishu-event:checked').forEach(function(el) {
    cfg.notifyEvents.push(el.getAttribute('data-event'));
  });
  fetch(API_BASE + '/api/settings/feishu', {
    method: 'POST', headers: getAuthHeaders(),
    body: JSON.stringify({ config: cfg })
  }).then(function(r) { return r.json(); })
  .then(function(d) {
    if (d.ok) { showToast('飞书配置已保存', 'success'); }
    else { showToast('保存失败', 'error'); }
  }).catch(function() { showToast('保存失败: 服务器错误', 'error'); });
}

function testFeishuConnection() {
  var cfg = {
    appId: document.getElementById('feishuAppId').value.trim(),
    appSecret: document.getElementById('feishuAppSecret').value.trim()
  };
  var resultEl = document.getElementById('feishuTestResult');
  resultEl.innerHTML = '<span class="text-blue-600"><i class="fas fa-spinner fa-spin mr-1"></i>测试中...</span>';
  fetch(API_BASE + '/api/settings/feishu/test', {
    method: 'POST', headers: getAuthHeaders(),
    body: JSON.stringify({ config: cfg })
  }).then(function(r) { return r.json(); })
  .then(function(d) {
    if (d.ok) {
      resultEl.innerHTML = '<span class="text-emerald-600"><i class="fas fa-check-circle mr-1"></i>' + (d.message || '连接成功') + '</span>';
    } else {
      resultEl.innerHTML = '<span class="text-red-600"><i class="fas fa-times-circle mr-1"></i>' + (d.message || '连接失败') + '</span>';
    }
  }).catch(function() {
    resultEl.innerHTML = '<span class="text-red-600"><i class="fas fa-times-circle mr-1"></i>测试请求失败</span>';
  });
}

function loadFeishuConfig() {
  var appIdEl = document.getElementById('feishuAppId');
  var appSecretEl = document.getElementById('feishuAppSecret');
  var chatIdEl = document.getElementById('feishuChatId');
  var notifyEnabledEl = document.getElementById('feishuNotifyEnabled');
  if (!appIdEl) return;
  fetch(API_BASE + '/api/settings/feishu', { headers: getAuthHeaders() })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.ok && d.config) {
        appIdEl.value = d.config.appId || '';
        appSecretEl.value = d.config.appSecret || '';
        chatIdEl.value = d.config.chatId || '';
        if (notifyEnabledEl) notifyEnabledEl.checked = !!d.config.notifyEnabled;
        if (d.config.notifyEvents) {
          document.querySelectorAll('.feishu-event').forEach(function(el) {
            el.checked = d.config.notifyEvents.indexOf(el.getAttribute('data-event')) >= 0;
          });
        }
      }
    })
    .catch(function() {});
}

(function() { initFromServer().then(() => { const s = loadData('currentUser', null); if (s && s.role) doLogin(); }); })();

// ── 进出口业务活动 ──
var IE_SAMPLE_DATA = [
    {id:'IE2026001', direction:'出口', declNo:'223320250400000001', contractNo:'EXP2025-001', tradeMode:'一般贸易', declDate:'2025-04-01', goodsName:'集成电路', amount:156800, currency:'USD', remarks:'对美出口'},
    {id:'IE2026002', direction:'出口', declNo:'223320250400000002', contractNo:'EXP2025-002', tradeMode:'一般贸易', declDate:'2025-04-03', goodsName:'电子元器件', amount:89200, currency:'USD', remarks:'对日出口'},
    {id:'IE2026003', direction:'进口', declNo:'223320250400000003', contractNo:'IMP2025-001', tradeMode:'一般贸易', declDate:'2025-04-05', goodsName:'精密仪器', amount:420000, currency:'EUR', remarks:'德国进口'},
    {id:'IE2026004', direction:'进口', declNo:'223320250400000004', contractNo:'IMP2025-002', tradeMode:'进料加工', declDate:'2025-04-08', goodsName:'化工原料A', amount:280000, currency:'USD', remarks:'韩国进口'},
    {id:'IE2026005', direction:'出口', declNo:'223320250400000005', contractNo:'EXP2025-003', tradeMode:'一般贸易', declDate:'2025-04-10', goodsName:'消费电子产品', amount:325000, currency:'USD', remarks:'东南亚出口'},
    {id:'IE2026006', direction:'进口', declNo:'223320250400000006', contractNo:'IMP2025-003', tradeMode:'一般贸易', declDate:'2025-04-12', goodsName:'机械设备', amount:680000, currency:'EUR', remarks:'意大利进口'},
    {id:'IE2026007', direction:'出口', declNo:'223320250400000007', contractNo:'EXP2025-004', tradeMode:'来料加工', declDate:'2025-04-15', goodsName:'服装辅料', amount:45000, currency:'USD', remarks:'来料加工复出口'},
    {id:'IE2026008', direction:'进口', declNo:'223320250400000008', contractNo:'IMP2025-004', tradeMode:'保税物流', declDate:'2025-04-18', goodsName:'存储芯片', amount:195000, currency:'USD', remarks:'保税区仓储转口'},
    {id:'IE2026009', direction:'出口', declNo:'223320250400000009', contractNo:'EXP2025-005', tradeMode:'一般贸易', declDate:'2025-04-20', goodsName:'通讯设备', amount:510000, currency:'USD', remarks:'欧洲出口'},
    {id:'IE2026010', direction:'进口', declNo:'223320250400000010', contractNo:'IMP2025-005', tradeMode:'一般贸易', declDate:'2025-04-22', goodsName:'光学镜头', amount:128000, currency:'USD', remarks:'日本进口'},
    {id:'IE2026011', direction:'出口', declNo:'223320250400000011', contractNo:'EXP2025-006', tradeMode:'一般贸易', declDate:'2025-04-25', goodsName:'汽车配件', amount:234000, currency:'USD', remarks:'中东出口'},
    {id:'IE2026012', direction:'进口', declNo:'223320250400000012', contractNo:'IMP2025-006', tradeMode:'一般贸易', declDate:'2025-04-28', goodsName:'实验室设备', amount:375000, currency:'EUR', remarks:'瑞士进口'},
    {id:'IE2026013', direction:'出口', declNo:'223320250400000013', contractNo:'EXP2025-007', tradeMode:'一般贸易', declDate:'2025-05-02', goodsName:'医疗器械', amount:168000, currency:'USD', remarks:'东南亚出口'},
    {id:'IE2026014', direction:'进口', declNo:'223320250400000014', contractNo:'IMP2025-007', tradeMode:'进料加工', declDate:'2025-05-05', goodsName:'金属原材料', amount:95000, currency:'USD', remarks:'澳大利亚进口'},
    {id:'IE2026015', direction:'出口', declNo:'223320250400000015', contractNo:'EXP2025-008', tradeMode:'一般贸易', declDate:'2025-05-08', goodsName:'纺织品', amount:78000, currency:'USD', remarks:'非洲出口'},
];
var _iePage = 1;
var _iePageSize = 10;
var _ieFilteredData = [];
function loadIeActivities() {
    var stored = loadData('ieActivities', null);
    if (!stored || stored.length === 0) { saveData('ieActivities', IE_SAMPLE_DATA); return JSON.parse(JSON.stringify(IE_SAMPLE_DATA)); }
    return stored;
}
function renderIeActivities() {
    var all = loadIeActivities();
    if (!_ieFilteredData || _ieFilteredData.length === 0) _ieFilteredData = all;
    var search = (document.getElementById('ieSearchInput') || {}).value || '';
    var tradeMode = (document.getElementById('ieTradeModeFilter') || {}).value || '';
    var direction = (document.getElementById('ieDirectionFilter') || {}).value || '';
    _ieFilteredData = all.filter(function(r) {
        if (search && r.declNo.indexOf(search) === -1 && r.contractNo.indexOf(search) === -1) return false;
        if (tradeMode && r.tradeMode !== tradeMode) return false;
        if (direction && r.direction !== direction) return false;
        return true;
    });
    document.getElementById('ieTotalCount').textContent = _ieFilteredData.length;
    var total = _ieFilteredData.length;
    var totalPages = Math.max(1, Math.ceil(total / _iePageSize));
    if (_iePage > totalPages) _iePage = totalPages;
    var start = (_iePage - 1) * _iePageSize;
    var end = Math.min(start + _iePageSize, total);
    var pageData = _ieFilteredData.slice(start, end);
    var body = document.getElementById('ieActivityBody');
    var empty = document.getElementById('ieActivityEmpty');
    if (!pageData.length) { body.innerHTML = ''; empty.classList.remove('hidden'); document.getElementById('ieFooterInfo').textContent = '显示 0 条'; document.getElementById('iePageInfo').textContent = '0/0'; return; }
    empty.classList.add('hidden');
    body.innerHTML = pageData.map(function(r) {
        var isExport = r.direction === '出口';
        var dirBg = isExport ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700';
        var dirIcon = isExport ? 'fa-arrow-up text-emerald-500' : 'fa-arrow-down text-blue-500';
        var tc = ({'一般贸易':'bg-slate-100','进料加工':'bg-violet-50 text-violet-700','来料加工':'bg-amber-50 text-amber-700','保税物流':'bg-cyan-50 text-cyan-700','免税品':'bg-rose-50 text-rose-700'}[r.tradeMode] || 'bg-slate-100');
        var amt = r.amount ? (r.currency||'USD') + ' ' + r.amount.toLocaleString() : '-';
        return '<tr class="hover:bg-slate-50"><td class="px-4 py-3"><span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ' + dirBg + '"><i class="fas ' + dirIcon + ' mr-1"></i>' + escapeHtml(r.direction) + '</span></td><td class="px-4 py-3 font-mono text-xs font-medium" style="color:var(--clr-text);">' + escapeHtml(r.declNo) + '</td><td class="px-4 py-3 text-xs" style="color:var(--clr-text-secondary);">' + escapeHtml(r.contractNo) + '</td><td class="px-4 py-3"><span class="px-2 py-0.5 rounded text-xs ' + tc + '">' + escapeHtml(r.tradeMode) + '</span></td><td class="px-4 py-3 text-xs" style="color:var(--clr-text-secondary);">' + (r.declDate||'-') + '</td><td class="px-4 py-3 text-xs" style="color:var(--clr-text);">' + escapeHtml(r.goodsName||'-') + '</td><td class="px-4 py-3 text-xs font-mono" style="color:var(--clr-text-secondary);">' + amt + '</td><td class="px-4 py-3 text-center"><div class="flex items-center justify-center gap-1"><button onclick="editIeActivity(\'' + r.id + '\')" class="p-1.5 rounded hover:bg-slate-100" style="color:var(--clr-text-muted);" title="编辑"><i class="fas fa-edit text-xs"></i></button><button onclick="deleteIeActivity(\'' + r.id + '\')" class="p-1.5 rounded hover:bg-red-50 hover:text-red-600" style="color:var(--clr-text-muted);" title="删除"><i class="fas fa-trash-alt text-xs"></i></button></div></td></tr>';
    }).join('');
    document.getElementById('ieFooterInfo').textContent = '显示 ' + (start+1) + '-' + end + ' 条，共 ' + total + ' 条';
    document.getElementById('iePageInfo').textContent = _iePage + '/' + totalPages;
}
function filterIeActivities() { _iePage = 1; renderIeActivities(); }
function iePagePrev() { if (_iePage > 1) { _iePage--; renderIeActivities(); } }
function iePageNext() { var total = _ieFilteredData.length; var tp = Math.ceil(total / _iePageSize); if (_iePage < tp) { _iePage++; renderIeActivities(); } }
function showIeActivityModal(editId) {
    document.getElementById('ieEditId').value = editId || '';
    if (editId) {
        document.getElementById('ieModalTitle').textContent = '编辑进出口记录';
        var all = loadIeActivities();
        var rec = all.find(function(r) { return r.id === editId; });
        if (rec) {
            var dr = document.getElementsByName('ieDirection');
            for (var i = 0; i < dr.length; i++) dr[i].checked = dr[i].value === rec.direction;
            document.getElementById('ieDeclarationNo').value = rec.declNo || '';
            document.getElementById('ieContractNo').value = rec.contractNo || '';
            document.getElementById('ieTradeMode').value = rec.tradeMode || '一般贸易';
            document.getElementById('ieDeclDate').value = rec.declDate || '';
            document.getElementById('ieGoodsName').value = rec.goodsName || '';
            document.getElementById('ieAmount').value = rec.amount || '';
            document.getElementById('ieCurrency').value = rec.currency || 'USD';
            document.getElementById('ieRemarks').value = rec.remarks || '';
        }
    } else {
        document.getElementById('ieModalTitle').textContent = '新增进出口记录';
        document.getElementsByName('ieDirection')[0].checked = true;
        document.getElementById('ieDeclarationNo').value = ''; document.getElementById('ieContractNo').value = '';
        document.getElementById('ieTradeMode').value = '一般贸易';
        document.getElementById('ieDeclDate').value = new Date().toISOString().slice(0,10);
        document.getElementById('ieGoodsName').value = ''; document.getElementById('ieAmount').value = '';
        document.getElementById('ieCurrency').value = 'USD'; document.getElementById('ieRemarks').value = '';
    }
    document.getElementById('ieActivityModal').classList.add('active');
}
function saveIeActivity() {
    var editId = document.getElementById('ieEditId').value;
    var direction = null;
    var dr = document.getElementsByName('ieDirection');
    for (var i = 0; i < dr.length; i++) { if (dr[i].checked) { direction = dr[i].value; break; } }
    var declNo = document.getElementById('ieDeclarationNo').value.trim();
    var contractNo = document.getElementById('ieContractNo').value.trim();
    var tradeMode = document.getElementById('ieTradeMode').value;
    var declDate = document.getElementById('ieDeclDate').value;
    var goodsName = document.getElementById('ieGoodsName').value.trim();
    var amountVal = document.getElementById('ieAmount').value.trim();
    var currency = document.getElementById('ieCurrency').value;
    var remarks = document.getElementById('ieRemarks').value.trim();
    if (!direction) { showToast('请选择进出口标识', 'warning'); return; }
    if (!declNo) { showToast('请输入报关单号', 'warning'); return; }
    if (!contractNo) { showToast('请输入合同协议号', 'warning'); return; }
    if (!declDate) { showToast('请选择申报日期', 'warning'); return; }
    var all = loadIeActivities();
    var amount = amountVal ? parseFloat(amountVal) : 0;
    if (isNaN(amount)) amount = 0;
    if (editId) {
        var idx = all.findIndex(function(r) { return r.id === editId; });
        if (idx >= 0) { all[idx].direction = direction; all[idx].declNo = declNo; all[idx].contractNo = contractNo; all[idx].tradeMode = tradeMode; all[idx].declDate = declDate; all[idx].goodsName = goodsName; all[idx].amount = amount; all[idx].currency = currency; all[idx].remarks = remarks; }
        showToast('进出口记录已更新', 'success');
    } else {
        var newId = 'IE' + Date.now().toString(36).toUpperCase();
        all.push({ id:newId, direction:direction, declNo:declNo, contractNo:contractNo, tradeMode:tradeMode, declDate:declDate, goodsName:goodsName, amount:amount, currency:currency, remarks:remarks });
        showToast('进出口记录已新增', 'success');
    }
    saveData('ieActivities', all);
    closeModal('ieActivityModal');
    renderIeActivities();
}
function editIeActivity(id) { showIeActivityModal(id); }
function deleteIeActivity(id) {
    if (!confirm('确定删除该条进出口记录？')) return;
    var all = loadIeActivities().filter(function(r) { return r.id !== id; });
    saveData('ieActivities', all);
    renderIeActivities();
    showToast('记录已删除', 'success');
}
function exportIeActivities() {
    var data = _ieFilteredData && _ieFilteredData.length ? _ieFilteredData : loadIeActivities();
    var csv = '﻿进出口标识,报关单号,合同协议号,贸易方式,申报日期,货物名称,金额,币种,备注\n';
    data.forEach(function(r) { csv += r.direction + ',' + r.declNo + ',' + r.contractNo + ',' + r.tradeMode + ',' + (r.declDate||'') + ',' + (r.goodsName||'') + ',' + (r.amount||0) + ',' + (r.currency||'') + ',' + (r.remarks||'') + '\n'; });
    var blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '进出口业务数据_' + new Date().toISOString().slice(0,10) + '.csv';
    link.click(); URL.revokeObjectURL(link.href);
    showToast('导出成功', 'success');
}
// ── 意见反馈 ──────────────────────────────────────────
function loadFeedback() { return loadData('feedbackItems', []); }
function saveFeedback(list) { saveData('feedbackItems', list); }

function renderFeedback() {
    var feedback = loadFeedback();
    var user = currentUser || {};
    var html = '';

    // ── 提交表单 ──
    html += '<div class="bg-white rounded-lg border border-slate-200 p-5">';
    html += '<h3 class="text-base font-bold text-slate-800 mb-4"><i class="fas fa-plus-circle text-blue-600 mr-2"></i>提交反馈</h3>';
    html += '<div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">';
    html += '<div><label class="block text-xs font-medium text-slate-600 mb-1">反馈标题</label><input id="fbTitle" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="简要描述你的问题或建议"></div>';
    html += '<div><label class="block text-xs font-medium text-slate-600 mb-1">类别</label><select id="fbCategory" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"><option value="功能建议">功能建议</option><option value="界面优化">界面优化</option><option value="数据问题">数据问题</option><option value="权限问题">权限问题</option><option value="Bug报告">Bug报告</option><option value="其他">其他</option></select></div>';
    html += '<div><label class="block text-xs font-medium text-slate-600 mb-1">优先级</label><select id="fbPriority" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"><option value="低">低</option><option value="中" selected>中</option><option value="高">高</option><option value="紧急">紧急</option></select></div>';
    html += '</div>';
    html += '<div class="mb-3"><label class="block text-xs font-medium text-slate-600 mb-1">详细描述</label><textarea id="fbContent" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" rows="3" placeholder="请详细描述你的意见或遇到的问题..."></textarea></div>';
    html += '<div class="flex items-center space-x-3">';
    html += '<button onclick="submitFeedback()" class="btn-primary px-5 py-2 rounded-lg text-sm flex items-center space-x-2"><i class="fas fa-paper-plane"></i><span>提交反馈</span></button>';
    html += '<span id="fbSubmitMsg" class="text-xs text-slate-400"></span></div>';
    html += '</div>';

    // ── 反馈列表 ──
    html += '<div class="bg-white rounded-lg border border-slate-200 p-5 mt-4">';
    html += '<h3 class="text-base font-bold text-slate-800 mb-4"><i class="fas fa-list text-slate-500 mr-2"></i>全部反馈（' + feedback.length + '）</h3>';

    if (feedback.length === 0) {
        html += '<p class="text-sm text-slate-400 text-center py-8">暂无反馈，提交第一条意见吧</p>';
    } else {
        // Sort newest first
        feedback.sort(function(a, b) { return b.createdAt.localeCompare(a.createdAt); });
        feedback.forEach(function(fb) {
            var isOwner = user.username === fb.submitter;
            var isAdmin = user.role === 'customs_officer';
            var statusBadge = { '待处理': 'bg-slate-100 text-slate-600', '处理中': 'bg-blue-100 text-blue-700', '已解决': 'bg-emerald-100 text-emerald-700', '已关闭': 'bg-slate-100 text-slate-400' }[fb.status] || 'bg-slate-100 text-slate-600';
            var priorityIcon = { '低': 'text-slate-400', '中': 'text-blue-500', '高': 'text-amber-500', '紧急': 'text-red-500' }[fb.priority] || 'text-slate-400';
            var priorityLabel = { '低': '低优先级', '中': '中优先级', '高': '高优先级', '紧急': '紧急' }[fb.priority] || fb.priority;

            html += '<div class="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">';
            html += '<div class="flex items-start justify-between">';
            html += '<div class="flex-1 min-w-0">';
            html += '<div class="flex items-center space-x-2 flex-wrap">';
            html += '<span class="font-medium text-slate-800 text-sm">' + safeEs(fb.title) + '</span>';
            html += '<span class="text-xs px-2 py-0.5 rounded-full ' + statusBadge + '">' + fb.status + '</span>';
            html += '<span class="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">' + fb.category + '</span>';
            html += '<span class="text-xs ' + priorityIcon + '"><i class="fas fa-flag"></i> ' + priorityLabel + '</span>';
            html += '</div>';
            html += '<p class="text-sm text-slate-600 mt-2 whitespace-pre-wrap">' + safeEs(fb.content) + '</p>';
            var replyHtml = '';
            if (fb.reply) replyHtml = '<div class="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm"><span class="font-medium text-blue-700">回复：</span><span class="text-slate-600">' + safeEs(fb.reply) + '</span></div>';
            html += replyHtml || '';
            html += '<div class="flex items-center space-x-3 mt-2 text-xs text-slate-400">';
            html += '<span><i class="fas fa-user mr-1"></i>' + safeEs(fb.submitter) + '</span>';
            html += '<span><i class="fas fa-calendar mr-1"></i>' + fb.createdAt.slice(0, 16).replace('T', ' ') + '</span>';
            html += '</div></div>';
            html += '<div class="flex items-center space-x-1 ml-3 flex-shrink-0">';
            if (isAdmin) {
                html += '<button onclick="editFeedbackStatus(\'' + fb.id + '\')" class="text-xs px-2 py-1 text-blue-600 hover:text-blue-800 hover:underline" title="更新状态"><i class="fas fa-sync-alt mr-1"></i>状态</button>';
                html += '<button onclick="replyFeedback(\'' + fb.id + '\')" class="text-xs px-2 py-1 text-blue-600 hover:text-blue-800 hover:underline" title="回复"><i class="fas fa-reply mr-1"></i>回复</button>';
            }
            if (isOwner && !isAdmin) {
                html += '<button onclick="deleteFeedback(\'' + fb.id + '\')" class="text-xs px-2 py-1 text-red-500 hover:text-red-700 hover:underline"><i class="fas fa-trash mr-1"></i>删除</button>';
            }
            html += '</div></div></div>';
        });
    }
    html += '</div>';

    document.getElementById('feedbackContent').innerHTML = html;
}

function submitFeedback() {
    var title = document.getElementById('fbTitle').value.trim();
    var content = document.getElementById('fbContent').value.trim();
    if (!title) { showToast('请输入反馈标题', 'warning'); return; }
    if (!content) { showToast('请输入反馈内容', 'warning'); return; }
    var fb = {
        id: 'fb-' + Date.now(),
        title: title,
        category: document.getElementById('fbCategory').value,
        priority: document.getElementById('fbPriority').value,
        content: content,
        submitter: currentUser ? currentUser.username : '未知',
        submitterDept: currentUser ? (currentUser.dept || '') : '',
        status: '待处理',
        reply: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    var list = loadFeedback();
    list.push(fb);
    saveFeedback(list);
    document.getElementById('fbTitle').value = '';
    document.getElementById('fbContent').value = '';
    showToast('反馈已提交，感谢你的建议！', 'success');
    renderFeedback();
}

function deleteFeedback(id) {
    if (!confirm('确定删除此反馈？')) return;
    var list = loadFeedback();
    list = list.filter(function(f) { return f.id !== id; });
    saveFeedback(list);
    renderFeedback();
}

function editFeedbackStatus(id) {
    var list = loadFeedback();
    var fb = list.find(function(f) { return f.id === id; });
    if (!fb) return;
    var statuses = ['待处理', '处理中', '已解决', '已关闭'];
    var currentIdx = statuses.indexOf(fb.status);
    var nextStatus = statuses[(currentIdx + 1) % statuses.length];
    fb.status = nextStatus;
    fb.updatedAt = new Date().toISOString();
    saveFeedback(list);
    showToast('状态已更新为: ' + nextStatus, 'success');
    renderFeedback();
}

function replyFeedback(id) {
    var reply = prompt('输入回复内容：');
    if (!reply || !reply.trim()) return;
    var list = loadFeedback();
    var fb = list.find(function(f) { return f.id === id; });
    if (!fb) return;
    fb.reply = reply.trim();
    if (fb.status === '待处理') fb.status = '处理中';
    fb.updatedAt = new Date().toISOString();
    saveFeedback(list);
    showToast('已回复', 'success');
    renderFeedback();
}

(function() {
    var _onNav = navigateTo;
    navigateTo = function(m) {
        _onNav(m);
        if (m === 'ie-activities') { _iePage = 1; _ieFilteredData = []; renderIeActivities(); }
    };
})();
