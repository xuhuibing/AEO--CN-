// ========================================================================
// AEO认证稽核系统 v2.0 — 认证与权限模块
// ========================================================================
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24小时
const SESSION_CLEANUP_INTERVAL = 60 * 60 * 1000;  // 每小时清理

// ── 用户管理 ────────────────────────────────────────
function createUser(username, password, displayName, role, extra) {
  const exists = db.getDb().prepare("SELECT id FROM users WHERE username = ?").get(username);
  if (exists) throw new Error('用户名已存在: ' + username);
  const hash = bcrypt.hashSync(password, 10);
  const stmt = db.getDb().prepare(
    "INSERT INTO users (username, password_hash, display_name, role, email, phone, department) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  const result = stmt.run(username, hash, displayName || username, role || 'dept_lead',
    (extra && extra.email) || '', (extra && extra.phone) || '', (extra && extra.department) || '');
  return { id: result.lastInsertRowid, username, displayName: displayName || username, role: role || 'dept_lead' };
}

function authenticateUser(username, password) {
  const user = db.getDb().prepare("SELECT * FROM users WHERE username = ? AND is_active = 1").get(username);
  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password_hash)) return null;
  // 更新最后登录时间
  db.getDb().prepare("UPDATE users SET last_login = datetime('now','localtime') WHERE id = ?").run(user.id);
  return sanitizeUser(user);
}

function sanitizeUser(user) {
  return {
    id: user.id, username: user.username, displayName: user.display_name,
    role: user.role, email: user.email, phone: user.phone, department: user.department,
    avatar: user.avatar, lastLogin: user.last_login
  };
}

// ── 会话管理 ────────────────────────────────────────
function createSession(userId, ipAddress, userAgent) {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
  db.getDb().prepare(
    "INSERT INTO sessions (token, user_id, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)"
  ).run(token, userId, ipAddress || '', userAgent || '', expiresAt);
  return { token, expiresAt, userId };
}

function validateSession(token) {
  const session = db.getDb().prepare("SELECT s.user_id as id, s.id as session_id, u.username, u.display_name, u.role, u.email, u.phone, u.department, u.avatar, u.last_login FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > datetime('now','localtime') AND u.is_active = 1").get(token);
  if (!session) return null;
  // 更新最后活跃时间
  db.getDb().prepare("UPDATE sessions SET last_active = datetime('now','localtime') WHERE id = ?").run(session.session_id);
  return sanitizeUser(session);
}

function deleteSession(token) {
  db.getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

function deleteUserSessions(userId) {
  db.getDb().prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
}

function cleanupExpiredSessions() {
  db.getDb().prepare("DELETE FROM sessions WHERE expires_at <= datetime('now','localtime')").run();
}

// ── 角色与权限 ──────────────────────────────────────
function getRolePermissions(roleKey) {
  const role = db.getDb().prepare("SELECT * FROM roles WHERE role_key = ?").get(roleKey);
  if (!role) return [];
  try { return JSON.parse(role.permissions); }
  catch(e) { return []; }
}

function checkPermission(user, permission) {
  if (!user || !user.role) return false;
  const perms = getRolePermissions(user.role);
  return perms.includes(permission) || perms.includes('*');
}

function getRoleList() {
  return db.getDb().prepare("SELECT role_key, role_name, permissions, is_system FROM roles ORDER BY id").all()
    .map(r => ({ ...r, permissions: JSON.parse(r.permissions) }));
}

function updateRolePermissions(roleKey, permissions) {
  if (!Array.isArray(permissions)) throw new Error('permissions must be an array');
  db.getDb().prepare("UPDATE roles SET permissions = ? WHERE role_key = ?").run(JSON.stringify(permissions), roleKey);
}

// ── 用户列表 ───────────────────────────────────────
function getUsers() {
  return db.getDb().prepare(
    "SELECT id, username, display_name, role, email, phone, department, is_active, created_at, last_login FROM users ORDER BY id"
  ).all().map(u => ({
    id: u.id, username: u.username, displayName: u.display_name,
    role: u.role, email: u.email, phone: u.phone, department: u.department,
    isActive: !!u.is_active, createdAt: u.created_at, lastLogin: u.last_login
  }));
}

function getUserById(id) {
  const u = db.getDb().prepare("SELECT * FROM users WHERE id = ?").get(id);
  return u ? sanitizeUser(u) : null;
}

function updateUser(id, fields) {
  const allowed = ['display_name', 'role', 'email', 'phone', 'department', 'is_active'];
  const updates = [];
  const params = [];
  Object.keys(fields).forEach(k => {
    if (allowed.includes(k)) { updates.push(k + ' = ?'); params.push(fields[k]); }
  });
  if (updates.length === 0) return false;
  updates.push("updated_at = datetime('now','localtime')");
  params.push(id);
  db.getDb().prepare("UPDATE users SET " + updates.join(', ') + " WHERE id = ?").run(...params);
  return true;
}

function changePassword(id, oldPassword, newPassword) {
  const user = db.getDb().prepare("SELECT * FROM users WHERE id = ?").get(id);
  if (!user) throw new Error('用户不存在');
  if (!bcrypt.compareSync(oldPassword, user.password_hash)) throw new Error('原密码错误');
  const hash = bcrypt.hashSync(newPassword, 10);
  db.getDb().prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now','localtime') WHERE id = ?").run(hash, id);
  return true;
}

function resetPassword(id, newPassword) {
  const hash = bcrypt.hashSync(newPassword, 10);
  db.getDb().prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now','localtime') WHERE id = ?").run(hash, id);
}

// ── 审计日志 ───────────────────────────────────────
function addAuditLog(userId, username, action, moduleName, detail, ipAddress) {
  db.getDb().prepare(
    "INSERT INTO audit_logs (user_id, username, action, module, detail, ip_address) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(userId || null, username || '', action, moduleName || '', detail || '', ipAddress || '');
}

function getAuditLogs(options) {
  let sql = "SELECT * FROM audit_logs WHERE 1=1";
  const params = [];
  if (options.module) { sql += " AND module = ?"; params.push(options.module); }
  if (options.action) { sql += " AND action LIKE ?"; params.push('%' + options.action + '%'); }
  if (options.userId) { sql += " AND user_id = ?"; params.push(options.userId); }
  if (options.from) { sql += " AND created_at >= ?"; params.push(options.from); }
  if (options.to) { sql += " AND created_at <= ?"; params.push(options.to); }
  sql += " ORDER BY id DESC LIMIT ?";
  params.push(options.limit || 100);
  return db.getDb().prepare(sql).all(...params);
}

// ── 通知管理 ───────────────────────────────────────
function createNotification(title, content, type, targetUserId, targetRole, refType, refId) {
  db.getDb().prepare(
    "INSERT INTO notifications (title, content, type, target_user_id, target_role, ref_type, ref_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(title, content || '', type || 'info', targetUserId || null, targetRole || '', refType || '', refId || '');
}

function getNotifications(userId, role) {
  return db.getDb().prepare(
    "SELECT * FROM notifications WHERE (target_user_id IS NULL AND (target_role = '' OR target_role = ?)) OR target_user_id = ? ORDER BY id DESC LIMIT 50"
  ).all(role || '', userId || 0);
}

function markNotificationRead(id, userId) {
  db.getDb().prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND (target_user_id = ? OR target_user_id IS NULL)").run(id, userId);
}

function getUnreadNotificationCount(userId, role) {
  const row = db.getDb().prepare(
    "SELECT COUNT(*) as cnt FROM notifications WHERE is_read = 0 AND ((target_user_id IS NULL AND (target_role = '' OR target_role = ?)) OR target_user_id = ?)"
  ).get(role || '', userId || 0);
  return row ? row.cnt : 0;
}

// ── 定时清理 ───────────────────────────────────────
setInterval(cleanupExpiredSessions, SESSION_CLEANUP_INTERVAL);

module.exports = {
  createUser, authenticateUser,
  createSession, validateSession, deleteSession, deleteUserSessions,
  getRolePermissions, checkPermission, getRoleList, updateRolePermissions,
  getUsers, getUserById, updateUser, changePassword, resetPassword,
  addAuditLog, getAuditLogs,
  createNotification, getNotifications, markNotificationRead, getUnreadNotificationCount
};
