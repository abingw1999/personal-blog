# 后台管理使用说明

前台是给人看的，后台是给你自己用的。这个后台覆盖了站点上**全部**内容的增删改。

## 访问

| 项目 | 值 |
|---|---|
| 地址 | `http://你的服务器IP/admin` |
| 默认账号 | `admin` |
| 默认密码 | `admin123` |

前台页脚右下角有个「后台管理」入口，也可以直接敲地址进。

> ⚠️ **上线第一件事**：进「设置 → 修改登录密码」把默认密码改掉。后端已支持自助改密码（需要输入原密码）。

登录状态存在浏览器的 `localStorage`（键名 `blog_token`），JWT 有效期 **24 小时**，过期会自动跳回登录页。

---

## 能管什么

| 菜单 | 对应前台页面 | 能做的事 |
|---|---|---|
| 仪表盘 | — | 各模块数量、总阅读量、待审核留言提醒、最近文章 |
| 文章 | `/blog`、`/blog/:slug` | 写 / 改 / 删、设为精选、Markdown 实时预览 |
| 留言 | `/guestbook` | 审核通过 / 驳回、以站长身份回复、删除 |
| 建站日记 | `/changelog` | 增删改，前台「建站日记」和「时间轴」都会聚合 |
| 收藏单 | `/collections` | 书 / 影 / 游戏，含 5 星评分、状态、短评 |
| Now 状态 | `/now` | 「最近在做什么」的条目 |
| 足迹 | `/footprints` | 地点 + 经纬度 + 日期 + 照片 |
| 徽章 | `/badges` | 徽章名称、图标、获得条件 |
| 友情链接 | `/friends` | 站点名、链接、头像、分类、排序 |
| 橱窗 | `/shop` | 商品名、价格、图片、上下架、推荐 |
| 音乐 | 全站播放器 | 曲目、艺术家、音频直链、封面、启用 |
| 设置 | — | 改密码、查看当前账号 |

### 几个使用要点

**文章**
- `slug` 是网址标识（`/blog/<slug>`），**必须唯一**，重复会提示「slug（网址标识）已存在」。
- 改掉已有文章的 slug 会让旧链接失效。
- `tags` 用英文逗号分隔，后端存的是 JSON 字符串，保存时前端自动转换。
- 简介留空会自动从正文截取前 80 字。
- 字数 / 阅读时长留空会自动算（400 字 / 分钟）。
- 删除是**逻辑删除**：记录还在库里（`deleted=1`），只是前台不展示。

**留言**
- 后台能看到全部留言（含未审核），前台只看得到已通过的。
- 后端默认把新留言标为「通过」（`CommentService.createComment` 里 `setApproved(true)`），所以正常不会积压待审核。
- 「回复」以「站长」名义发出，自动 `approved=true`，不用再审核。
- 删除主留言不会级联删掉它的回复 —— 需要的话手动一起删。

**图片上传**
- 所有带图片的字段（封面、头像、商品图、足迹照片…）都支持「上传」按钮，也可以直接粘外链。
- 单张最大 **5MB**，支持 `jpg / jpeg / png / gif / webp / svg / avif / ico`。
- 存在后端的 `/app/uploads/YYYY/MM/` 下（Docker 卷 `uploads`），访问路径是 `/uploads/YYYY/MM/xxx.jpg`。

**足迹经纬度**
- 纬度 `lat`：北纬为正（杭州 `30.2741`）；经度 `lng`：东经为正（杭州 `120.1551`）。填错地图上的点会跑到别的国家。

---

## 这些不在这里改

后台只覆盖「数据库里的内容」。以下几项是**配置文件**，改完要重建前端镜像：

| 想改什么 | 去哪改 |
|---|---|
| 站点名、头像、标语、公告、社交链接、是否开启橱窗 | `src/config/site.ts` |
| 后台账号名（`admin` → 别的） | 数据库 `admin_users` 表 |
| 数据库密码、JWT 密钥 | 服务器上的 `.env` |
| 首页「关于我」的成就清单 / 设备列表 | `src/views/AboutPage.vue` |
| 上传目录位置 | `application.yml` 的 `file.upload-path` |

```bash
# 改完站点配置后
cd /opt/xiaojuzi-blog && git pull
docker compose up -d --build frontend
```

---

## 后端接口一览（新增部分）

后台所有接口都在 `/api/admin/**` 下，Spring Security 里已配置为**必须认证**。

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/admin/stats` | 仪表盘统计 |
| GET | `/api/admin/profile` | 当前登录账号 |
| PUT | `/api/admin/password` | 改密码（校验原密码） |
| POST | `/api/admin/upload` | 上传图片 |
| DELETE | `/api/admin/upload?path=` | 删除已上传图片 |
| GET | `/api/admin/articles` | 文章分页列表（支持 keyword / category / featured） |
| GET | `/api/admin/articles/{id}` | 按 id 取单篇（编辑回填） |
| POST / PUT / DELETE | `/api/admin/articles[/{id}]` | 文章增改删 |
| GET | `/api/admin/comments` | **全部**留言（含未审核） |
| PUT | `/api/admin/comments/{id}/approve` | 审核通过 |
| PUT | `/api/admin/comments/{id}/reject` | 驳回 |
| POST | `/api/admin/comments/{id}/reply` | 以站长身份回复 |
| DELETE | `/api/admin/comments/{id}` | 删除 |
| GET / POST / PUT / DELETE | `/api/admin/friends[/{id}]` | 友链 |
| GET / POST / PUT / DELETE | `/api/admin/products[/{id}]` | 商品 |
| GET / POST / PUT / DELETE | `/api/admin/music[/{id}]` | 音乐 |
| GET / POST / PUT / DELETE | `/api/admin/collections[/{id}]` | 收藏 |
| GET / POST / PUT / DELETE | `/api/admin/now-status[/{id}]` | Now 状态 |
| GET / POST / PUT / DELETE | `/api/admin/footprints[/{id}]` | 足迹 |
| GET / POST / PUT / DELETE | `/api/admin/badges[/{id}]` | 徽章 |
| GET / POST / PUT / DELETE | `/api/admin/changelog[/{id}]` | 建站日记 |

另外新增了一个**全局异常处理器**（`exception/GlobalExceptionHandler.java`）。
没有它的时候，任何异常都被 Spring 兜成 HTTP 500，前端只能显示「请求失败 (HTTP 500)」。
现在会返回人话，比如：

- slug 重复 → 「slug（网址标识）已存在，请换一个」
- 图片超限 → 「图片不能超过 5MB」
- 参数缺失 → 「title 不能为空」

---

## 部署时的三个注意点

这三个是加后台时才暴露出来的，跟后台代码本身无关，但**不处理功能就是坏的**。

### 1. Nginx 要放开上传体积

Nginx 默认 `client_max_body_size` 只有 **1MB**。后台上传 5MB 的图片会被 Nginx 直接拒成 `413 Request Entity Too Large`，请求根本到不了后端。

`deploy/nginx.conf` 里已加：

```nginx
client_max_body_size 8m;
```

### 2. `/uploads/` 必须用 `^~` 前缀

Nginx 的 location 匹配顺序里，**正则 location 优先于普通前缀 location**。
原来的配置里有：

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|...)$ { ... }   # 正则
location /uploads/ { proxy_pass http://backend:8080/uploads/; } # 普通前缀
```

`/uploads/2026/09/abc.jpg` 会**先命中上面那条正则**，然后去 `/usr/share/nginx/html` 里找文件 → 404（文件其实在后端容器里）。

改成 `location ^~ /uploads/` 就能让前缀匹配优先于正则。

### 3. uploads 是 Docker 卷，要一起备份

图片存在名为 `uploads` 的卷里（挂到后端容器 `/app/uploads`），**不在 MySQL 里**。
所以「备份数据库」并不包含图片：

```bash
docker run --rm -v personal-blog_uploads:/data -v $(pwd):/backup alpine \
  tar czf /backup/uploads-backup.tar.gz -C /data .
```

（卷名用 `docker volume ls` 确认，前缀是 compose 项目名。）

---

## 更新到服务器

```bash
cd /opt/xiaojuzi-blog
git pull

# nginx 配置在宿主机上以文件挂载，改完要重启 frontend 容器才生效
docker compose up -d --build backend frontend
docker compose restart frontend
```

然后访问 `http://你的服务器IP/admin` 登录。

**验收清单**（逐条点一遍）：

1. 能登录，仪表盘显示文章 3 篇、收藏 7 条等数字
2. 写一篇测试文章 → 前台 `/blog` 能看到 → 删除后消失
3. 上传一张图片 → 编辑器里能预览 → 前台文章封面正常显示（这条同时验证了 Nginx 的两个配置）
4. 留言页能回复 → 前台留言板里出现「站长」的回复
5. 设置页改一次密码 → 退出 → 用新密码能登录
