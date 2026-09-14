<template>
  <section>
    <!-- 头部：标题 + 新建 -->
    <header class="page-head">
      <div>
        <h2 class="page-head__title">{{ title }}</h2>
        <p v-if="subtitle" class="page-head__sub">{{ subtitle }}</p>
      </div>
      <div class="page-head__actions">
        <input
          v-if="searchKeys && searchKeys.length"
          v-model.trim="keyword"
          class="input input--search"
          type="search"
          placeholder="搜索…"
        />
        <button class="btn-primary" @click="openCreate">＋ 新建</button>
      </div>
    </header>

    <!-- 状态提示 -->
    <p v-if="error" class="banner banner--error">{{ error }}</p>
    <p v-if="toast" class="banner banner--ok">{{ toast }}</p>

    <!-- 列表 -->
    <div v-if="loading" class="empty">正在加载…</div>
    <div v-else-if="!filteredRows.length" class="empty">
      {{ keyword ? '没有匹配的记录' : emptyText }}
    </div>

    <div v-else class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th v-for="col in tableFields" :key="col.key" :style="col.width ? { width: col.width } : undefined">
              {{ col.label }}
            </th>
            <th class="col-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filteredRows" :key="row.id">
            <td v-for="col in tableFields" :key="col.key">
              <template v-if="col.type === 'switch'">
                <span :class="['pill', row[col.key] ? 'pill--on' : 'pill--off']">
                  {{ row[col.key] ? col.onText || '启用' : col.offText || '停用' }}
                </span>
              </template>
              <template v-else-if="col.type === 'rating'">
                <span class="stars-inline">
                  <span v-for="n in (col.max || 5)" :key="n" :class="{ 'star--on': Number(row[col.key]) >= n }">★</span>
                </span>
              </template>
              <template v-else-if="col.type === 'image'">
                <img v-if="row[col.key]" :src="row[col.key]" alt="" class="thumb" />
                <span v-else class="muted">—</span>
              </template>
              <template v-else-if="col.format">
                {{ col.format(row) }}
              </template>
              <template v-else>
                <span :class="{ strong: col.key === primaryKey }">{{ display(row, col) }}</span>
              </template>
            </td>
            <td class="col-actions">
              <button class="btn-sm" @click="openEdit(row)">编辑</button>
              <button class="btn-sm btn-sm--danger" @click="askDelete(row)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新建 / 编辑弹窗 -->
    <div v-if="dialogOpen" class="modal-mask" @click.self="closeDialog">
      <div class="modal">
        <header class="modal__head">
          <h3>{{ mode === 'create' ? `新建${title}` : `编辑${title}` }}</h3>
          <button class="modal__close" @click="closeDialog">✕</button>
        </header>

        <div class="modal__body">
          <p v-if="formError" class="banner banner--error">{{ formError }}</p>

          <div class="grid">
            <div
              v-for="field in fields"
              :key="field.key"
              :class="['form-item', { 'form-item--full': field.full || field.type === 'textarea' }]"
            >
              <label :for="`f-${field.key}`">
                {{ field.label }}
                <span v-if="field.required" class="req">*</span>
              </label>

              <!-- 长文本 -->
              <textarea
                v-if="field.type === 'textarea'"
                :id="`f-${field.key}`"
                v-model="form[field.key]"
                class="input"
                rows="4"
                :placeholder="field.placeholder"
              ></textarea>

              <!-- 开关 -->
              <label v-else-if="field.type === 'switch'" class="switch">
                <input type="checkbox" v-model="form[field.key]" />
                <span class="switch__track"><span class="switch__dot"></span></span>
                <span class="switch__text">{{ form[field.key] ? field.onText || '启用' : field.offText || '停用' }}</span>
              </label>

              <!-- 下拉 -->
              <select
                v-else-if="field.type === 'select'"
                :id="`f-${field.key}`"
                v-model="form[field.key]"
                class="input"
              >
                <option v-for="opt in field.options" :key="String(opt.value)" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>

              <!-- 评分 -->
              <div v-else-if="field.type === 'rating'" class="stars">
                <button
                  v-for="n in (field.max || 5)"
                  :key="n"
                  type="button"
                  class="star"
                  :class="{ 'star--on': Number(form[field.key]) >= n }"
                  @click="form[field.key] = n"
                >
                  ★
                </button>
                <span class="muted">{{ form[field.key] || 0 }} / {{ field.max || 5 }}</span>
              </div>

              <!-- 图片：URL + 上传 -->
              <div v-else-if="field.type === 'image'" class="image-field">
                <div class="image-field__row">
                  <input
                    :id="`f-${field.key}`"
                    v-model.trim="form[field.key]"
                    class="input"
                    placeholder="图片地址，或点右侧上传"
                  />
                  <button type="button" class="btn-sm" :disabled="uploading === field.key" @click="pickFile(field.key)">
                    {{ uploading === field.key ? '上传中…' : '上传' }}
                  </button>
                  <button
                    v-if="form[field.key]"
                    type="button"
                    class="btn-sm btn-sm--danger"
                    @click="form[field.key] = ''"
                  >
                    清除
                  </button>
                </div>
                <img v-if="form[field.key]" :src="form[field.key]" alt="" class="image-field__preview" />
              </div>

              <!-- 日期 / 数字 / 文本 -->
              <input
                v-else
                :id="`f-${field.key}`"
                v-model="form[field.key]"
                class="input"
                :type="field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'"
                :min="field.min"
                :max="field.max"
                :step="field.step"
                :placeholder="field.placeholder"
                @input="onNumberInput(field)"
              />

              <p v-if="field.hint" class="hint">{{ field.hint }}</p>
            </div>
          </div>
        </div>

        <footer class="modal__foot">
          <button class="btn-ghost" @click="closeDialog">取消</button>
          <button class="btn-primary" :disabled="saving" @click="submit">
            {{ saving ? '保存中…' : '保存' }}
          </button>
        </footer>
      </div>
    </div>

    <!-- 删除确认 -->
    <div v-if="deleteTarget" class="modal-mask" @click.self="deleteTarget = null">
      <div class="modal modal--sm">
        <header class="modal__head">
          <h3>确认删除</h3>
          <button class="modal__close" @click="deleteTarget = null">✕</button>
        </header>
        <div class="modal__body">
          <p class="confirm-text">
            将删除「{{ deleteTarget[primaryKey] || deleteTarget.id }}」，此操作不可撤销。
          </p>
        </div>
        <footer class="modal__foot">
          <button class="btn-ghost" @click="deleteTarget = null">取消</button>
          <button class="btn-primary btn-primary--danger" :disabled="saving" @click="doDelete">
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
import type { AdminRow } from '@/types'

export interface FieldDef {
  key: string
  label: string
  /** 默认 text。textarea 会自动占整行且不进表格 */
  type?: 'text' | 'textarea' | 'number' | 'switch' | 'select' | 'date' | 'image' | 'rating'
  required?: boolean
  placeholder?: string
  hint?: string
  options?: { label: string; value: string | number }[]
  min?: number
  max?: number
  step?: number
  /** 表格列宽 */
  width?: string
  /** 是否出现在表格里；不写时的默认规则：textarea 不进表格，其余进 */
  inTable?: boolean
  /** 表格里的展示逻辑（不写就按原值显示） */
  format?: (row: AdminRow) => string
  /** 表格里显示的最大字数 */
  truncate?: number
  /** 表单里的初始值 */
  defaultValue?: unknown
  /** 强制占整行 */
  full?: boolean
  /** switch 的文案 */
  onText?: string
  offText?: string
}

const props = defineProps<{
  title: string
  subtitle?: string
  fields: FieldDef[]
  /** 由 src/api/admin.ts 的 crud() 生成 */
  api: {
    list: (params?: Record<string, string | number | undefined | null>) => Promise<AdminRow[]>
    create: (data: Partial<AdminRow>) => Promise<AdminRow>
    update: (id: number, data: Partial<AdminRow>) => Promise<AdminRow>
    remove: (id: number) => Promise<void>
  }
  /** 表格里加粗显示的主字段 */
  primaryKey: string
  /** 参与本地搜索的字段 */
  searchKeys?: string[]
  /** 无数据时的提示 */
  emptyText?: string
}>()

const rows = ref<AdminRow[]>([])
const loading = ref(true)
const error = ref('')
const toast = ref('')
const keyword = ref('')

const dialogOpen = ref(false)
const mode = ref<'create' | 'edit'>('create')
const form = reactive<AdminRow>({})
const formError = ref('')
const saving = ref(false)
const deleteTarget = ref<AdminRow | null>(null)
const uploading = ref('')

const tableFields = computed(() =>
  props.fields.filter((f) => (f.inTable === undefined ? f.type !== 'textarea' : f.inTable))
)

const filteredRows = computed(() => {
  const keys = props.searchKeys
  if (!keyword.value || !keys || !keys.length) return rows.value
  const kw = keyword.value.toLowerCase()
  return rows.value.filter((row) =>
    keys.some((k) => String(row[k] ?? '').toLowerCase().includes(kw))
  )
})

function display(row: AdminRow, col: FieldDef): string {
  const raw = row[col.key]
  if (raw === null || raw === undefined || raw === '') return '—'
  const text = String(raw)
  if (col.truncate && text.length > col.truncate) return text.slice(0, col.truncate) + '…'
  return text
}

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
    rows.value = (await props.api.list()) || []
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  props.fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      form[field.key] = field.defaultValue
    } else if (field.type === 'switch') {
      // 新建时默认开启（上架 / 启用这类语义），要默认关闭就在字段上写 defaultValue: false
      form[field.key] = true
    } else if (field.type === 'select') {
      form[field.key] = field.options?.[0]?.value ?? ''
    } else if (field.type === 'number' || field.type === 'rating') {
      form[field.key] = field.min ?? 0
    } else {
      form[field.key] = ''
    }
  })
}

function openCreate() {
  mode.value = 'create'
  resetForm()
  // 排序值默认取「当前最大 + 1」，新建的项直接排到最后
  if (props.fields.some((f) => f.key === 'sortOrder')) {
    const max = rows.value.reduce((acc, r) => Math.max(acc, Number(r.sortOrder) || 0), 0)
    form.sortOrder = max + 1
  }
  formError.value = ''
  dialogOpen.value = true
}

function openEdit(row: AdminRow) {
  mode.value = 'edit'
  resetForm()
  // 只回填表单声明过的字段，避免把 createdAt 之类的只读字段又写回后端
  props.fields.forEach((field) => {
    if (row[field.key] !== undefined) {
      form[field.key] = row[field.key]
    }
  })
  form.id = row.id
  formError.value = ''
  dialogOpen.value = true
}

function closeDialog() {
  dialogOpen.value = false
  formError.value = ''
}

/** v-model 在 type=number 上给的是字符串，转成数字再提交 */
function onNumberInput(field: FieldDef) {
  if (field.type !== 'number') return
  const value = form[field.key]
  if (value === '' || value === null || value === undefined) return
  const num = Number(value)
  if (!Number.isNaN(num)) form[field.key] = num
}

function pickFile(key: string) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return
    uploading.value = key
    formError.value = ''
    try {
      const result = await adminApi.uploadImage(file)
      form[key] = result.url
    } catch (e) {
      formError.value = e instanceof Error ? e.message : '上传失败'
    } finally {
      uploading.value = ''
    }
  }
  input.click()
}

async function submit() {
  // 必填校验
  const missing = props.fields.find(
    (f) => f.required && (form[f.key] === '' || form[f.key] === null || form[f.key] === undefined)
  )
  if (missing) {
    formError.value = `请填写「${missing.label}」`
    return
  }
  // 数字字段的空值后端会当 null 处理，统一补 0
  props.fields.forEach((f) => {
    if ((f.type === 'number' || f.type === 'rating') && (form[f.key] === '' || form[f.key] === null)) {
      form[f.key] = f.min ?? 0
    }
  })

  saving.value = true
  formError.value = ''
  try {
    const payload: AdminRow = {}
    props.fields.forEach((f) => (payload[f.key] = form[f.key]))

    if (mode.value === 'create') {
      await props.api.create(payload)
      flash('已创建')
    } else {
      await props.api.update(form.id as number, payload)
      flash('已保存')
    }
    dialogOpen.value = false
    await load()
  } catch (e) {
    formError.value = e instanceof Error ? e.message : '保存失败'
  } finally {
    saving.value = false
  }
}

function askDelete(row: AdminRow) {
  deleteTarget.value = row
}

async function doDelete() {
  if (!deleteTarget.value) return
  saving.value = true
  try {
    await props.api.remove(deleteTarget.value.id)
    deleteTarget.value = null
    flash('已删除')
    await load()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '删除失败'
    deleteTarget.value = null
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.page-head__title {
  font-size: 1.125rem;
  font-weight: 600;
}
.page-head__sub {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin-top: 0.125rem;
}
.page-head__actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
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
  text-transform: uppercase;
  letter-spacing: 0.04em;
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
.col-actions {
  text-align: right;
  white-space: nowrap;
}
.strong {
  font-weight: 600;
}
.muted {
  color: var(--color-text-muted);
}
.thumb {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
}

.pill {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
}
.pill--on {
  background: rgba(46, 125, 79, 0.12);
  color: #2e7d4f;
}
.pill--off {
  background: var(--color-bg);
  color: var(--color-text-muted);
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
}
.btn-primary--danger {
  background: #d64545;
}
.btn-primary:disabled,
.btn-sm:disabled,
.btn-ghost:disabled {
  opacity: 0.55;
  cursor: not-allowed;
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
.input--search {
  width: 12rem;
}

/* 弹窗 */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 3rem 1rem;
  overflow-y: auto;
  z-index: 100;
}
.modal {
  width: 100%;
  max-width: 40rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.18);
}
.modal--sm {
  max-width: 24rem;
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
  font-size: 1rem;
}
.modal__body {
  padding: 1.25rem;
}
.modal__foot {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--color-border);
}
.confirm-text {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.form-item--full {
  grid-column: 1 / -1;
}
.form-item > label {
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
  margin-top: 0.25rem;
}

.switch {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.8125rem;
  color: var(--color-text-light);
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

.stars {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.stars-inline {
  color: var(--color-border);
  letter-spacing: 0.05em;
}
.stars-inline .star--on {
  color: #f0a500;
}
.star {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.125rem;
  line-height: 1;
  color: var(--color-border);
  padding: 0;
}
.star--on {
  color: #f0a500;
}

.image-field__row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.image-field__preview {
  margin-top: 0.5rem;
  max-height: 7rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .input--search {
    width: 8rem;
  }
}
</style>
