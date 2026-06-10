// ========================================================================
// AEO认证稽核系统 v2.0 — SQLite 数据库模块
// ========================================================================
const path = require('path');
const Database = require('better-sqlite3');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const DB_PATH = path.join(DATA_DIR, 'aeo.db');

let db = null;

// ── 初始化数据库 ──────────────────────────────────────
function initDatabase() {
  const fs = require('fs');
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    -- 用户表
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL DEFAULT 'dept_lead',
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      department TEXT DEFAULT '',
      avatar TEXT DEFAULT '',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      last_login TEXT
    );

    -- 会话表
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL REFERENCES users(id),
      ip_address TEXT DEFAULT '',
      user_agent TEXT DEFAULT '',
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      last_active TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );

    -- 角色权限表
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_key TEXT UNIQUE NOT NULL,
      role_name TEXT NOT NULL,
      permissions TEXT NOT NULL DEFAULT '[]',
      is_system INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );

    -- 审计日志表
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      username TEXT DEFAULT '',
      action TEXT NOT NULL,
      module TEXT NOT NULL DEFAULT '',
      detail TEXT DEFAULT '',
      ip_address TEXT DEFAULT '',
      metadata TEXT DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );

    -- 数据版本表（用于回滚）
    CREATE TABLE IF NOT EXISTS data_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data_key TEXT NOT NULL,
      data_value TEXT NOT NULL,
      user_id INTEGER REFERENCES users(id),
      username TEXT DEFAULT '',
      action TEXT DEFAULT 'update',
      description TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );

    -- 审批表
    CREATE TABLE IF NOT EXISTS approvals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ref_type TEXT NOT NULL,
      ref_id TEXT NOT NULL,
      ref_desc TEXT DEFAULT '',
      old_value TEXT DEFAULT '',
      new_value TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      requester_id INTEGER REFERENCES users(id),
      requester_name TEXT DEFAULT '',
      reviewer_id INTEGER REFERENCES users(id),
      reviewer_name TEXT DEFAULT '',
      review_comment TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      reviewed_at TEXT
    );

    -- 文件表
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_name TEXT NOT NULL,
      stored_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      mime_type TEXT DEFAULT '',
      file_size INTEGER DEFAULT 0,
      category TEXT DEFAULT '',
      ref_year TEXT DEFAULT '',
      ref_module TEXT DEFAULT '',
      ref_id TEXT DEFAULT '',
      uploaded_by INTEGER REFERENCES users(id),
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );

    -- 公告/通知表
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      type TEXT DEFAULT 'info',
      target_role TEXT DEFAULT '',
      target_user_id INTEGER REFERENCES users(id),
      is_read INTEGER NOT NULL DEFAULT 0,
      ref_type TEXT DEFAULT '',
      ref_id TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );

    -- 整改跟踪表
    CREATE TABLE IF NOT EXISTS rectifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ref_type TEXT NOT NULL,
      ref_id TEXT NOT NULL,
      issue_desc TEXT NOT NULL,
      severity TEXT DEFAULT 'medium',
      status TEXT NOT NULL DEFAULT 'open',
      owner TEXT DEFAULT '',
      owner_id INTEGER REFERENCES users(id),
      due_date TEXT,
      completed_at TEXT,
      resolution TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_module ON audit_logs(module);
    CREATE INDEX IF NOT EXISTS idx_data_versions_key ON data_versions(data_key);
    CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);
    CREATE INDEX IF NOT EXISTS idx_files_ref ON files(ref_year, ref_module);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(target_user_id);
    CREATE INDEX IF NOT EXISTS idx_rectifications_status ON rectifications(status);
    CREATE INDEX IF NOT EXISTS idx_rectifications_due ON rectifications(due_date);
  `);


  // 整改跟踪表 — 字段迁移（兼容已有数据库）
  try { db.exec("ALTER TABLE rectifications ADD COLUMN initiator_dept TEXT DEFAULT ''"); } catch(e) {}
  try { db.exec("ALTER TABLE rectifications ADD COLUMN initiator_name TEXT DEFAULT ''"); } catch(e) {}
  try { db.exec("ALTER TABLE rectifications ADD COLUMN issue_date TEXT DEFAULT ''"); } catch(e) {}
  try { db.exec("ALTER TABLE rectifications ADD COLUMN follow_dept TEXT DEFAULT ''"); } catch(e) {}
  try { db.exec("ALTER TABLE rectifications ADD COLUMN is_closed INTEGER DEFAULT 0"); } catch(e) {}
  try { db.exec("ALTER TABLE rectifications ADD COLUMN accept_dept_customs INTEGER DEFAULT 0"); } catch(e) {}
  try { db.exec("ALTER TABLE rectifications ADD COLUMN accept_dept_audit INTEGER DEFAULT 0"); } catch(e) {}
  try { db.exec("ALTER TABLE rectifications ADD COLUMN confirmed_by TEXT DEFAULT ''"); } catch(e) {}
  try { db.exec("ALTER TABLE rectifications ADD COLUMN confirmed_at TEXT DEFAULT ''"); } catch(e) {}
  try { db.exec("ALTER TABLE rectifications ADD COLUMN approval_comment TEXT DEFAULT ''"); } catch(e) {}
  // 插入默认角色
  const existingRoles = db.prepare('SELECT COUNT(*) as cnt FROM roles').get();
  if (existingRoles.cnt === 0) {
    const insertRole = db.prepare('INSERT INTO roles (role_key, role_name, permissions, is_system) VALUES (?, ?, ?, 1)');
    db.transaction(() => {
      insertRole.run('customs_officer', '关务经理', JSON.stringify([
        'dashboard.view', 'dashboard.manage',
        'assessment.view', 'assessment.edit', 'assessment.submit',
        'standard.view', 'standard.edit',
        'task.view', 'task.create', 'task.edit', 'task.delete', 'task.approve',
        'audit.view', 'audit.create', 'audit.edit', 'audit.delete',
        'finance.view', 'finance.edit', 'finance.approve',
        'supplier.view', 'supplier.edit',
        'archive.view', 'archive.create', 'archive.delete',
        'training.view', 'training.edit',
        'document.view', 'document.upload', 'document.delete',
        'user.view', 'user.manage',
        'system.config', 'system.backup', 'system.logs'
      ]));
      insertRole.run('dept_lead', '部门AEO对接人', JSON.stringify([
        'dashboard.view',
        'standard.view', 'standard.edit',
        'task.view', 'task.create', 'task.edit',
        'audit.view',
        'training.view', 'training.edit',
        'document.view', 'document.upload'
      ]));
      insertRole.run('auditor', '内审员', JSON.stringify([
        'dashboard.view',
        'standard.view',
        'task.view',
        'audit.view', 'audit.create', 'audit.edit',
        'finance.view',
        'document.view', 'document.upload'
      ]));
      insertRole.run('executive', '企业高管', JSON.stringify([
        'dashboard.view',
        'assessment.view',
        'standard.view',
        'task.view',
        'audit.view',
        'finance.view',
        'archive.view',
        'system.logs'
      ]));
      insertRole.run('customs_viewer', '海关查看者', JSON.stringify([
        'dashboard.view',
        'standard.view',
        'archive.view'
      ]));
    })();
  }

  // 插入默认管理员
  const adminCount = db.prepare("SELECT COUNT(*) as cnt FROM users WHERE username = 'admin'").get();
  if (adminCount.cnt === 0) {
    const bcrypt = require('bcryptjs');
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare("INSERT INTO users (username, password_hash, display_name, role) VALUES (?, ?, ?, 'customs_officer')")
      .run('admin', hash, '系统管理员');
  }

  return db;
}

// ── 数据库访问函数 ──────────────────────────────────
function getDb() {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
}

function closeDatabase() {
  if (db) { db.close(); db = null; }
}

// ── 通用 JSON 数据存取（兼容 old JSON file 模式）────
// 将业务数据以 JSON 形式存入 data_versions 表（latest 版本）
// 同时提供兼容 loadJson/saveJson 接口
const jsonCache = {};

function loadJson(key, fallback) {
  if (jsonCache[key] !== undefined) return jsonCache[key];
  try {
    const row = db.prepare("SELECT data_value FROM data_versions WHERE data_key = ? ORDER BY id DESC LIMIT 1").get(key);
    if (row) {
      jsonCache[key] = JSON.parse(row.data_value);
      return jsonCache[key];
    }
  } catch(e) { /* ignore */ }
  return typeof fallback === 'function' ? fallback() : fallback;
}

function saveJson(key, val, userId, userName) {
  jsonCache[key] = val;
  const json = JSON.stringify(val);
  const ts = new Date().toISOString();
  db.prepare("INSERT INTO data_versions (data_key, data_value, user_id, username, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(key, json, userId || null, userName || 'system', ts);
}

function deleteJson(key) {
  delete jsonCache[key];
  db.prepare("DELETE FROM data_versions WHERE data_key = ?").run(key);
}

// ── 数据版本历史 ───────────────────────────────────
function getDataVersions(key, limit) {
  return db.prepare(
    "SELECT id, data_key, username, action, description, created_at FROM data_versions WHERE data_key = ? ORDER BY id DESC LIMIT ?"
  ).all(key, limit || 20);
}

function getDataVersionById(id) {
  const row = db.prepare("SELECT * FROM data_versions WHERE id = ?").get(id);
  if (row) row.data_value = JSON.parse(row.data_value);
  return row;
}

function restoreDataVersion(id) {
  const row = db.prepare("SELECT * FROM data_versions WHERE id = ?").get(id);
  if (!row) return null;
  jsonCache[row.data_key] = JSON.parse(row.data_value);
  return row;
}

// ── 数据版本清理（每 key 保留最近 100 个版本） ─────────
function cleanupDataVersions() {
  try {
    const keys = db.prepare("SELECT DISTINCT data_key FROM data_versions").all();
    for (const row of keys) {
      const count = db.prepare("SELECT COUNT(*) as cnt FROM data_versions WHERE data_key = ?").get(row.data_key);
      if (count.cnt > 100) {
        const excess = count.cnt - 100;
        db.prepare(
          "DELETE FROM data_versions WHERE id IN (SELECT id FROM data_versions WHERE data_key = ? ORDER BY id ASC LIMIT ?)"
        ).run(row.data_key, excess);
      }
    }
  } catch(e) {
    console.error('数据版本清理失败:', e.message);
  }
}
// 每小时清理一次
setInterval(cleanupDataVersions, 60 * 60 * 1000);

// ── 备份（兼容原 backupData） ──────────────────────
function backupData() {
  const fs = require('fs');
  const backupDir = path.join(DATA_DIR, 'backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupFile = path.join(backupDir, 'aeo-backup-' + ts + '.db');

  try {
    db.backup(backupFile);
    // 保留最近30个备份
    const backups = fs.readdirSync(backupDir)
      .filter(f => f.startsWith('aeo-backup-') && f.endsWith('.db'))
      .sort().reverse();
    if (backups.length > 30) {
      backups.slice(30).forEach(f => fs.unlinkSync(path.join(backupDir, f)));
    }
    return backupFile;
  } catch(e) {
    console.error('备份失败:', e.message);
    return null;
  }
}

// ── 导出所有数据（JSON 格式，兼容原 export） ──────
function exportAllData() {
  const data = {};
  const rows = db.prepare(
    "SELECT d1.data_key, d1.data_value FROM data_versions d1 INNER JOIN (SELECT data_key, MAX(id) as max_id FROM data_versions GROUP BY data_key) d2 ON d1.id = d2.max_id"
  ).all();
  rows.forEach(r => {
    try { data[r.data_key] = JSON.parse(r.data_value); } catch(e) { data[r.data_key] = r.data_value; }
  });
  data._exportTime = new Date().toISOString();
  return data;
}

// ── 数据完整性检查 ────────────────────────────────
function verifyDataIntegrity() {
  const issues = [];
  try {
    const rows = db.prepare("SELECT data_key, data_value FROM data_versions d1 WHERE id = (SELECT MAX(id) FROM data_versions d2 WHERE d2.data_key = d1.data_key)").all();
    rows.forEach(r => {
      try { JSON.parse(r.data_value); } catch(e) { issues.push(r.data_key + ': JSON 解析失败'); }
    });
  } catch(e) {
    issues.push('数据库读取失败: ' + e.message);
  }
  return issues;
}

module.exports = {
  initDatabase, getDb, closeDatabase,
  loadJson, saveJson, deleteJson,
  getDataVersions, getDataVersionById, restoreDataVersion,
  backupData, exportAllData, verifyDataIntegrity
};
