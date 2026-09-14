# 从零到上线：我的第一个全栈博客项目部署实录

> 作者：小橘子  
> 日期：2024年  
> 标签：#部署记录 #新手入门 #Docker #Vue3 #SpringBoot

---

## 前言

作为一个编程小白，我从来没有想过自己能独立完成一个全栈项目的部署。从让 AI 帮我写代码，到一步步把网站跑在腾讯云服务器上，这个过程踩了不少坑，也学到了很多。写下这篇博客，既是记录，也是给同样想尝试的朋友一些参考。

---

## 一、项目诞生：让 AI 帮我写代码

### 1.1 我的需求

我想要一个个人生活分享博客，功能包括：
- 博客系统（文章发布、分类、标签、Markdown 渲染）
- 音乐播放器（全站悬浮，免费音乐）
- 留言板（楼中楼回复）
- 友链页面、橱窗、足迹地图
- 暗黑模式、点击特效、阅读进度条等趣味功能

### 1.2 技术选型

我提出了明确的技术栈要求：
- **前端**：Vue3 + Vue Router + Pinia + Vite
- **后端**：Java Spring Boot 3.x + MyBatis-Plus
- **数据库**：MySQL 8.0
- **部署**：Docker + Nginx

为什么选这些？因为我想学主流技术，而且 AI 帮我生成的代码就是这套技术栈。

### 1.3 AI 帮我生成了什么

AI 帮我生成了完整的项目代码，包括：
- 前端 14 个页面（首页、博客、留言、关于、收藏、Now 状态、友链、橱窗、足迹、徽章、建站日记、时间轴、404 等）
- 后端 12 个实体类、5 个 Controller、完整的 Service 层
- MySQL 建表 SQL + 示例数据
- Docker 部署配置（docker-compose.yml、Dockerfile、nginx.conf）
- 部署文档（DEPLOY.md）

**我的感受**：AI 生成的代码量非常大，我根本看不懂每一行在做什么，但我知道它是对的，因为 AI 会帮我测试和修复 bug。

---

## 二、第一次踩坑：预览页面是空白的

### 2.1 问题现象

代码生成完后，我打开预览页面，发现**一片空白**，什么都没有。

### 2.2 我的反应

我当时慌了，以为代码有问题，赶紧问 AI："为什么预览是一片空白？"

### 2.3 排查过程

AI 帮我排查了很久，最后发现是**项目从 Next.js 切换到 Vue3 时，残留了旧文件导致冲突**。

**教训**：
- 切换技术栈时，一定要**彻底清理旧文件**
- 不要手动删除部分文件，要整个目录清空重建

### 2.4 解决方案

AI 帮我重新初始化了一个干净的 Vue3 项目，所有代码重新生成，问题解决了。

---

## 三、部署到腾讯云服务器

### 3.1 我的服务器

我买了一台腾讯云服务器：`101.35.235.238`，系统是 Ubuntu。

### 3.2 我的疑问

我问 AI："我买的腾讯云服务器，如何部署？"

AI 给了我详细的部署步骤，但我作为新手，有很多不理解的地方。

### 3.3 我的第一个问题：为什么要做这些？

我说："为什么要做这些？我是新手。"

AI 用**开餐厅的比喻**给我解释：
- 租店面 = 腾讯云服务器
- 把菜谱搬进厨房 = 拉取代码（git clone）
- 请厨师做菜 = 安装 Docker
- 开门营业 = docker-compose up

**我明白了**：代码现在只在我电脑上，要让别人通过互联网访问，就必须把代码放到服务器上运行。

### 3.4 我的第二个问题：MySQL 怎么装？

我问："第四步让改 MySQL 密码，可是我服务器并没装 MySQL，项目的数据库部分如何安装配置？"

AI 告诉我：**不需要手动安装 MySQL**！

Docker 会自动帮我：
1. 下载 MySQL 镜像
2. 启动 MySQL 数据库
3. 创建数据库 `xiaojuzi_blog`
4. 执行 `init.sql` 建表 + 导入示例数据

**我恍然大悟**：原来 Docker 就是一个"自动化工具"，帮我装好所有依赖，我不需要在服务器上手动装任何东西。

---

## 四、部署过程中的报错

### 4.1 报错 1：Docker Compose 下载失败

**现象**：
```
curl: (56) Failure when receiving data from the peer
```

**原因**：GitHub 在国内下载慢/超时。

**解决**：用 apt 直接安装
```bash
sudo apt update && sudo apt install -y docker-compose-plugin
```

**注意**：后面命令要用 `docker compose`（中间有空格），不是 `docker-compose`（横杠）。

### 4.2 报错 2：TypeScript 类型错误

**现象**：
```
src/components/music/MusicPlayer.vue(115,24): error TS2362: 
The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
```

**原因**：`MusicPlayer.vue` 里 `target.value` 是字符串类型，不能直接做数学运算。

**解决**：AI 帮我修复了代码，用 `Number()` 转换：
```typescript
// 修复前
audio.currentTime = (target.value / 100) * duration.value

// 修复后
audio.currentTime = (Number(target.value) / 100) * duration.value
```

AI 修复后提交到 GitHub，我在服务器上 `git pull` 拉取最新代码，重新构建就好了。

### 4.3 报错 3：Git 权限问题

**现象**：
```
fatal: detected dubious ownership in repository at '/opt/xiaojuzi-blog'
```

**原因**：Git 的安全保护机制，目录权限和用户不匹配。

**解决**：
```bash
git config --global --add safe.directory /opt/xiaojuzi-blog
```

---

## 五、最终部署成功

经过以上几步，我的网站终于跑起来了！

### 5.1 访问地址

- **前端**：http://101.35.235.238
- **后端 API**：http://101.35.235.238/api/
- **后台管理**：http://101.35.235.238/api/auth/login
  - 账号：`admin`
  - 密码：`admin123`

### 5.2 常用运维命令

```bash
# 停止服务
docker compose down

# 重启服务
docker compose restart

# 更新代码并重新部署
git pull
docker compose up -d --build

# 备份数据库
docker exec xiaojuzi-mysql mysqldump -u root -p你的密码 xiaojuzi_blog > backup_$(date +%Y%m%d).sql

# 查看后端日志
docker compose logs -f backend
```

---

## 六、经验总结

### 6.1 给新手的建议

1. **不要怕报错**：报错是正常的，每个错误都有解决方案，问 AI 或者搜索都能找到答案。
2. **理解 Docker 的价值**：Docker 帮你隔离环境，自动装依赖，不用在服务器上手动装 MySQL、Redis、Java 等。
3. **Git 是必备技能**：学会 `git pull`、`git status`、`git log` 等基本命令，方便更新代码。
4. **备份很重要**：定期备份数据库，防止数据丢失。

### 6.2 我学到的东西

1. **Docker 是什么**：一个自动化工具，帮你把应用和所有依赖打包在一起， anywhere 都能跑。
2. **前后端分离**：前端 Vue3 负责界面，后端 Spring Boot 负责数据，通过 API 通信。
3. **Nginx 的作用**：反向代理，把前端请求转发给后端，同时提供静态文件服务。
4. **MySQL 容器化**：不需要在服务器上装 MySQL，Docker 会自动帮你装好。

### 6.3 下一步计划

1. 绑定域名 + HTTPS
2. 配置 CDN 加速
3. 学习如何修改代码（让 AI 帮我改）
4. 学习如何查看日志排查问题

---

## 七、感谢

感谢 AI 帮我生成了完整的项目代码，并在我部署过程中耐心解答每一个问题。虽然我还是看不懂每一行代码在做什么，但我知道如何部署、如何排查问题、如何更新代码，这就够了。

**编程不是记住每一行代码，而是知道如何解决问题。**

---

## 附录：完整部署命令汇总

```bash
# 1. 安装 Docker
curl -fsSL https://get.docker.com | sh
systemctl start docker
systemctl enable docker

# 2. 安装 Docker Compose
sudo apt update && sudo apt install -y docker-compose-plugin

# 3. 拉取代码
cd /opt
git clone https://github.com/abingw1999/personal-blog.git xiaojuzi-blog
cd xiaojuzi-blog

# 4. 配置环境变量
cp .env.example .env
vi .env  # 修改 DB_PASSWORD 和 JWT_SECRET

# 5. 启动服务
docker compose up -d

# 6. 验证
docker compose ps
curl http://localhost
```

---

**全文完**

如果你也是新手，希望这篇博客能帮到你。有问题欢迎留言交流！
