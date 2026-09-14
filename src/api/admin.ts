/**
 * 管理后台 API
 *
 * 复用 @/api 里的 request()（JWT 注入、Result 拆包、错误提示都是同一份实现），
 * 这里只做「路径规划」和「格式转换」两件事。
 */
import { request, upload, toQuery, type PageResult } from './index'
import type { AdminStats, AdminProfile, UploadResult, AdminRow, Article } from '@/types'

/** 后端 LocalDateTime -> 'YYYY-MM-DD HH:mm' */
function fmtDateTime(value?: string | null): string {
  if (!value) return ''
  return String(value).replace('T', ' ').slice(0, 16)
}

/** 通用单表 CRUD。八个模块共用一套路径规则，省掉八份重复代码。 */
function crud<T extends AdminRow = AdminRow>(base: string) {
  return {
    list: (params: Record<string, string | number | boolean | undefined | null> = {}) =>
      request<T[]>(`${base}${toQuery(params)}`),
    create: (data: Partial<T>) =>
      request<T>(base, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<T>) =>
      request<T>(`${base}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) => request<void>(`${base}/${id}`, { method: 'DELETE' }),
  }
}

export const adminApi = {
  // ===== 概览与账号 =====
  stats: () => request<AdminStats>('/admin/stats'),
  profile: () => request<AdminProfile>('/admin/profile'),
  changePassword: (oldPassword: string, newPassword: string) =>
    request<void>('/admin/password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword }),
    }),

  // ===== 图片上传 =====
  uploadImage: (file: File) => upload<UploadResult>('/admin/upload', file),
  deleteImage: (path: string) =>
    request<void>(`/admin/upload${toQuery({ path })}`, { method: 'DELETE' }),

  // ===== 文章（有分页和多条件筛选，单独写） =====
  articles: {
    list: (params: {
      page?: number
      size?: number
      keyword?: string
      category?: string
      featured?: boolean
    }) => request<PageResult<Article>>(`/admin/articles${toQuery(params)}`),
    get: (id: number) => request<Article>(`/admin/articles/${id}`),
    create: (data: AdminRow) =>
      request<Article>('/admin/articles', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: AdminRow) =>
      request<Article>(`/admin/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) => request<void>(`/admin/articles/${id}`, { method: 'DELETE' }),
  },

  // ===== 留言（需要审核 / 回复，单独写） =====
  comments: {
    list: () => request<AdminRow[]>('/admin/comments').then((list) =>
      (list || []).map((c) => ({ ...c, createdAt: fmtDateTime(c.createdAt) }))
    ),
    approve: (id: number) => request<void>(`/admin/comments/${id}/approve`, { method: 'PUT' }),
    reject: (id: number) => request<void>(`/admin/comments/${id}/reject`, { method: 'PUT' }),
    remove: (id: number) => request<void>(`/admin/comments/${id}`, { method: 'DELETE' }),
    reply: (id: number, payload: { nickname?: string; content: string; emoji?: string }) =>
      request<AdminRow>(`/admin/comments/${id}/reply`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },

  // ===== 其余八个模块：字段不同，但操作完全一样 =====
  friends: crud('/admin/friends'),
  products: crud('/admin/products'),
  music: crud('/admin/music'),
  collections: crud('/admin/collections'),
  nowStatus: crud('/admin/now-status'),
  footprints: crud('/admin/footprints'),
  badges: crud('/admin/badges'),
  changelog: crud('/admin/changelog'),
}
