#!/bin/bash
# AEO认证稽核系统 - 启动脚本
# 使用方式:
#   ./start.sh              (端口3080, 用户aeo, 密码aeo2026)
#   ./start.sh 8080         (自定义端口)
#   ./start.sh 8080 admin mypass (完全自定义)

cd "$(dirname "$0")"
PORT=${1:-3080}

# 检查端口是否被占用
if lsof -i :$PORT >/dev/null 2>&1; then
    echo "端口 $PORT 已被占用，请使用: ./start.sh <其他端口>"
    exit 1
fi

node server.js "$@"
