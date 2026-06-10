# AEO 海关认证管理系统 — 综合信息

> 生成日期：2026-06-11 02:17
> 项目目录：`/Users/bingxu/aeo-system/`（源码 + 运行时）
> 数据目录：`/Users/bingxu/bingxu-work-AEO/`（原始素材 + 认证标准文档）

---

## 一、项目背景

面向 **南京海关 AEO（Authorized Economic Operator，经认证的经营者）高级认证** 的企业合规管理平台。帮助进出口企业对标海关AEO高级认证标准（25项），实现标准自评、任务跟踪、整改闭环、文件管理、内部审计全流程数字化。

### 数据来源

- **45张照片OCR** — 百度网盘下载的《海关认证企业标准审核操作规范》手册照片，Tesseract OCR 提取全文
- **南京海关官方 Excel** — `南京海关AEO进出口收发货人高级认证内容.xlsx`，含25项认证标准全文 + 157条样本资料链接
- **海关官方 Word 文档** — 4份海关标准文件（单项标准、通用标准等）
- 整合产出：`aeo_南京海关AEO认证标准_检查表20260602.html`

---

## 二、系统架构

### 技术栈

| 组件 | 技术 |
|------|------|
| 运行时 | Node.js 20 (Alpine) |
| 数据库 | SQLite (better-sqlite3) + WAL 模式 |
| 前端 | 原生 HTML + Tailwind CSS + Chart.js |
| 图标 | Font Awesome 6（自托管） |
| 认证 | Session Token (bcrypt) + Basic Auth + API Key |
| 权限 | RBAC（5种预置角色，约30项细粒度权限） |
| 飞书 | 开放平台 API + Webhook + 智能体 |
| 部署 | Docker / Docker Compose / Systemd |

### 项目目录

```
aeo-system/
├── server.js              # HTTP 服务入口（~1118行，含所有路由）
├── lib/
│   ├── db.js              # SQLite 数据库模块（360行）
│   ├── auth.js            # 认证与权限模块（~200行）
│   ├── app.js             # 前端应用逻辑（~430KB，含 standards-data）
│   ├── standards-data.js  # AEO 标准条目数据（264KB，74项高级 + 62项认证标准）
│   ├── migrate.js         # JSON→SQLite 数据迁移工具
│   └── test-api.js        # API 集成测试（18项）
├── index.html             # 前端 SPA 主入口（~232KB，单页应用）
├── intro.html             # 功能介绍页面（独立分享页，6个Tab）
├── feishu.js              # 飞书集成模块
├── data/                  # 运行时数据（卷挂载）
│   ├── aeo.db             # SQLite 数据库
│   └── backups/           # 自动备份（每6小时）
├── uploads/               # 上传文件（卷挂载）
├── deploy/
│   └── aeo-system.service # Systemd 服务单元
├── Dockerfile             # 两阶段 Alpine 构建
├── docker-compose.yml     # 编排配置
└── docs/                  # 项目文档
```

---

## 三、功能模块（19个）

### 核心业务模块

| # | 模块 | 说明 |
|---|------|------|
| 1 | **仪表盘** | 数据概览：任务统计、评估分数、近期活动、超期预警图 |
| 2 | **认证标准** | 25项 AEO 认证标准展示，按维度/部门筛选，附带检查要点 |
| 3 | **标准自评** | 逐项评分（3档），自动计算达标率，历史评分趋势图 |
| 4 | **任务管理** | 任务创建/分配/状态流转（待下发→执行中→审核中→已完成），支持过滤排序 |
| 5 | **整改跟踪** | 问题创建→整改→验收闭环，严重程度标记，超期自动预警 |
| 6 | **内部审计** | 审计计划制定、执行记录、报告出具 |
| 7 | **文件管理** | 上传/下载/预览/删除，按分类/年份/模块检索 |
| 8 | **供应商管理** | 供应商安全评估，批量导入/导出 |
| 9 | **培训中心** | 培训计划、记录、完成度追踪 |
| 10 | **法律法规模块** | 法律法规信息管理 |

### 管理支持模块

| # | 模块 | 说明 |
|---|------|------|
| 11 | **用户管理** | 用户 CRUD、角色分配、密码管理 |
| 12 | **角色权限** | 5种预置角色，约30项细粒度权限 |
| 13 | **审批中心** | 关键操作提交审批/通过/驳回 |
| 14 | **审计日志** | 按模块/用户/时间查询操作历史 |
| 15 | **通知系统** | 按角色/用户推送通知，标记已读 |
| 16 | **数据版本** | 所有数据变更记录版本，支持回滚 |
| 17 | **系统设置** | 系统监控、数据管理、飞书配置、安全状态 |
| 18 | **数据看板视图** | 看板视图展示任务、整改、审计状态 |
| 19 | **报告导出** | 评估结果导出 |

### 飞书集成

| 功能 | 说明 |
|------|------|
| 消息接收 | 飞书开放平台事件回调 |
| 意图解析 | 8种自然语言指令（查/改公司、查/创建任务、更新状态、统计、查标准、查日志） |
| 通知推送 | 系统事件→飞书消息（任务创建、审批、整改、评估完成） |
| 认证 | API Key 认证（请求头/查询参数） |
| 凭证 | App ID: cli_aa8f4b7820b85cd5 |

---

## 四、认证标准体系

### 四大维度

#### 1. 内部控制（11项）

| 编号 | 标准项 | 责任部门 |
|:----:|--------|----------|
| IC-01 | 海关业务培训 | 关务部 |
| IC-02 | 组织机构与岗位职责 | 关务部 |
| IC-03 | 单证保管与海关封志 | 关务部 |
| IC-04 | 进出口业务操作 | 关务部 |
| IC-05 | 内部审计制度 | 关务部 |
| IC-06 | 产品质量管理 | 关务部 |
| IC-07 | 改进机制 | 关务部 |
| IC-08 | 信息系统 | IT部 |
| IC-09 | 数据管理 | IT部 |
| IC-10 | 信息安全 | IT部 |
| IC-11 | 守法合规 | 关务部 |

#### 2. 财务状况（1项）
| 编号 | 标准项 | 责任部门 |
|:----:|--------|----------|
| FI-01 | 财务状况标准 | 财务部 |

#### 3. 守法规范（4项）
| 编号 | 标准项 | 责任部门 |
|:----:|--------|----------|
| LC-01 | 遵守法律法规 | 关务部 |
| LC-02 | 进出口业务规范 | 关务部 |
| LC-03 | 进出口专项守法 | 关务部 |
| LC-04 | 外部信用 | 关务部 |

#### 4. 贸易安全（9项）
| 编号 | 标准项 | 责任部门 |
|:----:|--------|----------|
| TS-01 | 场所安全 | 行政部 |
| TS-02 | 进入安全 | 行政部 |
| TS-03 | 人员安全 | HR |
| TS-04 | 商业伙伴安全 | 采购部 |
| TS-05 | 货物安全 | 物流/仓储 |
| TS-06 | 集装箱安全 | 物流/仓储 |
| TS-07 | 运输工具安全 | 物流/仓储 |
| TS-08 | 危机管理 | 行政部 |
| TS-09 | 安全培训 | HR |

### 评分模型

自评采用 **3档评分**：达标 / 基本达标 / 不达标
- 自动计算各维度达标率和总评分
- 历史评分趋势追踪
- 导出评估报告

---

## 五、角色与权限体系

### 5种预置角色

| 角色 | 权限范围 | 适用人员 |
|------|----------|----------|
| **customs_officer**（关务经理） | 全部权限（30+项） | 关务经理、系统管理员 |
| **dept_lead**（部门AEO对接人） | 标准查看/编辑、任务创建、文件上传 | 各部门 AEO 对接人 |
| **auditor**（内审员） | 审计创建/执行、标准查看 | 内审员 |
| **executive**（企业高管） | 只读查看（仪表盘、评估、审计、日志） | 企业高管 |
| **customs_viewer**（海关查看者） | 最小只读权限（仪表盘、标准、档案） | 海关查看者 |

### 权限列表（约30项）

```
dashboard.view, dashboard.manage
assessment.view, assessment.edit, assessment.submit
standard.view, standard.edit
task.view, task.create, task.edit, task.delete, task.approve
audit.view, audit.create, audit.edit, audit.delete
finance.view, finance.edit, finance.approve
supplier.view, supplier.edit
archive.view, archive.create, archive.delete
training.view, training.edit
document.view, document.upload, document.delete
user.view, user.manage
system.config, system.backup, system.logs
```

---

## 六、API 端点汇总

### 认证
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/login | 用户登录（Session Token） |
| POST | /api/auth/logout | 用户登出 |
| POST | /api/auth/register | 用户注册（首个用户为管理员） |
| GET | /api/auth/me | 当前用户信息 |
| GET | /api/auth/permissions | 当前用户权限 |

### 用户管理
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/users | 用户列表 |
| POST | /api/users | 创建用户 |
| PUT | /api/users/:id | 更新用户 |
| PUT | /api/users/:id/password | 修改/重置密码 |
| GET | /api/users/roles | 角色列表 |
| PUT | /api/users/roles/:key | 更新角色权限 |

### 文件管理
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/files/upload | 上传文件（multipart/Base64） |
| GET | /api/files | 文件列表（按分类/年份/模块过滤） |
| GET | /api/files/:id/download | 下载文件 |
| GET | /api/files/:id/view | 在线预览 |
| DELETE | /api/files/:id | 删除文件 |

### 业务管理
| 方法 | 路径 | 说明 |
|------|------|------|
| GET/PUT | /api/company | 公司信息 |
| GET/PUT | /api/tasks | 任务管理 |
| PUT | /api/tasks/:id/status | 更新任务状态 |
| GET | /api/tasks/stats | 任务统计 |
| GET/PUT | /api/assessment | 标准自评 |
| GET/PUT | /api/finance | 财务数据 |
| GET | /api/standards | 认证标准列表 |

### 流程与监控
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/approvals | 提交审批 |
| GET | /api/approvals | 审批列表 |
| POST | /api/approvals/:id/approve | 通过审批 |
| POST | /api/approvals/:id/reject | 驳回审批 |
| GET | /api/rectifications | 整改列表 |
| POST | /api/rectifications | 创建整改 |
| PUT | /api/rectifications/:id | 更新整改 |
| PUT | /api/rectifications/:id/approve | 整改验收/退回 |
| GET | /api/rectifications/overdue | 超期整改 |
| GET | /api/notifications | 通知列表 |
| POST | /api/notifications/:id/read | 标记已读 |
| GET | /api/notifications/unread-count | 未读数量 |
| GET | /api/health | 健康检查（含磁盘/在线用户/数据完整性）|
| POST | /api/backup | 手动备份 |
| GET | /api/activity | 最近活动日志 |
| GET/PUT | /api/data/:key | 通用 JSON 数据读写（兼容） |
| GET | /api/export | 导出所有数据 |
| POST | /api/import | 导入数据 |

### 飞书集成
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/settings/feishu | 获取飞书配置 |
| POST | /api/settings/feishu | 保存飞书配置 |
| POST | /api/settings/feishu/test | 测试飞书连接 |
| POST | /api/webhook/feishu | 飞书 Webhook（8种操作） |
| POST | /api/feishu/webhook | 飞书事件回调 |

---

## 七、数据库结构（SQLite）

### 7张核心表

| 表名 | 说明 | 关键字段 |
|------|------|----------|
| **users** | 用户表 | id, username, password_hash, role, department, is_active |
| **sessions** | 会话表 | token, user_id, expires_at |
| **roles** | 角色权限表 | role_key, role_name, permissions (JSON) |
| **audit_logs** | 审计日志 | user_id, action, module, detail, ip_address |
| **data_versions** | 数据版本 | data_key, data_value (JSON), user_id |
| **approvals** | 审批表 | ref_type, ref_id, status, requester, reviewer |
| **files** | 文件表 | original_name, stored_name, mime_type, file_size, category |
| **notifications** | 通知表 | title, type, target_role, target_user_id, is_read |
| **rectifications** | 整改跟踪 | issue_desc, severity, status, owner, due_date |

### 索引
- sessions: token, user_id
- audit_logs: user_id, created_at, module
- data_versions: data_key
- approvals: status
- files: ref_year + ref_module
- notifications: target_user_id
- rectifications: status, due_date

---

## 八、部署方案

### 方式一：Docker（推荐）
```bash
cp .env.example .env
docker compose up -d
```

### 方式二：裸机部署（Node.js 18+）
```bash
./init.sh
node server.js        # 前台运行
./start.sh --daemon   # 进程守护
```

### 方式三：Systemd 生产环境
```bash
sudo ./init.sh
sudo cp deploy/aeo-system.service /etc/systemd/system/
sudo systemctl enable --now aeo-system
```

### Cloudflare Tunnel（外网访问）
```bash
./tunnel.sh
# 临时地址：https://companion-lan-tall-camel.trycloudflare.com
```

### 环境变量
| 变量 | 默认值 | 说明 |
|------|--------|------|
| PORT | 3080 | 监听端口 |
| ADMIN_USERNAME | aeo | Basic Auth 用户名 |
| ADMIN_PASSWORD | aeo2026 | Basic Auth 密码 |
| API_KEY | (空) | API 密钥 |
| FEISHU_APP_ID | (空) | 飞书 App ID |
| FEISHU_APP_SECRET | (空) | 飞书 App Secret |

### 默认账户
| 用户名 | 密码 | 角色 | 认证方式 |
|--------|------|------|----------|
| admin | admin123 | customs_officer | Session（前端登录） |
| aeo | aeo2026 | — | Basic Auth（API 访问） |

### 备份策略
- 自动：每6小时备份到 `data/backups/`，保留最近30个
- 手动：`POST /api/backup` 或 `npm run backup`

---

## 九、企业协作流程

```
关务经理
    │
    ├── 下发任务 ──→ 部门AEO对接人 ──→ 上传佐证材料
    │                      │
    │                      ├── 内审员审计 ──→ 出具报告
    │                      │       │
    │                      │       └── 整改通知 ──→ 部门整改
    │                      │
    │                      └── 验收 ──→ 关务经理确认闭环
    │
    └── 企业高管（只读审批）
```

### 任务生命周期
`待下发 → 执行中 → 审核中 → 已完成 → 已关闭`

### 整改生命周期
`open → in_progress → resolved → pending_accept → closed`

---

## 十、开发历史

| 阶段 | 日期 | 内容 |
|:----:|:----:|------|
| 数据准备 | 06-02 | OCR识别45张照片，解析南京海关Excel，生成检查表 |
| v2.0 架构升级 | 06-03 | SQLite替换JSON文件，Session认证，RBAC，文件API，数据版本，审计日志 |
| 三期功能改造 | 06-04~05 | 19个功能模块闭环：标准展示、整改、审批、供应商、内部审计、培训中心、看板等 |
| 飞书集成 | 06-04~05 | feishu.js 模块，8种自然语言指令，事件回调 |
| 企业级部署 | 06-09~10 | Docker/Docker Compose、Systemd、Cloudflare Tunnel、功能介绍页、README |
| 当前 | 06-11 | 系统完整可运行，源码+数据均在本地 |

### Git 分支
- 仓库：`https://github.com/xuhuibing/AEO--CN-.git`
- 4 个提交：初始化、项目文件+部署、企业级部署+意见反馈、静态文件修复+功能介绍页

---

## 十一、后续规划

### 高优先级
1. 认证标准关联任务自动下发（标准达标自动创建整改任务）
2. 飞书通知增强（卡片消息、飞书内审批操作）

### 中优先级
3. 数据看板完善（更多图表、自定义布局）
4. 批量操作增强（整改批量分配、任务批量更新）
5. 审批流程扩展（多级审批链、超时自动升级）

### 低优先级
6. 多语言支持（英文版、海关双语展示）
7. LDAP/AD 集成
8. 集群部署
9. 移动 App（小程序）

---

## 十二、使用指南

### 本地访问
- 本机：`http://localhost:3080`
- 局域网：`http://<局域网IP>:3080`

### 登录步骤
1. 浏览器访问上述地址
2. 输入用户名 `admin`、密码 `admin123`
3. 登录后自动跳转到仪表盘
4. 在"用户管理"中创建各部门用户

### 功能介绍页
`http://localhost:3080/intro.html` — 可直接分享给同事查看系统功能说明。
