<template>
  <div v-if="post">
    <router-link to="/blog" class="text-sm text-[var(--color-primary)] hover:underline mb-4 inline-block">← 返回博客</router-link>
    <article>
      <img :src="post.cover" :alt="post.title" class="w-full h-64 md:h-80 object-cover rounded-2xl mb-6" />
      <div class="flex items-center gap-2 mb-3">
        <span class="text-sm px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">{{ post.category }}</span>
        <span class="text-sm text-[var(--color-text-muted)]">{{ post.createdAt }}</span>
        <span class="text-sm text-[var(--color-text-muted)]">· {{ post.readTime }} 分钟阅读</span>
        <span class="text-sm text-[var(--color-text-muted)]">· {{ post.wordCount }} 字</span>
      </div>
      <h1 class="font-serif text-3xl md:text-4xl font-bold mb-4">{{ post.title }}</h1>
      <div class="flex flex-wrap gap-2 mb-6">
        <span v-for="tag in post.tags" :key="tag" class="text-sm px-3 py-1 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)]">#{{ tag }}</span>
      </div>
      <!-- Content -->
      <div class="prose prose-lg max-w-none dark:prose-invert" v-html="renderedContent"></div>
      <!-- Emoji Reactions -->
      <div class="mt-8 p-4 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)]">
        <p class="text-sm text-[var(--color-text-muted)] mb-3">觉得这篇文章怎么样？</p>
        <div class="flex flex-wrap gap-2">
          <button v-for="emoji in emojis" :key="emoji" @click="react(emoji)"
            :class="['px-3 py-1.5 rounded-full border transition-all', reactions[emoji] > 0 ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]']">
            {{ emoji }} {{ reactions[emoji] || 0 }}
          </button>
        </div>
      </div>
      <!-- Share -->
      <div class="mt-6 flex items-center gap-3">
        <button @click="shareArticle" class="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm hover:opacity-90 transition-opacity">📤 分享文章</button>
        <span class="text-sm text-[var(--color-text-muted)]">👁 {{ post.views }} 次阅读</span>
      </div>
    </article>
  </div>
  <div v-else class="text-center py-12">
    <span class="text-4xl block mb-4">📄</span>
    <p>文章不存在</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { articles } from '@/data/mock'

const route = useRoute()
const post = articles.find(a => a.slug === route.params.slug)
const emojis = ['❤️', '🔥', '😂', '😮', '👍']
const reactions = ref<Record<string, number>>({})

const renderedContent = computed(() => {
  if (!post) return ''
  return post.content
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-[var(--color-bg)] rounded-xl p-4 overflow-x-auto text-sm"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-[var(--color-bg)] px-1.5 py-0.5 rounded text-sm">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>')
    .replace(/\n\n/g, '<br/><br/>')
})

function react(emoji: string) {
  reactions.value[emoji] = (reactions.value[emoji] || 0) + 1
}

function shareArticle() {
  navigator.clipboard.writeText(window.location.href)
  alert('链接已复制到剪贴板！')
}
</script>
