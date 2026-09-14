<template>
  <div class="admin-shell">
    <!-- 侧边栏 -->
    <aside :class="['sidebar', { open: sidebarOpen }]">
      <div class="sidebar-head">
        <router-link to="/admin" class="brand" @click="sidebarOpen = false">
          <img :src="config.avatar" alt="" class="brand-avatar" />
          <span class="brand-text">
            <strong>{{ config.siteName }}</strong>
            <small>后台管理</small>
          </span>
        </router-link>
      </div>

      <nav class="sidebar-nav">
        <template v-for="group in navGroups" :key="group.title">
          <p class="nav-group">{{ group.title }}</p>
          <router-link
            v-for="item in group.items"
            :key="item.path"
            :to="item.path"
            :class="['nav-item', { 'nav-item--active': isActive(item.path) }]"
            @click="sidebarOpen = false"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
            <span v-if="item.badge && pending > 0" class="nav-badge">{{ pending }}</span>
          </router-link>
        </template>
      </nav>

      <div class="sidebar-foot">
        <a href="/" target="_blank" rel="noopener" class="nav-item">
          <span class="nav-icon">↗</span>
          <span>查看前台</span>
        </a>
      </div>
    </aside>

    <!-- 移动端遮罩 -->
    <div v-if="sidebarOpen" class="overlay" @click="sidebarOpen = false"></div>

    <!-- 主区域 -->
    <div class="main">
      <header class="topbar">
        <button class="icon-btn" @click="sidebarOpen = !sidebarOpen" aria-label="切换菜单">☰</button>
        <h1 class="page-title">{{ pageTitle }}</h1>
        <div class="topbar-right">
          <button class="icon-btn" @click="appStore.toggleTheme()" :title="appStore.isDark ? '切换到明亮模式' : '切换到暗黑模式'">
            {{ appStore.isDark ? '☀️' : '🌙' }}
          </button>
          <span class="user-chip">
            <img v-if="auth.avatar" :src="auth.avatar" alt="" class="user-avatar" />
            <span v-else class="user-avatar user-avatar--text">{{ auth.nickname.charAt(0) }}</span>
            <span class="user-name">{{ auth.nickname }}</span>
          </span>
          <button class="text-btn" @click="doLogout">退出</button>
        </div>
      </header>

      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { siteConfig } from '@/config/site'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { adminApi } from '@/api/admin'

const config = siteConfig
const auth = useAuthStore()
const appStore = useAppStore()
const route = useRoute()
const router = useRouter()

const sidebarOpen = ref(false)
const pending = ref(0)

interface NavItem {
  path: string
  label: string
  icon: string
  /** 有值表示要显示数字角标（目前只有待审核留言用） */
  badge?: boolean
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: '概览',
    items: [{ path: '/admin', label: '仪表盘', icon: '📊' }],
  },
  {
    title: '内容',
    items: [
      { path: '/admin/articles', label: '文章', icon: '📝' },
      { path: '/admin/comments', label: '留言', icon: '💬', badge: true },
      { path: '/admin/changelog', label: '建站日记', icon: '🗓️' },
    ],
  },
  {
    title: '展示',
    items: [
      { path: '/admin/collections', label: '收藏单', icon: '⭐' },
      { path: '/admin/now', label: 'Now 状态', icon: '📍' },
      { path: '/admin/footprints', label: '足迹', icon: '🗺️' },
      { path: '/admin/badges', label: '徽章', icon: '🏆' },
    ],
  },
  {
    title: '站点',
    items: [
      { path: '/admin/friends', label: '友情链接', icon: '🔗' },
      { path: '/admin/products', label: '橱窗', icon: '🛍️' },
      { path: '/admin/music', label: '音乐', icon: '🎵' },
    ],
  },
  {
    title: '系统',
    items: [{ path: '/admin/settings', label: '设置', icon: '⚙️' }],
  },
]

const pageTitle = computed(() => {
  for (const group of navGroups) {
    const hit = group.items.find((i) => i.path === route.path)
    if (hit) return hit.label
  }
  if (route.path.startsWith('/admin/articles/')) return '编辑文章'
  return '后台管理'
})

/**
 * 菜单高亮。
 * 不能用 router-link 的 active-class —— 它是「前缀匹配」，
 * 在 /admin/articles 页面下 `/admin`（仪表盘）也会被判定为激活，两个同时亮。
 * 这里精确控制：仪表盘只在 /admin 亮，其余按前缀匹配（好让 /admin/articles/1/edit 也亮「文章」）。
 */
function isActive(path: string): boolean {
  if (path === '/admin') return route.path === '/admin'
  return route.path === path || route.path.startsWith(path + '/')
}

function doLogout() {
  auth.logout()
  router.replace('/admin/login')
}

onMounted(async () => {
  try {
    const stats = await adminApi.stats()
    pending.value = stats.pendingComments || 0
  } catch {
    // 统计拿不到不影响后台使用（比如后端刚重启还没连上库）
  }
})
</script>

<style scoped>
.admin-shell {
  min-height: 100vh;
  display: flex;
  background: var(--color-bg);
  color: var(--color-text);
}

/* ---------- 侧边栏 ---------- */
.sidebar {
  width: 15rem;
  flex: 0 0 15rem;
  background: var(--color-bg-card);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}
.sidebar-head {
  padding: 1.25rem 1rem 0.75rem;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  color: inherit;
}
.brand-avatar {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  object-fit: cover;
  background: var(--color-primary-light);
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}
.brand-text strong {
  font-size: 0.9375rem;
}
.brand-text small {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0.75rem 1rem;
}
.nav-group {
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  margin: 1rem 0 0.375rem 0.5rem;
  text-transform: uppercase;
}
.sidebar-nav .nav-group:first-child {
  margin-top: 0.25rem;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.625rem;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  color: var(--color-text-light);
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
}
.nav-item:hover {
  background: var(--color-bg);
  color: var(--color-text);
}
.nav-item--active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 500;
}
.nav-icon {
  width: 1.125rem;
  text-align: center;
}
.nav-badge {
  margin-left: auto;
  min-width: 1.125rem;
  height: 1.125rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.6875rem;
  line-height: 1.125rem;
  text-align: center;
}
.sidebar-foot {
  padding: 0.75rem;
  border-top: 1px solid var(--color-border);
}

/* ---------- 主区域 ---------- */
.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.topbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-card);
  position: sticky;
  top: 0;
  z-index: 20;
}
.page-title {
  font-size: 1rem;
  font-weight: 600;
}
.topbar-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.icon-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--color-text);
}
.icon-btn:hover {
  border-color: var(--color-primary);
}
.user-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--color-text-light);
}
.user-avatar {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  object-fit: cover;
}
.user-avatar--text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
}
.text-btn {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
}
.text-btn:hover {
  color: var(--color-primary);
}
.content {
  padding: 1.5rem;
  flex: 1;
}

/* ---------- 移动端 ---------- */
.overlay {
  display: none;
}
@media (max-width: 860px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 40;
  }
  .content {
    padding: 1rem;
  }
  .user-name {
    display: none;
  }
}
@media (min-width: 861px) {
  .topbar .icon-btn[aria-label='切换菜单'] {
    display: none;
  }
}
</style>
