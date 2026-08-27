<template>
  <footer class="border-t border-[var(--color-border)] mt-12 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="font-serif font-bold text-lg mb-3">🍊 小橘子的日常</h3>
          <p class="text-sm text-[var(--color-text-light)]">记录生活中的小确幸，分享有趣的知识与故事</p>
        </div>
        <div>
          <h4 class="font-bold mb-3">快速链接</h4>
          <div class="flex flex-wrap gap-2">
            <router-link v-for="link in quickLinks" :key="link.path" :to="link.path"
              class="text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors">
              {{ link.name }}
            </router-link>
          </div>
        </div>
        <div>
          <h4 class="font-bold mb-3">本站已运行</h4>
          <p class="text-sm text-[var(--color-primary)] font-mono">{{ siteRunningTime }}</p>
        </div>
      </div>
      <div class="mt-8 pt-4 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-text-muted)]">
        <p>© 2024 小橘子的日常. Made with ❤️</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { siteConfig } from '@/data/mock'

const quickLinks = [
  { name: '博客', path: '/blog' },
  { name: '留言板', path: '/guestbook' },
  { name: '关于我', path: '/about' },
  { name: '友链', path: '/friends' },
  { name: '橱窗', path: '/shop' },
  { name: '足迹', path: '/footprint' },
  { name: '徽章', path: '/badges' },
  { name: '更新日志', path: '/changelog' }
]

const siteRunningTime = ref('')

onMounted(() => {
  const startDate = new Date(siteConfig.siteStartDate).getTime()
  const update = () => {
    const diff = Date.now() - startDate
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    siteRunningTime.value = `${days} 天 ${hours} 小时`
  }
  update()
  setInterval(update, 60000)
})
</script>
