// ===== Blog Post =====
export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  tags: string[]
  publishedAt: string
  readingTime: number
  wordCount: number
  viewCount: number
  featured: boolean
  reactions: Record<string, number>
}

// ===== Friend Link =====
export interface FriendLink {
  id: number
  name: string
  url: string
  avatar: string
  description: string
  category: string
}

// ===== Product =====
export interface Product {
  id: number
  name: string
  description: string
  price: string
  image: string
  link: string
  category: string
  recommended: boolean
}

// ===== Guestbook Entry =====
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

// ===== Collection Item =====
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

// ===== Now Status =====
export interface NowStatus {
  id: number
  category: string
  icon: string
  content: string
  updatedAt: string
}

// ===== Footprint =====
export interface Footprint {
  id: number
  place: string
  lat: number
  lng: number
  date: string
  description: string
  photo?: string
}

// ===== Badge =====
export interface Badge {
  id: number
  name: string
  icon: string
  description: string
  condition: string
  earned: boolean
  earnedAt?: string
}

// ===== Changelog Entry =====
export interface ChangelogEntry {
  id: number
  date: string
  title: string
  content: string
  type: 'feature' | 'fix' | 'optimize' | 'theme'
}

// ===== Timeline Item =====
export interface TimelineItem {
  id: number
  date: string
  title: string
  description: string
  type: 'article' | 'photo' | 'collection' | 'life' | 'project'
  link?: string
}

// ===== Music Track =====
export interface MusicTrack {
  id: number
  title: string
  artist: string
  url: string
  cover: string
}

// ===== Category =====
export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

// ===== Site Config =====
export interface SiteConfig {
  siteName: string
  siteDescription: string
  author: {
    name: string
    avatar: string
    bio: string
    social: {
      github?: string
      twitter?: string
      email?: string
      bilibili?: string
    }
  }
  announcement: string
  siteStartDate: string
  musicEnabled: boolean
  shopEnabled: boolean
  clickEffectEnabled: boolean
}

// ===== Reader Location =====
export interface ReaderLocation {
  city: string
  count: number
  lat: number
  lng: number
}
