import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    // ===== 前台 =====
    { path: '/', name: 'home', component: () => import('@/views/HomePage.vue') },
    { path: '/blog', name: 'blog', component: () => import('@/views/BlogPage.vue') },
    { path: '/blog/:slug', name: 'blog-post', component: () => import('@/views/BlogPostPage.vue') },
    { path: '/guestbook', name: 'guestbook', component: () => import('@/views/GuestbookPage.vue') },
    { path: '/about', name: 'about', component: () => import('@/views/AboutPage.vue') },
    { path: '/collections', name: 'collections', component: () => import('@/views/CollectionsPage.vue') },
    { path: '/now', name: 'now', component: () => import('@/views/NowPage.vue') },
    { path: '/friends', name: 'friends', component: () => import('@/views/FriendsPage.vue') },
    { path: '/shop', name: 'shop', component: () => import('@/views/ShopPage.vue') },
    { path: '/footprint', name: 'footprint', component: () => import('@/views/FootprintPage.vue') },
    { path: '/badges', name: 'badges', component: () => import('@/views/BadgesPage.vue') },
    { path: '/changelog', name: 'changelog', component: () => import('@/views/ChangelogPage.vue') },
    { path: '/timeline', name: 'timeline', component: () => import('@/views/TimelinePage.vue') },

    // ===== 后台 =====
    // meta.admin 让 App.vue 知道「这是后台，别套前台导航/页脚/音乐播放器」
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/AdminLogin.vue'),
      meta: { admin: true, guestOnly: true },
    },
    {
      path: '/admin',
      component: () => import('@/components/admin/AdminShell.vue'),
      meta: { admin: true, requiresAuth: true },
      children: [
        { path: '', name: 'admin-dashboard', component: () => import('@/views/admin/AdminDashboard.vue') },
        { path: 'articles', name: 'admin-articles', component: () => import('@/views/admin/AdminArticles.vue') },
        { path: 'articles/new', name: 'admin-article-new', component: () => import('@/views/admin/AdminArticleEdit.vue') },
        { path: 'articles/:id/edit', name: 'admin-article-edit', component: () => import('@/views/admin/AdminArticleEdit.vue') },
        { path: 'comments', name: 'admin-comments', component: () => import('@/views/admin/AdminComments.vue') },
        { path: 'friends', name: 'admin-friends', component: () => import('@/views/admin/AdminFriends.vue') },
        { path: 'products', name: 'admin-products', component: () => import('@/views/admin/AdminProducts.vue') },
        { path: 'music', name: 'admin-music', component: () => import('@/views/admin/AdminMusic.vue') },
        { path: 'collections', name: 'admin-collections', component: () => import('@/views/admin/AdminCollections.vue') },
        { path: 'now', name: 'admin-now', component: () => import('@/views/admin/AdminNow.vue') },
        { path: 'footprints', name: 'admin-footprints', component: () => import('@/views/admin/AdminFootprints.vue') },
        { path: 'badges', name: 'admin-badges', component: () => import('@/views/admin/AdminBadges.vue') },
        { path: 'changelog', name: 'admin-changelog', component: () => import('@/views/admin/AdminChangelog.vue') },
        { path: 'settings', name: 'admin-settings', component: () => import('@/views/admin/AdminSettings.vue') },
      ],
    },

    // 必须在最后：所有未匹配的路径都归 404
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundPage.vue') },
  ],
})

/**
 * 后台登录守卫。
 * 只检查本地有没有 token —— 不做「每次跳转都问一次后端」，
 * 那样每点一个菜单都要多一个请求。token 真正失效时，
 * request() 会清掉它并广播 auth:expired（见 src/api/index.ts）。
 */
router.beforeEach((to) => {
  if (!to.meta.admin) return true
  if (to.meta.guestOnly) return true

  const auth = useAuthStore()
  if (auth.isLoggedIn) return true
  return { name: 'admin-login', query: { redirect: to.fullPath } }
})

export default router
