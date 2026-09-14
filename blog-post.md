# 从零搭建个人博客：一次完整的开发部署记录

> 记录从需求讨论、代码生成、到腾讯云部署的全过程，包括踩过的每一个坑。

## 起因

我一直想有一个属于自己的个人博客，不需要多复杂，但要温暖、有设计感、能分享生活。市面上的博客系统要么太丑，要么太复杂，于是决定自己动手（其实是让 AI 帮忙）搭一个。

## 需求讨论

我的需求其实挺多的：

- 博客系统（核心）：文章发布、Markdown 支持、分类标签、搜索分页
- 音乐播放器：全站悬浮，免费版权音乐
- 留言板：楼中楼回复、表情支持
- 关于我页面：人生成就清单、设备列表、三张图代表过去现在未来
- 书单/影单/游戏单：评分、状态筛选
- Now 实时状态页：当前在读什么、玩什么、学什么
- 友链页面、橱窗功能、足迹地图、徽章系统、建站日记、时间轴...

说实话，列完需求我自己都觉得有点多。但 AI 说"没问题"，那就试试吧。

## 技术选型

我最初想要 Vue3 + Spring Boot + MySQL 的全栈方案，因为：
- 前端 Vue3 我稍微熟悉一点
- 后端 Java 比较稳定
- MySQL 存数据放心

AI 帮我分析了环境限制后，给出了完整的技术栈：

| 层 | 技术 |
|---|------|
| 前端 | Vue3 + Vite + TypeScript + Tailwind CSS |
| 后端 | Spring Boot 3.2 + Java 17 + MyBatis-Plus |
| 数据库 | MySQL 8.0 |
| 缓存 | Redis |
| 部署 | Docker + Docker Compose + Nginx |

## 代码生成过程

这部分我基本没操心。AI 帮我生成了：

- **14 个前端页面**：首页、博客列表、博客详情、留言板、关于我、收藏、Now、友链、橱窗、足迹、徽章、建站日记、时间轴、404
- **12 个后端实体类** + 对应的 Mapper、Controller、Service
- **完整的数据库 SQL 脚本**：12 张表 + 示例数据
- **Docker 部署配置**：docker-compose.yml、Dockerfile、nginx.conf
- **部署文档**：详细的阿里云/腾讯云部署步骤

代码生成完后，AI 还帮我做了测试，确认所有页面路由正常、组件无语法错误。

## 推送到 GitHub

代码写完后，我让 AI 帮我推送到 GitHub 仓库 `abingw1999/personal-blog`。核验了一下：

- 88 个文件全部已跟踪
- 工作区干净，无未提交文件
- 本地没有未推送的提交

一切看起来很好。

## 部署：真正的挑战开始了

### 第一步：SSH 登录服务器

```bash
ssh root@101.35.235.238
```

这一步没问题。

### 第二步：安装 Docker

```bash
curl -fsSL https://get.docker.com | sh
systemctl start docker
systemctl enable docker
```

顺利。

### 第三步：安装 Docker Compose —— 第一个坑

我按照文档执行：

```bash
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

结果：

```
curl: (56) Failure when receiving data from the peer
```

GitHub 在国内下载太慢了，等了 1 分 30 秒超时。

**解决方案**：改用 apt 直接安装：

```bash
sudo apt update && sudo apt install -y docker-compose-plugin
```

装完后验证：

```bash
docker compose version
```

看到版本号就 OK 了。注意后面命令要用 `docker compose`（有空格），不是 `docker-compose`（横杠）。

### 第四步：拉取代码

```bash
cd /opt
git clone https://github.com/abingw1999/personal-blog.git xiaojuzi-blog
cd xiaojuzi-blog
```

顺利。

### 第五步：配置环境变量 —— 第二个疑问

文档让我改 `.env` 里的 MySQL 密码，但我服务器上没装 MySQL 啊？

**解答**：不需要在服务器上装 MySQL！Docker 会自动下载 MySQL 镜像并启动容器。`.env` 里的密码是给 Docker 容器里的 MySQL 用的，改成自己记得住的就行。

```bash
cp .env.example .env
vi .env
```

改成：

```
DB_PASSWORD=你自己想一个密码
JWT_SECRET=随便一串长字符串至少32位
```

### 第六步：构建启动 —— 第三个坑

```bash
docker compose up -d --build
```

构建过程中报错了：

```
src/components/music/MusicPlayer.vue(115,24): error TS2362: 
The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
```

TypeScript 类型错误！`MusicPlayer.vue` 里的 `target.value` 是字符串，不能直接做数学运算。

**解决方案**：让 AI 修复，用 `Number()` 转换：

```typescript
// 修复前
audio.currentTime = (target.value / 100) * duration.value

// 修复后
audio.currentTime = (Number(target.value) / 100) * duration.value
```

AI 修复后推送到 GitHub，我在服务器上拉取最新代码：

```bash
git pull
```

又报错了：

```
fatal: detected dubious ownership in repository at '/opt/xiaojuzi-blog'
```

Git 安全保护机制，目录权限和用户不匹配。

**解决方案**：

```bash
git config --global --add safe.directory /opt/xiaojuzi-blog
git pull
```

然后重新构建：

```bash
docker compose up -d --build
```

这次顺利通过了。

### 第七步：腾讯云安全组放行端口

在腾讯云控制台 → 安全组，放行 **80 端口**。

### 第八步：访问网站

打开浏览器，访问 **http://101.35.235.238**

网站跑起来了！

## 踩坑总结

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Docker Compose 下载超时 | GitHub 国内访问慢 | 改用 `apt install docker-compose-plugin` |
| 不知道 MySQL 怎么装 | 误解了 Docker 的作用 | Docker 会自动装，不需要手动装 |
| TypeScript 类型错误 | 代码 bug | AI 修复并推送 |
| git pull 报 dubious ownership | Git 安全机制 | `git config --global --add safe.directory` |

## 最终效果

网站包含以下功能：

- ✅ 首页：个人介绍、打字机效果、精选文章、公告
- ✅ 博客：分类筛选、搜索、分页、8 篇示例文章
- ✅ 文章详情：Markdown 渲染、封面图、标签、阅读时长
- ✅ 留言板：楼中楼回复、表情选择
- ✅ 关于我：成就清单、设备列表、三张图
- ✅ 收藏：书单/影单/游戏单 Tab 切换
- ✅ Now：实时状态展示
- ✅ 友链：卡片展示、分类筛选
- ✅ 橱窗：默认"即将开放"
- ✅ 足迹：地图标记、足迹卡片
- ✅ 徽章：12 个趣味徽章
- ✅ 建站日记：时间线展示
- ✅ 时间轴：全内容串联
- ✅ 404：趣味设计
- ✅ 全站音乐播放器：5 首免费音乐
- ✅ 暗黑/明亮模式切换
- ✅ 阅读进度条、回到顶部、点击特效

## 感想

这次经历让我意识到几件事：

1. **AI 编程真的可以很快**：从需求讨论到代码生成，几个小时就完成了一个完整的全栈项目。
2. **部署才是真正考验**：代码写得再好，部署时总会遇到各种环境问题。
3. **Docker 是真香**：不用在服务器上手动装 MySQL、Redis、Java、Nginx，一条命令全搞定。
4. **记录很重要**：把踩过的坑记下来，下次遇到同样的问题就不用再查了。

如果你也想搭建自己的博客，希望这篇记录能帮到你。

---

*本文记录于 2024 年，网站源码已开源：https://github.com/abingw1999/personal-blog*
