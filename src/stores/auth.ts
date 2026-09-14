import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { api, getToken, setToken, clearToken } from '@/api'
import { adminApi } from '@/api/admin'

const NICKNAME_KEY = 'blog_admin_nickname'
const AVATAR_KEY = 'blog_admin_avatar'

/**
 * 登录状态
 *
 * token 本身由 @/api 统一管理（request() 每次从 localStorage 取），
 * 这个 store 只负责「页面要用到的展示信息」和登录/登出流程。
 */
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getToken())
  const nickname = ref(localStorage.getItem(NICKNAME_KEY) || '站长')
  const avatar = ref(localStorage.getItem(AVATAR_KEY) || '')
  /** 是否已经向后端确认过 token 有效，避免刷新页面时反复跳登录 */
  const verified = ref(false)

  const isLoggedIn = computed(() => !!token.value)

  async function login(username: string, password: string) {
    const data = await api.login(username, password)
    setToken(data.token)
    token.value = data.token
    nickname.value = data.nickname || '站长'
    avatar.value = data.avatar || ''
    localStorage.setItem(NICKNAME_KEY, nickname.value)
    localStorage.setItem(AVATAR_KEY, avatar.value)
    verified.value = true
  }

  function logout() {
    clearToken()
    token.value = null
    localStorage.removeItem(NICKNAME_KEY)
    localStorage.removeItem(AVATAR_KEY)
    verified.value = false
  }

  /**
   * 校验本地 token 是否还有效。
   * 无效就清掉——否则界面会显示「已登录」，但每个请求都 401。
   */
  async function verify(): Promise<boolean> {
    if (!token.value) {
      verified.value = true
      return false
    }
    try {
      const profile = await adminApi.profile()
      if (profile) {
        nickname.value = profile.nickname || nickname.value
        avatar.value = profile.avatar || avatar.value
        localStorage.setItem(NICKNAME_KEY, nickname.value)
        localStorage.setItem(AVATAR_KEY, avatar.value)
      }
      verified.value = true
      return true
    } catch {
      logout()
      verified.value = true
      return false
    }
  }

  return { token, nickname, avatar, isLoggedIn, verified, login, logout, verify }
})
