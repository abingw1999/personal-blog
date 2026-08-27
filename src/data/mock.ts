import type {
  BlogPost, FriendLink, Product, GuestbookEntry, CollectionItem,
  NowStatus, Footprint, Badge, ChangelogEntry, TimelineItem,
  MusicTrack, Category, SiteConfig, ReaderLocation
} from '@/types'

export const siteConfig: SiteConfig = {
  siteName: '小橘子的日常',
  siteDescription: '记录生活中的小确幸，分享有趣的知识与故事',
  author: {
    name: '小橘子',
    avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=orange&backgroundColor=ffdfbf&size=200',
    bio: '一个热爱生活的普通人，喜欢游戏、阅读和探索世界',
    social: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      email: 'hello@example.com',
      bilibili: 'https://bilibili.com'
    }
  },
  announcement: '欢迎来到我的小天地！这里记录着我的日常和感悟，希望你能喜欢~',
  siteStartDate: '2024-01-01',
  musicEnabled: true,
  shopEnabled: false,
  clickEffectEnabled: true
}

export const categories: Category[] = [
  { id: 'life', name: '生活', icon: '🌿', color: '#7FB685' },
  { id: 'gaming', name: '游戏', icon: '🎮', color: '#E8735A' },
  { id: 'knowledge', name: '知识', icon: '📚', color: '#5B8DEF' },
  { id: 'tech', name: '技术', icon: '💻', color: '#9B59B6' },
  { id: 'travel', name: '旅行', icon: '✈️', color: '#F5A623' },
  { id: 'food', name: '美食', icon: '🍜', color: '#E74C3C' }
]

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'spring-day',
    title: '春日里的一场小散步',
    excerpt: '阳光正好，微风不燥，决定出门走走。路边的樱花开得正盛，空气里都是甜甜的味道...',
    content: `## 春天的味道

阳光正好，微风不燥，决定出门走走。

路边的樱花开得正盛，空气里都是甜甜的味道。公园里有很多人在放风筝，小孩子们跑来跑去，笑声清脆。

### 路上的发现

- 一棵开满花的老树
- 一只慵懒的橘猫
- 一对牵手散步的老夫妻

> 生活的美好，往往藏在这些不经意的瞬间里。

有时候觉得，幸福不是什么惊天动地的大事，而是这些平凡日子里的小确幸。

\`\`\`
今天的心情：☀️ 晴朗
步数：8,234 步
拍照：12 张
\`\`\`

下次还要来这片樱花林！`,
    coverImage: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&h=400&fit=crop',
    category: 'life',
    tags: ['春天', '散步', '日常'],
    publishedAt: '2024-03-15',
    readingTime: 3,
    wordCount: 450,
    viewCount: 1234,
    featured: true,
    reactions: { '❤️': 23, '🔥': 8, '😂': 2, '😮': 1, '👍': 15 }
  },
  {
    id: 2,
    slug: 'game-review-zelda',
    title: '《塞尔达传说》200小时通关感想',
    excerpt: '终于把海拉鲁大陆探索了个遍，这篇文章来聊聊我的游戏体验和感悟...',
    content: `## 海拉鲁之旅

经过了200多个小时的冒险，我终于把《塞尔达传说：王国之泪》通关了。

### 最喜欢的瞬间

1. 第一次飞上天空的那一刻
2. 发现隐藏神庙的惊喜
3. 用奇葩载具打败Boss的成就感

### 游戏给我的启发

这个游戏教会我：**遇到问题不一定要按套路来**，有时候跳出框架思考，反而能找到更有趣的解决方案。

> 游戏不只是娱乐，也是一种学习方式。`,
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop',
    category: 'gaming',
    tags: ['塞尔达', '游戏评测', '任天堂'],
    publishedAt: '2024-03-10',
    readingTime: 8,
    wordCount: 1800,
    viewCount: 2567,
    featured: true,
    reactions: { '❤️': 45, '🔥': 32, '😂': 5, '😮': 12, '👍': 28 }
  },
  {
    id: 3,
    slug: 'coffee-guide',
    title: '手冲咖啡入门指南：从选豆到冲泡',
    excerpt: '作为一个曾经的速溶咖啡党，我是如何一步步走进手冲咖啡的世界的...',
    content: `## 我的咖啡之旅

作为一个曾经的速溶咖啡党，我是如何一步步走进手冲咖啡的世界的。

### 入门装备

- 手摇磨豆机
- V60 滤杯
- 细口壶
- 电子秤

### 冲泡要点

1. 水温：90-96度
2. 粉水比：1:15
3. 研磨度：中细

> 好咖啡不需要多贵的设备，用心就好。`,
    coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop',
    category: 'knowledge',
    tags: ['咖啡', '手冲', '生活技能'],
    publishedAt: '2024-03-05',
    readingTime: 6,
    wordCount: 1200,
    viewCount: 890,
    featured: false,
    reactions: { '❤️': 18, '🔥': 5, '😂': 1, '😮': 3, '👍': 12 }
  },
  {
    id: 4,
    slug: 'weekend-cooking',
    title: '周末厨房实验：自制日式拉面',
    excerpt: '花了整整一个下午，从熬汤底到做叉烧，终于还原了记忆中那碗拉面的味道...',
    content: `## 自制拉面记录

花了整整一个下午，从熬汤底到做叉烧，终于还原了记忆中那碗拉面的味道。

### 材料清单

- 猪骨 1kg
- 酱油、味醂、清酒
- 溏心蛋
- 葱花、海苔、笋干

### 步骤

1. 猪骨焯水后大火熬煮4小时
2. 叉烧用酱油味醂腌制后慢炖
3. 溏心蛋煮6分半钟，冰水浸泡

> 做饭的过程本身就是一种治愈。`,
    coverImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=400&fit=crop',
    category: 'food',
    tags: ['料理', '拉面', '周末'],
    publishedAt: '2024-02-28',
    readingTime: 5,
    wordCount: 980,
    viewCount: 654,
    featured: false,
    reactions: { '❤️': 31, '🔥': 15, '😂': 3, '😮': 8, '👍': 22 }
  },
  {
    id: 5,
    slug: 'book-review-atomic-habits',
    title: '读书笔记：《原子习惯》的4个定律',
    excerpt: '这本书改变了我对习惯养成的认知，微小的改变能带来巨大的差异...',
    content: `## 原子习惯

这本书改变了我对习惯养成的认知。

### 四个定律

1. **让它显而易见** - 把想做的事放在显眼的地方
2. **让它有吸引力** - 把想做的事和喜欢的事绑定
3. **让它简便易行** - 从两分钟版本开始
4. **让它令人愉悦** - 给自己即时奖励

### 我的实践

- 每天早上先喝一杯水（定律1）
- 边听播客边跑步（定律2）
- 每天只读一页书（定律3）
- 在日历上打勾（定律4）

> 不要追求一次巨大的改变，而是每天进步1%。`,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=400&fit=crop',
    category: 'knowledge',
    tags: ['读书', '习惯', '自我提升'],
    publishedAt: '2024-02-20',
    readingTime: 7,
    wordCount: 1500,
    viewCount: 1876,
    featured: true,
    reactions: { '❤️': 56, '🔥': 28, '😂': 2, '😮': 4, '👍': 41 }
  },
  {
    id: 6,
    slug: 'kyoto-travel',
    title: '京都五日慢游记：寺庙、和服与抹茶',
    excerpt: '在京都的五天里，我走过了无数寺庙，穿上了和服，喝遍了各种抹茶...',
    content: `## 京都慢游

在京都的五天里，我走过了无数寺庙，穿上了和服，喝遍了各种抹茶。

### 行程亮点

- Day 1: 伏见稻荷大社的千本鸟居
- Day 2: 岚山竹林与天龙寺
- Day 3: 祇园花见小路
- Day 4: 金阁寺与龙安寺
- Day 5: 清水寺与二年坂

> 旅行不是打卡，而是感受。`,
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=400&fit=crop',
    category: 'travel',
    tags: ['日本', '京都', '旅行'],
    publishedAt: '2024-02-15',
    readingTime: 10,
    wordCount: 2200,
    viewCount: 3421,
    featured: true,
    reactions: { '❤️': 78, '🔥': 45, '😂': 3, '😮': 15, '👍': 52 }
  }
]

export const friendLinks: FriendLink[] = [
  { id: 1, name: '樱花博客', url: 'https://example.com/sakura', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=sakura&backgroundColor=ffb6c1', description: '记录生活中的美好瞬间', category: '朋友的博客' },
  { id: 2, name: '代码日记', url: 'https://example.com/code', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=code&backgroundColor=87ceeb', description: '一个程序员的日常', category: '朋友的博客' },
  { id: 3, name: '美食地图', url: 'https://example.com/food', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=food&backgroundColor=ffd700', description: '探索世界各地的美食', category: '推荐网站' },
  { id: 4, name: '旅行日志', url: 'https://example.com/travel', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=travel&backgroundColor=98fb98', description: '用脚步丈量世界', category: '推荐网站' },
  { id: 5, name: '摄影天地', url: 'https://example.com/photo', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=photo&backgroundColor=dda0dd', description: '用镜头捕捉光影', category: '朋友的博客' }
]

export const products: Product[] = [
  { id: 1, name: '复古胶片相机', description: '记录生活的每一刻', price: '¥299', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop', link: 'https://example.com', category: '数码', recommended: true },
  { id: 2, name: '手冲咖啡套装', description: '在家也能做出咖啡店的味道', price: '¥168', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop', link: 'https://example.com', category: '生活', recommended: true },
  { id: 3, name: '日式陶瓷杯', description: '手工制作的温暖质感', price: '¥89', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&h=300&fit=crop', link: 'https://example.com', category: '生活', recommended: false }
]

export const guestbookEntries: GuestbookEntry[] = [
  {
    id: 1, nickname: '小明', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=ming', content: '很喜欢你的博客风格，温暖又有设计感！', emoji: '❤️', createdAt: '2024-03-15 14:30', parentId: null,
    replies: [
      { id: 11, nickname: '小橘子', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=orange', content: '谢谢你的喜欢！会继续努力的~', emoji: '😊', createdAt: '2024-03-15 15:00', parentId: 1, replies: [] }
    ]
  },
  {
    id: 2, nickname: '旅行者', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=traveler', content: '京都那篇游记写得太好了，已经加入我的旅行清单！', emoji: '✈️', createdAt: '2024-03-14 10:20', parentId: null, replies: []
  },
  {
    id: 3, nickname: '游戏迷', avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=gamer', content: '塞尔达那篇文章说到我心坎里了，200小时不是白玩的！', emoji: '🎮', createdAt: '2024-03-13 20:15', parentId: null, replies: []
  }
]

export const collections: CollectionItem[] = [
  { id: 1, type: 'book', title: '原子习惯', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop', rating: 9, status: '已读', comment: '改变了我对习惯养成的认知', link: 'https://book.douban.com', completedAt: '2024-02' },
  { id: 2, type: 'book', title: '百年孤独', cover: 'https://images.unsplash.com/photo-1543002588-bfa73341bf51?w=200&h=280&fit=crop', rating: 8, status: '已读', comment: '魔幻现实主义的巅峰之作', completedAt: '2024-01' },
  { id: 3, type: 'movie', title: '千与千寻', cover: 'https://images.unsplash.com/photo-1518930259200-3e5b29f2ea24?w=200&h=280&fit=crop', rating: 10, status: '已看', comment: '每次看都有新的感悟', link: 'https://douban.com' },
  { id: 4, type: 'game', title: '塞尔达传说：王国之泪', cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=280&fit=crop', rating: 10, status: '已通关', comment: '200小时的冒险，值得每一分钟', completedAt: '2024-03' },
  { id: 5, type: 'game', title: '星之卡比：探索发现', cover: 'https://images.unsplash.com/photo-1585620385456-4a0a5e06c8e2?w=200&h=280&fit=crop', rating: 8, status: '已通关', comment: '可爱又治愈的游戏' },
  { id: 6, type: 'book', title: '人类简史', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=280&fit=crop', rating: 7, status: '在读', comment: '正在阅读中...' }
]

export const nowStatuses: NowStatus[] = [
  { id: 1, category: '在读', icon: '📖', content: '《被讨厌的勇气》', updatedAt: '2024-03-15' },
  { id: 2, category: '在玩', icon: '🎮', content: '《博德之门3》', updatedAt: '2024-03-15' },
  { id: 3, category: '在学', icon: '🎨', content: '水彩画基础', updatedAt: '2024-03-14' },
  { id: 4, category: '在追', icon: '📺', content: '《葬送的芙莉莲》', updatedAt: '2024-03-15' },
  { id: 5, category: '在思考', icon: '💭', content: '如何更好地平衡工作与生活', updatedAt: '2024-03-13' }
]

export const footprints: Footprint[] = [
  { id: 1, place: '北京', lat: 39.9, lng: 116.4, date: '2023-10', description: '故宫、长城、胡同' },
  { id: 2, place: '上海', lat: 31.2, lng: 121.5, date: '2023-08', description: '外滩、迪士尼、城隍庙' },
  { id: 3, place: '成都', lat: 30.6, lng: 104.1, date: '2023-07', description: '火锅、熊猫基地、宽窄巷子' },
  { id: 4, place: '京都', lat: 35.0, lng: 135.8, date: '2024-02', description: '寺庙、和服体验、抹茶' },
  { id: 5, place: '大理', lat: 25.7, lng: 100.2, date: '2023-12', description: '洱海、古城、苍山' }
]

export const badges: Badge[] = [
  { id: 1, name: '初次见面', icon: '👋', description: '第一次访问网站', condition: '访问首页', earned: true, earnedAt: '2024-01-01' },
  { id: 2, name: '话痨达人', icon: '💬', description: '在留言板留下第一条留言', condition: '发表留言', earned: true, earnedAt: '2024-01-15' },
  { id: 3, name: '阅读者', icon: '📖', description: '阅读5篇文章', condition: '阅读5篇文章', earned: true, earnedAt: '2024-02-01' },
  { id: 4, name: '铁杆粉丝', icon: '❤️', description: '给文章点赞10次', condition: '点赞10次', earned: false },
  { id: 5, name: '社交达人', icon: '🌟', description: '分享文章到社交平台', condition: '分享文章', earned: false },
  { id: 6, name: '夜猫子', icon: '🦉', description: '在凌晨0-5点访问网站', condition: '凌晨访问', earned: true, earnedAt: '2024-03-01' },
  { id: 7, name: '探索者', icon: '🗺️', description: '访问网站所有页面', condition: '访问所有页面', earned: false },
  { id: 8, name: '收藏家', icon: '🏆', description: '收藏5篇文章', condition: '收藏5篇', earned: false },
  { id: 9, name: '连续签到', icon: '📅', description: '连续7天访问网站', condition: '连续7天', earned: false },
  { id: 10, name: '评论达人', icon: '💭', description: '发表10条评论', condition: '评论10次', earned: false },
  { id: 11, name: '早起鸟儿', icon: '🌅', description: '在早上6-8点访问网站', condition: '早起访问', earned: true, earnedAt: '2024-02-15' },
  { id: 12, name: '音乐爱好者', icon: '🎵', description: '播放音乐10次', condition: '播放10次', earned: false }
]

export const changelogEntries: ChangelogEntry[] = [
  { id: 1, date: '2024-03-15', title: '新增音乐播放器', content: '添加了全站悬浮音乐播放器，支持播放列表、音量控制等功能', type: 'feature' },
  { id: 2, date: '2024-03-10', title: '优化暗黑模式', content: '修复了暗黑模式下部分文字颜色不清晰的问题', type: 'fix' },
  { id: 3, date: '2024-03-05', title: '新增徽章系统', content: '添加了12个趣味徽章，访客可以通过互动获得', type: 'feature' },
  { id: 4, date: '2024-02-28', title: '性能优化', content: '优化了图片加载和页面渲染速度', type: 'optimize' },
  { id: 5, date: '2024-02-20', title: '新增时间轴页面', content: '添加了内容时间轴功能，可以按时间浏览所有内容', type: 'feature' },
  { id: 6, date: '2024-02-15', title: '更换主题配色', content: '调整为更温暖的奶油色系，视觉更舒适', type: 'theme' }
]

export const timelineItems: TimelineItem[] = [
  { id: 1, date: '2024-03-15', title: '春日里的一场小散步', description: '记录了一次愉快的春日散步', type: 'article', link: '/blog/spring-day' },
  { id: 2, date: '2024-03-10', title: '通关了《塞尔达传说》', description: '200小时的冒险终于结束', type: 'collection' },
  { id: 3, date: '2024-03-05', title: '学会了手冲咖啡', description: '从零开始学习手冲咖啡', type: 'life' },
  { id: 4, date: '2024-02-28', title: '自制日式拉面', description: '花了整整一个下午做拉面', type: 'life' },
  { id: 5, date: '2024-02-20', title: '读完《原子习惯》', description: '改变了我对习惯养成的认知', type: 'collection' },
  { id: 6, date: '2024-02-15', title: '京都五日游', description: '寺庙、和服与抹茶的美好时光', type: 'article', link: '/blog/kyoto-travel' },
  { id: 7, date: '2024-02-01', title: '网站上线', description: '小橘子的日常正式上线！', type: 'project' }
]

export const musicTracks: MusicTrack[] = [
  { id: 1, title: 'Spring Morning', artist: 'Free Music', url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_1b5f0458b0.mp3', cover: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=100&h=100&fit=crop' },
  { id: 2, title: 'Gentle Breeze', artist: 'Free Music', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_18a23c3cd5.mp3', cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop' },
  { id: 3, title: 'Peaceful Piano', artist: 'Free Music', url: 'https://cdn.pixabay.com/audio/2022/10/18/audio_4b30b04a4f.mp3', cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100&h=100&fit=crop' },
  { id: 4, title: 'Sunny Day', artist: 'Free Music', url: 'https://cdn.pixabay.com/audio/2022/03/24/audio_d1718ab41b.mp3', cover: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=100&h=100&fit=crop' },
  { id: 5, title: 'Quiet Evening', artist: 'Free Music', url: 'https://cdn.pixabay.com/audio/2022/08/02/audio_464c30e563.mp3', cover: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=100&h=100&fit=crop' }
]

export const readerLocations: ReaderLocation[] = [
  { city: '北京', count: 234, lat: 39.9, lng: 116.4 },
  { city: '上海', count: 189, lat: 31.2, lng: 121.5 },
  { city: '广州', count: 156, lat: 23.1, lng: 113.3 },
  { city: '深圳', count: 143, lat: 22.5, lng: 114.1 },
  { city: '杭州', count: 98, lat: 30.3, lng: 120.2 },
  { city: '成都', count: 87, lat: 30.6, lng: 104.1 },
  { city: '武汉', count: 76, lat: 30.6, lng: 114.3 },
  { city: '南京', count: 65, lat: 32.1, lng: 118.8 }
]
