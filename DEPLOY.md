# 小橘子的日常 - 部署文档

## 项目结构

```
.
├── src/                    # Vue3 前端源码
│   ├── api/index.ts        # 后端接口封装（所有页面取数都走这里）
│   └── config/site.ts      # 站点静态配置（站点名/头像/社交链接等）
├── backend/                # Spring Boot 后端
│   ├── pom.xml
│   ├── src/
│   ├── sql/init.sql        # 数据库初始化脚本（建表 + 示例数据）
│   └── Dockerfile.backend
├── deploy/
│   └── nginx.conf          # Nginx 配置（含 /api 反向代理到 backend:8080）
├── docker-compose.yml      # Docker 编排
├── Dockerfile              # 前端 Dockerfile
└── .env.example            # 环境变量模板
```

## 架构说明

```
浏览器 → Nginx(:80) ┬─ 静态文件 dist/
                    ├─ /api/*     → 反向代理 → backend:8080
                    └─ /uploads/* → 反向代理 → backend:8080
```

前端所有数据都通过 `/api/...` 从 Spring Boot 后端获取，**不再有本地 mock 数据**。
本地 `pnpm dev` 时由 `vite.config.ts` 里的 proxy 转发到 `localhost:8080`；
生产环境由 `deploy/nginx.conf` 转发到容器 `backend:8080`。

## 方案一：Docker 一键部署（推荐）

### 前置要求
- 一台服务器（推荐 2核4G，腾讯云轻量/CVM 均可）
- Docker + Docker Compose

### 步骤

```bash
# 1. 克隆项目到服务器
git clone https://github.com/abingw1999/personal-blog.git /opt/xiaojuzi-blog
cd /opt/xiaojuzi-blog

# 2. 配置环境变量
cp .env.example .env
vim .env  # 修改数据库密码、JWT密钥等

# 3. 启动所有服务
docker-compose up -d --build

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

### ⚠️ 已部署过一次的话必看

`init.sql` 只在 **MySQL 数据卷首次创建时** 由 MySQL 容器执行（
`/docker-entrypoint-initdb.d/` 机制）。如果你之前已经 `up` 过一次，
数据库卷 `mysql_data` 已经存在，此时改 `init.sql` 再重新 `up` 是**不会生效**的
（包括新增的示例数据、以及 admin 密码哈希的更新）。

因为博客目前还没有真实数据，最省事的做法是清库重来：

```bash
cd /opt/xiaojuzi-blog
docker-compose down

# 删掉 MySQL 数据卷（注意：会清空数据库，确认没有真实数据再做）
docker volume rm personal-blog_mysql_data
# 卷名如果不对，用 docker volume ls | grep mysql_data 查一下

docker-compose up -d --build
```

不想清库的话，也可以手动把增量 SQL 灌进去：

```bash
# 只补示例数据（表已存在时适用）
docker exec -i xiaojuzi-mysql mysql -uroot -proot123 xiaojuzi_blog \
  < backend/sql/init.sql
```

> 注：`init.sql` 里的 `INSERT` 没有唯一键约束，重复执行会产生重复数据。
> 空库首次部署时不用担心；手动重灌前建议先确认表里是否已有数据。

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
pnpm install --frozen-lockfile
pnpm build
# 使用 Nginx 托管 dist 目录
```

### 5. 配置 Nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/xiaojuzi
sudo ln -s /etc/nginx/sites-available/xiaojuzi /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

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
| REDIS_PASSWORD | Redis 密码 | 空 |
| JWT_SECRET | JWT 密钥 | 需修改 |
| FILE_UPLOAD_PATH | 上传文件目录 | /app/uploads/ |

## 接口一览（前端已全部对接）

| 接口 | 说明 | 对应页面 |
|------|------|----------|
| `GET /api/articles` | 文章分页列表（支持 page/size/category/keyword） | 首页、博客列表 |
| `GET /api/articles/{slug}` | 文章详情（同时阅读量 +1） | 文章页、404 页随机跳转 |
| `GET /api/articles/featured` | 精选文章 | —— |
| `GET /api/articles/categories` | 全部分类 | 博客列表筛选 |
| `GET /api/articles/random` | 随机文章 | 404 页「随机看看」 |
| `GET /api/comments` | 留言（主留言 + 内嵌 replies） | 留言板 |
| `POST /api/comments` | 发表留言 / 回复 | 留言板 |
| `GET /api/friends` | 友链 | 友链页 |
| `GET /api/products` | 商品 | 橱窗页 |
| `GET /api/music` | 音乐 | 左下角播放器 |
| `GET /api/collections` | 收藏（书/影/游戏） | 收藏单页 |
| `GET /api/now-status` | Now 状态 | Now 页 |
| `GET /api/footprints` | 足迹 | 足迹页 |
| `GET /api/badges` | 徽章 | 徽章页 |
| `GET /api/changelog` | 更新日志 | 建站日记页 |
| `POST /api/auth/login` | 管理员登录（返回 JWT） | —— |
| `/api/admin/**` | 后台增删改，需 `Authorization: Bearer <token>` | —— |

时间轴（`/timeline`）后端没有独立接口，前端用「文章 + 收藏」在本地聚合而成。

## 后台管理

### 登录
- 地址：`POST /api/auth/login`
- 默认账号：`admin`
- 默认密码：`admin123`
- 返回的 `token` 放在 `Authorization: Bearer <token>` 头里访问 `/api/admin/*`

### 密码修改
默认密码只在 `init.sql` 里写入一次。改密码需要重新生成 BCrypt 哈希后更新 `admin_users` 表：

```sql
UPDATE admin_users SET password = '<新的BCrypt哈希>' WHERE username = 'admin';
```

## 常见问题

### Q: 页面能打开但数据全是空的？
A: 检查 `/api` 是否通。在服务器上执行：
```bash
curl -i http://localhost/api/articles
```
返回 502/504 说明 Nginx 到 backend 容器不通，看后端日志：
```bash
docker-compose logs -f backend
```

### Q: 提示数据库表不存在 / 没有示例数据？
A: 见上文「已部署过一次的话必看」，`init.sql` 不会在已有数据卷上重跑。

### Q: 留言的回复显示不出来？
A: 后端 `CommentService.getComments()` 已修复（原实现查了回复但没有挂到主留言上）。
确认服务器上跑的是最新代码：`docker-compose up -d --build backend`。

### Q: 音乐播放器无法播放？
A: 检查音乐 URL 是否可访问，建议使用 HTTPS 链接。

### Q: 图片加载慢？
A: 示例数据用的是 unsplash 图片，建议换成本地图床或对象存储 + CDN。

### Q: 如何修改网站名 / 头像 / 公告？
A: 改 `src/config/site.ts` 里的 `siteConfig`，改完重新构建前端
（`docker-compose up -d --build frontend`）。

### Q: 想打开商品橱窗？
A: `src/config/site.ts` 里把 `shopEnabled` 改成 `true`。

## 维护建议

1. **定期备份数据库**：`mysqldump -u root -p xiaojuzi_blog > backup.sql`
2. **改掉默认密码和 JWT_SECRET**，不要用仓库里的默认值
3. **更新依赖**：定期检查安全更新
4. **SSL 证书**：使用 Let's Encrypt 免费证书
