<template>
  <CrudManager
    title="建站日记"
    subtitle="前台「建站日记」页 + 时间轴会聚合这里的内容"
    primary-key="title"
    :fields="fields"
    :api="adminApi.changelog"
    :search-keys="['title', 'content']"
    empty-text="还没有记录，点右上角新建"
  />
</template>

<script setup lang="ts">
import CrudManager, { type FieldDef } from '@/components/admin/CrudManager.vue'
import { adminApi } from '@/api/admin'

const typeLabels: Record<string, string> = {
  feature: '新功能',
  fix: '修复',
  optimize: '优化',
  theme: '主题',
}
const typeColors: Record<string, string> = {
  feature: '✨',
  fix: '🔧',
  optimize: '⚡',
  theme: '🎨',
}

const fields: FieldDef[] = [
  { key: 'date', label: '日期', type: 'date', required: true, width: '8rem' },
  {
    key: 'type',
    label: '类型',
    type: 'select',
    width: '8rem',
    options: [
      { label: '✨ 新功能', value: 'feature' },
      { label: '🔧 修复', value: 'fix' },
      { label: '⚡ 优化', value: 'optimize' },
      { label: '🎨 主题', value: 'theme' },
    ],
    defaultValue: 'feature',
    format: (row) => `${typeColors[String(row.type)] || ''} ${typeLabels[String(row.type)] || row.type}`,
  },
  { key: 'title', label: '标题', required: true, placeholder: '网站正式上线' },
  { key: 'content', label: '内容', type: 'textarea', placeholder: '这次改了什么' },
]
</script>
