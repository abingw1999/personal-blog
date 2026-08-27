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
import { nowStatuses } from '@/data/mock'
const statuses = nowStatuses
const latestUpdate = computed(() => statuses.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]?.updatedAt || '')
</script>
