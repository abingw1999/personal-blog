<template>
  <div>
    <h1 class="font-serif text-3xl font-bold mb-2">💬 留言板</h1>
    <p class="text-[var(--color-text-light)] mb-6">有什么想说的？留下你的足迹吧~</p>
    <!-- Form -->
    <div class="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)] mb-8">
      <div class="flex gap-3 mb-4">
        <input v-model="form.nickname" placeholder="你的昵称" class="flex-1 px-4 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none" />
        <select v-model="form.emoji" class="px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
          <option v-for="e in emojiList" :key="e" :value="e">{{ e }}</option>
        </select>
      </div>
      <textarea v-model="form.content" placeholder="写下你想说的话..." rows="3" class="w-full px-4 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none resize-none mb-3"></textarea>
      <div class="flex items-center justify-between">
        <p class="text-xs text-[var(--color-text-muted)]">{{ funTips[currentTip] }}</p>
        <button @click="submitComment" :disabled="!form.content.trim()"
          class="px-6 py-2 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
          发表留言
        </button>
      </div>
    </div>
    <!-- Entries -->
    <div v-if="loading" class="text-center py-8 text-sm text-[var(--color-text-muted)]">📡 正在加载留言…</div>
    <div v-else-if="error" class="text-center py-8 text-sm text-[var(--color-text-muted)]">⚠️ {{ error }}</div>
    <div v-else class="space-y-4">
      <div v-for="entry in entries" :key="entry.id" class="bg-[var(--color-card)] rounded-2xl p-4 border border-[var(--color-border)]">
        <div class="flex items-start gap-3">
          <img :src="entry.avatar" class="w-10 h-10 rounded-full" />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-bold">{{ entry.nickname }}</span>
              <span>{{ entry.emoji }}</span>
              <span class="text-xs text-[var(--color-text-muted)]">{{ entry.createdAt }}</span>
            </div>
            <p class="text-[var(--color-text-light)]">{{ entry.content }}</p>
            <button @click="replyTo = entry.id" class="text-xs text-[var(--color-primary)] mt-2 hover:underline">回复</button>
            <!-- Replies -->
            <div v-if="entry.replies.length" class="mt-3 ml-4 space-y-3 border-l-2 border-[var(--color-border)] pl-4">
              <div v-for="reply in entry.replies" :key="reply.id" class="flex items-start gap-2">
                <img :src="reply.avatar" class="w-8 h-8 rounded-full" />
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold text-sm">{{ reply.nickname }}</span>
                    <span class="text-xs text-[var(--color-text-muted)]">{{ reply.createdAt }}</span>
                  </div>
                  <p class="text-sm text-[var(--color-text-light)]">{{ reply.content }}</p>
                </div>
              </div>
            </div>
            <!-- Reply form -->
            <div v-if="replyTo === entry.id" class="mt-3 flex gap-2">
              <input v-model="replyContent" placeholder="回复..." class="flex-1 px-3 py-1.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] focus:outline-none" />
              <button @click="submitReply(entry.id)" class="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-sm">发送</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { api, useAsyncData } from '@/api'
import type { Comment, GuestbookEntry } from '@/types'

const form = ref({ nickname: '', content: '', emoji: '😊' })
const replyTo = ref<number | null>(null)
const replyContent = ref('')
const submitting = ref(false)
const emojiList = ['😊', '❤️', '🔥', '😂', '😮', '👍', '🎉', '💪']
const funTips = ['每一条留言都是对小橘子的鼓励~', '留言区是温暖的角落，请友善发言哦', '你的支持是我更新的动力！', '有什么建议也欢迎告诉我~']
const currentTip = computed(() => Math.floor(Math.random() * funTips.length))

/**
 * 后端 /api/comments 返回的是「主留言 + 内嵌 replies」的树形结构，
 * 但为了兼容旧格式（扁平列表），这里两种形态都支持：
 * - 有 replies 字段：直接递归转换
 * - 没有 replies 字段：按 parentId 从扁平列表里自己分组
 */
function buildTree(list: Comment[]): GuestbookEntry[] {
  const toEntry = (c: Comment, replies: GuestbookEntry[] = []): GuestbookEntry => ({
    id: c.id,
    nickname: c.nickname,
    avatar: c.avatar,
    content: c.content,
    emoji: c.emoji,
    createdAt: c.createdAt,
    parentId: c.parentId,
    replies,
  })

  const hasNested = list.some((c) => Array.isArray(c.replies) && c.replies.length > 0)
  if (hasNested) {
    return list.map((c) => toEntry(c, (c.replies || []).map((r) => toEntry(r))))
  }

  const roots = list.filter((c) => c.parentId === null || c.parentId === undefined)
  return roots.map((root) =>
    toEntry(root, list.filter((c) => c.parentId === root.id).map((r) => toEntry(r)))
  )
}

const { data: entries, loading, error, reload } = useAsyncData<GuestbookEntry[]>(
  () => api.getComments().then(buildTree),
  []
)

async function submitComment() {
  if (!form.value.content.trim() || submitting.value) return
  submitting.value = true
  try {
    await api.createComment({
      nickname: form.value.nickname || '匿名访客',
      content: form.value.content,
      emoji: form.value.emoji,
      avatar: `https://api.dicebear.com/7.0/thumbs/svg?seed=${Date.now()}`,
    })
    form.value = { nickname: '', content: '', emoji: '😊' }
    await reload()
  } catch (e) {
    alert(e instanceof Error ? e.message : '留言失败')
  } finally {
    submitting.value = false
  }
}

async function submitReply(parentId: number) {
  if (!replyContent.value.trim() || submitting.value) return
  submitting.value = true
  try {
    await api.createComment({
      nickname: '小橘子',
      avatar: 'https://api.dicebear.com/7.0/thumbs/svg?seed=orange',
      content: replyContent.value,
      emoji: '',
      parentId,
    })
    replyContent.value = ''
    replyTo.value = null
    await reload()
  } catch (e) {
    alert(e instanceof Error ? e.message : '回复失败')
  } finally {
    submitting.value = false
  }
}
</script>
