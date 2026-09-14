<template>
  <div class="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
    <!-- 后台：独立布局，不套前台的导航 / 页脚 / 音乐播放器 -->
    <router-view v-if="isAdmin" />

    <!-- 前台 -->
    <template v-else>
      <ReadingProgress />
      <SiteHeader />
      <main class="container mx-auto px-4 max-w-6xl py-8">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <SiteFooter />
      <MusicPlayer />
      <BackToTop />
      <ClickEffect />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import MusicPlayer from '@/components/music/MusicPlayer.vue'
import ReadingProgress from '@/components/common/ReadingProgress.vue'
import BackToTop from '@/components/common/BackToTop.vue'
import ClickEffect from '@/components/common/ClickEffect.vue'

const appStore = useAppStore()
const route = useRoute()

/** 路由 meta.admin 由 src/router/index.ts 里的后台路由声明 */
const isAdmin = computed(() => route.meta.admin === true)

onMounted(() => {
  appStore.initTheme()
})
</script>

<style>
.page-enter-active, .page-leave-active {
  transition: all 0.3s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
