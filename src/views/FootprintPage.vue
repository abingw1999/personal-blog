<template>
  <div>
    <h1 class="font-serif text-3xl font-bold mb-2">🗺️ 足迹地图</h1>
    <p class="text-[var(--color-text-light)] mb-6">我去过的地方 & 读者来自何方</p>
    <!-- Map placeholder -->
    <div class="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden mb-8">
      <div class="relative w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 flex items-center justify-center">
        <div class="text-center">
          <span class="text-6xl block mb-4">🌍</span>
          <p class="text-[var(--color-text-muted)]">地图可视化（接入地图API后展示）</p>
        </div>
        <!-- Map markers -->
        <div v-for="place in footprints" :key="place.id" 
          class="absolute w-4 h-4 bg-[var(--color-primary)] rounded-full animate-pulse cursor-pointer"
          :style="{ left: `${getMapX(place.lng)}%`, top: `${getMapY(place.lat)}%` }"
          :title="place.place">
        </div>
      </div>
    </div>
    <!-- Footprint list -->
    <h2 class="font-serif text-xl font-bold mb-4">📍 我去过的地方</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div v-for="place in footprints" :key="place.id" class="bg-[var(--color-card)] rounded-2xl p-4 border border-[var(--color-border)]">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">📍</span>
          <h3 class="font-bold text-lg">{{ place.place }}</h3>
          <span class="text-xs text-[var(--color-text-muted)] ml-auto">{{ place.date }}</span>
        </div>
        <p class="text-sm text-[var(--color-text-light)]">{{ place.description }}</p>
      </div>
    </div>
    <!-- Reader distribution -->
    <h2 class="font-serif text-xl font-bold mb-4">🌐 读者来自何方</h2>
    <div class="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)]">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div v-for="region in readerRegions" :key="region.name" class="p-3 rounded-xl bg-[var(--color-bg)]">
          <p class="text-2xl font-bold text-[var(--color-primary)]">{{ region.count }}</p>
          <p class="text-sm text-[var(--color-text-muted)]">{{ region.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { footprints } from '@/data/mock'

const readerRegions = [
  { name: '北京', count: 128 },
  { name: '上海', count: 96 },
  { name: '广州', count: 72 },
  { name: '深圳', count: 64 },
  { name: '杭州', count: 45 },
  { name: '成都', count: 38 },
  { name: '武汉', count: 29 },
  { name: '其他', count: 156 }
]

function getMapX(lng: number): number {
  return ((lng - 73) / (135 - 73)) * 100
}

function getMapY(lat: number): number {
  return ((53 - lat) / (53 - 18)) * 100
}
</script>
