<template>
  <CrudManager
    title="徽章"
    subtitle="前台「徽章」页的趣味徽章列表"
    primary-key="name"
    :fields="fields"
    :api="adminApi.badges"
    :search-keys="['name', 'description']"
    empty-text="还没有徽章，点右上角新建"
  />
</template>

<script setup lang="ts">
import CrudManager, { type FieldDef } from '@/components/admin/CrudManager.vue'
import { adminApi } from '@/api/admin'

const fields: FieldDef[] = [
  { key: 'icon', label: '图标', required: true, placeholder: '🌱', width: '6rem' },
  { key: 'name', label: '徽章名称', required: true, placeholder: '初来乍到' },
  { key: 'sortOrder', label: '排序', type: 'number', min: 0, width: '5rem' },
  { key: 'description', label: '获得条件说明', type: 'textarea', placeholder: '首次访问网站' },
  {
    key: 'condition',
    label: '条件标识（存库字段 condition_desc）',
    placeholder: '访问网站',
    hint: '数据库字段名是 condition_desc —— condition 是 MySQL 保留字。和上一栏意义接近，简写即可',
  },
]
</script>
