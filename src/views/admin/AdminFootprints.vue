<template>
  <CrudManager
    title="足迹"
    subtitle="前台「足迹」页的地图标记。经纬度填错时，地图上的点会跑到别处"
    primary-key="place"
    :fields="fields"
    :api="adminApi.footprints"
    :search-keys="['place', 'description']"
    empty-text="还没有足迹，点右上角新建"
  />
</template>

<script setup lang="ts">
import CrudManager, { type FieldDef } from '@/components/admin/CrudManager.vue'
import { adminApi } from '@/api/admin'

const fields: FieldDef[] = [
  { key: 'place', label: '地点', required: true, placeholder: '杭州·西湖' },
  {
    key: 'lat',
    label: '纬度 lat',
    type: 'number',
    step: 0.000001,
    min: -90,
    max: 90,
    required: true,
    hint: '北纬为正，例如杭州 30.2741',
  },
  {
    key: 'lng',
    label: '经度 lng',
    type: 'number',
    step: 0.000001,
    min: -180,
    max: 180,
    required: true,
    hint: '东经为正，例如杭州 120.1551',
  },
  { key: 'date', label: '日期', type: 'date', required: true },
  { key: 'photo', label: '照片', type: 'image' },
  { key: 'description', label: '描述', type: 'textarea', placeholder: '那天发生了什么' },
]
</script>
