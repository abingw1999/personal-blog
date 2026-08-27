# 小橘子的日常 - 部署文档

## 项目结构

```
.
├── src/                    # Vue3 前端源码
├── backend/                # Spring Boot 后端
│   ├── pom.xml
│   ├── src/
│   ├── sql/init.sql        # 数据库初始化脚本
│   └── Dockerfile.backend
├── deploy/
│   └── nginx.conf          # Nginx 配置
├── docker-compose.yml      # Docker 编排
├── Dockerfile              # 前端 Dockerfile
└── .env.example            # 环境变量模板
```

## 方案一：Docker 一键部署（推荐）

### 前置要求
- 阿里云 ECS 服务器（推荐 2核4G）
- Docker + Docker Compose
- 域名（可选）

### 步骤

```bash
# 1. 克隆项目到服务器
git clone <your-repo-url> /opt/xiaojuzi-blog
cd /opt/xiaojuzi-blog

# 2. 配置环境变量
cp .env.example .env
vim .env  # 修改数据库密码、JWT密钥等

# 3. 启动所有服务
docker-compose up -d

# 4. 查看日志
docker-compose logs -f

# 5. 停止服务
docker-compose down
```

### 服务端口
- 前端：80
- 后端 API：8080
- MySQL：3306
- Redis：6379

## 方案二：手动部署

### 1. 安装环境

```bash
# Java 17
sudo apt install openjdk-17-jdk

# MySQL 8.0
sudo apt install mysql-server

# Redis
sudo apt install redis-server

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs
npm install -g pnpm
```

### 2. 初始化数据库

```bash
mysql -u root -p < backend/sql/init.sql
```

### 3. 构建并启动后端

```bash
cd backend
mvn package -DskipTests
java -jar target/blog-1.0.0.jar
```

### 4. 构建并启动前端

```bash
pnpm install
pnpm build
# 使用 Nginx 托管 dist 目录
```

### 5. 配置 Nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/xiaojuzi
sudo ln -s /etc/nginx/sites-available/xiaojuzi /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 方案三：阿里云 OSS + CDN

### 前端部署到 OSS

```bash
# 安装 ossutil
# 构建前端
pnpm build

# 上传到 OSS
ossutil cp -r dist/ oss://your-bucket/ --update
```

### 配置 CDN
1. 在阿里云 CDN 控制台添加加速域名
2. 源站类型选择 OSS
3. 配置 HTTPS 证书
4. 配置回源路径

## 环境变量说明

| 变量 | 说明 | 默认值 |
|------|------|--------|
| DB_HOST | MySQL 地址 | localhost |
| DB_PORT | MySQL 端口 | 3306 |
| DB_NAME | 数据库名 | xiaojuzi_blog |
| DB_USER | 数据库用户 | root |
| DB_PASSWORD | 数据库密码 | root123 |
| REDIS_HOST | Redis 地址 | localhost |
| REDIS_PORT | Redis 端口 | 6379 |
| JWT_SECRET | JWT 密钥 | 需修改 |

## 后台管理

### 登录
- 地址：`/api/auth/login`
- 默认账号：admin
- 默认密码：admin123

### API 文档
所有 API 以 `/api/` 开头：
- 公开 API：GET 请求无需认证
- 管理 API：`/api/admin/*` 需要 Bearer Token

## 常见问题

### Q: 音乐播放器无法播放？
A: 检查音乐 URL 是否可访问，建议使用 HTTPS 链接。

### Q: 图片加载慢？
A: 建议使用阿里云 OSS 存储图片，配合 CDN 加速。

### Q: 如何修改网站配置？
A: 修改 `src/data/mock.ts` 中的 `siteConfig` 对象，或接入后端 API。

## 维护建议

1. **定期备份数据库**：`mysqldump -u root -p xiaojuzi_blog > backup.sql`
2. **监控服务器资源**：使用阿里云云监控
3. **更新依赖**：定期检查安全更新
4. **SSL 证书**：使用 Let's Encrypt 免费证书
