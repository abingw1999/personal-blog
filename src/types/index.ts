export interface Article {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  cover: string
  category: string
  tags: string[]
  createdAt: string
  readTime: number
  wordCount: number
  views: number
  featured: boolean
}

export interface FriendLink {
  id: number
  name: string
  url: string
  avatar: string
  description: string
  category: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  link: string
  category: string
  recommended: boolean
}

export interface Music {
  id: number
  title: string
  artist: string
  url: string
  cover: string
}

export interface GuestbookEntry {
  id: number
  nickname: string
  avatar: string
  content: string
  emoji: string
  createdAt: string
  parentId: number | null
  replies: GuestbookEntry[]
}

export interface CollectionItem {
  id: number
  type: 'book' | 'movie' | 'game'
  title: string
  cover: string
  rating: number
  status: string
  comment: string
  link?: string
  completedAt?: string
}

export interface NowStatus {
  id: number
  category: string
  icon: string
  content: string
  updatedAt: string
}

export interface FootprintItem {
  id: number
  place: string
  lat: number
  lng: number
  date: string
  description: string
  photo?: string
}

export interface Badge {
  id: number
  name: string
  icon: string
  description: string
  condition: string
  earned: boolean
  earnedAt?: string
}

export interface ChangelogEntry {
  id: number
  date: string
  title: string
  content: string
  type: 'feature' | 'fix' | 'optimize' | 'theme'
}

export interface TimelineItem {
  id: number
  date: string
  title: string
  content: string
  type: 'article' | 'photo' | 'collection' | 'life' | 'project'
}

export interface SiteConfig {
  siteName: string
  siteDescription: string
  avatar: string
  nickname: string
  tagline: string
  socialLinks: { name: string; url: string; icon: string }[]
  announcements: string[]
  siteStartDate: string
  shopEnabled: boolean
}

/** 评论/留言（对应后端 Comment 实体） */
export interface Comment {
  id: number
  nickname: string
  avatar: string
  content: string
  emoji: string
  parentId: number | null
  approved: boolean
  ip?: string
  createdAt: string
  /** 后端 /api/comments 已经把子回复内嵌在主留言上 */
  replies?: Comment[]
}

/* ==========================================================
 * 后台管理相关
 *
 * 前端展示用的接口（上面那些）只声明了页面真正用到的字段。
 * 后台要编辑全字段，所以这里补上「排序 / 启用状态」这类
 * 前台用不到、但数据库里存在的字段。
 * ========================================================== */

/** 后台可编辑字段（叠加到各实体上） */
export interface AdminFields {
  /** 列表排序，越小越靠前 */
  sortOrder?: number
  /** 是否在前台展示（商品 / 音乐有这一列） */
  enabled?: boolean
}

export interface AdminStats {
  articles: number
  comments: number
  pendingComments: number
  friends: number
  products: number
  music: number
  collections: number
  nowStatus: number
  footprints: number
  badges: number
  changelog: number
  totalViews: number
  recentArticles: Article[]
}

export interface AdminProfile {
  id: number
  username: string
  nickname: string
  avatar: string
  enabled: boolean
}

export interface UploadResult {
  url: string
  name: string
  size: string
}

/** 后台文章编辑表单：tags 在表单里是逗号分隔的字符串，提交前转 JSON */
export interface ArticleForm {
  id?: number
  slug: string
  title: string
  excerpt: string
  content: string
  cover: string
  category: string
  tags: string
  readTime: number
  wordCount: number
  featured: boolean
}

/** 通用 CRUD 行的类型：各模块字段不同，用宽松类型承接 */
export type AdminRow = Record<string, any>

