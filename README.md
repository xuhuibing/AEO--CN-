# AEO海关认证管理系统 v2.0

企业级海关AEO认证合规管理平台。支持部门协作、任务跟踪、整改闭环、文件管理、审计日志和角色权限控制。

## 快速开始

### 方式一：Docker 部署（推荐）

```bash
# 1. 配置环境变量
cp .env.example .env
# 编辑 .env，修改 ADMIN_PASSWORD 等配置

# 2. 构建并启动
docker compose up -d

# 3. 查看日志
docker compose logs -f

# 4. 访问系统
open http://localhost:3080
```

### 方式二：裸机部署

需要 Node.js 18+。

```bash
# 1. 一键初始化
chmod +x init.sh
./init.sh

# 2. 启动服务
node server.js

# 3. 或使用进程守护模式
./start.sh --daemon
```

### 方式三：Systemd 服务（生产 Linux 服务器）

```bash
# 1. 初始化系统
sudo ./init.sh

# 2. 创建系统用户并部署
sudo useradd -r -s /bin/false -m -d /opt/aeo-system aeo
sudo cp -r . /opt/aeo-system/
sudo chown -R aeo:aeo /opt/aeo-system

# 3. 安装系统服务
sudo mkdir -p /opt/aeo-system
sudo cp deploy/aeo-system.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now aeo-system

# 4. 检查状态
sudo systemctl status aeo-system
sudo journalctl -u aeo-system -f
```

## 访问系统

| 地址 | 说明 |
|------|------|
| http://localhost:3080 | 本机访问 |
| http://<局域网IP>:3080 | 同网络设备访问 |

## 默认账户

| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| admin | admin123 | customs_officer | 系统管理员（前端 Session 登录） |
| aeo | aeo2026 | — | Basic Auth 凭据（API 访问） |

**⚠ 安全警告：首次部署后请务必修改默认密码！**
- 在系统内通过"用户管理"修改 admin 密码
- 编辑 .env 文件修改 ADMIN_PASSWORD
- 生产环境请配置 HTTPS 反向代理

## 配置说明

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| PORT | 3080 | HTTP 监听端口 |
| ADMIN_USERNAME | aeo | Basic Auth 用户名 |
| ADMIN_PASSWORD | aeo2026 | Basic Auth 密码 |
| API_KEY | (空) | API 密钥，设置后可通过请求头认证 |
| FEISHU_APP_ID | (空) | 飞书开放平台 App ID |
| FEISHU_APP_SECRET | (空) | 飞书开放平台 App Secret |
| NODE_ENV | production | 运行环境 |

配置优先级：**CLI 参数 > 环境变量 > 默认值**

```bash
# 示例：通过环境变量
PORT=8080 ADMIN_USERNAME=customs ADMIN_PASSWORD=complexPass! node server.js

# 示例：通过 CLI 参数
node server.js 8080 customs complexPass!
```

### .env 文件

复制 `.env.example` 为 `.env` 并按需修改。Docker 部署时 docker compose 会自动加载 `.env` 文件。

## 角色与部门协作指南

### 5 种预置角色

| 角色 | 权限范围 | 适用人员 |
|------|----------|----------|
| customs_officer | 全部权限（管理、审计、审批、配置） | 关务经理、系统管理员 |
| dept_lead | 标准查看/编辑、任务创建、文件上传 | 各部门 AEO 对接人 |
| auditor | 审计创建/执行、标准查看 | 内审员 |
| executive | 只读查看（仪表盘、评估、审计、日志） | 企业高管 |
| customs_viewer | 最小只读权限（仪表盘、标准、档案） | 海关查看者 |

### 企业协作流程

```
关务经理 ──下发任务──> 部门对接人 ──上传资料──> 内审员
    ▲                       │                    │
    │                       ▼                    │
    │                 整改通知                    │
    │                       │                    │
    │                       ▼                    ▼
    └───────────── 验收通过 <─── 整改完成 ──────
                        │
                        ▼
                  企业高管（只读审批）
```

1. **关务经理** 创建任务并分配给各部门
2. **部门对接人** 执行任务并上传佐证材料
3. **内审员** 进行内部审核并出具报告
4. **部门对接人** 整改不符合项
5. **关务经理** 最终验收闭环
6. **企业高管** 只读查看系统整体进度

### 创建用户

在系统界面的"用户管理 → 创建用户"中：
- 选择对应角色
- 填写所属部门
- 初始密码建议 6 位以上，首次登录后修改

## 数据备份与恢复

### 自动备份

系统每 **6 小时** 自动备份一次 SQLite 数据库到 `data/backups/`。最多保留 **30 个** 最新备份。

### 手动备份

```bash
# 通过 API
curl -X POST http://localhost:3080/api/backup \
  -H "Authorization: Basic $(echo -n 'aeo:aeo2026' | base64)"

# 通过 npm script
npm run backup
```

### 恢复备份

```bash
# 1. 停止服务
# 2. 替换数据库
cp data/backups/aeo-backup-2026-06-09T10-00-00.db data/aeo.db
# 3. 重启服务
```

### 完整数据目录备份

```bash
# 定期备份整个 data/ 目录
tar -czf aeo-backup-$(date +%Y%m%d).tar.gz data/
```

## 健康检查

系统提供 `/api/health` 端点返回详细健康状态：

```json
{
  "status": "ok",
  "version": "2.0.0",
  "uptime": 86400,
  "onlineUsers": 3,
  "totalUsers": 12,
  "diskUsagePercent": 45,
  "serverTime": "2026-06-09T08:00:00.000Z"
}
```

Docker HEALTHCHECK 每 30 秒检查一次此端点。

## 安全建议

1. **修改默认密码** — 所有预置账户首次部署后立即修改密码
2. **配置 HTTPS** — 建议使用 nginx/caddy 反向代理 + Let's Encrypt
3. **限制访问 IP** — 仅允许内网或 VPN 访问
4. **定期备份** — 将 data/ 目录备份到异地存储
5. **监控审计日志** — 定期审查 user.manage 和 system.config 操作
6. **API 密钥** — 启用 API_KEY 并定期轮换
7. **文件上传** — uploads/ 目录不应直接通过 Web 服务

### Nginx 反向代理示例

```nginx
server {
    listen 443 ssl;
    server_name aeo.example.com;

    ssl_certificate /etc/letsencrypt/live/aeo.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aeo.example.com/privkey.pem;

    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:3080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 故障排查

### 端口被占用

```bash
# 查找占用端口的进程
lsof -i :3080

# 指定其他端口启动
node server.js 3081
```

### 数据库问题

```bash
# 删除并重建数据库（注意：会丢失数据！）
rm data/aeo.db data/aeo.db-wal data/aeo.db-shm
node server.js
# 系统会自动重建表和默认数据
```

### 依赖安装失败

```bash
# 清理缓存重试
rm -rf node_modules package-lock.json
npm install
```

### Docker 构建问题

```bash
# 清理 Docker 缓存
docker compose build --no-cache
```

## 技术栈

| 组件 | 技术 |
|------|------|
| 运行时 | Node.js 20 (Alpine) |
| 数据库 | SQLite (better-sqlite3) |
| 前端 | 原生 HTML + Tailwind CSS + Chart.js |
| 图标 | Font Awesome 6 |
| 认证 | Session Token + Basic Auth + API Key |
| 权限 | RBAC (5 种预置角色) |

## 项目目录

```
aeo-system/
├── server.js              # HTTP 服务入口
├── package.json           # 项目配置与依赖
├── Dockerfile             # Docker 构建文件
├── docker-compose.yml     # Docker Compose 配置
├── .env.example           # 环境变量示例
├── .gitignore             # Git 忽略规则
├── init.sh                # 裸机初始化脚本
├── start.sh               # 启动脚本（含进程守护）
├── index.html             # 前端 SPA 入口
├── lib/                   # 后端模块
│   ├── db.js              # SQLite 数据库模块
│   ├── auth.js            # 认证与权限模块
│   ├── app.js             # 前端应用逻辑
│   ├── migrate.js         # 数据迁移工具
│   ├── standards-data.js  # AEO 标准条目数据
│   ├── tailwind/          # 自托管 Tailwind CSS
│   ├── chart.js/          # 自托管 Chart.js
│   └── fa/                # 自托管 Font Awesome
├── src/                   # 前端源代码
├── data/                  # 运行时数据（卷挂载）
│   ├── aeo.db             # SQLite 数据库
│   └── backups/           # 自动备份目录
├── uploads/               # 上传文件（卷挂载）
├── docs/                  # 项目文档
├── feishu.js              # 飞书集成模块
└── deploy/                # 部署相关文件
    └── aeo-system.service # Systemd 服务单元
```
