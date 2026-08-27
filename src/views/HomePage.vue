<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <section class="py-16 md:py-24 text-center">
      <div class="animate-fade-in">
        <img :src="config.avatar" :alt="config.nickname" class="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-[var(--color-primary-light)]" />
        <h1 class="font-serif text-3xl md:text-4xl font-bold mb-2">{{ config.nickname }}</h1>
        <p class="text-[var(--color-text-light)] text-lg mb-4">{{ config.tagline }}</p>
        <div class="flex justify-center gap-3">
          <a v-for="s in config.socialLinks" :key="s.name" :href="s.url" target="_blank"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
            {{ s.icon }}
          </a>
        </div>
      </div>
    </section>

    <!-- Announcements -->
    <section class="mb-12">
      <div class="bg-[var(--color-primary-light)] rounded-2xl p-4 flex items-center gap-3">
        <span class="text-xl">📢</span>
        <div class="text-sm">
          <span v-for="(a, i) in config.announcements" :key="i">{{ a }}<span v-if="i < config.announcements.length - 1"> · </span></span>
        </div>
      </div>
    </section>

    <!-- Featured Articles -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-serif text-2xl font-bold">📝 精选文章</h2>
        <router-link to="/blog" class="text-sm text-[var(--color-primary)] hover:underline">查看全部 →</router-link>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link v-for="post in featuredPosts" :key="post.id" :to="`/blog/${post.slug}`"
          class="group bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <img :src="post.cover" :alt="post.title" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
          <div class="p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">{{ post.category }}</span>
              <span class="text-xs text-[var(--color-text-muted)]">{{ post.readTime }} 分钟阅读</span>
            </div>
            <h3 class="font-bold mb-1 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{{ post.title }}</h3>
            <p class="text-sm text-[var(--color-text-light)] line-clamp-2">{{ post.excerpt }}</p>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Quick Links -->
    <section class="mb-12">
      <h2 class="font-serif text-2xl font-bold mb-6">🔗 快速入口</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link v-for="link in quickLinks" :key="link.path" :to="link.path"
          class="bg-[var(--color-card)] rounded-2xl p-4 text-center border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-md transition-all">
          <span class="text-3xl block mb-2">{{ link.icon }}</span>
          <span class="text-sm font-medium">{{ link.name }}</span>
        </router-link>
      </div>
    </section>

    <!-- Latest Posts -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-serif text-2xl font-bold">🕐 最新文章</h2>
        <router-link to="/blog" class="text-sm text-[var(--color-primary)] hover:underline">更多 →</router-link>
      </div>
      <div class="space-y-4">
        <router-link v-for="post in latestPosts" :key="post.id" :to="`/blog/${post.slug}`"
          class="flex gap-4 bg-[var(--color-card)] rounded-xl p-4 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all group">
          <img :src="post.cover" :alt="post.title" class="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
          <div class="min-w-0">
            <h3 class="font-bold group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{{ post.title }}</h3>
            <p class="text-sm text-[var(--color-text-light)] line-clamp-1 mt-1">{{ post.excerpt }}</p>
            <div class="flex items-center gap-3 mt-2 text-xs text-[var(--color-text-muted)]">
              <span>{{ post.createdAt }}</span>
              <span>👁 {{ post.views }}</span>
              <span>{{ post.category }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { siteConfig, articles } from '@/data/mock'
const config = siteConfig
const featuredPosts = articles.filter(a => a.featured).slice(0, 3)
const latestPosts = articles.slice(0, 5)
const quickLinks = [
  { name: '留言板', path: '/guestbook', icon: '💬' },
  { name: '友链', path: '/friends', icon: '🔗' },
  { name: '收藏', path: '/collections', icon: '⭐' },
  { name: '时间轴', path: '/timeline', icon: '📅' },
  { name: '关于我', path: '/about', icon: '👤' },
  { name: 'Now', path: '/now', icon: '📍' },
  { name: '足迹', path: '/footprint', icon: '🗺️' },
  { name: '徽章', path: '/badges', icon: '🏆' }
]
</script>
