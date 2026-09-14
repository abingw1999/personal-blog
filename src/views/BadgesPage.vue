<template>
  <div>
    <h1 class="font-serif text-3xl font-bold mb-2">🏆 徽章成就</h1>
    <p class="text-[var(--color-text-light)] mb-6">收集徽章，解锁成就！已解锁 {{ earnedCount }}/{{ badges.length }}</p>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="badge in badges" :key="badge.id"
        :class="['bg-[var(--color-card)] rounded-2xl p-4 border text-center transition-all', badge.earned ? 'border-[var(--color-primary)] shadow-md' : 'border-[var(--color-border)] opacity-60']">
        <span class="text-4xl block mb-2">{{ badge.icon }}</span>
        <h3 class="font-bold text-sm mb-1">{{ badge.name }}</h3>
        <p class="text-xs text-[var(--color-text-muted)] mb-2">{{ badge.description }}</p>
        <div v-if="badge.earned" class="text-xs text-[var(--color-primary)]">
          ✓ {{ badge.earnedAt }}
        </div>
        <div v-else class="text-xs text-[var(--color-text-muted)]">
          条件：{{ badge.condition }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { api, useAsyncData } from '@/api'
import type { Badge } from '@/types'

// 徽章定义从后端 /api/badges 拉取。
// 注意：后端目前没有实现「访客徽章解锁」逻辑（visitor_badges 表还没有对应接口），
// 所以 earned 一律按未解锁处理；等后端补上接口后再在这里接真实解锁状态。
const { data: badges } = useAsyncData<Badge[]>(
  () => api.getBadges().then(list => list.map(b => ({ ...b, earned: false }))),
  []
)

const earnedCount = computed(() => badges.value.filter(b => b.earned).length)
</script>
