<template>
  <div ref="containerRef" class="fixed inset-0 pointer-events-none z-[200]"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
const particles: HTMLElement[] = []
const emojis = ['✨', '🌟', '💫', '⭐', '🎉', '🎊', '💖']

function createParticle(x: number, y: number) {
  if (!containerRef.value) return
  const el = document.createElement('span')
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)]
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;font-size:${12 + Math.random() * 12}px;pointer-events:none;transition:all 1s ease-out;z-index:200;`
  containerRef.value.appendChild(el)
  particles.push(el)
  requestAnimationFrame(() => {
    el.style.transform = `translate(${(Math.random() - 0.5) * 100}px, ${-50 - Math.random() * 80}px) scale(0)`
    el.style.opacity = '0'
  })
  setTimeout(() => {
    el.remove()
    const idx = particles.indexOf(el)
    if (idx > -1) particles.splice(idx, 1)
  }, 1000)
}

function handleClick(e: MouseEvent) {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => createParticle(e.clientX, e.clientY), i * 50)
  }
}

onMounted(() => document.addEventListener('click', handleClick))
onUnmounted(() => document.removeEventListener('click', handleClick))
</script>
