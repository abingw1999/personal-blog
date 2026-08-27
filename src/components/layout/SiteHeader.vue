<template>
  <header class="sticky top-0 z-50 backdrop-blur-md bg-[var(--color-bg)]/80 border-b border-[var(--color-border)]">
    <div class="container mx-auto px-4 max-w-6xl">
      <div class="flex items-center justify-between h-16">
        <router-link to="/" class="flex items-center gap-2 font-serif text-xl font-bold text-[var(--color-primary)]">
          <span class="text-2xl">🍊</span>
          <span class="hidden sm:inline">小橘子的日常</span>
        </router-link>

        <nav class="hidden md:flex items-center gap-1">
          <router-link v-for="item in navItems" :key="item.path" :to="item.path"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
            active-class="!text-[var(--color-primary)] bg-[var(--color-primary-light)]">
            {{ item.icon }} {{ item.name }}
          </router-link>
        </nav>

        <div class="flex items-center gap-2">
          <button @click="appStore.toggleTheme()" class="p-2 rounded-lg hover:bg-[var(--color-primary-light)] transition-colors" :title="appStore.isDark ? '切换亮色' : '切换暗色'">
            <span v-if="appStore.isDark">☀️</span>
            <span v-else>🌙</span>
          </button>
          <button @click="showMobileMenu = !showMobileMenu" class="md:hidden p-2 rounded-lg hover:bg-[var(--color-primary-light)]">
            <span v-if="showMobileMenu">✕</span>
            <span v-else>☰</span>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <transition name="page">
        <div v-if="showMobileMenu" class="md:hidden pb-4 border-t border-[var(--color-border)] pt-2">
          <router-link v-for="item in navItems" :key="item.path" :to="item.path"
            @click="showMobileMenu = false"
            class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--color-primary-light)]">
            {{ item.icon }} {{ item.name }}
          </router-link>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const showMobileMenu = ref(false)

const navItems = [
  { path: '/', name: '首页', icon: '🏠' },
  { path: '/blog', name: '博客', icon: '📝' },
  { path: '/guestbook', name: '留言', icon: '💬' },
  { path: '/about', name: '关于', icon: '👤' },
  { path: '/collections', name: '收藏', icon: '⭐' },
  { path: '/now', name: 'Now', icon: '📍' },
  { path: '/friends', name: '友链', icon: '🔗' },
  { path: '/timeline', name: '时间轴', icon: '📅' }
]
</script>
