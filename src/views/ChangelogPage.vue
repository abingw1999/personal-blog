<template>
  <div>
    <h1 class="font-serif text-3xl font-bold mb-2">📋 建站日记</h1>
    <p class="text-[var(--color-text-light)] mb-8">记录网站的每一次更新</p>
    <div class="relative pl-8 border-l-2 border-[var(--color-border)]">
      <div v-for="entry in changelog" :key="entry.id" class="relative mb-8">
        <div class="absolute -left-[2.35rem] w-4 h-4 rounded-full bg-[var(--color-primary)] border-2 border-[var(--color-bg)]"></div>
        <div class="bg-[var(--color-card)] rounded-2xl p-4 border border-[var(--color-border)]">
          <div class="flex items-center gap-2 mb-2">
            <span :class="['text-xs px-2 py-0.5 rounded-full', typeColors[entry.type]]">{{ typeLabels[entry.type] }}</span>
            <span class="text-xs text-[var(--color-text-muted)]">{{ entry.date }}</span>
          </div>
          <h3 class="font-bold text-lg mb-1">{{ entry.title }}</h3>
          <p class="text-sm text-[var(--color-text-light)]">{{ entry.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api, useAsyncData } from '@/api'
import type { ChangelogEntry } from '@/types'

// 更新日志从后端 /api/changelog 拉取
const { data: changelog } = useAsyncData<ChangelogEntry[]>(() => api.getChangelog(), [])

const typeLabels: Record<string, string> = { feature: '新功能', fix: '修复', optimize: '优化', theme: '主题' }
const typeColors: Record<string, string> = {
  feature: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  fix: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  optimize: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  theme: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
}
</script>
