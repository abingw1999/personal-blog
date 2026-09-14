# ============================================
# 前端构建阶段
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

# 固定 pnpm 版本：pnpm-lock.yaml 是 lockfileVersion 9.0，
# 不锁版本的话，将来 pnpm 出大版本可能解析不了这个 lockfile 导致线上构建挂掉。
# 放在 COPY 之前，让这一层能被缓存复用。
RUN npm install -g pnpm@10.15.0

# 先只拷依赖清单：依赖没变时这一层直接命中缓存
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 再拷源码。
# ⚠️ 注意：仓库根目录的 .dockerignore 必须排除 node_modules，
#    否则宿主机（Windows/macOS）的依赖会覆盖上面刚装好的 Linux 依赖，
#    容器里的 pnpm build 会因为 esbuild 等平台二进制不匹配而失败。
COPY . .

RUN pnpm build

# ============================================
# Nginx 运行阶段
# ============================================
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
