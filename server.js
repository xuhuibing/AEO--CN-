// ========================================================================
// AEO认证稽核系统 v2.0 — HTTP Server（SQLite + Auth + RBAC + File API）
// ========================================================================
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const querystring = require('querystring');

// ── 环境变量加载 ──────────────────────────────────
try { require('dotenv').config(); } catch(e) { /* dotenv not available */ }

// ── 初始化数据库 ────────────────────────────────────
const db = require('./lib/db');
db.initDatabase();

// ── 认证模块 ────────────────────────────────────────
const auth = require('./lib/auth');

// ── 配置: CLI 参数 > 环境变量 > 默认值 ──────────────
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3080;
const USERNAME = process.argv[3] || process.env.ADMIN_USERNAME || process.env.ADMIN_USER || 'aeo';
const PASSWORD = process.argv[4] || process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || 'aeo2026';
const API_KEY = process.argv[5] || process.env.API_KEY || '';
const FEISHU_APP_ID = process.argv[6] || process.env.FEISHU_APP_ID || '';
const FEISHU_APP_SECRET = process.argv[7] || process.env.FEISHU_APP_SECRET || '';
const NODE_ENV = process.env.NODE_ENV || 'production';
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const UPLOAD_DIR = path.join(ROOT, 'uploads');
// ───────────────────────────────────────────────────

// 飞书集成模块
let feishuBot = null;
try { feishuBot = require('./feishu.js'); } catch(e) { /* feishu module not available */ }

// 飞书通知辅助函数
function sendFeishuNotify(eventType, eventData) {
  if (!feishuBot || typeof feishuBot.sendSystemNotification !== 'function') return;
  feishuBot.sendSystemNotification(eventType, eventData, function() {
    return db.loadJson('feishuConfig', {});
  }).catch(function(e) { /* 通知失败不阻塞 */ });
}

// 确保目录存在
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ── MIME 类型 ──────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.zip': 'application/zip', '.mp4': 'video/mp4'
};

// ── 工具函数 ────────────────────────────────────────
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return '127.0.0.1';
}

function sendJSON(res, data, statusCode) {
  res.writeHead(statusCode || 200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function sendError(res, code, msg) {
  res.writeHead(code || 400, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: msg }));
}

function parseBody(req) {
  return new Promise(function(resolve, reject) {
    let body = '';
    req.on('data', function(chunk) { body += chunk; });
    req.on('end', function() {
      try { resolve(JSON.parse(body)); }
      catch(e) { reject(new Error('Invalid JSON')); }
    });
  });
}

function parseUrlEncoded(body) {
  try {
    const params = querystring.parse(body);
    return params;
  } catch(e) { return {}; }
}

// ── 认证中间件 ──────────────────────────────────────
// 支持三种认证方式：Basic Auth、API Key、Session Token
function checkAuth(req) {
  const header = req.headers['authorization'] || '';
  const token = header.split(' ')[1];

  // 1. Session Token 认证（Bearer token）
  if (header.startsWith('Bearer ')) {
    const session = auth.validateSession(token);
    if (session) return { method: 'session', user: session };
    return null;
  }

  // 2. Basic Auth 认证（向后兼容）
  if (token) {
    try {
      const decoded = Buffer.from(token, 'base64').toString();
      if (decoded === USERNAME + ':' + PASSWORD) return { method: 'basic', user: { id: 1, username: USERNAME, displayName: '系统管理员', role: 'customs_officer' } };
    } catch(e) { /* fall through */ }
  }

  // 3. API Key 认证
  if (API_KEY && req.headers['x-api-key'] === API_KEY) return { method: 'apikey', user: { id: 1, username: 'API', displayName: 'API 客户端', role: 'customs_officer' } };
  const urlKey = new URL(req.url, 'http://localhost').searchParams.get('api_key');
  if (API_KEY && urlKey === API_KEY) return { method: 'apikey', user: { id: 1, username: 'API', displayName: 'API 客户端', role: 'customs_officer' } };

  return null;
}

function unauth(res) {
  res.writeHead(401, {
    'WWW-Authenticate': 'Basic realm="AEO System Login"',
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.end('<!DOCTYPE html><html lang=zh-CN><meta charset=utf-8><title>AEO系统</title><body style="font-family:sans-serif;display:flex;height:100vh;align-items:center;justify-content:center;background:#f1f5f9"><div style="background:white;padding:40px;border-radius:12px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.1)"><h2 style="color:#1e3a5f">AEO海关认证管理系统</h2><p style="color:#64748b;margin-top:8px">请输入用户名和密码访问</p></div></body></html>');
}

function requireAuth(req, res) {
  const authInfo = checkAuth(req);
  if (!authInfo) { unauth(res); return null; }
  return authInfo;
}

function checkPerm(authInfo, permission) {
  if (!authInfo) return false;
  // Basic Auth 和 API Key 拥有所有权限
  if (authInfo.method === 'basic' || authInfo.method === 'apikey') return true;
  return auth.checkPermission(authInfo.user, permission);
}

// ── 静态文件服务 ────────────────────────────────────
function serveStatic(req, res, urlPath) {
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
  const filePath = path.join(ROOT, urlPath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  // 安全检查：阻止目录遍历
  if (filePath.includes('..')) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(filePath, function(err, data) {
    if (err) {
      // Try lib/ directory
      const libPath = path.join(ROOT, 'lib', path.basename(urlPath));
      fs.readFile(libPath, function(err2, data2) {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          return res.end('<h3>404 - 文件未找到</h3>');
        }
        const ext = path.extname(libPath).toLowerCase();
        var headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' };
        if (ext === '.html' || ext === '.js') headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        res.writeHead(200, headers);
        res.end(data2);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    var headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' };
    if (ext === '.html' || ext === '.js') headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    res.writeHead(200, headers);
    res.end(data);
  });
}

// ── 解析 multipart/form-data ───────────────────────
function parseMultipart(req, boundary) {
  return new Promise(function(resolve, reject) {
    var chunks = [];
    req.on('data', function(c) { chunks.push(c); });
    req.on('end', function() {
      var buffer = Buffer.concat(chunks);
      var parts = [];
      var delimiter = '--' + boundary;
      var partsRaw = buffer.toString('binary').split(delimiter);
      partsRaw.forEach(function(part) {
        var match = part.match(/name="([^"]+)"\r\n\r\n([\s\S]*)$/);
        var fileMatch = part.match(/name="([^"]+)";\s*filename="([^"]*)"\r\nContent-Type:\s*(\S+)\r\n\r\n/);
        if (fileMatch) {
          var fieldName = fileMatch[1];
          var fileName = fileMatch[2];
          var contentType = fileMatch[3];
          var dataStart = part.indexOf('\r\n\r\n') + 4;
          var fileData = part.substring(dataStart);
          // Remove trailing \r\n--
          if (fileData.endsWith('\r\n')) fileData = fileData.slice(0, -2);
          if (fileData.endsWith('\n')) fileData = fileData.slice(0, -1);
          parts.push({ fieldName: fieldName, fileName: fileName, contentType: contentType, data: Buffer.from(fileData, 'binary') });
        } else if (match) {
          parts.push({ fieldName: match[1], value: match[2].replace(/\r\n$/, '') });
        }
      });
      resolve(parts);
    });
    req.on('error', reject);
  });
}

// ── HTTP Server ──────────────────────────────────────
const server = http.createServer(async function(req, res) {
  const url = req.url.split('?')[0];
  const method = req.method;
  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

  // ── CORS ──
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  if (method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  // ── 公开端点（无需认证） ──────────────────────────
  // POST /api/auth/login — 用户登录
  if (method === 'POST' && url === '/api/auth/login') {
    try {
      const body = await parseBody(req);
      if (!body.username || !body.password) return sendError(res, 400, '用户名和密码为必填');
      const user = auth.authenticateUser(body.username, body.password);
      if (!user) return sendError(res, 401, '用户名或密码错误');
      const session = auth.createSession(user.id, clientIP, req.headers['user-agent'] || '');
      auth.addAuditLog(user.id, user.username, '登录系统', 'auth', '登录成功', clientIP);
      sendJSON(res, { ok: true, user: user, token: session.token, expiresAt: session.expiresAt });
    } catch(e) { sendError(res, 500, '登录失败: ' + e.message); }
    return;
  }

  // POST /api/auth/register — 用户注册（首个用户自动为管理员）
  if (method === 'POST' && url === '/api/auth/register') {
    try {
      const body = await parseBody(req);
      if (!body.username || !body.password) return sendError(res, 400, '用户名和密码为必填');
      if (body.password.length < 6) return sendError(res, 400, '密码至少6位');
      // 第一个用户设为关务经理角色
      const existingUsers = auth.getUsers();
      const role = existingUsers.length === 0 ? 'customs_officer' : 'dept_lead';
      const user = auth.createUser(body.username, body.password, body.displayName || body.username, role, body);
      const session = auth.createSession(user.id, clientIP, req.headers['user-agent'] || '');
      sendJSON(res, { ok: true, user: user, token: session.token, expiresAt: session.expiresAt }, 201);
    } catch(e) { sendError(res, 400, '注册失败: ' + e.message); }
    return;
  }

  // ── 静态文件无需认证（HTML/JS/CSS/图片等） ───────
  if (!url.startsWith('/api/')) {
    serveStatic(req, res, url);
    return;
  }

  // ── 以下 API 端点需要认证 ────────────────────────────
  const authInfo = requireAuth(req, res);
  if (!authInfo) return;

  const currentUser = authInfo.user;

  try {
    // POST /api/auth/logout
    if (method === 'POST' && url === '/api/auth/logout') {
      const token = (req.headers['authorization'] || '').split(' ')[1];
      if (token) auth.deleteSession(token);
      sendJSON(res, { ok: true });
      return;
    }

    // GET /api/auth/me — 当前用户信息
    if (method === 'GET' && url === '/api/auth/me') {
      sendJSON(res, { ok: true, user: currentUser });
      return;
    }

    // GET /api/auth/permissions — 当前用户权限
    if (method === 'GET' && url === '/api/auth/permissions') {
      const perms = auth.getRolePermissions(currentUser.role);
      sendJSON(res, { ok: true, role: currentUser.role, permissions: perms });
      return;
    }

    // ── 用户管理 ─────────────────────────────────
    // GET /api/users — 用户列表
    if (method === 'GET' && url === '/api/users') {
      if (!checkPerm(authInfo, 'user.view')) return sendError(res, 403, '无权限');
      sendJSON(res, auth.getUsers());
      return;
    }

    // POST /api/users — 创建用户
    if (method === 'POST' && url === '/api/users') {
      if (!checkPerm(authInfo, 'user.manage')) return sendError(res, 403, '无权限');
      const body = await parseBody(req);
      const user = auth.createUser(body.username, body.password, body.displayName, body.role, body);
      auth.addAuditLog(currentUser.id, currentUser.username, '创建用户: ' + body.username, 'user', '', clientIP);
      sendJSON(res, { ok: true, user: user }, 201);
      return;
    }

    // PUT /api/users/:id — 更新用户
    if (method === 'PUT' && url.startsWith('/api/users/') && !url.includes('/password')) {
      if (!checkPerm(authInfo, 'user.manage')) return sendError(res, 403, '无权限');
      const id = parseInt(url.split('/')[3]);
      const body = await parseBody(req);
      auth.updateUser(id, body);
      auth.addAuditLog(currentUser.id, currentUser.username, '更新用户信息', 'user', '用户ID: ' + id, clientIP);
      sendJSON(res, { ok: true });
      return;
    }

    // PUT /api/users/:id/password — 修改密码
    if (method === 'PUT' && /^\/api\/users\/\d+\/password$/.test(url)) {
      const id = parseInt(url.split('/')[3]);
      if (id !== currentUser.id && !checkPerm(authInfo, 'user.manage')) return sendError(res, 403, '只能修改自己的密码');
      const body = await parseBody(req);
      if (id === currentUser.id) {
        auth.changePassword(id, body.oldPassword, body.newPassword);
      } else {
        auth.resetPassword(id, body.newPassword);
      }
      sendJSON(res, { ok: true });
      return;
    }

    // GET /api/users/roles — 角色列表
    if (method === 'GET' && url === '/api/users/roles') {
      sendJSON(res, auth.getRoleList());
      return;
    }

    // PUT /api/users/roles/:key — 更新角色权限
    if (method === 'PUT' && url.startsWith('/api/users/roles/')) {
      if (!checkPerm(authInfo, 'user.manage')) return sendError(res, 403, '无权限');
      const roleKey = url.split('/')[4];
      const body = await parseBody(req);
      auth.updateRolePermissions(roleKey, body.permissions);
      auth.addAuditLog(currentUser.id, currentUser.username, '更新角色权限: ' + roleKey, 'user', '', clientIP);
      sendJSON(res, { ok: true });
      return;
    }

    // ── 文件管理 ─────────────────────────────────
    // POST /api/files/upload — 上传文件
    if (method === 'POST' && url === '/api/files/upload') {
      if (!checkPerm(authInfo, 'document.upload')) return sendError(res, 403, '无权限');
      var contentType = req.headers['content-type'] || '';
      if (contentType.includes('multipart/form-data')) {
        var boundary = contentType.split('boundary=')[1];
        if (!boundary) return sendError(res, 400, '缺少 boundary');
        var parts = await parseMultipart(req, boundary);
        var filePart = null;
        var extra = {};
        parts.forEach(function(p) {
          if (p.fileName) filePart = p;
          else extra[p.fieldName] = p.value;
        });
        if (!filePart) return sendError(res, 400, '未找到文件');
        // 限制文件大小 50MB
        if (filePart.data.length > 50 * 1024 * 1024) return sendError(res, 413, '文件超过50MB限制');
        var ext = path.extname(filePart.fileName) || '';
        var storedName = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext;
        var filePath = path.join(UPLOAD_DIR, storedName);
        fs.writeFileSync(filePath, filePart.data);
        var dbPath = 'uploads/' + storedName;
        var result = db.getDb().prepare(
          "INSERT INTO files (original_name, stored_name, file_path, mime_type, file_size, category, ref_year, ref_module, ref_id, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).run(filePart.fileName, storedName, dbPath, filePart.contentType || '', filePart.data.length,
          extra.category || '', extra.ref_year || '', extra.ref_module || '', extra.ref_id || '', currentUser.id);
        auth.addAuditLog(currentUser.id, currentUser.username, '上传文件: ' + filePart.fileName, 'file', '大小: ' + filePart.data.length, clientIP);
        sendJSON(res, { ok: true, file: { id: result.lastInsertRowid, name: filePart.fileName, storedName: storedName, size: filePart.data.length, mimeType: filePart.contentType } });
      } else {
        // 兼容 Base64 JSON 上传
        const body = await parseBody(req);
        if (body.fileData && body.fileName) {
          var base64Data = body.fileData.replace(/^data:.*?;base64,/, '');
          var fileBuffer = Buffer.from(base64Data, 'base64');
          if (fileBuffer.length > 50 * 1024 * 1024) return sendError(res, 413, '文件超过50MB限制');
          var ext2 = path.extname(body.fileName) || '';
          var storedName2 = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext2;
          var filePath2 = path.join(UPLOAD_DIR, storedName2);
          fs.writeFileSync(filePath2, fileBuffer);
          var dbPath2 = 'uploads/' + storedName2;
          var result2 = db.getDb().prepare(
            "INSERT INTO files (original_name, stored_name, file_path, mime_type, file_size, category, ref_year, ref_module, ref_id, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
          ).run(body.fileName, storedName2, dbPath2, body.mimeType || '', fileBuffer.length,
            body.category || '', body.ref_year || '', body.ref_module || '', body.ref_id || '', currentUser.id);
          sendJSON(res, { ok: true, file: { id: result2.lastInsertRowid, name: body.fileName, storedName: storedName2, size: fileBuffer.length } });
        } else {
          sendError(res, 400, '缺少文件数据');
        }
      }
      return;
    }

    // GET /api/files — 文件列表
    if (method === 'GET' && url === '/api/files') {
      var params = new URL(req.url, 'http://localhost').searchParams;
      var sql = "SELECT * FROM files WHERE 1=1";
      var sqlParams = [];
      if (params.get('category')) { sql += " AND category = ?"; sqlParams.push(params.get('category')); }
      if (params.get('ref_year')) { sql += " AND ref_year = ?"; sqlParams.push(params.get('ref_year')); }
      if (params.get('ref_module')) { sql += " AND ref_module = ?"; sqlParams.push(params.get('ref_module')); }
      if (params.get('ref_id')) { sql += " AND ref_id = ?"; sqlParams.push(params.get('ref_id')); }
      sql += " ORDER BY id DESC";
      if (params.get('limit')) { sql += " LIMIT ?"; sqlParams.push(parseInt(params.get('limit'))); }
      var stmt = db.getDb().prepare(sql);
      var files = stmt.all.apply(stmt, sqlParams);
      sendJSON(res, files);
      return;
    }

    // GET /api/files/:id/download — 下载文件
    if (method === 'GET' && /^\/api\/files\/\d+\/download$/.test(url)) {
      var fileId = parseInt(url.split('/')[3]);
      var fileRecord = db.getDb().prepare("SELECT * FROM files WHERE id = ?").get(fileId);
      if (!fileRecord) return sendError(res, 404, '文件未找到');
      var fullPath = path.join(ROOT, fileRecord.file_path);
      if (!fs.existsSync(fullPath)) return sendError(res, 404, '文件已不存在');
      var fileData = fs.readFileSync(fullPath);
      var mimeType = fileRecord.mime_type || MIME[path.extname(fileRecord.original_name)] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': mimeType,
        'Content-Disposition': 'attachment; filename="' + encodeURIComponent(fileRecord.original_name) + '"',
        'Content-Length': fileData.length
      });
      res.end(fileData);
      return;
    }

    // GET /api/files/:id/view — 在线预览
    if (method === 'GET' && /^\/api\/files\/\d+\/view$/.test(url)) {
      var viewId = parseInt(url.split('/')[3]);
      var viewRecord = db.getDb().prepare("SELECT * FROM files WHERE id = ?").get(viewId);
      if (!viewRecord) return sendError(res, 404, '文件未找到');
      var viewPath = path.join(ROOT, viewRecord.file_path);
      if (!fs.existsSync(viewPath)) return sendError(res, 404, '文件已不存在');
      var viewData = fs.readFileSync(viewPath);
      var viewMime = viewRecord.mime_type || MIME[path.extname(viewRecord.original_name)] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': viewMime,
        'Content-Disposition': 'inline',
        'Cache-Control': 'private, max-age=3600'
      });
      res.end(viewData);
      return;
    }

    // DELETE /api/files/:id — 删除文件
    if (method === 'DELETE' && url.startsWith('/api/files/') && /^\/api\/files\/\d+$/.test(url)) {
      if (!checkPerm(authInfo, 'document.delete')) return sendError(res, 403, '无权限');
      var delId = parseInt(url.split('/')[3]);
      var delRecord = db.getDb().prepare("SELECT * FROM files WHERE id = ?").get(delId);
      if (!delRecord) return sendError(res, 404, '文件未找到');
      try { fs.unlinkSync(path.join(ROOT, delRecord.file_path)); } catch(e) { /* file may not exist */ }
      db.getDb().prepare("DELETE FROM files WHERE id = ?").run(delId);
      auth.addAuditLog(currentUser.id, currentUser.username, '删除文件: ' + delRecord.original_name, 'file', '', clientIP);
      sendJSON(res, { ok: true });
      return;
    }

    // ── 数据版本管理 ─────────────────────────────
    // GET /api/versions/:key — 数据版本历史
    if (method === 'GET' && url.startsWith('/api/versions/')) {
      if (!checkPerm(authInfo, 'system.logs')) return sendError(res, 403, '无权限');
      var versionKey = url.slice('/api/versions/'.length);
      var versions = db.getDataVersions(versionKey, 50);
      sendJSON(res, versions);
      return;
    }

    // POST /api/versions/:id/restore — 恢复版本
    if (method === 'POST' && /^\/api\/versions\/\d+\/restore$/.test(url)) {
      var restoreId = parseInt(url.split('/')[3]);
      var restored = db.restoreDataVersion(restoreId);
      if (!restored) return sendError(res, 404, '版本未找到');
      auth.addAuditLog(currentUser.id, currentUser.username, '恢复数据版本: ' + restored.data_key, 'data', '版本ID: ' + restoreId, clientIP);
      sendJSON(res, { ok: true, dataKey: restored.data_key });
      return;
    }

    // ── 审批流程 ─────────────────────────────────
    // POST /api/approvals — 提交审批
    if (method === 'POST' && url === '/api/approvals') {
      if (!checkPerm(authInfo, 'finance.approve')) return sendError(res, 403, '无权限');
      const body = await parseBody(req);
      if (!body.ref_type || !body.ref_id) return sendError(res, 400, 'ref_type 和 ref_id 为必填');
      db.getDb().prepare(
        "INSERT INTO approvals (ref_type, ref_id, ref_desc, old_value, new_value, requester_id, requester_name) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).run(body.ref_type, body.ref_id, body.ref_desc || '', JSON.stringify(body.old_value || ''), JSON.stringify(body.new_value || ''),
        currentUser.id, currentUser.displayName);
      auth.addAuditLog(currentUser.id, currentUser.username, '提交审批: ' + body.ref_type + '/' + body.ref_id, 'approval', body.ref_desc, clientIP);
      // 通知关务经理审批
      auth.createNotification('审批请求: ' + body.ref_desc, body.ref_type + '/' + body.ref_id + ' 需要审批', 'approval', null, 'customs_officer', body.ref_type, body.ref_id);
      sendFeishuNotify('approval', { type: body.ref_type, id: body.ref_id, action: '提交审批', user: currentUser.displayName, comment: body.ref_desc || '' });
      sendJSON(res, { ok: true });
      return;
    }

    // GET /api/approvals — 审批列表
    if (method === 'GET' && url === '/api/approvals') {
      if (!checkPerm(authInfo, 'finance.approve')) return sendError(res, 403, '无权限');
      var appParams = new URL(req.url, 'http://localhost').searchParams;
      var appSql = "SELECT * FROM approvals WHERE 1=1";
      var appSqlParams = [];
      if (appParams.get('status')) { appSql += " AND status = ?"; appSqlParams.push(appParams.get('status')); }
      appSql += " ORDER BY id DESC LIMIT 100";
      var appStmt = db.getDb().prepare(appSql);
      var approvals = appStmt.all.apply(appStmt, appSqlParams);
      sendJSON(res, approvals);
      return;
    }

    // POST /api/approvals/:id/approve — 通过审批
    if (method === 'POST' && /^\/api\/approvals\/\d+\/approve$/.test(url)) {
      if (!checkPerm(authInfo, 'finance.approve')) return sendError(res, 403, '无权限');
      var appId = parseInt(url.split('/')[3]);
      var appRecord = db.getDb().prepare("SELECT * FROM approvals WHERE id = ? AND status = 'pending'").get(appId);
      if (!appRecord) return sendError(res, 404, '审批不存在或已处理');
      // 执行变更
      db.saveJson(appRecord.ref_type + '_' + appRecord.ref_id, appRecord.new_value, currentUser.id, currentUser.displayName);
      db.getDb().prepare("UPDATE approvals SET status = 'approved', reviewer_id = ?, reviewer_name = ?, reviewed_at = datetime('now','localtime') WHERE id = ?")
        .run(currentUser.id, currentUser.displayName, appId);
      auth.addAuditLog(currentUser.id, currentUser.username, '审批通过: ' + appRecord.ref_type + '/' + appRecord.ref_id, 'approval', appRecord.ref_desc, clientIP);
      sendFeishuNotify('approval', { type: appRecord.ref_type, id: appRecord.ref_id, action: '审批通过', user: currentUser.displayName, comment: '' });
      sendJSON(res, { ok: true });
      return;
    }

    // POST /api/approvals/:id/reject — 驳回审批
    if (method === 'POST' && /^\/api\/approvals\/\d+\/reject$/.test(url)) {
      if (!checkPerm(authInfo, 'finance.approve')) return sendError(res, 403, '无权限');
      var rejId = parseInt(url.split('/')[3]);
      const body = await parseBody(req);
      db.getDb().prepare("UPDATE approvals SET status = 'rejected', reviewer_id = ?, reviewer_name = ?, review_comment = ?, reviewed_at = datetime('now','localtime') WHERE id = ? AND status = 'pending'")
        .run(currentUser.id, currentUser.displayName, body.comment || '', rejId);
      auth.addAuditLog(currentUser.id, currentUser.username, '审批驳回', 'approval', 'ID: ' + rejId, clientIP);
      sendFeishuNotify('approval', { type: 'approval', id: rejId, action: '审批驳回', user: currentUser.displayName, comment: body.comment || '' });
      sendJSON(res, { ok: true });
      return;
    }

    // ── 整改跟踪 ─────────────────────────────────
    // GET /api/rectifications — 整改列表
    if (method === 'GET' && url === '/api/rectifications') {
      var recSql = "SELECT * FROM rectifications";
      var recParams = [];
      var recQuery = new URL(req.url, 'http://localhost').searchParams;
      if (recQuery.get('status')) { recSql += " WHERE status = ?"; recParams.push(recQuery.get('status')); }
      recSql += " ORDER BY CASE WHEN status = 'open' THEN 0 ELSE 1 END, due_date ASC";
      var recStmt = db.getDb().prepare(recSql);
      sendJSON(res, recStmt.all.apply(recStmt, recParams));
      return;
    }

    // POST /api/rectifications — 创建整改
    if (method === 'POST' && url === '/api/rectifications') {
      if (!checkPerm(authInfo, 'audit.create')) return sendError(res, 403, '无权限');
      const body = await parseBody(req);
      if (!body.issue_desc) return sendError(res, 400, '问题描述为必填');
      var result = db.getDb().prepare(
        "INSERT INTO rectifications (ref_type, ref_id, issue_desc, severity, owner, owner_id, due_date, initiator_dept, initiator_name, issue_date, follow_dept, accept_dept_customs, accept_dept_audit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).run(body.ref_type || 'rectification', body.ref_id || '',
        body.issue_desc, body.severity || 'medium',
        body.owner || currentUser.displayName, body.ownerId || currentUser.id,
        body.due_date || '',
        body.initiator_dept || '', body.initiator_name || currentUser.displayName,
        body.issue_date || '',
        body.follow_dept || '',
        body.accept_dept_customs || 0, body.accept_dept_audit || 0);
      auth.addAuditLog(currentUser.id, currentUser.username, '创建整改项: ' + body.issue_desc, 'rectification', '严重程度: ' + (body.severity || 'medium'), clientIP);
      sendFeishuNotify('rectification', { id: result.lastInsertRowid, desc: body.issue_desc, dept: body.follow_dept || '', owner: body.owner || '', status: 'open' });
      sendJSON(res, { ok: true, id: result.lastInsertRowid }, 201);
      return;
    }

    // PUT /api/rectifications/:id — 更新整改
    if (method === 'PUT' && /^\/api\/rectifications\/\d+$/.test(url)) {
      var recId = parseInt(url.split('/')[3]);
      const body = await parseBody(req);
      var updates = [];
      var params = [];
      var updatableFields = ['status', 'owner', 'due_date', 'resolution', 'severity',
        'initiator_dept', 'initiator_name', 'issue_date', 'follow_dept',
        'accept_dept_customs', 'accept_dept_audit', 'is_closed',
        'confirmed_by', 'confirmed_at', 'approval_comment'];
      updatableFields.forEach(function(k) {
        if (body[k] !== undefined) { updates.push(k + ' = ?'); params.push(body[k]); }
      });
      if (body.status === 'resolved') {
        updates.push("status = 'pending_accept'");
      }
      if (body.status === 'closed') {
        updates.push("completed_at = datetime('now','localtime')");
        updates.push("is_closed = 1");
      }
      updates.push("updated_at = datetime('now','localtime')");
      params.push(recId);
      if (updates.length > 1) {
        var updStmt = db.getDb().prepare("UPDATE rectifications SET " + updates.join(', ') + " WHERE id = ?");
        updStmt.run.apply(updStmt, params);
      }
      auth.addAuditLog(currentUser.id, currentUser.username, '更新整改项: ' + recId, 'rectification', '状态: ' + (body.status || ''), clientIP);
      sendJSON(res, { ok: true });
      return;
    }

    // PUT /api/rectifications/:id/approve — 整改验收
    if (method === 'PUT' && /^\/api\/rectifications\/\d+\/approve$/.test(url)) {
      var recId2 = parseInt(url.split('/')[3]);
      const body2 = await parseBody(req);
      var action = body2.action || 'approve';
      var currentRec = db.getDb().prepare("SELECT * FROM rectifications WHERE id = ?").get(recId2);
      if (!currentRec) return sendError(res, 404, '整改项不存在');

      if (action === 'approve') {
        // 验收确认：记录确认人和确认时间，标记闭环
        var customsOk = body2.accept_dept_customs !== undefined ? body2.accept_dept_customs : currentRec.accept_dept_customs;
        var auditOk = body2.accept_dept_audit !== undefined ? body2.accept_dept_audit : currentRec.accept_dept_audit;
        db.getDb().prepare(
          "UPDATE rectifications SET confirmed_by = ?, confirmed_at = datetime('now','localtime'), is_closed = 1, status = 'closed', completed_at = datetime('now','localtime'), approval_comment = ?, accept_dept_customs = ?, accept_dept_audit = ?, updated_at = datetime('now','localtime') WHERE id = ?"
        ).run(body2.confirmed_by || currentUser.displayName, body2.comment || '', customsOk ? 1 : 0, auditOk ? 1 : 0, recId2);
        auth.addAuditLog(currentUser.id, currentUser.username, '验收整改项: ' + recId2, 'rectification', '确认人: ' + (body2.confirmed_by || currentUser.displayName), clientIP);
        sendFeishuNotify('rectification', { id: recId2, desc: (currentRec.issue_desc || '').slice(0, 50), dept: currentRec.follow_dept || '', owner: currentRec.owner || '', status: 'closed' });
      } else if (action === 'reject') {
        // 退回：状态回到 in_progress
        db.getDb().prepare(
          "UPDATE rectifications SET status = 'in_progress', approval_comment = ?, updated_at = datetime('now','localtime') WHERE id = ?"
        ).run(body2.comment || '', recId2);
        auth.addAuditLog(currentUser.id, currentUser.username, '退回整改项: ' + recId2, 'rectification', '原因: ' + (body2.comment || ''), clientIP);
        sendFeishuNotify('rectification', { id: recId2, desc: (currentRec.issue_desc || '').slice(0, 50), dept: currentRec.follow_dept || '', owner: currentRec.owner || '', status: 'rejected' });
      }
      sendJSON(res, { ok: true });
      return;
    }

    // GET /api/rectifications/overdue — 超期整改
    if (method === 'GET' && url === '/api/rectifications/overdue') {
      var overdue = db.getDb().prepare(
        "SELECT * FROM rectifications WHERE status IN ('open', 'in_progress') AND due_date IS NOT NULL AND due_date < datetime('now','localtime') ORDER BY due_date ASC"
      ).all();
      sendJSON(res, overdue);
      return;
    }

    // ── 通知 ─────────────────────────────────────
    // GET /api/notifications — 获取通知
    if (method === 'GET' && url === '/api/notifications') {
      var notifs = auth.getNotifications(currentUser.id, currentUser.role);
      sendJSON(res, notifs);
      return;
    }

    // POST /api/notifications/:id/read — 标记已读
    if (method === 'POST' && /^\/api\/notifications\/\d+\/read$/.test(url)) {
      var notifId = parseInt(url.split('/')[3]);
      auth.markNotificationRead(notifId, currentUser.id);
      sendJSON(res, { ok: true });
      return;
    }

    // GET /api/notifications/unread-count — 未读数量
    if (method === 'GET' && url === '/api/notifications/unread-count') {
      var count = auth.getUnreadNotificationCount(currentUser.id, currentUser.role);
      sendJSON(res, { count: count });
      return;
    }

    // ── 系统状态与监控 ───────────────────────────
    // GET /api/health — 增强健康检查
    if (method === 'GET' && url === '/api/health') {
      const uploadDirSize = fs.readdirSync(UPLOAD_DIR).length;
      const dataDirSize = fs.readdirSync(DATA_DIR).filter(function(f) { return f.endsWith('.json') || f === 'aeo.db'; }).length;
      const issues = db.verifyDataIntegrity();
      // 磁盘空间
      let diskFree = 0, diskTotal = 0;
      try {
        const diskInfo = require('child_process').execSync('df -k .', { encoding: 'utf-8' }).split('\n')[1].split(/\s+/);
        if (diskInfo.length >= 4) { diskFree = parseInt(diskInfo[3]) * 1024; diskTotal = parseInt(diskInfo[1]) * 1024; }
      } catch(e) { /* df not available */ }
      const onlineUsers = db.getDb().prepare("SELECT COUNT(*) as cnt FROM sessions WHERE expires_at > datetime('now','localtime')").get().cnt;
      sendJSON(res, {
        status: issues.length === 0 ? 'ok' : 'degraded',
        version: '2.0.0',
        uptime: process.uptime(),
        dataFiles: dataDirSize,
        uploadFiles: uploadDirSize,
        backupFiles: fs.existsSync(path.join(DATA_DIR, 'backups')) ? fs.readdirSync(path.join(DATA_DIR, 'backups')).length : 0,
        integrityIssues: issues,
        onlineUsers: onlineUsers,
        totalUsers: db.getDb().prepare("SELECT COUNT(*) as cnt FROM users WHERE is_active = 1").get().cnt,
        diskFree: diskFree,
        diskTotal: diskTotal,
        diskUsagePercent: diskTotal > 0 ? Math.round((diskTotal - diskFree) / diskTotal * 100) : 0,
        serverTime: new Date().toISOString()
      });
      return;
    }

    // POST /api/backup — 手动触发备份
    if (method === 'POST' && url === '/api/backup') {
      if (!checkPerm(authInfo, 'system.backup')) return sendError(res, 403, '无权限');
      const fp = db.backupData();
      if (fp) {
        auth.addAuditLog(currentUser.id, currentUser.username, '手动备份数据库', 'system', '文件: ' + path.basename(fp), clientIP);
        sendJSON(res, { ok: true, backupFile: path.basename(fp) });
      } else {
        sendError(res, 500, '备份失败');
      }
      return;
    }

    // GET /api/activity — 最近活动
    if (method === 'GET' && url === '/api/activity') {
      const logs = auth.getAuditLogs({ limit: 30 });
      sendJSON(res, logs);
      return;
    }

    // ── 保持原有 REST API 兼容 ──────────────────
    // GET/PUT /api/data/:key
    if (method === 'GET' && url.startsWith('/api/data/')) {
      const key = url.slice('/api/data/'.length);
      const val = db.loadJson(key, null);
      sendJSON(res, val !== null ? val : null);
      return;
    }

    if (method === 'PUT' && url.startsWith('/api/data/')) {
      const key = url.slice('/api/data/'.length);
      const body = await parseBody(req);
      db.saveJson(key, body, currentUser.id, currentUser.displayName);
      sendJSON(res, { ok: true, key: key });
      return;
    }

    // GET /api/export — 导出所有数据
    if (method === 'GET' && url === '/api/export') {
      const exportData = db.exportAllData();
      sendJSON(res, exportData);
      return;
    }

    // POST /api/import — 导入所有数据
    if (method === 'POST' && url === '/api/import') {
      if (!checkPerm(authInfo, 'system.config')) return sendError(res, 403, '无权限');
      const body = await parseBody(req);
      var importCount = 0;
      Object.keys(body).forEach(function(key) {
        if (key.startsWith('_')) return;
        db.saveJson(key, body[key], currentUser.id, currentUser.displayName);
        importCount++;
      });
      auth.addAuditLog(currentUser.id, currentUser.username, '导入数据', 'data', '导入 ' + importCount + ' 项', clientIP);
      sendJSON(res, { ok: true, imported: importCount });
      return;
    }

    // ── 飞书集成（保持完全兼容） ────────────────
    // GET /api/company
    if (method === 'GET' && url === '/api/company') {
      const info = db.loadJson('companyInfo', null);
      sendJSON(res, info || { error: '公司信息未设置' });
      return;
    }

    // PUT /api/company
    if (method === 'PUT' && url === '/api/company') {
      const body = await parseBody(req);
      const current = db.loadJson('companyInfo', {});
      Object.keys(body).forEach(function(k) { current[k] = body[k]; });
      db.saveJson('companyInfo', current, currentUser.id, currentUser.displayName);
      sendJSON(res, { ok: true, company: current });
      return;
    }

    // GET /api/tasks (with ?dept=, ?status=, ?overdue= filters)
    if (method === 'GET' && url === '/api/tasks') {
      const params = new URL(req.url, 'http://localhost').searchParams;
      let tasks = db.loadJson('tasks', []) || [];
      if (params.get('dept')) tasks = tasks.filter(function(t) { return t.dept === params.get('dept'); });
      if (params.get('status')) tasks = tasks.filter(function(t) { return t.status === params.get('status'); });
      if (params.get('overdue') === 'true') {
        const now = new Date();
        tasks = tasks.filter(function(t) { return new Date(t.due) < now && t.status !== '已完成' && t.status !== '已关闭'; });
      }
      sendJSON(res, tasks);
      return;
    }

    // POST /api/tasks
    if (method === 'POST' && url === '/api/tasks') {
      const body = await parseBody(req);
      if (!body.name || !body.dept || !body.owner || !body.due) return sendError(res, 400, '缺少必填字段: name, dept, owner, due');
      let tasks = db.loadJson('tasks', []) || [];
      const nums = tasks.map(function(t) { var m = t.id.match(/TSK-(\d{4})-(\d+)/); return m ? parseInt(m[2]) : 0; });
      const next = nums.length > 0 ? Math.max.apply(null, nums) + 1 : 1;
      const year = new Date().getFullYear();
      const task = {
        id: 'TSK-' + year + '-' + String(next).padStart(4, '0'),
        name: body.name, standard: body.standard || '', dept: body.dept, owner: body.owner,
        due: body.due, req: body.req || '', attachReq: body.attachReq || '',
        status: '待下发', evidence: [], createdAt: new Date().toISOString()
      };
      tasks.push(task);
      db.saveJson('tasks', tasks, currentUser.id, currentUser.displayName);
      auth.addAuditLog(currentUser.id, currentUser.username, '创建任务: ' + task.name, 'task', task.dept + ' · ' + task.owner, clientIP);
      sendFeishuNotify('task_create', { name: task.name, id: task.id, dept: task.dept, owner: task.owner, due: task.due });
      sendJSON(res, { ok: true, task: task }, 201);
      return;
    }

    // PUT /api/tasks/:id/status
    if (method === 'PUT' && /^\/api\/tasks\/TSK-\d{4}-\d+\/status$/.test(url)) {
      const taskId = url.split('/')[3];
      const body = await parseBody(req);
      let tasks = db.loadJson('tasks', []) || [];
      const task = tasks.find(function(t) { return t.id === taskId; });
      if (!task) return sendError(res, 404, '任务未找到: ' + taskId);
      const validStatuses = ['待下发', '执行中', '审核中', '已完成', '已关闭'];
      if (!validStatuses.includes(body.status)) return sendError(res, 400, '状态值无效: ' + body.status);
      const oldStatus = task.status;
      task.status = body.status;
      db.saveJson('tasks', tasks, currentUser.id, currentUser.displayName);
      auth.addAuditLog(currentUser.id, currentUser.username, '更新任务状态: ' + task.name + ' → ' + body.status, 'task', task.id, clientIP);
      sendFeishuNotify('task_status', { name: task.name, id: taskId, oldStatus: oldStatus, newStatus: body.status, user: currentUser.displayName });
      sendJSON(res, { ok: true, taskId: taskId, oldStatus: oldStatus, newStatus: body.status });
      return;
    }

    // GET /api/tasks/stats
    if (method === 'GET' && url === '/api/tasks/stats') {
      const tasks = db.loadJson('tasks', []) || [];
      const now = new Date();
      sendJSON(res, {
        total: tasks.length, pending: tasks.filter(function(t) { return t.status === '待下发'; }).length,
        executing: tasks.filter(function(t) { return t.status === '执行中'; }).length,
        review: tasks.filter(function(t) { return t.status === '审核中'; }).length,
        done: tasks.filter(function(t) { return t.status === '已完成'; }).length,
        closed: tasks.filter(function(t) { return t.status === '已关闭'; }).length,
        overdue: tasks.filter(function(t) { return new Date(t.due) < now && t.status !== '已完成' && t.status !== '已关闭'; }).length
      });
      return;
    }

    // GET /api/audit-logs
    if (method === 'GET' && url === '/api/audit-logs') {
      const logParams = new URL(req.url, 'http://localhost').searchParams;
      const logs = auth.getAuditLogs({
        module: logParams.get('module') || '',
        action: logParams.get('action') || '',
        limit: parseInt(logParams.get('limit')) || 50
      });
      sendJSON(res, logs);
      return;
    }

    // GET/PUT /api/assessment
    if (method === 'GET' && url === '/api/assessment') {
      sendJSON(res, {
        answers: db.loadJson('assessmentAnswers', {}),
        results: db.loadJson('assessmentResults', {}),
        score: db.loadJson('lastAssessmentScore', 0),
        date: db.loadJson('lastAssessmentDate', null)
      });
      return;
    }

    if (method === 'PUT' && url === '/api/assessment') {
      const body = await parseBody(req);
      if (body.answers !== undefined) db.saveJson('assessmentAnswers', body.answers);
      if (body.results !== undefined) db.saveJson('assessmentResults', body.results);
      if (body.score !== undefined) {
        db.saveJson('lastAssessmentScore', body.score);
        db.saveJson('lastAssessmentDate', body.date || new Date().toISOString());
        sendFeishuNotify('assessment', { user: currentUser.displayName, score: body.score, time: new Date().toLocaleString('zh-CN') });
      }
      sendJSON(res, { ok: true });
      return;
    }

    // GET/PUT /api/finance
    if (method === 'GET' && url === '/api/finance') {
      sendJSON(res, db.loadJson('financeData', {}));
      return;
    }

    if (method === 'PUT' && url === '/api/finance') {
      const body = await parseBody(req);
      db.saveJson('financeData', body, currentUser.id, currentUser.displayName);
      sendJSON(res, { ok: true });
      return;
    }

    // GET /api/standards
    if (method === 'GET' && url === '/api/standards') {
      const standardsMeta = [
        { id: 'IC-01', name: '海关业务培训', dim: '内部控制', dept: '关务部' },
        { id: 'IC-02', name: '组织机构和岗位职责', dim: '内部控制', dept: '关务部' },
        { id: 'IC-03', name: '单证保管与海关封志', dim: '内部控制', dept: '关务部' },
        { id: 'IC-04', name: '进出口业务操作', dim: '内部控制', dept: '关务部' },
        { id: 'IC-05', name: '内部审计制度', dim: '内部控制', dept: '关务部' },
        { id: 'IC-06', name: '产品质量管理', dim: '内部控制', dept: '关务部' },
        { id: 'IC-07', name: '改进机制', dim: '内部控制', dept: '关务部' },
        { id: 'IC-08', name: '信息系统', dim: '内部控制', dept: 'IT部' },
        { id: 'IC-09', name: '数据管理', dim: '内部控制', dept: 'IT部' },
        { id: 'IC-10', name: '信息安全', dim: '内部控制', dept: 'IT部' },
        { id: 'IC-11', name: '守法合规', dim: '内部控制', dept: '关务部' },
        { id: 'FI-01', name: '财务状况标准', dim: '财务状况', dept: '财务部' },
        { id: 'LC-01', name: '遵守法律法规', dim: '守法规范', dept: '关务部' },
        { id: 'LC-02', name: '进出口业务规范', dim: '守法规范', dept: '关务部' },
        { id: 'LC-03', name: '进出口专项守法', dim: '守法规范', dept: '关务部' },
        { id: 'LC-04', name: '外部信用', dim: '守法规范', dept: '关务部' },
        { id: 'TS-01', name: '场所安全', dim: '贸易安全', dept: '行政部' },
        { id: 'TS-02', name: '进入安全', dim: '贸易安全', dept: '行政部' },
        { id: 'TS-03', name: '人员安全', dim: '贸易安全', dept: 'HR' },
        { id: 'TS-04', name: '商业伙伴安全', dim: '贸易安全', dept: '采购部' },
        { id: 'TS-05', name: '货物安全', dim: '贸易安全', dept: '物流/仓储' },
        { id: 'TS-06', name: '集装箱安全', dim: '贸易安全', dept: '物流/仓储' },
        { id: 'TS-07', name: '运输工具安全', dim: '贸易安全', dept: '物流/仓储' },
        { id: 'TS-08', name: '危机管理', dim: '贸易安全', dept: '行政部' },
        { id: 'TS-09', name: '安全培训', dim: '贸易安全', dept: 'HR' }
      ];
      sendJSON(res, { standards: standardsMeta, departments: ['关务部', '财务部', '法务部', '行政部', '物流/仓储', 'HR', '采购部', 'IT部', '内审部'] });
      return;
    }

    // ── 飞书设置 ──────────────────────────────
    if (method === 'GET' && url === '/api/settings/feishu') {
      const cfg = db.loadJson('feishuConfig', {});
      sendJSON(res, { ok: true, config: cfg });
      return;
    }
    if (method === 'POST' && url === '/api/settings/feishu') {
      const body = await parseBody(req);
      if (!checkPerm(authInfo, 'admin')) return sendError(res, 403, '无权限');
      if (body.config) db.saveJson('feishuConfig', body.config);
      sendJSON(res, { ok: true });
      return;
    }
    if (method === 'POST' && url === '/api/settings/feishu/test') {
      const body = await parseBody(req);
      const cfg = body.config || {};
      const appId = cfg.appId || FEISHU_APP_ID;
      const appSecret = cfg.appSecret || FEISHU_APP_SECRET;
      if (!appId || !appSecret) return sendJSON(res, { ok: false, message: '请先填写 App ID 和 App Secret' });
      try {
        if (feishuBot && typeof feishuBot.getAccessToken === 'function') {
          const token = await feishuBot.getAccessToken(appId, appSecret);
          sendJSON(res, { ok: true, message: '连接成功 ✓', hasToken: !!token });
        } else {
          sendJSON(res, { ok: false, message: '飞书模块未加载' });
        }
      } catch(e) {
        sendJSON(res, { ok: false, message: '连接失败: ' + e.message });
      }
      return;
    }

    // ── 飞书 Webhook ────────────────────────────
    // POST /api/webhook/feishu
    if (method === 'POST' && url === '/api/webhook/feishu') {
      const body = await parseBody(req);
      const { action, params: actionParams } = body;
      if (!action) return sendError(res, 400, '缺少 action 字段');
      let result;
      switch (action) {
        case 'getCompany':
          result = db.loadJson('companyInfo', {});
          break;
        case 'setCompany':
          if (!actionParams) return sendError(res, 400, '缺少 params');
          const cur = db.loadJson('companyInfo', {});
          Object.keys(actionParams).forEach(function(k) { cur[k] = actionParams[k]; });
          db.saveJson('companyInfo', cur);
          result = { ok: true, message: '公司信息已更新' };
          break;
        case 'listTasks':
          result = db.loadJson('tasks', []);
          if (actionParams && actionParams.dept) result = result.filter(function(t) { return t.dept === actionParams.dept; });
          if (actionParams && actionParams.status) result = result.filter(function(t) { return t.status === actionParams.status; });
          break;
        case 'createTask':
          if (!actionParams || !actionParams.name || !actionParams.dept || !actionParams.owner || !actionParams.due)
            return sendError(res, 400, 'name, dept, owner, due 为必填');
          var tList = db.loadJson('tasks', []);
          var nums = tList.map(function(t) { var m = t.id.match(/TSK-(\d{4})-(\d+)/); return m ? parseInt(m[2]) : 0; });
          var nxt = nums.length > 0 ? Math.max.apply(null, nums) + 1 : 1;
          var yr = new Date().getFullYear();
          var newTask = {
            id: 'TSK-' + yr + '-' + String(nxt).padStart(4, '0'),
            name: actionParams.name, standard: actionParams.standard || '', dept: actionParams.dept,
            owner: actionParams.owner, due: actionParams.due, req: actionParams.req || '',
            attachReq: actionParams.attachReq || '', status: '待下发', evidence: [], createdAt: new Date().toISOString()
          };
          tList.push(newTask);
          db.saveJson('tasks', tList);
          result = { ok: true, task: newTask };
          break;
        case 'updateTaskStatus':
          if (!actionParams || !actionParams.id || !actionParams.status) return sendError(res, 400, 'id 和 status 为必填');
          var tt = db.loadJson('tasks', []);
          var tTask = tt.find(function(t) { return t.id === actionParams.id; });
          if (!tTask) return sendError(res, 404, '任务未找到');
          tTask.status = actionParams.status;
          db.saveJson('tasks', tt);
          result = { ok: true, taskId: actionParams.id, newStatus: actionParams.status };
          break;
        case 'getStats':
          var st = db.loadJson('tasks', []);
          var n2 = new Date();
          result = {
            total: st.length, pending: st.filter(function(t) { return t.status === '待下发'; }).length,
            executing: st.filter(function(t) { return t.status === '执行中'; }).length,
            review: st.filter(function(t) { return t.status === '审核中'; }).length,
            done: st.filter(function(t) { return t.status === '已完成'; }).length,
            overdue: st.filter(function(t) { return new Date(t.due) < n2 && t.status !== '已完成' && t.status !== '已关闭'; }).length
          };
          break;
        default:
          return sendError(res, 400, '未知 action: ' + action);
      }
      sendJSON(res, { ok: true, data: result });
      return;
    }

    // POST /api/feishu/webhook
    if (method === 'POST' && url === '/api/feishu/webhook') {
      const body = await parseBody(req);
      if (feishuBot && FEISHU_APP_ID && FEISHU_APP_SECRET) {
        const result = await feishuBot.handleWebhook(body, {
          loadJson: db.loadJson, saveJson: function(k, v) { db.saveJson(k, v); },
          appId: FEISHU_APP_ID, appSecret: FEISHU_APP_SECRET
        });
        if (result.status) {
          res.writeHead(result.status, result.headers || { 'Content-Type': 'application/json' });
          res.end(result.body || '{}');
        }
      } else {
        sendJSON(res, { code: 0 });
      }
      return;
    }

    // ── 未匹配 → 静态文件 ──────────────────────────
    serveStatic(req, res, url);
  } catch (e) {
    console.error('请求处理异常:', e.message);
    console.error(e.stack);
    sendError(res, 500, '服务器内部错误: ' + e.message);
  }
});

// ── 启动时自动备份 ──────────────────────────────────
try { db.backupData(); } catch(e) { /* silent */ }
setInterval(function() { try { db.backupData(); } catch(e) { /* silent */ } }, 6 * 60 * 60 * 1000);

// ── 启动 ──────────────────────────────────────────────
const localIP = getLocalIP();
server.listen(PORT, '0.0.0.0', function() {
  console.log('');
  console.log('  ┌─────────────────────────────────────────────────────────────┐');
  console.log('  │  AEO海关认证管理系统 v2.0 · 服务已启动                      │');
  console.log('  ├─────────────────────────────────────────────────────────────┤');
  console.log('  │  存储升级: SQLite (data/aeo.db) + 文件存储 (uploads/)      │');
  console.log('  │  用户认证: Session Token + Basic Auth + API Key           │');
  console.log('  │  权限控制: RBAC (5 种角色, 细粒度权限)                    │');
  console.log('  │  数据追溯: 版本历史 + 回滚 + 审计日志                     │');
  console.log('  │  审批流程: 关键操作审批 + 整改跟踪 + 超期预警             │');
  console.log('  ├─────────────────────────────────────────────────────────────┤');
  console.log('  │  本机:    http://localhost:' + PORT + '                       │');
  console.log('  │  局域网:  http://' + localIP + ':' + PORT + '               │');
  console.log('  ├─────────────────────────────────────────────────────────────┤');
  console.log('  │  API 端点:                                                  │');
  console.log('  │  POST    /api/auth/login         用户登录                   │');
  console.log('  │  POST    /api/auth/logout        用户登出                   │');
  console.log('  │  GET     /api/auth/me            当前用户信息               │');
  console.log('  │  GET     /api/auth/permissions   当前用户权限               │');
  console.log('  │  GET     /api/users              用户管理                   │');
  console.log('  │  POST    /api/files/upload       文件上传                   │');
  console.log('  │  GET     /api/files              文件列表(?category=&ref_year=) │');
  console.log('  │  GET     /api/files/:id/download 文件下载                   │');
  console.log('  │  GET     /api/versions/:key      数据版本历史               │');
  console.log('  │  POST    /api/approvals          审批流程                   │');
  console.log('  │  GET     /api/rectifications     整改跟踪                   │');
  console.log('  │  GET     /api/rectifications/overdue 超期整改               │');
  console.log('  │  GET     /api/notifications      通知列表                   │');
  console.log('  │  GET     /api/activity           最近活动日志               │');
  console.log('  │  GET/PUT /api/data/:key          通用数据读写(兼容)         │');
  console.log('  │  POST    /api/backup             手动备份                   │');
  console.log('  │  GET     /api/health             增强健康检查               │');
  console.log('  │  ...（保留全部原有飞书/业务 API）                           │');
  console.log('  ├─────────────────────────────────────────────────────────────┤');
  console.log('  │  用户名: ' + USERNAME + ' (Basic Auth)                        │');
  console.log('  │  管理员: admin / admin123 (Session Auth)                    │');
  console.log('  │  数据: SQLite + JSON 兼容模式                              │');
  console.log('  ├─────────────────────────────────────────────────────────────┤');
  console.log('  │  Ctrl+C 停止服务器                                         │');
  console.log('  └─────────────────────────────────────────────────────────────┘');
  console.log('');
});
