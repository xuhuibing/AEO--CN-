#!/bin/bash
# ====================================================================
# AEO海关认证管理系统 — 一键初始化脚本（裸机部署）
# ====================================================================
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│  AEO海关认证管理系统 v2.0 — 初始化脚本                      │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
echo ""

# ── 检查 Node.js ─────────────────────────────────────────
echo -e "${YELLOW}[1/6] 检查 Node.js 环境...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}  ✗ 未找到 Node.js${NC}"
    echo "  请安装 Node.js 18+ (推荐 20 LTS):"
    echo "    https://nodejs.org/"
    exit 1
fi

NODE_VER=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VER" -lt 18 ]; then
    echo -e "${RED}  ✗ Node.js 版本过低: $(node -v) (需要 18+)${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ Node.js $(node -v)${NC}"

# ── 检查 npm ─────────────────────────────────────────────
echo -e "${YELLOW}[2/6] 检查 npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}  ✗ 未找到 npm${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ npm $(npm -v)${NC}"

# ── 安装依赖 ─────────────────────────────────────────────
echo -e "${YELLOW}[3/6] 安装项目依赖...${NC}"
cd "$(dirname "$0")"

if [ ! -f package.json ]; then
    echo -e "${RED}  ✗ 未找到 package.json${NC}"
    exit 1
fi

npm install --production
echo -e "${GREEN}  ✓ 依赖安装完成${NC}"

# ── 创建必要目录 ────────────────────────────────────────
echo -e "${YELLOW}[4/6] 创建数据目录...${NC}"
mkdir -p data uploads data/backups
chmod 755 data uploads data/backups
echo -e "${GREEN}  ✓ 目录就绪: data/, uploads/, data/backups/${NC}"

# ── 配置环境变量 ────────────────────────────────────────
echo -e "${YELLOW}[5/6] 配置环境变量...${NC}"
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}  ✓ 已从 .env.example 创建 .env${NC}"
        echo -e "${YELLOW}  ⚠ 请编辑 .env 修改密码等配置${NC}"
    else
        echo -e "${YELLOW}  ⚠ 未找到 .env.example, 跳过${NC}"
    fi
else
    echo -e "${GREEN}  ✓ .env 已存在${NC}"
fi

# ── 初始化数据库 + 测试 ─────────────────────────────────
echo -e "${YELLOW}[6/6] 验证安装...${NC}"
node -e "
const db = require('./lib/db');
try {
    db.initDatabase();
    console.log('  ✓ 数据库初始化成功');
    const count = db.getDb().prepare('SELECT COUNT(*) as cnt FROM users').get();
    console.log('  ✓ 用户表就绪 (' + count.cnt + ' 个用户)');
    db.closeDatabase();
} catch(e) {
    console.error('  ✗ 数据库初始化失败: ' + e.message);
    process.exit(1);
}
"
echo -e "${GREEN}  ✓ 系统验证通过${NC}"

# ── 完成 ─────────────────────────────────────────────────
echo ""
echo -e "${GREEN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${GREEN}│  ✅ AEO系统初始化完成！                                     │${NC}"
echo -e "${GREEN}├─────────────────────────────────────────────────────────────┤${NC}"
echo -e "${GREEN}│  启动命令:                                                 │${NC}"
echo -e "${GREEN}│    node server.js                  (默认配置)               │${NC}"
echo -e "${GREEN}│    node server.js 8080             (自定义端口)             │${NC}"
echo -e "${GREEN}│    ./start.sh                      (带进程守护)             │${NC}"
echo -e "${GREEN}│    ./start.sh --daemon             (守护模式)               │${NC}"
echo -e "${GREEN}├─────────────────────────────────────────────────────────────┤${NC}"
echo -e "${GREEN}│  首次访问:  http://localhost:3080                           │${NC}"
echo -e "${GREEN}│  管理员登录: admin / admin123                               │${NC}"
echo -e "${GREEN}│  API Basic Auth: 参见 .env 中的 ADMIN_USERNAME/PASSWORD    │${NC}"
echo -e "${GREEN}├─────────────────────────────────────────────────────────────┤${NC}"
echo -e "${GREEN}│  ⚠ 安全提醒:                                              │${NC}"
echo -e "${GREEN}│  1. 务必修改默认密码 admin123                               │${NC}"
echo -e "${GREEN}│  2. 生产环境请使用反向代理 (nginx) + HTTPS                 │${NC}"
echo -e "${GREEN}│  3. 定期备份 data/ 目录                                     │${NC}"
echo -e "${GREEN}└─────────────────────────────────────────────────────────────┘${NC}"
echo ""
