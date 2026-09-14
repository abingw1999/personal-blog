<template>
  <CrudManager
    title="友情链接"
    subtitle="前台「友链」页展示的站点"
    primary-key="name"
    :fields="fields"
    :api="adminApi.friends"
    :search-keys="['name', 'description', 'category']"
    empty-text="还没有友链，点右上角新建"
  />
</template>

<script setup lang="ts">
import CrudManager, { type FieldDef } from '@/components/admin/CrudManager.vue'
import { adminApi } from '@/api/admin'

const fields: FieldDef[] = [
  { key: 'name', label: '站点名称', required: true, placeholder: '小明的博客' },
  { key: 'url', label: '链接', required: true, placeholder: 'https://example.com' },
  { key: 'category', label: '分类', placeholder: '技术 / 生活', defaultValue: '技术', width: '7rem' },
  { key: 'sortOrder', label: '排序', type: 'number', min: 0, width: '5rem', hint: '数字越小越靠前' },
  { key: 'avatar', label: '头像', type: 'image' },
  { key: 'description', label: '描述', type: 'textarea', placeholder: '一句话介绍这个站点' },
]
</script>
