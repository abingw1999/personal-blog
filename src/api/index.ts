/**
 * 后端 API 封装
 *
 * 三件事：
 * 1. 统一拆包后端 Result{code,message,data}
 * 2. 自动注入 JWT（存 localStorage）
 * 3. 抹平后端与前端的数据格式差异
 *    - 后端 Article.tags 存的是 JSON 字符串 '["a","b"]'，前端要 string[]
 *    - 后端 LocalDateTime 序列化为 '2024-03-15T10:30:00'，前端卡片只显示日期
 *
 * 用原生 fetch，不引入 axios —— 项目用 pnpm --frozen-lockfile 构建，
 * 新增依赖必须同步改 pnpm-lock.yaml，否则线上构建会失败。
 */
import { ref, onMounted, type Ref } from 'vue'
import type {
  Article,
  FriendLink,
  Product,
  Music,
  CollectionItem,
  NowStatus,
  FootprintItem,
  Badge,
  ChangelogEntry,
  Comment,
} from '@/types'

/** 分页结果（对应后端 dto/PageResult，字段名是 list 不是 records） */
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  size: number
}

export interface LoginResponse {
  token: string
  nickname: string
  avatar: string
}

interface ApiResult<T> {
  code: number
  message: string
  data: T
}

const BASE_URL = '/api'
const TOKEN_KEY = 'blog_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const resp = await fetch(BASE_URL + path, { ...options, headers })
  if (!resp.ok) {
    throw new Error(`请求失败 (HTTP ${resp.status})`)
  }

  const result = (await resp.json()) as ApiResult<T>
  if (result.code !== 200) {
    throw new Error(result.message || '请求失败')
  }
  return result.data
}

function toQuery(params: Record<string, string | number | undefined | null>): string {
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      usp.append(key, String(value))
    }
  })
  const qs = usp.toString()
  return qs ? `?${qs}` : ''
}

/** 后端 LocalDateTime -> 'YYYY-MM-DD' */
export function formatDate(value?: string | null): string {
  if (!value) return ''
  return String(value).replace('T', ' ').slice(0, 10)
}

/** 后端 tags 是 JSON 字符串，转成数组 */
export function parseTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags as string[]
  if (typeof tags !== 'string' || !tags.trim()) return []
  try {
    const parsed = JSON.parse(tags)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeArticle(raw: any): Article {
  return {
    ...raw,
    tags: parseTags(raw?.tags),
    createdAt: formatDate(raw?.createdAt),
    // 这几个字段后端可能为 null，补 0 避免模板里出现 "null 分钟阅读"
    readTime: raw?.readTime ?? 0,
    wordCount: raw?.wordCount ?? 0,
    views: raw?.views ?? 0,
  } as Article
}

function normalizeComment(raw: any): Comment {
  return {
    ...raw,
    createdAt: String(raw?.createdAt ?? '').replace('T', ' ').slice(0, 16),
  } as Comment
}

/** 后端 LocalDateTime -> 'YYYY-MM-DD HH:mm' */
function formatDateTime(value?: string | null): string {
  if (!value) return ''
  return String(value).replace('T', ' ').slice(0, 16)
}

export const api = {
  // ===== 认证 =====
  login: (username: string, password: string) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // ===== 文章 =====
  getArticles: (params: { page?: number; size?: number; category?: string; keyword?: string } = {}) =>
    request<PageResult<Article>>(`/articles${toQuery(params)}`).then((r) => ({
      ...r,
      list: (r.list || []).map(normalizeArticle),
    })),

  getArticle: (slug: string) =>
    request<Article>(`/articles/${encodeURIComponent(slug)}`).then(normalizeArticle),

  getFeaturedArticles: () =>
    request<Article[]>('/articles/featured').then((list) => (list || []).map(normalizeArticle)),

  getCategories: () => request<string[]>('/articles/categories'),

  getRandomArticle: () => request<Article>('/articles/random').then(normalizeArticle),

  // ===== 留言板 =====
  getComments: () =>
    request<Comment[]>('/comments').then((list) => (list || []).map(normalizeComment)),

  createComment: (payload: {
    nickname: string
    content: string
    emoji?: string
    avatar?: string
    parentId?: number | null
  }) =>
    request<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(normalizeComment),

  // ===== 其余数据 =====
  getFriends: () => request<FriendLink[]>('/friends'),
  getProducts: () => request<Product[]>('/products'),
  getMusic: () => request<Music[]>('/music'),
  getCollections: (type?: string) =>
    request<CollectionItem[]>(`/collections${toQuery({ type })}`).then((list) =>
      (list || []).map((c) => ({ ...c, rating: c.rating ?? 0 }))
    ),
  // 后端 updatedAt 是 LocalDateTime('2024-03-15T10:30:00')，统一转成可读格式
  getNowStatus: () =>
    request<NowStatus[]>('/now-status').then((list) =>
      (list || []).map((s) => ({ ...s, updatedAt: formatDateTime(s.updatedAt) }))
    ),
  getFootprints: () => request<FootprintItem[]>('/footprints'),
  getBadges: () => request<Badge[]>('/badges'),
  getChangelog: () =>
    request<ChangelogEntry[]>('/changelog').then((list) =>
      (list || []).map((c) => ({ ...c, date: formatDate(c.date) }))
    ),
}

/**
 * 统一的异步数据加载助手，省去每个页面重复写 loading / error / onMounted
 */
export function useAsyncData<T>(
  loader: () => Promise<T>,
  fallback: T
): {
  data: Ref<T>
  loading: Ref<boolean>
  error: Ref<string>
  reload: () => Promise<void>
} {
  const data = ref(fallback) as Ref<T>
  const loading = ref(true)
  const error = ref('')

  const reload = async () => {
    loading.value = true
    error.value = ''
    try {
      data.value = await loader()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  onMounted(reload)
  return { data, loading, error, reload }
}
