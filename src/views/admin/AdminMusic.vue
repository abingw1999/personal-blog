<template>
  <CrudManager
    title="音乐"
    subtitle="前台左下角的全站音乐播放器"
    primary-key="title"
    :fields="fields"
    :api="adminApi.music"
    :search-keys="['title', 'artist']"
    empty-text="还没有曲目，点右上角新建"
  />
</template>

<script setup lang="ts">
import CrudManager, { type FieldDef } from '@/components/admin/CrudManager.vue'
import { adminApi } from '@/api/admin'

const fields: FieldDef[] = [
  { key: 'title', label: '曲名', required: true },
  { key: 'artist', label: '艺术家', placeholder: '可留空' },
  {
    key: 'url',
    label: '音频地址',
    required: true,
    full: true,
    placeholder: 'https://…/song.mp3',
    hint: '需要是可直接播放的音频直链（mp3 / m4a），外链音乐站点的分享页地址不能直接播',
  },
  { key: 'cover', label: '封面', type: 'image' },
  { key: 'sortOrder', label: '排序', type: 'number', min: 0, width: '5rem' },
  { key: 'enabled', label: '启用', type: 'switch', onText: '播放列表中', offText: '已隐藏', width: '7rem' },
]
</script>
