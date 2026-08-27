import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/BlogPage.vue')
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('@/views/BlogPostPage.vue')
    },
    {
      path: '/guestbook',
      name: 'guestbook',
      component: () => import('@/views/GuestbookPage.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutPage.vue')
    },
    {
      path: '/collections',
      name: 'collections',
      component: () => import('@/views/CollectionsPage.vue')
    },
    {
      path: '/now',
      name: 'now',
      component: () => import('@/views/NowPage.vue')
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('@/views/FriendsPage.vue')
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('@/views/ShopPage.vue')
    },
    {
      path: '/footprint',
      name: 'footprint',
      component: () => import('@/views/FootprintMapPage.vue')
    },
    {
      path: '/badges',
      name: 'badges',
      component: () => import('@/views/BadgesPage.vue')
    },
    {
      path: '/changelog',
      name: 'changelog',
      component: () => import('@/views/ChangelogPage.vue')
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('@/views/TimelinePage.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundPage.vue')
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
