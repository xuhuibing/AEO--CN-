const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

// ── 配置 ─────────────────────────────────────────────
// 可通过命令行参数覆盖: node server.js [port] [username] [password]
const PORT = parseInt(process.argv[2]) || 3080;
const USERNAME = process.argv[3] || 'aeo';
const PASSWORD = process.argv[4] || 'aeo2026';
const ROOT = __dirname;
// ───────────────────────────────────────────────────

// 获取局域网 IP
function getLocalIP() {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) return net.address;
        }
    }
    return '127.0.0.1';
}

// Basic Auth 校验
function auth(req) {
    const header = req.headers['authorization'] || '';
    const token = header.split(' ')[1];
    if (!token) return false;
    const decoded = Buffer.from(token, 'base64').toString();
    return decoded === `${USERNAME}:${PASSWORD}`;
}

function unauth(res) {
    res.writeHead(401, {
        'WWW-Authenticate': 'Basic realm="AEO System Login"',
        'Content-Type': 'text/html; charset=utf-8'
    });
    res.end('<!DOCTYPE html><html lang=zh-CN><meta charset=utf-8><title>AEO系统</title><body style="font-family:sans-serif;display:flex;height:100vh;align-items:center;justify-content:center;background:#f1f5f9"><div style="background:white;padding:40px;border-radius:12px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.1)"><h2 style="color:#1e3a5f">AEO认证稽核系统</h2><p style="color:#64748b;margin-top:8px">请输入用户名和密码访问</p></div></body></html>');
}

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
    if (!auth(req)) return unauth(res);

    let url = req.url.split('?')[0];
    if (url === '/') url = '/index.html';

    const filePath = path.join(ROOT, url);

    // 安全校验：防止目录穿越
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        return res.end('Forbidden');
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            return res.end('<h3>404 - 文件未找到</h3>');
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
    });
});

const localIP = getLocalIP();
server.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('  ┌─────────────────────────────────────────────┐');
    console.log('  │     AEO认证稽核系统 · 已启动               │');
    console.log('  ├─────────────────────────────────────────────┤');
    console.log(`  │  本机:    http://localhost:${PORT}            │`);
    console.log(`  │  局域网:  http://${localIP}:${PORT}    │`);
    console.log('  ├─────────────────────────────────────────────┤');
    console.log('  │  用户名: ' + USERNAME + '                    │');
    console.log('  │  密码:   ' + PASSWORD + '                    │');
    console.log('  ├─────────────────────────────────────────────┤');
    console.log('  │  Ctrl+C 停止服务器                          │');
    console.log('  └─────────────────────────────────────────────┘');
    console.log('');
});
