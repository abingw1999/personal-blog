<template>
  <div>
    <h1 class="font-serif text-3xl font-bold mb-6">⭐ 收藏单</h1>
    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
        :class="['px-4 py-2 rounded-xl text-sm font-medium transition-colors', activeTab === tab.key ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]']">
        {{ tab.icon }} {{ tab.name }}
      </button>
    </div>
    <!-- Filter -->
    <div class="flex gap-2 mb-6">
      <select v-model="statusFilter" class="px-3 py-1.5 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-sm">
        <option value="">全部状态</option>
        <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
      </select>
      <select v-model="sortBy" class="px-3 py-1.5 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-sm">
        <option value="rating">按评分</option>
        <option value="date">按日期</option>
      </select>
    </div>
    <!-- Items -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="item in filteredItems" :key="item.id" class="bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] hover:shadow-lg transition-all">
        <img :src="item.cover" class="w-full h-40 object-cover" />
        <div class="p-4">
          <h3 class="font-bold mb-1">{{ item.title }}</h3>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-yellow-500">{{ '★'.repeat(item.rating) }}{{ '☆'.repeat(5 - item.rating) }}</span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">{{ item.status }}</span>
          </div>
          <p class="text-sm text-[var(--color-text-light)]">{{ item.comment }}</p>
          <div class="flex items-center justify-between mt-3">
            <span v-if="item.completedAt" class="text-xs text-[var(--color-text-muted)]">{{ item.completedAt }}</span>
            <a v-if="item.link" :href="item.link" target="_blank" class="text-xs text-[var(--color-primary)] hover:underline">查看详情 →</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { collections } from '@/data/mock'

const tabs = [
  { key: 'book', name: '书单', icon: '📖' },
  { key: 'movie', name: '影单', icon: '🎬' },
  { key: 'game', name: '游戏单', icon: '🎮' }
]
const activeTab = ref('book')
const statusFilter = ref('')
const sortBy = ref('rating')

const statuses = computed(() => [...new Set(collections.filter(c => c.type === activeTab.value).map(c => c.status))])

const filteredItems = computed(() => {
  let result = collections.filter(c => c.type === activeTab.value)
  if (statusFilter.value) result = result.filter(c => c.status === statusFilter.value)
  if (sortBy.value === 'rating') result.sort((a, b) => b.rating - a.rating)
  return result
})
</script>
