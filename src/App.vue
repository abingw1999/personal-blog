<template>
  <div class="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
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
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import MusicPlayer from '@/components/music/MusicPlayer.vue'
import ReadingProgress from '@/components/common/ReadingProgress.vue'
import BackToTop from '@/components/common/BackToTop.vue'
import ClickEffect from '@/components/common/ClickEffect.vue'

const appStore = useAppStore()

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
