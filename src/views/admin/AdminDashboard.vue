<template>
  <section>
    <header class="head">
      <div>
        <h2 class="head__title">仪表盘</h2>
        <p class="head__sub">网站内容的整体情况</p>
      </div>
      <button class="btn-sm" :disabled="loading" @click="load">
        {{ loading ? '刷新中…' : '↻ 刷新' }}
      </button>
    </header>

    <p v-if="error" class="banner banner--error">{{ error }}</p>

    <!-- 核心指标 -->
    <div class="cards">
      <router-link to="/admin/articles" class="stat card">
        <span class="stat__icon">📝</span>
        <span class="stat__num">{{ stats?.articles ?? '—' }}</span>
        <span class="stat__label">篇文章</span>
      </router-link>

      <router-link to="/admin/comments" class="stat card" :class="{ 'stat--alert': (stats?.pendingComments ?? 0) > 0 }">
        <span class="stat__icon">💬</span>
        <span class="stat__num">{{ stats?.comments ?? '—' }}</span>
        <span class="stat__label">
          条留言
          <em v-if="(stats?.pendingComments ?? 0) > 0">（{{ stats?.pendingComments }} 待审核）</em>
        </span>
      </router-link>

      <div class="stat card">
        <span class="stat__icon">👁</span>
        <span class="stat__num">{{ stats?.totalViews ?? '—' }}</span>
        <span class="stat__label">次阅读</span>
      </div>

      <router-link to="/admin/collections" class="stat card">
        <span class="stat__icon">⭐</span>
        <span class="stat__num">{{ stats?.collections ?? '—' }}</span>
        <span class="stat__label">条收藏</span>
      </router-link>
    </div>

    <!-- 待办提醒 -->
    <div v-if="(stats?.pendingComments ?? 0) > 0" class="notice">
      <span>⚠️ 有 <strong>{{ stats?.pendingComments }}</strong> 条留言还没审核，前台看不到。</span>
      <router-link to="/admin/comments" class="notice__link">去处理 →</router-link>
    </div>

    <div class="cols">
      <!-- 最近文章 -->
      <div class="panel">
        <div class="panel__head">
          <h3>最近文章</h3>
          <router-link to="/admin/articles/new" class="panel__action">＋ 写一篇</router-link>
        </div>
        <div v-if="!recent.length" class="panel__empty">还没有文章</div>
        <ul v-else class="list">
          <li v-for="item in recent" :key="item.id">
            <router-link :to="`/admin/articles/${item.id}/edit`" class="list__title">
              {{ item.title }}
            </router-link>
            <span class="list__meta">
              <em v-if="item.featured" class="star">精选</em>
              {{ formatDate(item.createdAt) }} · {{ item.views || 0 }} 阅读
            </span>
          </li>
        </ul>
      </div>

      <!-- 内容清单 -->
      <div class="panel">
        <div class="panel__head">
          <h3>内容清单</h3>
        </div>
        <ul class="list list--dense">
          <li v-for="row in inventory" :key="row.path">
            <router-link :to="row.path" class="list__title">{{ row.icon }} {{ row.label }}</router-link>
            <span class="list__meta">{{ row.value }} 条</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { adminApi } from '@/api/admin'
import { formatDate } from '@/api'
import type { AdminStats, Article } from '@/types'

const stats = ref<AdminStats | null>(null)
const loading = ref(true)
const error = ref('')

const recent = computed<Article[]>(() => stats.value?.recentArticles || [])

const inventory = computed(() => {
  const s = stats.value
  return [
    { icon: '🔗', label: '友情链接', path: '/admin/friends', value: s?.friends ?? 0 },
    { icon: '🛍️', label: '橱窗商品', path: '/admin/products', value: s?.products ?? 0 },
    { icon: '🎵', label: '音乐', path: '/admin/music', value: s?.music ?? 0 },
    { icon: '📍', label: 'Now 状态', path: '/admin/now', value: s?.nowStatus ?? 0 },
    { icon: '🗺️', label: '足迹', path: '/admin/footprints', value: s?.footprints ?? 0 },
    { icon: '🏆', label: '徽章', path: '/admin/badges', value: s?.badges ?? 0 },
    { icon: '🗓️', label: '建站日记', path: '/admin/changelog', value: s?.changelog ?? 0 },
  ]
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    stats.value = await adminApi.stats()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.head__title {
  font-size: 1.125rem;
  font-weight: 600;
}
.head__sub {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: 0.875rem;
  margin-bottom: 1rem;
}
.stat {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-decoration: none;
  color: inherit;
}
.stat--alert {
  border: 1px solid var(--color-primary);
}
.stat__icon {
  font-size: 1.125rem;
}
.stat__num {
  font-size: 1.625rem;
  font-weight: 700;
  line-height: 1.1;
}
.stat__label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
.stat__label em {
  font-style: normal;
  color: var(--color-primary);
}

.notice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.8125rem;
  padding: 0.625rem 0.875rem;
  border-radius: 0.75rem;
  background: var(--color-primary-light);
  color: var(--color-primary);
  margin-bottom: 1rem;
}
.notice__link {
  color: inherit;
  text-decoration: underline;
}

.cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1rem;
}
.panel {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1rem;
}
.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.panel__head h3 {
  font-size: 0.9375rem;
  font-weight: 600;
}
.panel__action {
  font-size: 0.8125rem;
  color: var(--color-primary);
  text-decoration: none;
}
.panel__empty {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  padding: 1rem 0;
  text-align: center;
}
.list {
  list-style: none;
  display: flex;
  flex-direction: column;
}
.list li {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.875rem;
}
.list li:last-child {
  border-bottom: none;
}
.list__title {
  color: var(--color-text);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list__title:hover {
  color: var(--color-primary);
}
.list__meta {
  flex: 0 0 auto;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
.star {
  font-style: normal;
  color: var(--color-primary);
  margin-right: 0.25rem;
}

.banner {
  font-size: 0.8125rem;
  border-radius: 0.625rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.75rem;
}
.banner--error {
  color: #d64545;
  background: rgba(214, 69, 69, 0.08);
  border: 1px solid rgba(214, 69, 69, 0.25);
}
</style>
