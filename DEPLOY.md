# 小橘子的日常 - 部署文档

> 一键部署直接看 **「Docker 部署 Runbook」**，照着敲即可。
> 后面是接口清单、`.dockerignore` 说明和排错。

## 项目结构

```
.
├── src/                    # Vue3 前端源码
│   ├── api/index.ts        # 后端接口封装（所有页面取数都走这里）
│   └── config/site.ts      # 站点静态配置（站点名/头像/社交链接等）
├── backend/                # Spring Boot 后端
│   ├── sql/init.sql        # 建表 + 示例数据（只在 MySQL 首次初始化时执行）
│   └── Dockerfile.backend
├── deploy/nginx.conf       # Nginx 配置（含 /api 反向代理到 backend:8080）
├── docker-compose.yml
├── Dockerfile              # 前端镜像（pnpm build → nginx）
├── .dockerignore           # ⚠️ 必须保留，见「关于 .dockerignore」
└── .env.example            # 环境变量模板
```

## 架构

```
浏览器 → Nginx(:80) ┬─ 静态文件 dist/
                    ├─ /api/*     反向代理 → backend:8080
                    └─ /uploads/* 反向代理 → backend:8080
```

前端所有数据都通过 `/api/...` 从 Spring Boot 获取，**没有本地 mock 数据**。
本地 `pnpm dev` 由 `vite.config.ts` 的 proxy 转发到 `localhost:8080`；
生产由 `deploy/nginx.conf` 转发到容器 `backend:8080`。

---

# Docker 部署 Runbook

## 前提检查

```bash
docker --version                 # 需要 Docker 20.10+
docker compose version           # 需要 Compose V2
```

如果 `docker compose` 报错但 `docker-compose` 能用，下文命令把
`docker compose` 换成 `docker-compose` 即可。

**腾讯云安全组**：控制台 → 安全组 → 入站规则，放通

- `22`（SSH）
- `80`（网站）

不放通 80，容器起来了但外网访问不到 —— 这一步最容易漏。

## 1. 拉代码

```bash
mkdir -p /opt && cd /opt
git clone https://github.com/abingw1999/personal-blog.git xiaojuzi-blog
cd /opt/xiaojuzi-blog
```

已经有这个目录（之前部署过），就只更新：

```bash
cd /opt/xiaojuzi-blog
git pull
```

> 如果服务器上这个目录不是 `git clone` 来的（是手动传上去的），
> 建议重新 clone 一份到新目录，避免旧文件残留。

## 2. 配置环境变量

```bash
cd /opt/xiaojuzi-blog
cp .env.example .env
openssl rand -base64 48        # 用这个输出去填 JWT_SECRET
vim .env
```

`.env` 里**至少改这两个**：

| 变量 | 改成什么 |
|---|---|
| `DB_PASSWORD` | 自己设一个强一点的数据库密码 |
| `JWT_SECRET` | `openssl rand -base64 48` 生成的随机串 |

`.env` 已在 `.gitignore` 里不会被提交，`.dockerignore` 也会把它挡在镜像外。

## 3. ⚠️ 清掉旧的 MySQL 数据卷（只做一次）

**`backend/sql/init.sql` 只在 MySQL 数据卷第一次创建时执行**
（MySQL 官方镜像的 `/docker-entrypoint-initdb.d/` 机制）。
卷已存在的话，改 `init.sql` 再 `up` 不会生效 —— 新加的示例数据、admin 密码
都进不去，表现就是「网站能打开但数据是空的」。

博客目前没有真实数据，直接连卷一起清掉最省事：

```bash
cd /opt/xiaojuzi-blog
docker compose down -v
```

`-v` 会删除 compose 文件里声明的数据卷（`mysql_data` / `redis_data` / `uploads`），
**数据库会被清空**。确认没有要保留的数据再执行。

> 不想清库的话，见文末「不想清库怎么补数据」。

## 4. 构建并启动

```bash
cd /opt/xiaojuzi-blog
docker compose up -d --build
```

首次构建要下载基础镜像 + Maven 依赖，大约 **5～10 分钟**，属于正常
（后端 Dockerfile 已配置腾讯云 Maven 镜像加速，直连中央仓库要 10 分钟以上）。

## 5. 确认状态

```bash
docker compose ps
```

理想结果：

```
NAME                  STATUS
xiaojuzi-mysql        Up (healthy)
xiaojuzi-redis        Up
xiaojuzi-backend      Up
xiaojuzi-frontend     Up
```

**后端第一次启动可能重启一两次，是正常的** —— MySQL 首次初始化要跑建表脚本，
后端连不上会退出，`restart: always` 会自动重试，等 MySQL 准备好就稳定了。
观察日志：

```bash
docker compose logs -f backend
```

看到 `Started BlogApplication in x.x seconds` 就成功了（`Ctrl+C` 退出日志）。

## 6. 验证

```bash
# 后端接口，应返回 JSON 且 code=200
curl -s http://localhost/api/articles | head -c 300; echo
curl -s http://localhost/api/comments | head -c 300; echo
```

浏览器打开 `http://101.35.235.238`，逐项检查：

- 首页有 3 篇精选文章 + 5 篇最新文章
- 「博客」3 篇、「友链」2 个、「收藏单」7 条、「建站日记」5 条
- 「留言板」3 条留言，其中第一条下面挂着 1 条回复
- 左下角音乐播放器能显示曲目

都对上，说明前后端已经通了。

## 7. 以后更新代码

```bash
cd /opt/xiaojuzi-blog
git pull
docker compose up -d --build
```

只改了前端就 `docker compose up -d --build frontend`，只改后端就 `... backend`。

---

## 后台管理与账号

- 登录：`POST /api/auth/login`，body `{"username":"admin","password":"admin123"}`
- 返回的 `token` 放在请求头 `Authorization: Bearer <token>` 访问 `/api/admin/*`

**上线后请立刻改掉默认密码。** 改密码需要重新生成 BCrypt 哈希：

```bash
source /opt/xiaojuzi-blog/.env
docker exec -i xiaojuzi-mysql mysql -uroot -p"$DB_PASSWORD" xiaojuzi_blog \
  -e "UPDATE admin_users SET password='<新的BCrypt哈希>' WHERE username='admin';"
```

`JWT_SECRET` 也务必换成随机值。

## 接口一览（前端已全部对接）

| 接口 | 说明 | 对应页面 |
|------|------|----------|
| `GET /api/articles` | 文章分页列表（page/size/category/keyword） | 首页、博客列表 |
| `GET /api/articles/{slug}` | 文章详情（同时阅读量 +1） | 文章页、404 页随机跳转 |
| `GET /api/articles/featured` | 精选文章（后端 LIMIT 6） | 首页 |
| `GET /api/articles/categories` | 全部分类 | 博客列表筛选 |
| `GET /api/articles/random` | 随机文章 | 404 页「随机看看」 |
| `GET /api/comments` | 留言（主留言 + 内嵌 replies） | 留言板 |
| `POST /api/comments` | 发表留言 / 回复 | 留言板 |
| `GET /api/friends` | 友链 | 友链页 |
| `GET /api/products` | 商品 | 橱窗页（默认关闭） |
| `GET /api/music` | 音乐 | 左下角播放器 |
| `GET /api/collections` | 收藏（书/影/游戏） | 收藏单页 |
| `GET /api/now-status` | Now 状态 | Now 页 |
| `GET /api/footprints` | 足迹 | 足迹页 |
| `GET /api/badges` | 徽章 | 徽章页 |
| `GET /api/changelog` | 更新日志 | 建站日记页 |
| `POST /api/auth/login` | 管理员登录 | —— |
| `/api/admin/**` | 后台增删改（需 Bearer Token） | —— |

时间轴（`/timeline`）后端没有独立接口，前端用「文章 + 收藏」在本地聚合。

---

## 关于 .dockerignore（不要删）

前端镜像的构建上下文是**仓库根目录**，Dockerfile 顺序是：

```dockerfile
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .          # ← 没有 .dockerignore 的话，这里会把宿主机 node_modules 复制进去
RUN pnpm build
```

`pnpm install` 装的是 Linux 依赖。如果宿主机的 `node_modules`
（Windows/macOS 版，其中 esbuild 是平台相关二进制）被 `COPY . .` 覆盖进去，
容器里的 `pnpm build` 会因为平台不匹配直接失败。

根目录 `.dockerignore` 排除了 `node_modules`、`dist`、`.git`、`backend/` 等，
**这个文件必须保留**。`backend/.dockerignore` 同理，排除 `target/` 减小上下文体积。

## 常见问题

### Q: 网站能打开但数据全是空的？
按顺序查：

```bash
curl -i http://localhost/api/articles        # 接口通不通
docker compose logs --tail=100 backend       # 后端有没有报错
docker compose logs --tail=50 mysql          # 有没有执行 init.sql
```

如果接口报 `Table 'xiaojuzi_blog.articles' doesn't exist`，说明 `init.sql` 没跑
—— 回到第 3 步清卷重来。

### Q: `docker compose up` 卡在 building frontend？
看构建日志里 `COPY . .` 那一步是不是传了很多文件 —— 说明 `node_modules`
被复制进镜像了。确认 `.dockerignore` 存在且内容正确。

### Q: 留言的回复显示不出来？
后端 `CommentService.getComments()` 曾经查了回复却丢弃，已修复。
确认服务器上是新代码（`git log -1` 应包含该修复），然后
`docker compose up -d --build backend`。

### Q: 后端一直重启 / 报数据库连不上？
```bash
docker compose logs --tail=80 backend
docker compose ps mysql
```
多半是 `.env` 里的 `DB_PASSWORD` 和 MySQL 数据卷初始化时用的密码不一致。
改过 `.env` 密码但没清卷的话，MySQL 里还是旧密码 —— 执行第 3 步清卷重建。

### Q: 后台管理能登录但改不了数据？
`/api/admin/**` 需要 `Authorization: Bearer <token>` 头；token 24 小时后过期，需重新登录。

### Q: 音乐播放器不响？
示例数据用的是 `soundhelix.com` 的公网 mp3，确认服务器能出网。
换成本地文件或对象存储更稳。

### Q: 图片加载慢 / 加载不出来？
示例数据用的是 unsplash 图片，国内访问不稳定。换成本地图床或对象存储 + CDN。

### Q: 如何改网站名 / 头像 / 公告？
改 `src/config/site.ts` 里的 `siteConfig`，然后：

```bash
docker compose up -d --build frontend
```

### Q: 想打开商品橱窗？
`src/config/site.ts` 里把 `shopEnabled` 改成 `true`，重新构建前端。

### 不想清库怎么补数据？
手动灌入（**`INSERT` 没有唯一键约束，重复执行会产生重复数据**，
表里已有数据时建议手工挑需要的语句执行）：

```bash
cd /opt/xiaojuzi-blog
source .env
docker exec -i xiaojuzi-mysql mysql -uroot -p"$DB_PASSWORD" xiaojuzi_blog \
  < backend/sql/init.sql
```

---

## 维护建议

1. **定期备份数据库**
   ```bash
   source /opt/xiaojuzi-blog/.env
   docker exec xiaojuzi-mysql mysqldump -uroot -p"$DB_PASSWORD" xiaojuzi_blog > backup-$(date +%F).sql
   ```
2. **改掉默认密码和 JWT_SECRET**，不要用仓库里的默认值
3. **收敛端口暴露**：`docker-compose.yml` 里 MySQL(3306)、Redis(6379) 映射到了宿主机。
   只在本机使用的话，建议删掉这两段 `ports`，或改成 `127.0.0.1:3306:3306`，
   避免数据库直接暴露在公网
4. **SSL 证书**：用 Let's Encrypt / 腾讯云免费证书配 HTTPS
5. **更新依赖**：定期检查安全更新
