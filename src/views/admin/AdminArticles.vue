<template>
  <section>
    <header class="head">
      <div>
        <h2 class="head__title">文章</h2>
        <p class="head__sub">共 {{ total }} 篇（已删除的文章不在其中）</p>
      </div>
      <router-link to="/admin/articles/new" class="btn-primary">＋ 写文章</router-link>
    </header>

    <!-- 筛选 -->
    <div class="filters">
      <input v-model.trim="filters.keyword" class="input" type="search" placeholder="搜索标题 / slug / 摘要" @keyup.enter="reload" />
      <select v-model="filters.category" class="input input--sm" @change="reload">
        <option value="">全部分类</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
      <select v-model="filters.featured" class="input input--sm" @change="reload">
        <option value="">全部</option>
        <option value="true">仅精选</option>
        <option value="false">非精选</option>
      </select>
      <button class="btn-sm" @click="reload">搜索</button>
    </div>

    <p v-if="error" class="banner banner--error">{{ error }}</p>
    <p v-if="toast" class="banner banner--ok">{{ toast }}</p>

    <div v-if="loading" class="empty">正在加载…</div>
    <div v-else-if="!rows.length" class="empty">没有符合条件的文章</div>

    <div v-else class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th style="width: 3.5rem">封面</th>
            <th>标题</th>
            <th style="width: 6rem">分类</th>
            <th style="width: 6rem">精选</th>
            <th style="width: 5rem">阅读</th>
            <th style="width: 7rem">创建日期</th>
            <th class="col-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>
              <img v-if="row.cover" :src="row.cover" alt="" class="thumb" />
              <span v-else class="muted">—</span>
            </td>
            <td>
              <router-link :to="`/admin/articles/${row.id}/edit`" class="title-link">
                {{ row.title }}
              </router-link>
              <small class="slug">/blog/{{ row.slug }}</small>
            </td>
            <td>{{ row.category || '—' }}</td>
            <td>
              <span :class="['pill', row.featured ? 'pill--on' : 'pill--off']">
                {{ row.featured ? '精选' : '普通' }}
              </span>
            </td>
            <td>{{ row.views || 0 }}</td>
            <td class="muted">{{ formatDate(row.createdAt) }}</td>
            <td class="col-actions">
              <a :href="`/blog/${row.slug}`" target="_blank" rel="noopener" class="btn-sm">预览</a>
              <router-link :to="`/admin/articles/${row.id}/edit`" class="btn-sm">编辑</router-link>
              <button class="btn-sm btn-sm--danger" @click="askDelete(row)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pager">
      <button class="btn-sm" :disabled="page <= 1" @click="go(page - 1)">上一页</button>
      <span class="pager__info">第 {{ page }} / {{ totalPages }} 页</span>
      <button class="btn-sm" :disabled="page >= totalPages" @click="go(page + 1)">下一页</button>
    </div>

    <!-- 删除确认 -->
    <div v-if="deleteTarget" class="modal-mask" @click.self="deleteTarget = null">
      <div class="modal">
        <header class="modal__head">
          <h3>确认删除</h3>
          <button class="modal__close" @click="deleteTarget = null">✕</button>
        </header>
        <div class="modal__body">
          <p class="confirm-text">
            将删除《{{ deleteTarget.title }}》。<br />
            <span class="muted">这是逻辑删除：记录还留在数据库里（deleted=1），只是前台不再展示，原有链接会变成 404。</span>
          </p>
        </div>
        <footer class="modal__foot">
          <button class="btn-ghost" @click="deleteTarget = null">取消</button>
          <button class="btn-danger" :disabled="saving" @click="doDelete">
            {{ saving ? '删除中…' : '确认删除' }}
          </button>
        </footer>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { adminApi } from '@/api/admin'
import { api, formatDate } from '@/api'
import type { Article } from '@/types'

const rows = ref<Article[]>([])
const categories = ref<string[]>([])
const total = ref(0)
const page = ref(1)
const size = 10

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const toast = ref('')
const deleteTarget = ref<Article | null>(null)

const filters = reactive<{ keyword: string; category: string; featured: string }>({
  keyword: '',
  category: '',
  featured: '',
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / size)))

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
    const result = await adminApi.articles.list({
      page: page.value,
      size,
      keyword: filters.keyword || undefined,
      category: filters.category || undefined,
      featured: filters.featured === '' ? undefined : filters.featured === 'true',
    })
    rows.value = result.list || []
    total.value = result.total || 0
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
}

async function loadCategories() {
  // 分类复用前台接口，避免再写一个
  try {
    categories.value = await api.getCategories()
  } catch {
    categories.value = []
  }
}

function reload() {
  page.value = 1
  load()
}

function go(next: number) {
  page.value = next
  load()
}

function askDelete(row: Article) {
  deleteTarget.value = row
}

async function doDelete() {
  if (!deleteTarget.value) return
  saving.value = true
  try {
    await adminApi.articles.remove(deleteTarget.value.id)
    deleteTarget.value = null
    flash('已删除')
    // 删掉当前页最后一条时回退一页，避免停在空白页
    if (rows.value.length === 1 && page.value > 1) page.value -= 1
    await load()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '删除失败'
    deleteTarget.value = null
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  load()
  loadCategories()
})
</script>

<style scoped>
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
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
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.input {
  padding: 0.5rem 0.75rem;
  border-radius: 0.625rem;
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  color: var(--color-text);
  font-size: 0.875rem;
  outline: none;
}
.input:focus {
  border-color: var(--color-primary);
}
.input--sm {
  width: 9rem;
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
.table-wrap {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  overflow-x: auto;
}
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.table th,
.table td {
  padding: 0.625rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
}
.table thead th {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 500;
  white-space: nowrap;
  background: var(--color-bg);
}
.table tbody tr:last-child td {
  border-bottom: none;
}
.table tbody tr:hover {
  background: var(--color-bg);
}
.title-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
}
.title-link:hover {
  color: var(--color-primary);
}
.slug {
  display: block;
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}
.thumb {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
}
.muted {
  color: var(--color-text-muted);
}
.col-actions {
  text-align: right;
  white-space: nowrap;
}
.pill {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
}
.pill--on {
  background: var(--color-primary-light);
  color: var(--color-primary);
}
.pill--off {
  background: var(--color-bg);
  color: var(--color-text-muted);
}
.btn-sm {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  font-size: 0.8125rem;
  cursor: pointer;
  text-decoration: none;
}
.btn-sm:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.btn-sm--danger:hover {
  border-color: #d64545;
  color: #d64545;
}
.btn-ghost {
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-light);
  cursor: pointer;
  font-size: 0.875rem;
}
.btn-danger {
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  border: none;
  background: #d64545;
  color: #fff;
  cursor: pointer;
  font-size: 0.875rem;
}
.btn-danger:disabled {
  opacity: 0.55;
}
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
.pager__info {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 4rem 1rem;
  z-index: 100;
}
.modal {
  width: 100%;
  max-width: 26rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
}
.modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
}
.modal__head h3 {
  font-size: 0.9375rem;
  font-weight: 600;
}
.modal__close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
}
.modal__body {
  padding: 1.25rem;
}
.confirm-text {
  font-size: 0.875rem;
  color: var(--color-text-light);
  line-height: 1.7;
}
.modal__foot {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--color-border);
}
</style>
