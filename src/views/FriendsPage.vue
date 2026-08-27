<template>
  <div>
    <h1 class="font-serif text-3xl font-bold mb-2">🔗 友情链接</h1>
    <p class="text-[var(--color-text-light)] mb-6">一起同行的朋友们</p>
    <div class="flex flex-wrap gap-2 mb-6">
      <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat"
        :class="['px-3 py-1.5 rounded-full text-sm transition-colors', selectedCategory === cat ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]']">
        {{ cat }}
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <a v-for="friend in filteredFriends" :key="friend.id" :href="friend.url" target="_blank"
        class="bg-[var(--color-card)] rounded-2xl p-4 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-lg transition-all group">
        <div class="flex items-center gap-3 mb-2">
          <img :src="friend.avatar" class="w-12 h-12 rounded-full" />
          <div>
            <h3 class="font-bold group-hover:text-[var(--color-primary)] transition-colors">{{ friend.name }}</h3>
            <span class="text-xs text-[var(--color-text-muted)]">{{ friend.category }}</span>
          </div>
        </div>
        <p class="text-sm text-[var(--color-text-light)]">{{ friend.description }}</p>
      </a>
    </div>
    <div class="mt-8 text-center">
      <p class="text-sm text-[var(--color-text-muted)]">想交换友链？欢迎联系我~</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { friendLinks } from '@/data/mock'
const selectedCategory = ref('全部')
const categories = ['全部', ...new Set(friendLinks.map(f => f.category))]
const filteredFriends = computed(() => selectedCategory.value === '全部' ? friendLinks : friendLinks.filter(f => f.category === selectedCategory.value))
</script>
