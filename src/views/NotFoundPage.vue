<template>
  <div class="min-h-[60vh] flex flex-col items-center justify-center text-center">
    <span class="text-8xl mb-6 animate-bounce">🍊</span>
    <h1 class="font-serif text-4xl font-bold mb-4">哎呀，页面走丢了！</h1>
    <p class="text-lg text-[var(--color-text-light)] mb-8">
      你访问的页面不存在，或者已经被小橘子吃掉了~
    </p>
    <div class="flex gap-4">
      <router-link to="/" class="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
        🏠 返回首页
      </router-link>
      <button @click="randomPost" class="px-6 py-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl font-medium hover:border-[var(--color-primary)] transition-colors">
        🎲 随机看看
      </button>
    </div>
    <div class="mt-12 text-sm text-[var(--color-text-muted)]">
      <p>错误代码：404 - Page Not Found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { articles } from '@/data/mock'

const router = useRouter()

function randomPost() {
  const randomIndex = Math.floor(Math.random() * articles.length)
  router.push(`/blog/${articles[randomIndex].slug}`)
}
</script>
