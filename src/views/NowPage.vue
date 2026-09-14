<template>
  <div>
    <h1 class="font-serif text-3xl font-bold mb-2">📍 Now</h1>
    <p class="text-[var(--color-text-light)] mb-8">此时此刻，我在做什么</p>
    <div class="space-y-4 mb-8">
      <div v-for="status in statuses" :key="status.id" class="bg-[var(--color-card)] rounded-2xl p-4 border border-[var(--color-border)] flex items-center gap-4">
        <span class="text-3xl">{{ status.icon }}</span>
        <div class="flex-1">
          <p class="text-xs text-[var(--color-text-muted)] mb-1">{{ status.category }}</p>
          <p class="font-bold text-lg">{{ status.content }}</p>
        </div>
        <span class="text-xs text-[var(--color-text-muted)]">{{ status.updatedAt }}</span>
      </div>
    </div>
    <div class="bg-[var(--color-primary-light)] rounded-2xl p-4 text-center text-sm text-[var(--color-text-muted)]">
      最近更新时间：{{ latestUpdate }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { api, useAsyncData } from '@/api'
import type { NowStatus } from '@/types'

// Now 状态从后端 /api/now-status 拉取
const { data: statuses } = useAsyncData<NowStatus[]>(() => api.getNowStatus(), [])

const latestUpdate = computed(() => {
  // 复制再排序，避免直接改动源数组
  const sorted = [...statuses.value].sort((a, b) =>
    String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''))
  )
  return sorted[0]?.updatedAt ? String(sorted[0].updatedAt).slice(0, 10) : ''
})
</script>
