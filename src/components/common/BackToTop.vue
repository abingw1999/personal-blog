<template>
  <transition name="fade">
    <button v-if="show" @click="scrollToTop" class="fixed bottom-24 right-4 z-50 w-12 h-12 bg-[var(--color-primary)] text-white rounded-full shadow-lg hover:opacity-90 transition-all flex items-center justify-center text-xl">
      ↑
    </button>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const show = ref(false)
function checkScroll() { show.value = window.scrollY > 300 }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
onMounted(() => window.addEventListener('scroll', checkScroll))
onUnmounted(() => window.removeEventListener('scroll', checkScroll))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
