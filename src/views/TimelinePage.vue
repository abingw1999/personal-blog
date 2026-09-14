<template>
  <div>
    <h1 class="font-serif text-3xl font-bold mb-2">📅 内容时间轴</h1>
    <p class="text-[var(--color-text-light)] mb-6">按时间顺序记录所有内容</p>
    <!-- Filters -->
    <div class="flex flex-wrap gap-2 mb-8">
      <button v-for="type in types" :key="type.key" @click="selectedType = type.key"
        :class="['px-3 py-1.5 rounded-full text-sm transition-colors', selectedType === type.key ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]']">
        {{ type.icon }} {{ type.name }}
      </button>
    </div>
    <!-- Timeline -->
    <div class="relative pl-8 border-l-2 border-[var(--color-border)]">
      <div v-for="item in filteredTimeline" :key="item.id" class="relative mb-6">
        <div class="absolute -left-[2.35rem] w-4 h-4 rounded-full border-2 border-[var(--color-bg)]"
          :class="typeDotColors[item.type]"></div>
        <div class="bg-[var(--color-card)] rounded-2xl p-4 border border-[var(--color-border)] hover:shadow-md transition-all">
          <div class="flex items-center gap-2 mb-2">
            <span :class="['text-xs px-2 py-0.5 rounded-full', typeColors[item.type]]">{{ typeLabels[item.type] }}</span>
            <span class="text-xs text-[var(--color-text-muted)]">{{ item.date }}</span>
          </div>
          <h3 class="font-bold mb-1">{{ item.title }}</h3>
          <p class="text-sm text-[var(--color-text-light)]">{{ item.content }}</p>
        </div>
      </div>
    </div>
    <div v-if="filteredTimeline.length === 0" class="text-center py-12 text-[var(--color-text-muted)]">
      <span class="text-4xl block mb-4">📭</span>
      <p>暂无内容</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { api, useAsyncData } from '@/api'
import type { TimelineItem } from '@/types'

const selectedType = ref('all')
const types = [
  { key: 'all', name: '全部', icon: '📋' },
  { key: 'article', name: '文章', icon: '📝' },
  { key: 'photo', name: '照片', icon: '📸' },
  { key: 'collection', name: '收藏', icon: '⭐' },
  { key: 'life', name: '生活', icon: '🌱' },
  { key: 'project', name: '项目', icon: '🚀' }
]

const typeLabels: Record<string, string> = { article: '文章', photo: '照片', collection: '收藏', life: '生活', project: '项目' }
const typeColors: Record<string, string> = {
  article: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  photo: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  collection: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  life: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  project: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
}
const typeDotColors: Record<string, string> = {
  article: 'bg-blue-500',
  photo: 'bg-green-500',
  collection: 'bg-yellow-500',
  life: 'bg-pink-500',
  project: 'bg-purple-500'
}

// 后端没有独立的 timeline 接口，这里用「文章 + 收藏」两份数据在本地聚合成时间轴
const { data: timeline } = useAsyncData<TimelineItem[]>(async () => {
  const [articles, collections] = await Promise.all([api.getArticles({ size: 100 }), api.getCollections()])

  const fromArticles: TimelineItem[] = (articles.list || []).map((a) => ({
    id: 100000 + a.id,
    date: a.createdAt,
    title: a.title,
    content: a.excerpt,
    type: 'article'
  }))

  const fromCollections: TimelineItem[] = (collections || []).map((c) => ({
    id: 200000 + c.id,
    date: c.completedAt || '',
    title: c.title,
    content: c.comment,
    type: 'collection'
  }))

  return [...fromArticles, ...fromCollections].sort((a, b) => (a.date < b.date ? 1 : -1))
}, [])

const filteredTimeline = computed(() => {
  if (selectedType.value === 'all') return timeline.value
  return timeline.value.filter(item => item.type === selectedType.value)
})
</script>
