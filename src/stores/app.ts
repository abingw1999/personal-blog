import { defineStore } from 'pinia'
import { ref } from 'vue'
import { siteConfig } from '@/config/site'
import type { SiteConfig } from '@/types'

export const useAppStore = defineStore('app', () => {
  const isDark = ref(false)
  const currentSiteConfig = ref<SiteConfig>(siteConfig)

  function initTheme() {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      isDark.value = true
      document.documentElement.classList.add('dark')
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return { isDark, currentSiteConfig, initTheme, toggleTheme }
})
