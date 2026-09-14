<template>
  <div>
    <h1 class="font-serif text-3xl font-bold mb-8">📝 博客</h1>
    <!-- Filters -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat"
        :class="['px-3 py-1.5 rounded-full text-sm transition-colors', selectedCategory === cat ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]']">
        {{ cat }}
      </button>
    </div>
    <!-- Search -->
    <div class="mb-6">
      <input v-model="searchQuery" type="text" placeholder="搜索文章..." class="w-full px-4 py-2.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none transition-colors" />
    </div>
    <!-- Posts -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <router-link v-for="post in filteredPosts" :key="post.id" :to="`/blog/${post.slug}`"
        class="group bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <img :src="post.cover" :alt="post.title" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        <div class="p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">{{ post.category }}</span>
            <span class="text-xs text-[var(--color-text-muted)]">{{ post.readTime }} 分钟 · {{ post.wordCount }} 字</span>
          </div>
          <h2 class="font-bold text-lg mb-1 group-hover:text-[var(--color-primary)] transition-colors">{{ post.title }}</h2>
          <p class="text-sm text-[var(--color-text-light)] line-clamp-2">{{ post.excerpt }}</p>
          <div class="flex flex-wrap gap-1 mt-3">
            <span v-for="tag in post.tags" :key="tag" class="text-xs px-2 py-0.5 rounded bg-[var(--color-bg)] text-[var(--color-text-muted)]">#{{ tag }}</span>
          </div>
          <div class="flex items-center justify-between mt-3 text-xs text-[var(--color-text-muted)]">
            <span>{{ post.createdAt }}</span>
            <span>👁 {{ post.views }}</span>
          </div>
        </div>
      </router-link>
    </div>
    <div v-if="loading" class="text-center py-12 text-[var(--color-text-muted)]">
      <p>📡 正在加载文章…</p>
    </div>
    <div v-else-if="error" class="text-center py-12 text-[var(--color-text-muted)]">
      <span class="text-4xl block mb-4">⚠️</span>
      <p>{{ error }}</p>
    </div>
    <div v-else-if="filteredPosts.length === 0" class="text-center py-12 text-[var(--color-text-muted)]">
      <span class="text-4xl block mb-4">🔍</span>
      <p>没有找到匹配的文章</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { api, useAsyncData } from '@/api'
import type { Article } from '@/types'

const selectedCategory = ref('全部')
const searchQuery = ref('')

// 文章列表从后端 /api/articles 拉取。
// 分类/关键词目前在前端过滤（后端同样支持 category/keyword 参数，
// 文章量大了之后可以改成服务端筛选 + 分页）。
const { data: articles, loading, error } = useAsyncData<Article[]>(
  () => api.getArticles({ page: 1, size: 100 }).then((r) => r.list),
  []
)

// 分类从后端 /api/articles/categories 取
const { data: categories } = useAsyncData<string[]>(
  async () => {
    try {
      const list = await api.getCategories()
      return ['全部', ...list]
    } catch {
      return ['全部']
    }
  },
  ['全部']
)

const filteredPosts = computed(() => {
  let result = articles.value
  if (selectedCategory.value !== '全部') result = result.filter(a => a.category === selectedCategory.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(a =>
      (a.title || '').toLowerCase().includes(q) ||
      (a.excerpt || '').toLowerCase().includes(q) ||
      (a.tags || []).some(t => t.toLowerCase().includes(q))
    )
  }
  return result
})
</script>
