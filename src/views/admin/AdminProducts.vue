<template>
  <CrudManager
    title="商品"
    subtitle="前台「橱窗」页展示（商品橱窗需在 src/config/site.ts 里开启）"
    primary-key="name"
    :fields="fields"
    :api="adminApi.products"
    :search-keys="['name', 'description', 'category']"
    empty-text="还没有商品，点右上角新建"
  />
</template>

<script setup lang="ts">
import CrudManager, { type FieldDef } from '@/components/admin/CrudManager.vue'
import { adminApi } from '@/api/admin'

const fields: FieldDef[] = [
  { key: 'name', label: '商品名称', required: true },
  { key: 'price', label: '价格（¥）', type: 'number', min: 0, step: 0.01, required: true, width: '7rem' },
  { key: 'category', label: '分类', placeholder: '数码 / 书籍', width: '7rem' },
  { key: 'sortOrder', label: '排序', type: 'number', min: 0, width: '5rem' },
  { key: 'image', label: '商品图', type: 'image' },
  { key: 'link', label: '跳转链接', placeholder: 'https://…（可留空）' },
  {
    key: 'recommended',
    label: '推荐',
    type: 'switch',
    onText: '推荐',
    offText: '普通',
    width: '6rem',
    defaultValue: false,
    hint: '标记为推荐会加角标',
  },
  {
    key: 'enabled',
    label: '上架',
    type: 'switch',
    onText: '已上架',
    offText: '已下架',
    width: '6rem',
    defaultValue: true,
  },
  { key: 'description', label: '描述', type: 'textarea' },
]
</script>
