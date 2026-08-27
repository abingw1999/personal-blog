import type { Article, FriendLink, Product, Music, GuestbookEntry, CollectionItem, NowStatus, FootprintItem, Badge, ChangelogEntry, TimelineItem, SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  siteName: '小橘子的日常',
  siteDescription: '记录生活中的小确幸，分享有趣的知识与故事',
  avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=orange&backgroundColor=ffdfbf',
  nickname: '小橘子',
  tagline: '生活就像一盒巧克力，你永远不知道下一颗是什么味道 🍊',
  socialLinks: [
    { name: 'GitHub', url: 'https://github.com', icon: '🐙' },
    { name: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
    { name: 'Email', url: 'mailto:hello@example.com', icon: '📧' }
  ],
  announcements: ['🎉 网站全新上线啦！', '📝 正在学习 Vue3，记录学习笔记'],
  siteStartDate: '2024-01-01',
  shopEnabled: false
}

export const articles: Article[] = [
  { id: 1, slug: 'my-first-post', title: '你好，世界！我的第一篇博客', excerpt: '这是我的第一篇博客文章，记录一下建站的心路历程...', content: '# 你好，世界！\n\n这是我的第一篇博客文章。\n\n## 为什么写博客\n\n记录生活，分享知识。\n\n## 未来计划\n\n- 每周至少更新一篇\n- 分享技术学习笔记\n- 记录生活趣事', cover: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800', category: '生活', tags: ['随笔', '开始'], createdAt: '2024-03-15', readTime: 3, wordCount: 520, views: 128, featured: true },
  { id: 2, slug: 'vue3-learning-notes', title: 'Vue3 学习笔记：Composition API 入门', excerpt: '最近在学习 Vue3，记录一下 Composition API 的使用心得...', content: '# Vue3 Composition API\n\n## 什么是 Composition API\n\nVue3 新增的一种组织组件逻辑的方式。\n\n## setup 函数\n\n```typescript\nimport { ref } from "vue"\nconst count = ref(0)\n```\n\n## 响应式数据\n\n使用 `ref` 和 `reactive` 创建响应式数据。', cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', category: '知识', tags: ['Vue3', '前端', '学习'], createdAt: '2024-03-20', readTime: 8, wordCount: 1500, views: 256, featured: true },
  { id: 3, slug: 'indie-game-recommendations', title: '2024 年值得玩的独立游戏推荐', excerpt: '整理了一些今年值得一玩的独立游戏，每一款都让人印象深刻...', content: '# 独立游戏推荐\n\n## Celeste\n\n一款关于攀登的像素游戏，剧情感人。\n\n## Hollow Knight\n\n银河恶魔城类游戏的巅峰之作。\n\n## Stardew Valley\n\n休闲农场模拟，治愈系首选。', cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', category: '游戏', tags: ['独立游戏', '推荐'], createdAt: '2024-04-01', readTime: 6, wordCount: 1100, views: 342, featured: true },
  { id: 4, slug: 'cooking-tips', title: '厨房小白也能学会的 10 道菜', excerpt: '分享一些简单又好吃的家常菜做法，新手也能轻松上手...', content: '# 简单家常菜\n\n## 番茄炒蛋\n\n最经典的家常菜，简单又好吃。\n\n## 蒜蓉西兰花\n\n健康又美味。\n\n## 可乐鸡翅\n\n小朋友最爱的菜。', cover: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', category: '生活', tags: ['美食', '教程'], createdAt: '2024-04-10', readTime: 5, wordCount: 900, views: 189, featured: false },
  { id: 5, slug: 'typescript-tips', title: 'TypeScript 实用技巧分享', excerpt: '一些日常开发中常用的 TypeScript 技巧，提升代码质量...', content: '# TypeScript 技巧\n\n## 类型守卫\n\n```typescript\nfunction isString(val: unknown): val is string {\n  return typeof val === "string"\n}\n```\n\n## 工具类型\n\n`Partial`、`Required`、`Pick`、`Omit` 等。', cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800', category: '知识', tags: ['TypeScript', '前端'], createdAt: '2024-04-15', readTime: 7, wordCount: 1300, views: 278, featured: false },
  { id: 6, slug: 'travel-diary', title: '周末短途旅行记录', excerpt: '记录上周末的一次短途旅行，去了一个安静的小镇...', content: '# 周末旅行\n\n## 目的地\n\n一个安静的江南小镇。\n\n## 行程安排\n\n- 周六早上出发\n- 下午逛古镇\n- 晚上住民宿\n- 周日返程', cover: 'https://images.unsplash.com/photo-1469854523086-cc02fe4d58a2?w=800', category: '生活', tags: ['旅行', '周末'], createdAt: '2024-04-20', readTime: 4, wordCount: 750, views: 156, featured: false },
  { id: 7, slug: 'reading-list-2024', title: '2024 年阅读清单', excerpt: '今年计划读的书籍清单，涵盖技术、文学、心理学等领域...', content: '# 2024 阅读清单\n\n## 技术类\n\n- 《Vue.js 设计与实现》\n- 《深入理解 TypeScript》\n\n## 文学类\n\n- 《百年孤独》\n- 《活着》\n\n## 心理学\n\n- 《思考，快与慢》', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800', category: '知识', tags: ['阅读', '书单'], createdAt: '2024-05-01', readTime: 4, wordCount: 680, views: 203, featured: false },
  { id: 8, slug: 'productivity-tools', title: '我的效率工具箱', excerpt: '分享一些我日常使用的效率工具，帮助你提升工作和学习效率...', content: '# 效率工具\n\n## 笔记\n\n- Obsidian：本地知识库\n- Notion：项目管理\n\n## 时间管理\n\n- Toggl：时间追踪\n- Forest：专注森林\n\n## 开发工具\n\n- VS Code：编辑器\n- Warp：终端', cover: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800', category: '知识', tags: ['工具', '效率'], createdAt: '2024-05-10', readTime: 5, wordCount: 950, views: 312, featured: false }
]

export const friendLinks: FriendLink[] = [
  { id: 1, name: '小明技术博客', url: 'https://example.com/xiaoming', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=xiaoming', description: '专注前端开发，分享技术心得', category: '技术博客' },
  { id: 2, name: '旅行日记', url: 'https://example.com/travel', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=travel', description: '用镜头记录世界的美好', category: '生活分享' },
  { id: 3, name: '游戏时光', url: 'https://example.com/gaming', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=gaming', description: '游戏评测与推荐', category: '游戏' },
  { id: 4, name: '设计灵感', url: 'https://example.com/design', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=design', description: 'UI/UX 设计资源分享', category: '推荐网站' },
  { id: 5, name: '读书笔记', url: 'https://example.com/reading', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=reading', description: '每年读 100 本书的读书达人', category: '生活分享' }
]

export const products: Product[] = [
  { id: 1, name: '机械键盘', description: 'Cherry 红轴，打字超舒服', price: 399, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', link: 'https://taobao.com', category: '数码', recommended: true },
  { id: 2, name: '《Vue.js 设计与实现》', description: '霍春阳力作，深入理解 Vue3', price: 99, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', link: 'https://jd.com', category: '书籍', recommended: true },
  { id: 3, name: '桌面收纳架', description: '让桌面更整洁', price: 59, image: 'https://images.unsplash.com/photo-1586023492125-27b2c4b743d0?w=400', link: 'https://taobao.com', category: '生活', recommended: false }
]

export const musicList: Music[] = [
  { id: 1, title: 'A Little Story', artist: 'Valentin', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100' },
  { id: 2, title: 'Spring In My Step', artist: 'Silent Partner', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100' },
  { id: 3, title: 'Afternoon Tea', artist: 'Chris Haugen', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', cover: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=100' }
]

export const guestbookEntries: GuestbookEntry[] = [
  { id: 1, nickname: '小明', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=ming', content: '网站做得真好看！🎉', emoji: '❤️', createdAt: '2024-05-15 10:30', parentId: null, replies: [
    { id: 101, nickname: '小橘子', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=orange', content: '谢谢支持！😊', emoji: '', createdAt: '2024-05-15 11:00', parentId: 1, replies: [] }
  ]},
  { id: 2, nickname: '旅行者', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=traveler', content: '很喜欢你的旅行文章，期待更多更新！', emoji: '🔥', createdAt: '2024-05-14 15:20', parentId: null, replies: [] },
  { id: 3, nickname: '代码侠', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=coder', content: 'Vue3 写得不错，学到了 👍', emoji: '👍', createdAt: '2024-05-13 09:15', parentId: null, replies: [] }
]

export const collections: CollectionItem[] = [
  { id: 1, type: 'book', title: '百年孤独', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300', rating: 5, status: '已读', comment: '魔幻现实主义的巅峰之作', link: 'https://book.douban.com', completedAt: '2024-02' },
  { id: 2, type: 'book', title: '活着', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300', rating: 5, status: '已读', comment: '余华最震撼人心的作品', completedAt: '2024-01' },
  { id: 3, type: 'movie', title: '千与千寻', cover: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300', rating: 5, status: '已看', comment: '宫崎骏的奇幻世界', link: 'https://bilibili.com' },
  { id: 4, type: 'movie', title: '星际穿越', cover: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300', rating: 4, status: '已看', comment: '诺兰的科幻巨作' },
  { id: 5, type: 'game', title: 'Celeste', cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300', rating: 5, status: '已通关', comment: '关于攀登与自我超越' },
  { id: 6, type: 'game', title: 'Hollow Knight', cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300', rating: 5, status: '已通关', comment: '银河恶魔城类游戏的巅峰' }
]

export const nowStatuses: NowStatus[] = [
  { id: 1, category: '在读', icon: '📖', content: '《深入理解 TypeScript》', updatedAt: '2024-05-20' },
  { id: 2, category: '在玩', icon: '🎮', content: '塞尔达传说：王国之泪', updatedAt: '2024-05-18' },
  { id: 3, category: '在学', icon: '🧠', content: 'Rust 编程语言', updatedAt: '2024-05-15' },
  { id: 4, category: '在追', icon: '📺', content: '《庆余年 第二季》', updatedAt: '2024-05-20' },
  { id: 5, category: '在思考', icon: '💭', content: '如何保持工作与生活的平衡', updatedAt: '2024-05-19' }
]

export const footprints: FootprintItem[] = [
  { id: 1, place: '北京', lat: 39.9, lng: 116.4, date: '2023-10', description: '第一次去北京，爬了长城' },
  { id: 2, place: '上海', lat: 31.2, lng: 121.5, date: '2024-01', description: '在外滩看夜景' },
  { id: 3, place: '杭州', lat: 30.3, lng: 120.2, date: '2024-03', description: '西湖骑行，断桥残雪' },
  { id: 4, place: '成都', lat: 30.6, lng: 104.1, date: '2024-04', description: '吃火锅，看熊猫' }
]

export const badges: Badge[] = [
  { id: 1, name: '初来乍到', icon: '🌱', description: '首次访问网站', condition: '访问网站', earned: true, earnedAt: '2024-05-01' },
  { id: 2, name: '话痨达人', icon: '💬', description: '首次留言', condition: '发表第一条留言', earned: true, earnedAt: '2024-05-02' },
  { id: 3, name: '阅读者', icon: '📖', description: '阅读 10 篇文章', condition: '阅读 10 篇文章', earned: false },
  { id: 4, name: '社交达人', icon: '🤝', description: '留言被回复 5 次', condition: '留言被回复 5 次', earned: false },
  { id: 5, name: '铁杆粉丝', icon: '⭐', description: '连续访问 7 天', condition: '连续访问 7 天', earned: false },
  { id: 6, name: '收藏家', icon: '🏆', description: '点赞 20 次', condition: '点赞 20 次', earned: false },
  { id: 7, name: '夜猫子', icon: '🦉', description: '凌晨访问网站', condition: '凌晨 0-5 点访问', earned: true, earnedAt: '2024-05-03' },
  { id: 8, name: '分享者', icon: '📤', description: '分享文章到社交平台', condition: '分享文章', earned: false },
  { id: 9, name: '探索者', icon: '🗺️', description: '访问所有页面', condition: '访问所有页面', earned: false },
  { id: 10, name: '评论达人', icon: '💡', description: '发表 10 条留言', condition: '发表 10 条留言', earned: false },
  { id: 11, name: '早起鸟', icon: '🐦', description: '早上 6-8 点访问', condition: '早上 6-8 点访问', earned: false },
  { id: 12, name: '忠实读者', icon: '📚', description: '阅读 50 篇文章', condition: '阅读 50 篇文章', earned: false }
]

export const changelog: ChangelogEntry[] = [
  { id: 1, date: '2024-05-20', title: '新增 Now 实时状态页', content: '可以查看站长当前在读、在玩、在学什么', type: 'feature' },
  { id: 2, date: '2024-05-15', title: '修复留言板样式问题', content: '修复了移动端留言卡片溢出的问题', type: 'fix' },
  { id: 3, date: '2024-05-10', title: '优化页面加载速度', content: '图片懒加载、代码分割、缓存优化', type: 'optimize' },
  { id: 4, date: '2024-05-01', title: '网站正式上线', content: '个人博客网站正式上线，包含博客、留言板、友链等功能', type: 'feature' },
  { id: 5, date: '2024-04-25', title: '暗黑模式主题', content: '新增暗黑模式，保护眼睛', type: 'theme' }
]

export const timeline: TimelineItem[] = [
  { id: 1, date: '2024-05-20', title: '开始学习 Rust', content: '终于开始学 Rust 了，所有权系统真的很有意思', type: 'life' },
  { id: 2, date: '2024-05-15', title: '发布了 Vue3 学习笔记', content: '整理了 Composition API 的使用心得', type: 'article' },
  { id: 3, date: '2024-05-10', title: '读完了《百年孤独》', content: '魔幻现实主义的巅峰，马尔克斯太厉害了', type: 'collection' },
  { id: 4, date: '2024-05-01', title: '网站正式上线', content: '经过一个月的开发，个人博客终于上线了', type: 'project' },
  { id: 5, date: '2024-04-20', title: '周末去了杭州', content: '西湖骑行，断桥残雪，太美了', type: 'photo' },
  { id: 6, date: '2024-04-15', title: '完成了 TypeScript 技巧文章', content: '整理了日常开发中常用的 TS 技巧', type: 'article' }
]
