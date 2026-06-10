#!/bin/bash
# ========================================================================
# AEO海关认证管理系统 — 一键部署脚本
# 适用系统: Ubuntu 20.04+ / Debian 11+ / CentOS 8+
# 使用方法:
#   sudo bash deploy.sh -d aeo.yourcompany.com
# 参数说明:
#   -d DOMAIN  必需，部署域名（如 aeo.example.com）
#   -e EMAIL   可选，SSL证书注册邮箱
#   -p PORT    可选，后端端口（默认3080）
#   -h         显示帮助
# ========================================================================

set -e

# ── 颜色 ──────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ── 帮助 ──────────────────────────────────────────────
usage() {
    echo "用法: sudo bash deploy.sh -d 域名 [-e 邮箱] [-p 端口]"
    echo ""
    echo "必需参数:"
    echo "  -d DOMAIN  部署域名（如 aeo.example.com）"
    echo "可选参数:"
    echo "  -e EMAIL   Let's Encrypt 注册邮箱（用于证书到期提醒）"
    echo "  -p PORT    后端监听端口（默认3080）"
    echo "  -h         显示此帮助"
    exit 0
}

# ── 解析参数 ──────────────────────────────────────────
DOMAIN=""
EMAIL=""
PORT=3080

while getopts "d:e:p:h" opt; do
    case $opt in
        d) DOMAIN="$OPTARG" ;;
        e) EMAIL="$OPTARG" ;;
        p) PORT="$OPTARG" ;;
        h) usage ;;
        *) usage ;;
    esac
done

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}错误: 请指定域名 (-d)${NC}"
    usage
fi

# ── 检查 root ─────────────────────────────────────────
if [ "$(id -u)" -ne 0 ]; then
    echo -e "${RED}错误: 请使用 sudo 或 root 用户运行${NC}"
    exit 1
fi

# ── 配置 ──────────────────────────────────────────────
APP_DIR="/opt/aeo-system"
NGINX_CONF="/etc/nginx/conf.d/aeo.conf"

echo ""
echo "=============================================="
echo -e "${BLUE}  AEO 海关认证管理系统 - 一键部署${NC}"
echo "=============================================="
echo -e "  域名:      ${GREEN}$DOMAIN${NC}"
echo -e "  端口:      ${GREEN}$PORT${NC}"
echo -e "  安装目录:  ${GREEN}$APP_DIR${NC}"
echo "=============================================="
echo ""

# ── Step 1: 检测系统 ─────────────────────────────────
echo -e "${YELLOW}[1/8] 检测系统环境...${NC}"
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    echo "  系统: $NAME $VERSION_ID"
else
    OS="unknown"
    echo "  系统: 未知"
fi

# ── Step 2: 安装 Node.js 20 ──────────────────────────
echo ""
echo -e "${YELLOW}[2/8] 安装 Node.js 20...${NC}"
if command -v node &>/dev/null; then
    echo -e "  Node.js 已安装: $(node --version)"
else
    if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
    elif [ "$OS" = "centos" ] || [ "$OS" = "rhel" ]; then
        curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
        yum install -y nodejs
    else
        echo -e "${RED}不支持的 Linux 发行版，请手动安装 Node.js 20${NC}"
        exit 1
    fi
    echo -e "  安装完成: $(node --version)"
fi

# ── Step 3: 安装 Nginx ───────────────────────────────
echo ""
echo -e "${YELLOW}[3/8] 安装 Nginx...${NC}"
if command -v nginx &>/dev/null; then
    echo -e "  Nginx 已安装: $(nginx -v 2>&1)"
else
    if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
        apt-get install -y nginx
    elif [ "$OS" = "centos" ] || [ "$OS" = "rhel" ]; then
        yum install -y nginx
    fi
    systemctl enable nginx
    echo -e "  Nginx 安装完成"
fi

# ── Step 4: 部署项目代码 ─────────────────────────────
echo ""
echo -e "${YELLOW}[4/8] 部署项目代码...${NC}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

if [ "$PROJECT_DIR" != "$APP_DIR" ]; then
    # 从脚本所在项目复制到目标目录
    rsync -a --exclude=node_modules --exclude=data --exclude=uploads --exclude=.git --exclude=.env "$PROJECT_DIR/" "$APP_DIR/"
    echo -e "  代码已部署到 $APP_DIR"
else
    echo -e "  已在目标目录中"
fi

cd "$APP_DIR"

# ── Step 5: 配置环境变量 ─────────────────────────────
echo ""
echo -e "${YELLOW}[5/8] 配置环境变量...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env

    # 生成随机密码
    ADMIN_PASS=$(openssl rand -base64 16)
    API_KEY=$(openssl rand -hex 16)

    # 写入 .env
    sed -i "s/ADMIN_PASSWORD=aeo2026/ADMIN_PASSWORD=$ADMIN_PASS/" .env
    sed -i "s/^API_KEY=$/API_KEY=$API_KEY/" .env
    sed -i "s|CORS_ORIGINS=http://localhost:3080|CORS_ORIGINS=https://$DOMAIN|" .env

    echo -e "  环境变量已生成"
    echo -e "  ${YELLOW}━━━ 重要：请记录以下凭据 ━━━${NC}"
    echo -e "  Basic Auth 账号: ${GREEN}aeo${NC}"
    echo -e "  Basic Auth 密码: ${GREEN}$ADMIN_PASS${NC}"
    echo -e "  API Key:         ${GREEN}$API_KEY${NC}"
    echo -e "  ${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
else
    echo -e "  .env 文件已存在，跳过"
fi

# ── Step 6: 安装依赖 ─────────────────────────────────
echo ""
echo -e "${YELLOW}[6/8] 安装 npm 依赖...${NC}"
npm install --production
echo -e "  依赖安装完成"

# ── Step 7: 配置 Nginx + SSL ─────────────────────────
echo ""
echo -e "${YELLOW}[7/8] 配置 Nginx + SSL 证书...${NC}"

# 确保 nginx 配置目录存在
mkdir -p /etc/nginx/conf.d

# 复制 Nginx 配置
if [ -f "$APP_DIR/deploy/nginx-aeo.conf" ]; then
    cp "$APP_DIR/deploy/nginx-aeo.conf" "$NGINX_CONF"
    # 替换域名
    sed -i "s/server_name aeo.yourcompany.com;/server_name $DOMAIN;/g" "$NGINX_CONF"
    # 替换端口
    sed -i "s/server 127.0.0.1:3080;/server 127.0.0.1:$PORT;/g" "$NGINX_CONF"
    sed -i "s/proxy_pass http:\/\/aeo_backend/proxy_pass http:\/\/127.0.0.1:$PORT/g" "$NGINX_CONF"
    echo -e "  Nginx 配置已写入 $NGINX_CONF"
else
    # 使用默认 nginx 配置
    cat > "$NGINX_CONF" << NGINX_EOF
server {
    listen 80;
    server_name $DOMAIN;

    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/auth/login {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
NGINX_EOF
    echo -e "  Nginx 配置已生成"
fi

# 申请 SSL 证书
echo ""
if command -v certbot &>/dev/null; then
    echo "  检测到 certbot，正在申请 SSL 证书..."
    CERTBOT_ARGS="--nginx -d $DOMAIN --non-interactive --agree-tos"
    if [ -n "$EMAIL" ]; then
        CERTBOT_ARGS="$CERTBOT_ARGS -m $EMAIL"
    else
        CERTBOT_ARGS="$CERTBOT_ARGS --register-unsafely-without-email"
    fi

    if certbot $CERTBOT_ARGS; then
        echo -e "  ${GREEN}SSL 证书申请成功${NC}"
        systemctl enable certbot.timer 2>/dev/null || true
    else
        echo -e "  ${YELLOW}SSL 证书申请失败，将使用 HTTP（不安全）${NC}"
        echo -e "  ${YELLOW}稍后可手动运行: certbot --nginx -d $DOMAIN${NC}"
    fi
else
    echo -e "  ${YELLOW}未安装 certbot，将使用 HTTP（不安全）${NC}"
    echo -e "  ${YELLOW}稍后可手动安装: apt install certbot python3-certbot-nginx${NC}"
    echo -e "  ${YELLOW}然后运行: certbot --nginx -d $DOMAIN${NC}"
fi

# 测试 nginx 配置
nginx -t && systemctl reload nginx
echo -e "  Nginx 已重新加载"

# ── Step 8: 注册 Systemd 服务并启动 ──────────────────
echo ""
echo -e "${YELLOW}[8/8] 注册系统服务并启动...${NC}"

# 创建 aeo 用户（如果不存在）
id -u aeo &>/dev/null || useradd -r -s /sbin/nologin -d "$APP_DIR" aeo

# 设置目录权限
chown -R aeo:aeo "$APP_DIR" 2>/dev/null || true
mkdir -p "$APP_DIR/data" "$APP_DIR/uploads" "$APP_DIR/data/backups"
chown -R aeo:aeo "$APP_DIR/data" "$APP_DIR/uploads"

# 复制 Systemd 服务文件
if [ -f "$APP_DIR/deploy/aeo-system.service" ]; then
    cp "$APP_DIR/deploy/aeo-system.service" /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable aeo-system
    systemctl restart aeo-system
    echo -e "  Systemd 服务已注册并启动"
else
    # 手动创建 Systemd 服务文件
    cat > /etc/systemd/system/aeo-system.service << SYSTEMD_EOF
[Unit]
Description=AEO customs compliance management system
After=network.target network-online.target
Wants=network-online.target

[Service]
Type=simple
User=aeo
Group=aeo
WorkingDirectory=$APP_DIR
EnvironmentFile=$APP_DIR/.env
ExecStart=/usr/bin/node $APP_DIR/server.js
Restart=always
RestartSec=10
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=true
ReadWritePaths=$APP_DIR/data $APP_DIR/uploads
LimitNOFILE=65536
LimitNPROC=4096

[Install]
WantedBy=multi-user.target
SYSTEMD_EOF
    systemctl daemon-reload
    systemctl enable aeo-system
    systemctl restart aeo-system
    echo -e "  Systemd 服务已创建并启动"
fi

# ── 等待启动 ─────────────────────────────────────────
echo ""
echo -e "  等待服务启动..."
for i in $(seq 1 10); do
    if curl -sf http://127.0.0.1:$PORT/api/health > /dev/null 2>&1; then
        echo -e "  ${GREEN}服务已成功启动${NC}"
        break
    fi
    sleep 1
done

# ── 输出部署结果 ──────────────────────────────────────
echo ""
echo "=============================================="
echo -e "${GREEN}  🎉 AEO 系统部署完成！${NC}"
echo "=============================================="
echo ""
echo -e "  访问地址:   ${GREEN}https://$DOMAIN${NC}"
echo ""
echo -e "  管理员登录（请在页面操作）:"
echo -e "    用户名:   admin"
echo -e "    密码:     admin123"
echo -e "    ${RED}⚠ 首次登录后请立即修改密码${NC}"
echo ""
echo -e "  API 访问（Basic Auth）:"
echo -e "    用户名:   aeo"
echo -e "    密码:     $ADMIN_PASS"
echo ""
echo -e "  服务管理命令:"
echo -e "    查看状态:  ${BLUE}systemctl status aeo-system${NC}"
echo -e "    查看日志:  ${BLUE}journalctl -u aeo-system -f${NC}"
echo -e "    重启服务:  ${BLUE}systemctl restart aeo-system${NC}"
echo ""
echo -e "  部署目录:   $APP_DIR"
echo -e "  数据目录:   $APP_DIR/data"
echo -e "  上传目录:   $APP_DIR/uploads"
echo ""
echo "=============================================="
echo -e "${YELLOW}  请将本页输出的凭据保存到安全位置${NC}"
echo "=============================================="
