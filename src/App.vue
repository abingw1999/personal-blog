<template>
  <div id="app" class="min-h-screen flex flex-col">
    <SiteHeader />
    <main class="flex-1 container mx-auto px-4 py-8 max-w-6xl">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <SiteFooter />
    <MusicPlayer />
    <BackToTop />
    <ReadingProgress />
    <ClickEffect v-if="appStore.siteConfig.clickEffectEnabled" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import MusicPlayer from '@/components/music/MusicPlayer.vue'
import BackToTop from '@/components/common/BackToTop.vue'
import ReadingProgress from '@/components/common/ReadingProgress.vue'
import ClickEffect from '@/components/common/ClickEffect.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

onMounted(() => {
  appStore.initTheme()
})
</script>
