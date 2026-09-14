<template>
  <div>
    <h1 class="font-serif text-3xl font-bold mb-2">🛍️ 好物橱窗</h1>
    <p class="text-[var(--color-text-light)] mb-6">精选好物推荐</p>
    <div v-if="!shopEnabled" class="text-center py-20">
      <span class="text-6xl block mb-4">🚧</span>
      <h2 class="text-xl font-bold mb-2">即将开放</h2>
      <p class="text-[var(--color-text-muted)]">好物橱窗正在筹备中，敬请期待~</p>
    </div>
    <div v-else>
      <div class="flex flex-wrap gap-2 mb-6">
        <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat"
          :class="['px-3 py-1.5 rounded-full text-sm transition-colors', selectedCategory === cat ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]']">
          {{ cat }}
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in filteredProducts" :key="product.id" class="bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] hover:shadow-lg transition-all group">
          <div class="relative">
            <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <span v-if="product.recommended" class="absolute top-2 right-2 bg-[var(--color-primary)] text-white text-xs px-2 py-1 rounded-full">推荐</span>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-lg mb-1">{{ product.name }}</h3>
            <p class="text-sm text-[var(--color-text-light)] mb-3">{{ product.description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-xl font-bold text-[var(--color-primary)]">¥{{ product.price }}</span>
              <a :href="product.link" target="_blank" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm hover:opacity-90 transition-opacity">去购买</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { siteConfig } from '@/config/site'
import { api, useAsyncData } from '@/api'
import type { Product } from '@/types'

const shopEnabled = siteConfig.shopEnabled
const selectedCategory = ref('全部')

// 商品从后端 /api/products 拉取
const { data: products } = useAsyncData<Product[]>(() => api.getProducts(), [])

const categories = computed(() => ['全部', ...new Set(products.value.map(p => p.category))])
const filteredProducts = computed(() =>
  selectedCategory.value === '全部'
    ? products.value
    : products.value.filter(p => p.category === selectedCategory.value)
)
</script>
