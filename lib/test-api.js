// ========================================================================
// AEO认证稽核系统 v2.0 — API 集成测试
// ========================================================================
// 运行: node lib/test-api.js
// 启动服务器后执行基本 API 功能测试
// ========================================================================
const http = require('http');

var BASE = 'http://localhost:3080';
var passed = 0;
var failed = 0;

function api(method, path, body, auth) {
  return new Promise(function(resolve, reject) {
    var options = {
      hostname: 'localhost',
      port: 3080,
      path: path,
      method: method,
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    };
    if (auth) options.headers['Authorization'] = 'Bearer ' + auth;
    if (body) options.headers['Content-Length'] = Buffer.byteLength(body);

    var req = http.request(options, function(res) {
      var data = '';
      res.on('data', function(c) { data += c; });
      res.on('end', function() {
        var parsed = null;
        try { parsed = JSON.parse(data); } catch(e) {}
        resolve({ status: res.statusCode, data: parsed, raw: data });
      });
    });
    req.on('error', function(e) { reject(e); });
    req.on('timeout', function() { req.destroy(); reject(new Error('Timeout')); });
    if (body) req.write(body);
    req.end();
  });
}

function test(name, fn) {
  return fn().then(function(result) {
    if (result.pass) {
      console.log('  ✅ ' + name);
      passed++;
    } else {
      console.log('  ❌ ' + name + ': ' + (result.reason || 'failed'));
      failed++;
    }
  }).catch(function(e) {
    console.log('  ❌ ' + name + ': ' + e.message);
    failed++;
  });
}

console.log('');
console.log('AEO认证稽核系统 — API 测试');
console.log('========================================');
console.log('目标: ' + BASE);
console.log('');

var token = '';

Promise.resolve()
  .then(function() {
    return test('系统健康检查（Basic Auth）', function() {
      return api('GET', '/api/health', null, null).then(function(r) {
        // Basic auth may fail for health check, that's OK
        // Just check the server is responding
        return { pass: r.status === 401 || (r.data && r.data.status === 'ok') };
      });
    });
  })
  .then(function() {
    return test('用户登录（有效凭据）', function() {
      return api('POST', '/api/auth/login', JSON.stringify({ username: 'admin', password: 'admin123' })).then(function(r) {
        if (r.status === 200 && r.data && r.data.ok && r.data.token) {
          token = r.data.token;
          return { pass: true };
        }
        return { pass: false, reason: 'status=' + r.status + ' ok=' + (r.data ? r.data.ok : 'no data') };
      });
    });
  })
  .then(function() {
    return test('用户登录（无效密码应拒绝）', function() {
      return api('POST', '/api/auth/login', JSON.stringify({ username: 'admin', password: 'wrongpass' })).then(function(r) {
        return { pass: r.status === 401 || (r.data && !r.data.ok) };
      });
    });
  })
  .then(function() {
    return test('获取当前用户信息', function() {
      return api('GET', '/api/auth/me', null, token).then(function(r) {
        return { pass: r.data && r.data.ok && r.data.user && r.data.user.id === 1 };
      });
    });
  })
  .then(function() {
    return test('获取用户权限列表', function() {
      return api('GET', '/api/auth/permissions', null, token).then(function(r) {
        return { pass: r.data && r.data.ok && Array.isArray(r.data.permissions) };
      });
    });
  })
  .then(function() {
    return test('用户列表查询', function() {
      return api('GET', '/api/users', null, token).then(function(r) {
        return { pass: Array.isArray(r.data) && r.data.length > 0 };
      });
    });
  })
  .then(function() {
    return test('创建新用户', function() {
      var ts = Date.now();
      return api('POST', '/api/users', JSON.stringify({ username: 'testuser' + ts, password: 'test123', displayName: '测试用户', role: 'auditor' }), token).then(function(r) {
        return { pass: r.status === 201 || r.data.ok, reason: r.data ? r.data.error : '' };
      });
    });
  })
  .then(function() {
    return test('角色列表查询', function() {
      return api('GET', '/api/users/roles', null, token).then(function(r) {
        return { pass: Array.isArray(r.data) && r.data.length === 5 };
      });
    });
  })
  .then(function() {
    return test('文件列表（空）', function() {
      return api('GET', '/api/files?category=evidence', null, token).then(function(r) {
        return { pass: Array.isArray(r.data) };
      });
    });
  })
  .then(function() {
    return test('创建整改项', function() {
      return api('POST', '/api/rectifications', JSON.stringify({ issue_desc: 'API测试整改项', severity: 'medium', owner: '测试', due_date: '2026-12-31' }), token).then(function(r) {
        return { pass: r.data && r.data.ok && r.data.id > 0 };
      });
    });
  })
  .then(function() {
    return test('查询整改列表', function() {
      return api('GET', '/api/rectifications', null, token).then(function(r) {
        return { pass: Array.isArray(r.data) && r.data.length > 0 };
      });
    });
  })
  .then(function() {
    return test('查询通知', function() {
      return api('GET', '/api/notifications', null, token).then(function(r) {
        return { pass: Array.isArray(r.data) };
      });
    });
  })
  .then(function() {
    return test('查询最近活动日志', function() {
      return api('GET', '/api/activity', null, token).then(function(r) {
        return { pass: Array.isArray(r.data) };
      });
    });
  })
  .then(function() {
    return test('增强健康检查', function() {
      return api('GET', '/api/health', null, null).then(function(r) {
        // Health requires auth - so we use Bearer
        return api('GET', '/api/health', null, token).then(function(r2) {
          return { pass: r2.data && r2.data.status === 'ok' && r2.data.version && typeof r2.data.uptime === 'number' };
        });
      });
    });
  })
  .then(function() {
    return test('手动备份', function() {
      return api('POST', '/api/backup', null, token).then(function(r) {
        return { pass: r.data && r.data.ok };
      });
    });
  })
  .then(function() {
    return test('兼容 GET /api/data/:key', function() {
      return api('GET', '/api/data/companyInfo', null, token).then(function(r) {
        return { pass: r.status === 200 };
      });
    });
  })
  .then(function() {
    return test('兼容 PUT /api/data/:key', function() {
      return api('PUT', '/api/data/testkey', JSON.stringify({ test: true }), token).then(function(r) {
        return { pass: r.data && r.data.ok };
      });
    });
  })
  .then(function() {
    return test('登出', function() {
      return api('POST', '/api/auth/logout', null, token).then(function(r) {
        return { pass: r.data && r.data.ok };
      });
    });
  })
  .then(function() {
    console.log('========================================');
    console.log('测试结果: ' + passed + ' 通过, ' + failed + ' 失败, ' + (passed + failed) + ' 总计');
    console.log('');
    if (failed > 0) process.exit(1);
  });
