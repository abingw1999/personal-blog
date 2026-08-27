<template>
  <div class="fixed top-0 left-0 right-0 h-1 z-[100] bg-transparent">
    <div class="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-150" :style="{ width: `${progress}%` }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const progress = ref(0)
function updateProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
}
onMounted(() => window.addEventListener('scroll', updateProgress))
onUnmounted(() => window.removeEventListener('scroll', updateProgress))
</script>
