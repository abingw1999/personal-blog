<template>
  <CrudManager
    title="收藏单"
    subtitle="前台「收藏」页的书 / 影 / 游戏清单"
    primary-key="title"
    :fields="fields"
    :api="adminApi.collections"
    :search-keys="['title', 'comment', 'status']"
    empty-text="还没有收藏，点右上角新建"
  />
</template>

<script setup lang="ts">
import CrudManager, { type FieldDef } from '@/components/admin/CrudManager.vue'
import { adminApi } from '@/api/admin'

const typeLabels: Record<string, string> = { book: '书', movie: '影', game: '游戏' }

const fields: FieldDef[] = [
  {
    key: 'type',
    label: '类型',
    type: 'select',
    required: true,
    width: '6rem',
    // value 必须和后端存的英文枚举一致，前台靠它做 Tab 分组
    options: [
      { label: '书', value: 'book' },
      { label: '影视', value: 'movie' },
      { label: '游戏', value: 'game' },
    ],
    format: (row) => typeLabels[String(row.type)] || String(row.type ?? '—'),
    defaultValue: 'book',
  },
  { key: 'title', label: '名称', required: true },
  {
    key: 'status',
    label: '状态',
    width: '7rem',
    placeholder: '已读完',
    hint: '自由填写，例如：在读 / 已读完 / 在看 / 已看完 / 在玩 / 已通关',
  },
  { key: 'rating', label: '评分', type: 'rating', max: 5, width: '9rem' },
  { key: 'sortOrder', label: '排序', type: 'number', min: 0, width: '5rem' },
  { key: 'completedAt', label: '完成日期', type: 'date', hint: '在读 / 在玩的可留空' },
  { key: 'cover', label: '封面', type: 'image' },
  { key: 'link', label: '相关链接', placeholder: '豆瓣 / Steam 链接（可留空）' },
  { key: 'comment', label: '短评', type: 'textarea', placeholder: '一两句话的感想' },
]
</script>
