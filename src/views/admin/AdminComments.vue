<template>
  <section>
    <header class="head">
      <div>
        <h2 class="head__title">留言</h2>
        <p class="head__sub">
          共 {{ rows.length }} 条，其中
          <strong :class="{ alert: pendingCount > 0 }">{{ pendingCount }} 条待审核</strong>
        </p>
      </div>
      <div class="head__actions">
        <select v-model="filter" class="input input--sm">
          <option value="all">全部</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
        </select>
        <button class="btn-sm" :disabled="loading" @click="load">↻ 刷新</button>
      </div>
    </header>

    <p v-if="error" class="banner banner--error">{{ error }}</p>
    <p v-if="toast" class="banner banner--ok">{{ toast }}</p>

    <p class="tip">
      💡 前台只显示「已通过」的留言。<code>/api/comments</code> 默认把新留言标为通过，
      所以正常情况不会积压待审核 —— 如果有，多半是手动驳回或早期数据。
    </p>

    <div v-if="loading" class="empty">正在加载…</div>
    <div v-else-if="!visibleRoots.length" class="empty">没有符合条件的留言</div>

    <div v-else class="threads">
      <div v-for="root in visibleRoots" :key="root.id" class="thread">
        <!-- 主留言 -->
        <div :class="['msg', { 'msg--pending': !root.approved }]">
          <img v-if="root.avatar" :src="root.avatar" alt="" class="avatar" />
          <span v-else class="avatar avatar--text">{{ String(root.nickname || '?').charAt(0) }}</span>

          <div class="msg__body">
            <div class="msg__head">
              <strong>{{ root.nickname || '匿名' }}</strong>
              <span v-if="!root.approved" class="tag tag--pending">待审核</span>
              <span class="time">{{ root.createdAt }}</span>
              <span v-if="root.ip" class="ip">{{ root.ip }}</span>
            </div>
            <p class="msg__text">
              <span v-if="root.emoji">{{ root.emoji }} </span>{{ root.content }}
            </p>

            <div class="msg__actions">
              <button v-if="!root.approved" class="btn-sm btn-sm--ok" @click="approve(root.id)">通过</button>
              <button v-else class="btn-sm" @click="reject(root.id)">驳回</button>
              <button class="btn-sm" @click="toggleReply(root.id)">
                {{ replyTo === root.id ? '取消回复' : '回复' }}
              </button>
              <button class="btn-sm btn-sm--danger" @click="remove(root.id)">删除</button>
            </div>

            <!-- 回复框 -->
            <div v-if="replyTo === root.id" class="reply-box">
              <textarea
                v-model="replyText"
                class="input"
                rows="3"
                placeholder="以「站长」身份回复（不需要审核，直接公开）"
              ></textarea>
              <div class="reply-box__foot">
                <input v-model="replyEmoji" class="input input--emoji" placeholder="emoji（可留空）" />
                <button class="btn-sm" @click="replyTo = null">取消</button>
                <button class="btn-primary btn-primary--sm" :disabled="replying" @click="sendReply(root.id)">
                  {{ replying ? '发送中…' : '发送回复' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 回复列表 -->
        <div v-for="child in repliesOf(root.id)" :key="child.id" :class="['msg', 'msg--reply', { 'msg--pending': !child.approved }]">
          <img v-if="child.avatar" :src="child.avatar" alt="" class="avatar avatar--sm" />
          <span v-else class="avatar avatar--sm avatar--text">{{ String(child.nickname || '?').charAt(0) }}</span>

          <div class="msg__body">
            <div class="msg__head">
              <strong>{{ child.nickname || '匿名' }}</strong>
              <span v-if="!child.approved" class="tag tag--pending">待审核</span>
              <span class="time">{{ child.createdAt }}</span>
            </div>
            <p class="msg__text">
              <span v-if="child.emoji">{{ child.emoji }} </span>{{ child.content }}
            </p>
            <div class="msg__actions">
              <button v-if="!child.approved" class="btn-sm btn-sm--ok" @click="approve(child.id)">通过</button>
              <button v-else class="btn-sm" @click="reject(child.id)">驳回</button>
              <button class="btn-sm btn-sm--danger" @click="remove(child.id)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { adminApi } from '@/api/admin'
import type { AdminRow } from '@/types'

const rows = ref<AdminRow[]>([])
const loading = ref(true)
const error = ref('')
const toast = ref('')
const filter = ref<'all' | 'pending' | 'approved'>('all')

const replyTo = ref<number | null>(null)
const replyText = ref('')
const replyEmoji = ref('')
const replying = ref(false)

/** 顶层留言 = 没有 parentId 的 */
const roots = computed(() => rows.value.filter((r) => r.parentId === null || r.parentId === undefined))
const pendingCount = computed(() => rows.value.filter((r) => !r.approved).length)

function repliesOf(id: number): AdminRow[] {
  return rows.value.filter((r) => r.parentId === id)
}

/**
 * 筛选。
 * 「待审核」要把「主留言没通过」和「只有回复没通过」都算进来，
 * 否则会出现：主留言通过了，但它下面有个待审核的回复，筛不出来。
 */
const visibleRoots = computed(() => {
  if (filter.value === 'all') return roots.value
  const want = filter.value === 'pending' ? false : true
  return roots.value.filter(
    (root) => !!root.approved === want || repliesOf(root.id).some((r) => !!r.approved === want)
  )
})

let toastTimer: ReturnType<typeof setTimeout> | undefined
function flash(message: string) {
  toast.value = message
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 2500)
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    rows.value = (await adminApi.comments.list()) || []
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
}

async function approve(id: number) {
  try {
    await adminApi.comments.approve(id)
    flash('已通过')
    await load()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '操作失败'
  }
}

async function reject(id: number) {
  try {
    await adminApi.comments.reject(id)
    flash('已驳回（前台不再显示）')
    await load()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '操作失败'
  }
}

async function remove(id: number) {
  if (!window.confirm('确认删除这条留言？如果是主留言，它下面的回复也会一起被删掉。')) return
  try {
    await adminApi.comments.remove(id)
    flash('已删除')
    await load()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '删除失败'
  }
}

function toggleReply(id: number) {
  if (replyTo.value === id) {
    replyTo.value = null
    return
  }
  replyTo.value = id
  replyText.value = ''
  replyEmoji.value = ''
}

async function sendReply(id: number) {
  if (!replyText.value.trim()) {
    error.value = '回复内容不能为空'
    return
  }
  replying.value = true
  error.value = ''
  try {
    await adminApi.comments.reply(id, {
      content: replyText.value.trim(),
      emoji: replyEmoji.value.trim() || undefined,
    })
    replyTo.value = null
    replyText.value = ''
    replyEmoji.value = ''
    flash('回复已发布')
    await load()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '回复失败'
  } finally {
    replying.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.head__title {
  font-size: 1.125rem;
  font-weight: 600;
}
.head__sub {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}
.head__actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.alert {
  color: var(--color-primary);
}
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.625rem;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
}
.input:focus {
  border-color: var(--color-primary);
}
.input--sm {
  width: 7rem;
  background: var(--color-bg-card);
}
.input--emoji {
  width: 8rem;
}
.tip {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 0.625rem 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.7;
}
.tip code {
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 0.05rem 0.3rem;
  border-radius: 0.25rem;
}
.banner {
  font-size: 0.8125rem;
  border-radius: 0.625rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.75rem;
}
.banner--error {
  color: #d64545;
  background: rgba(214, 69, 69, 0.08);
  border: 1px solid rgba(214, 69, 69, 0.25);
}
.banner--ok {
  color: #2e7d4f;
  background: rgba(46, 125, 79, 0.08);
  border: 1px solid rgba(46, 125, 79, 0.25);
}
.empty {
  text-align: center;
  padding: 3rem 1rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  background: var(--color-bg-card);
  border: 1px dashed var(--color-border);
  border-radius: 1rem;
}

.threads {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.thread {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1rem;
}
.msg {
  display: flex;
  gap: 0.75rem;
}
.msg--reply {
  margin-top: 0.875rem;
  padding-top: 0.875rem;
  padding-left: 1.75rem;
  border-top: 1px dashed var(--color-border);
}
.msg--pending {
  opacity: 0.85;
}
.avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  object-fit: cover;
  flex: 0 0 auto;
}
.avatar--sm {
  width: 1.75rem;
  height: 1.75rem;
}
.avatar--text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.8125rem;
}
.msg__body {
  flex: 1;
  min-width: 0;
}
.msg__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.8125rem;
}
.time {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}
.ip {
  color: var(--color-text-muted);
  font-size: 0.6875rem;
}
.tag {
  font-size: 0.6875rem;
  padding: 0.05rem 0.4rem;
  border-radius: 999px;
}
.tag--pending {
  background: var(--color-primary-light);
  color: var(--color-primary);
}
.msg__text {
  font-size: 0.875rem;
  margin: 0.375rem 0 0.5rem;
  line-height: 1.7;
  overflow-wrap: anywhere;
}
.msg__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
.reply-box {
  margin-top: 0.75rem;
}
.reply-box__foot {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}
.btn-sm {
  padding: 0.25rem 0.625rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  font-size: 0.8125rem;
  cursor: pointer;
}
.btn-sm:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.btn-sm--ok:hover {
  border-color: #2e7d4f;
  color: #2e7d4f;
}
.btn-sm--danger:hover {
  border-color: #d64545;
  color: #d64545;
}
.btn-primary--sm {
  padding: 0.3rem 0.9rem;
  font-size: 0.8125rem;
  border-radius: 0.5rem;
}
</style>
