<template>
  <CrudManager
    title="Now 状态"
    subtitle="前台「Now」页的「最近在做什么」"
    primary-key="category"
    :fields="fields"
    :api="adminApi.nowStatus"
    :search-keys="['category', 'content']"
    empty-text="还没有状态，点右上角新建"
  />
</template>

<script setup lang="ts">
import CrudManager, { type FieldDef } from '@/components/admin/CrudManager.vue'
import { adminApi } from '@/api/admin'

const fields: FieldDef[] = [
  {
    key: 'category',
    label: '分类',
    required: true,
    placeholder: '正在学习',
    hint: '常见：正在学习 / 正在阅读 / 正在玩 / 正在听',
  },
  { key: 'icon', label: '图标', placeholder: '📚', width: '6rem', hint: '填一个 emoji' },
  { key: 'content', label: '内容', type: 'textarea', placeholder: 'Vue3 + TypeScript，顺便复习 Spring Boot' },
]
</script>
