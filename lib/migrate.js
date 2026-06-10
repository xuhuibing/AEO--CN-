// ========================================================================
// AEO认证稽核系统 v2.0 — 数据迁移脚本（JSON → SQLite）
// ========================================================================
// 运行: node lib/migrate.js
// 将 data/*.json 文件中的数据迁移到 SQLite data/aeo.db
// ========================================================================
const fs = require('fs');
const path = require('path');
const db = require('./db');

console.log('AEO认证稽核系统 v2.0 — 数据迁移工具');
console.log('========================================');

// 初始化数据库
db.initDatabase();
const DATA_DIR = path.resolve(__dirname, '..', 'data');

// 读取所有 JSON 文件
const files = fs.readdirSync(DATA_DIR).filter(function(f) {
  return f.endsWith('.json') && !f.startsWith('backup') && !f.startsWith('_') && f !== 'package.json';
});

console.log('发现 ' + files.length + ' 个 JSON 数据文件');

var migrated = 0;
var skipped = 0;

files.forEach(function(file) {
  var filePath = path.join(DATA_DIR, file);
  var key = file.replace(/\.json$/, '');

  // Skip system files
  if (key.startsWith('_') || key === 'aeo') return;

  try {
    var content = fs.readFileSync(filePath, 'utf-8');
    var data = JSON.parse(content);

    // Skip empty data
    if (data === null || (Array.isArray(data) && data.length === 0) || (typeof data === 'object' && Object.keys(data).length === 0)) {
      skipped++;
      return;
    }

    // Check if data already exists in SQLite
    var existingRows = db.getDb().prepare("SELECT COUNT(*) as cnt FROM data_versions WHERE data_key = ?").get(key);
    if (existingRows && existingRows.cnt > 0) {
      console.log('  ⏭ 跳过 ' + key + ' (已存在于 SQLite)');
      skipped++;
      return;
    }

    // Import to SQLite
    db.saveJson(key, data, null, 'migration');
    console.log('  ✅ 已迁移: ' + key + ' (' + JSON.stringify(data).length + ' bytes)');
    migrated++;
  } catch(e) {
    console.log('  ❌ 迁移失败 ' + file + ': ' + e.message);
  }
});

console.log('');
console.log('迁移完成:');
console.log('  ✅ 成功: ' + migrated + ' 项');
console.log('  ⏭ 跳过: ' + skipped + ' 项');
console.log('  数据库: ' + path.join(DATA_DIR, 'aeo.db'));

// 验证
var totalVersions = db.getDb().prepare("SELECT COUNT(*) as cnt FROM data_versions").get();
console.log('  数据版本: ' + totalVersions.cnt + ' 条记录');
console.log('');

// 检查用户
var userCount = db.getDb().prepare("SELECT COUNT(*) as cnt FROM users").get();
console.log('  用户: ' + userCount.cnt + ' 人');

db.closeDatabase();
console.log('========================================');
console.log('迁移完成！请重启服务器: node server.js');
