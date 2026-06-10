#!/bin/bash
# AEO认证稽核系统 - 启动脚本（带进程守护）
# 使用方式:
#   ./start.sh                              (端口3080, 用户aeo, 密码aeo2026)
#   ./start.sh 8080                         (自定义端口)
#   ./start.sh 8080 admin mypass            (完全自定义)
#   ./start.sh 3080 aeo aeo2026 "" appId secret  (指定飞书App ID和Secret)
#   ./start.sh --daemon                     (以守护进程模式运行)
#
# 飞书开放平台集成（可选）：
#   方式1: ./start.sh 3080 aeo aeo2026 "" cli_xxx secret
#   方式2: FEISHU_APP_ID=cli_xxx FEISHU_APP_SECRET=secret ./start.sh
#
# 进程守护模式（--daemon）:
#   进程退出后自动重启，按 Ctrl+C 两次彻底停止

cd "$(dirname "$0")"
PORT=${1:-3080}
DAEMON=false
ARGS=()

# 解析参数
for arg in "$@"; do
    if [ "$arg" = "--daemon" ]; then
        DAEMON=true
    else
        ARGS+=("$arg")
    fi
done

# 检查端口是否被占用
function check_port() {
    if lsof -i :$PORT >/dev/null 2>&1; then
        return 1
    fi
    return 0
}

if ! check_port; then
    echo "⚠️  端口 $PORT 已被占用，请使用: ./start.sh <其他端口>"
    echo "   如需强制停止: lsof -ti tcp:$PORT | xargs kill -9"
    exit 1
fi

# 支持通过环境变量传入飞书凭证
if [ -z "${ARGS[5]}" ] && [ -n "$FEISHU_APP_ID" ]; then
    ARGS[4]="$FEISHU_APP_ID"
    ARGS[5]="$FEISHU_APP_SECRET"
fi

# 如果未指定API密钥则自动生成
if [ -z "${ARGS[4]}" ] && [ -z "$FEISHU_APP_ID" ]; then
    API_KEY="aeo_$(openssl rand -hex 12)"
    ARGS[4]="$API_KEY"
fi

echo "================================================"
echo "  AEO认证稽核系统 v2.7"
echo "================================================"

if [ "$DAEMON" = true ]; then
    echo "  守护进程模式已启用（异常退出自动重启）"
    echo "  按 Ctrl+C 一次重启 | 两次退出"
    echo "================================================"
    echo ""
    COUNTER=0
    while true; do
        COUNTER=$((COUNTER + 1))
        echo "[$(date '+%H:%M:%S')] 第 ${COUNTER} 次启动..."
        trap 'echo ""; echo "  按 Ctrl+C 再次确认退出"; COUNTER=9999' INT
        node server.js "${ARGS[@]}"
        trap - INT
        if [ $COUNTER -ge 9999 ]; then
            echo "  已确认退出"
            exit 0
        fi
        echo "[$(date '+%H:%M:%S')] 进程退出，3秒后自动重启..."
        sleep 3
    done
else
    echo "  普通模式（退出后不会自动重启）"
    echo "  提示: 使用 --daemon 参数启用进程守护"
    echo "================================================"
    echo ""
    exec node server.js "${ARGS[@]}"
fi
