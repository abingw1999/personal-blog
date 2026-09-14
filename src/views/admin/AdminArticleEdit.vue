<template>
  <section>
    <header class="head">
      <div>
        <router-link to="/admin/articles" class="back">← 返回文章列表</router-link>
        <h2 class="head__title">{{ isEdit ? '编辑文章' : '写文章' }}</h2>
      </div>
      <div class="head__actions">
        <a v-if="isEdit && form.slug" :href="`/blog/${form.slug}`" target="_blank" rel="noopener" class="btn-ghost">
          预览前台
        </a>
        <button class="btn-primary" :disabled="saving" @click="submit">
          {{ saving ? '保存中…' : isEdit ? '保存修改' : '发布文章' }}
        </button>
      </div>
    </header>

    <p v-if="error" class="banner banner--error">{{ error }}</p>

    <div v-if="loading" class="empty">正在加载…</div>

    <div v-else class="layout">
      <!-- 左：正文 -->
      <div class="col-main">
        <div class="panel">
          <label class="label" for="title">标题 <span class="req">*</span></label>
          <input id="title" v-model="form.title" class="input" placeholder="文章标题" @blur="suggestSlug" />

          <label class="label mt" for="slug">
            slug（网址标识）<span class="req">*</span>
          </label>
          <div class="row">
            <input id="slug" v-model.trim="form.slug" class="input" placeholder="my-first-post" />
            <button class="btn-sm" @click="form.slug = dateSlug()">用日期生成</button>
          </div>
          <p class="hint">
            文章地址是 <code>/blog/{{ form.slug || '…' }}</code>。
            <strong>必须唯一</strong>，且建议只用小写字母、数字和连字符——改掉已有文章的 slug 会让旧链接失效。
          </p>

          <label class="label mt" for="excerpt">摘要</label>
          <textarea
            id="excerpt"
            v-model="form.excerpt"
            class="input"
            rows="2"
            placeholder="列表卡片上显示的一句话（留空会自动从正文截取）"
          ></textarea>
        </div>

        <!-- Markdown 编辑器 -->
        <div class="panel mt">
          <div class="editor-head">
            <label class="label" style="margin: 0">正文（Markdown）</label>
            <div class="tabs">
              <button :class="['tab', { 'tab--on': tab === 'write' }]" @click="tab = 'write'">编辑</button>
              <button :class="['tab', { 'tab--on': tab === 'preview' }]" @click="tab = 'preview'">预览</button>
              <span class="counter">{{ wordCount }} 字 · 约 {{ readTime }} 分钟</span>
            </div>
          </div>

          <textarea
            v-if="tab === 'write'"
            v-model="form.content"
            class="input editor"
            placeholder="# 小标题&#10;&#10;正文，支持 Markdown 语法。&#10;&#10;```js&#10;console.log('代码块')&#10;```"
          ></textarea>
          <div v-else class="preview markdown-content" v-html="rendered"></div>

          <div class="toolbar">
            <button class="btn-sm" @click="insert('# ')">标题</button>
            <button class="btn-sm" @click="insert('**粗体**')">粗体</button>
            <button class="btn-sm" @click="insert('- 列表项')">列表</button>
            <button class="btn-sm" @click="insert('> 引用')">引用</button>
            <button class="btn-sm" @click="insert('[链接文字](https://)')">链接</button>
            <button class="btn-sm" @click="insert('```\n代码\n```')">代码块</button>
            <button class="btn-sm" @click="insert('![图片说明](图片地址)')">图片</button>
          </div>
        </div>
      </div>

      <!-- 右：属性 -->
      <div class="col-side">
        <div class="panel">
          <h3 class="panel__title">发布设置</h3>

          <label class="switch-row">
            <span>设为精选</span>
            <label class="switch">
              <input type="checkbox" v-model="form.featured" />
              <span class="switch__track"><span class="switch__dot"></span></span>
            </label>
          </label>
          <p class="hint">开启后会出现在首页「精选文章」区域。</p>

          <label class="label mt" for="category">分类</label>
          <input id="category" v-model.trim="form.category" class="input" placeholder="生活 / 技术" list="category-list" />
          <datalist id="category-list">
            <option v-for="c in categories" :key="c" :value="c" />
          </datalist>

          <label class="label mt" for="tags">标签</label>
          <input id="tags" v-model="form.tags" class="input" placeholder="随笔, 年度总结" />
          <p class="hint">用英文逗号分隔，存库时自动转成 JSON 数组。</p>

          <label class="label mt" for="readTime">阅读时长（分钟）</label>
          <input id="readTime" v-model.number="form.readTime" class="input" type="number" min="1" />
          <p class="hint">留空会自动按 400 字/分钟计算。</p>
        </div>

        <div class="panel mt">
          <h3 class="panel__title">封面图</h3>
          <div class="cover">
            <img v-if="form.cover" :src="form.cover" alt="" class="cover__img" />
            <div v-else class="cover__empty">暂无封面</div>
          </div>
          <div class="row mt">
            <input v-model.trim="form.cover" class="input" placeholder="图片地址" />
            <button class="btn-sm" :disabled="uploading" @click="pickCover">
              {{ uploading ? '上传中…' : '上传' }}
            </button>
          </div>
          <button v-if="form.cover" class="btn-sm btn-sm--danger mt" @click="form.cover = ''">清除封面</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { adminApi } from '@/api/admin'
import { api, parseTags } from '@/api'
import type { Article } from '@/types'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id && route.params.id !== 'new')
const loading = ref(false)
const saving = ref(false)
const uploading = ref(false)
const error = ref('')
const categories = ref<string[]>([])
const tab = ref<'write' | 'preview'>('write')

const form = reactive({
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  cover: '',
  category: '',
  tags: '',
  readTime: 0,
  wordCount: 0,
  featured: false,
})

/** 与后端 normalizeArticle() 用同一套算法，好让保存前后显示一致 */
const wordCount = computed(() => form.content.replace(/\s/g, '').length)
const readTime = computed(() => Math.max(1, Math.round(wordCount.value / 400)))

const rendered = computed(() => {
  if (!form.content) return '<p class="muted">（正文为空）</p>'
  return marked.parse(form.content, { async: false, breaks: true }) as string
})

function dateSlug(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `post-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`
}

/** 从标题生成一个「能看」的 slug：保留字母数字，中文原样留着（浏览器会转义） */
function suggestSlug() {
  if (form.slug || !form.title) return
  const ascii = form.title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
  form.slug = ascii || dateSlug()
}

function insert(snippet: string) {
  form.content = form.content ? `${form.content}\n\n${snippet}` : snippet
}

function pickCover() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return
    uploading.value = true
    error.value = ''
    try {
      const result = await adminApi.uploadImage(file)
      form.cover = result.url
    } catch (e) {
      error.value = e instanceof Error ? e.message : '上传失败'
    } finally {
      uploading.value = false
    }
  }
  input.click()
}

async function submit() {
  if (!form.title.trim()) {
    error.value = '请填写标题'
    return
  }
  if (!form.slug.trim()) {
    suggestSlug()
  }
  if (!form.slug.trim()) {
    error.value = '请填写 slug'
    return
  }
  if (/[\s/?#]/.test(form.slug)) {
    error.value = 'slug 不能包含空格、斜杠、问号或井号'
    return
  }

  saving.value = true
  error.value = ''
  try {
    // tags 后端存的是 JSON 字符串，这里把逗号分隔转成 '["a","b"]'
    const tagsJson = JSON.stringify(
      form.tags
        .split(/[,，]/)
        .map((t) => t.trim())
        .filter(Boolean)
    )
    const payload = {
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      cover: form.cover,
      category: form.category,
      tags: tagsJson,
      readTime: form.readTime || readTime.value,
      wordCount: form.wordCount || wordCount.value,
      featured: form.featured,
    }

    if (isEdit.value) {
      await adminApi.articles.update(Number(route.params.id), payload)
    } else {
      await adminApi.articles.create(payload)
    }
    router.push('/admin/articles')
  } catch (e) {
    error.value = e instanceof Error ? e.message : '保存失败'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  api.getCategories().then((list) => (categories.value = list)).catch(() => {})

  if (!isEdit.value) return
  loading.value = true
  try {
    const article: Article = await adminApi.articles.get(Number(route.params.id))
    form.slug = article.slug || ''
    form.title = article.title || ''
    form.excerpt = article.excerpt || ''
    form.content = article.content || ''
    form.cover = article.cover || ''
    form.category = article.category || ''
    form.tags = parseTags(article.tags).join(', ')
    form.readTime = article.readTime || 0
    form.wordCount = article.wordCount || 0
    form.featured = !!article.featured
  } catch (e) {
    error.value = e instanceof Error ? e.message : '文章加载失败'
  } finally {
    loading.value = false
  }
})
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
.head__actions {
  display: flex;
  gap: 0.5rem;
}
.back {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-decoration: none;
}
.back:hover {
  color: var(--color-primary);
}
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 19rem;
  gap: 1rem;
  align-items: start;
}
.col-side {
  position: sticky;
  top: 4.5rem;
}
.panel {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1rem;
}
.panel__title {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}
.mt {
  margin-top: 1rem;
}
.label {
  display: block;
  font-size: 0.8125rem;
  color: var(--color-text-light);
  margin-bottom: 0.375rem;
}
.req {
  color: #d64545;
}
.hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.375rem;
  line-height: 1.6;
}
.hint code {
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 0.05rem 0.3rem;
  border-radius: 0.25rem;
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
.row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.editor-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}
.tabs {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.tab {
  padding: 0.25rem 0.625rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-light);
  font-size: 0.8125rem;
  cursor: pointer;
}
.tab--on {
  background: var(--color-primary-light);
  border-color: transparent;
  color: var(--color-primary);
}
.counter {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-left: 0.5rem;
}
.editor {
  min-height: 26rem;
  line-height: 1.8;
  resize: vertical;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.8125rem;
}
.preview {
  min-height: 26rem;
  padding: 0.75rem;
  border: 1px dashed var(--color-border);
  border-radius: 0.625rem;
  font-size: 0.875rem;
  overflow-wrap: anywhere;
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.625rem;
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
  text-decoration: none;
}
.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8125rem;
  color: var(--color-text-light);
  cursor: pointer;
}
.switch {
  display: inline-flex;
  cursor: pointer;
}
.switch input {
  display: none;
}
.switch__track {
  width: 2.25rem;
  height: 1.25rem;
  border-radius: 999px;
  background: var(--color-border);
  position: relative;
  transition: background 0.2s ease;
}
.switch__dot {
  position: absolute;
  top: 0.1875rem;
  left: 0.1875rem;
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 999px;
  background: #fff;
  transition: transform 0.2s ease;
}
.switch input:checked + .switch__track {
  background: var(--color-primary);
}
.switch input:checked + .switch__track .switch__dot {
  transform: translateX(1rem);
}
.cover__img {
  width: 100%;
  border-radius: 0.625rem;
  border: 1px solid var(--color-border);
}
.cover__empty {
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  border: 1px dashed var(--color-border);
  border-radius: 0.625rem;
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
.empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
@media (max-width: 1080px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .col-side {
    position: static;
  }
}
</style>
