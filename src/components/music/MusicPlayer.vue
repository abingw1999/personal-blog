<template>
  <transition name="slide-up">
    <div v-if="show" class="fixed bottom-4 right-4 z-50 bg-[var(--color-card)] rounded-2xl shadow-xl border border-[var(--color-border)] overflow-hidden" :class="{ 'w-80': expanded, 'w-14': !expanded }">
      <!-- Expanded view -->
      <div v-if="expanded" class="p-4">
        <div class="flex items-center gap-3 mb-3">
          <img :src="currentTrack.cover" class="w-12 h-12 rounded-lg object-cover" />
          <div class="flex-1 min-w-0">
            <p class="font-bold text-sm truncate">{{ currentTrack.title }}</p>
            <p class="text-xs text-[var(--color-text-muted)] truncate">{{ currentTrack.artist }}</p>
          </div>
          <button @click="expanded = false" class="p-1 hover:bg-[var(--color-bg)] rounded-lg transition-colors">
            <span class="text-sm">▼</span>
          </button>
        </div>
        <!-- Progress -->
        <div class="mb-3">
          <input type="range" :value="progress" @input="seek" min="0" max="100" class="w-full h-1 rounded-full appearance-none bg-[var(--color-border)] cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-primary)]" />
          <div class="flex justify-between text-xs text-[var(--color-text-muted)] mt-1">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>
        <!-- Controls -->
        <div class="flex items-center justify-center gap-4">
          <button @click="prevTrack" class="p-2 hover:bg-[var(--color-bg)] rounded-full transition-colors">⏮</button>
          <button @click="togglePlay" class="w-10 h-10 flex items-center justify-center bg-[var(--color-primary)] text-white rounded-full hover:opacity-90 transition-opacity">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <button @click="nextTrack" class="p-2 hover:bg-[var(--color-bg)] rounded-full transition-colors">⏭</button>
        </div>
        <!-- Volume -->
        <div class="flex items-center gap-2 mt-3">
          <span class="text-sm">🔊</span>
          <input type="range" :value="volume * 100" @input="setVolume" min="0" max="100" class="flex-1 h-1 rounded-full appearance-none bg-[var(--color-border)] cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-primary)]" />
        </div>
      </div>
      <!-- Collapsed view -->
      <div v-else class="p-2 flex items-center justify-center">
        <button @click="expanded = true" class="w-10 h-10 flex items-center justify-center bg-[var(--color-primary)] text-white rounded-full hover:opacity-90 transition-opacity">
          {{ isPlaying ? '🎵' : '🎶' }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { musicList } from '@/data/mock'

const show = ref(true)
const expanded = ref(true)
const isPlaying = ref(false)
const currentTrackIndex = ref(0)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.5)
const progress = ref(0)

let audio: HTMLAudioElement | null = null

const currentTrack = computed(() => musicList[currentTrackIndex.value])

onMounted(() => {
  audio = new Audio(musicList[0].url)
  audio.volume = volume.value
  audio.addEventListener('timeupdate', () => {
    if (audio) {
      currentTime.value = audio.currentTime
      duration.value = audio.duration || 0
      progress.value = duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
    }
  })
  audio.addEventListener('ended', nextTrack)
})

onUnmounted(() => {
  if (audio) {
    audio.pause()
    audio = null
  }
})

function togglePlay() {
  if (!audio) return
  if (isPlaying.value) {
    audio.pause()
  } else {
    audio.play().catch(() => {})
  }
  isPlaying.value = !isPlaying.value
}

function nextTrack() {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % musicList.length
  loadTrack()
}

function prevTrack() {
  currentTrackIndex.value = (currentTrackIndex.value - 1 + musicList.length) % musicList.length
  loadTrack()
}

function loadTrack() {
  if (!audio) return
  audio.src = musicList[currentTrackIndex.value].url
  audio.play().catch(() => {})
  isPlaying.value = true
}

function seek(e: Event) {
  if (!audio || !duration.value) return
  const target = e.target as HTMLInputElement
  audio.currentTime = (target.value / 100) * duration.value
}

function setVolume(e: Event) {
  const target = e.target as HTMLInputElement
  volume.value = target.value / 100
  if (audio) audio.volume = volume.value
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
