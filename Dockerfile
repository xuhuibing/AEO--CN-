# ====================================================================
# AEO海关认证管理系统 — Docker 构建文件
# 两阶段构建：编译 better-sqlite3 原生模块 → 精简运行时镜像
# ====================================================================

# ── Stage 1: Dependency installation ─────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for better-sqlite3 native module
RUN apk add --no-cache python3 make g++ gcc

# Copy package files and install ALL dependencies (including dev for build)
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: Runtime image ─────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Install runtime system dependencies
RUN apk add --no-cache ca-certificates tzdata wget

# Copy node_modules from builder stage (only production deps)
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY server.js .
COPY lib/ ./lib/
COPY index.html .
COPY src/ ./src/
COPY feishu.js .
COPY tailwind.config.js .

# Create data directories (will be overridden by volumes in production)
RUN mkdir -p /app/data /app/uploads /app/data/backups && \
    adduser -D -h /app aeo && \
    chown -R aeo:aeo /app/data /app/uploads

# Switch to non-root user
USER aeo

# Volume mount points
VOLUME ["/app/data", "/app/uploads"]

# Expose application port
EXPOSE 3080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3080/api/health || exit 1

# Default command
CMD ["node", "server.js"]
