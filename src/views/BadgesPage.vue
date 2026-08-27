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
import { badges } from '@/data/mock'
const earnedCount = computed(() => badges.filter(b => b.earned).length)
</script>
