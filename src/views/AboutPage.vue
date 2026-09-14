<template>
  <div>
    <h1 class="font-serif text-3xl font-bold mb-8">👤 关于我</h1>
    <!-- Profile -->
    <div class="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)] mb-8 text-center">
      <img :src="config.avatar" class="w-20 h-20 rounded-full mx-auto mb-4 ring-4 ring-[var(--color-primary-light)]" />
      <h2 class="font-serif text-2xl font-bold mb-1">{{ config.nickname }}</h2>
      <p class="text-[var(--color-text-light)]">{{ config.tagline }}</p>
    </div>
    <!-- Achievements -->
    <section class="mb-8">
      <h2 class="font-serif text-xl font-bold mb-4">🏆 人生成就清单</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label v-for="item in achievements" :key="item.text" class="flex items-center gap-3 bg-[var(--color-card)] rounded-xl p-3 border border-[var(--color-border)] cursor-pointer hover:border-[var(--color-primary)] transition-colors">
          <input type="checkbox" v-model="item.done" class="w-5 h-5 rounded accent-[var(--color-primary)]" />
          <span :class="{ 'line-through text-[var(--color-text-muted)]': item.done }">{{ item.text }}</span>
        </label>
      </div>
    </section>
    <!-- Past Present Future -->
    <section class="mb-8">
      <h2 class="font-serif text-xl font-bold mb-4">📸 过去 · 现在 · 未来</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="img in timeImages" :key="img.label" class="text-center">
          <img :src="img.url" class="w-full h-40 object-cover rounded-xl mb-2" />
          <p class="font-bold">{{ img.label }}</p>
          <p class="text-sm text-[var(--color-text-light)]">{{ img.desc }}</p>
        </div>
      </div>
    </section>
    <!-- Devices -->
    <section class="mb-8">
      <h2 class="font-serif text-xl font-bold mb-4">💻 我的设备</h2>
      <div class="space-y-3">
        <div v-for="device in devices" :key="device.name" class="bg-[var(--color-card)] rounded-xl p-4 border border-[var(--color-border)]">
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ device.icon }}</span>
            <div>
              <p class="font-bold">{{ device.name }}</p>
              <p class="text-sm text-[var(--color-text-muted)]">{{ device.model }}</p>
            </div>
          </div>
          <p class="text-sm text-[var(--color-text-light)] mt-2">{{ device.comment }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { siteConfig } from '@/config/site'
const config = siteConfig

const achievements = ref([
  { text: '写一本自己的书', done: false },
  { text: '去一次日本旅行', done: true },
  { text: '学会弹吉他', done: false },
  { text: '跑一次半程马拉松', done: true },
  { text: '做一个开源项目', done: true },
  { text: '学会做一道法式甜点', done: false },
  { text: '看一次极光', done: false },
  { text: '读完100本书', done: false }
])

const timeImages = [
  { label: '过去', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400', desc: '那个充满好奇心的小孩' },
  { label: '现在', url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400', desc: '正在努力生活的我' },
  { label: '未来', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400', desc: '充满无限可能的明天' }
]

const devices = [
  { icon: '💻', name: 'MacBook Pro', model: 'M2 Pro 14寸', comment: '主力开发机，性能强劲' },
  { icon: '📱', name: 'iPhone 15 Pro', model: '256GB 原色钛金属', comment: '拍照很好用' },
  { icon: '🎧', name: 'AirPods Pro 2', model: 'USB-C 版', comment: '降噪效果一流' },
  { icon: '⌨️', name: 'HHKB Professional', model: 'Type-S 有刻版', comment: '码字神器，手感绝佳' }
]
</script>
