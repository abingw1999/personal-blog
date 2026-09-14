<template>
  <div class="admin-login">
    <div class="login-card card">
      <div class="text-center mb-6">
        <img :src="config.avatar" alt="" class="login-avatar" />
        <h1 class="text-xl font-bold mt-3">{{ config.siteName }}</h1>
        <p class="text-sm text-[var(--color-text-muted)]">后台管理</p>
      </div>

      <form @submit.prevent="submit">
        <label class="field-label" for="username">用户名</label>
        <input
          id="username"
          v-model.trim="username"
          class="field"
          autocomplete="username"
          placeholder="admin"
        />

        <label class="field-label mt-4" for="password">密码</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="field"
          autocomplete="current-password"
          placeholder="••••••"
        />

        <p v-if="error" class="error-box mt-4">{{ error }}</p>

        <button type="submit" class="btn-primary w-full mt-6" :disabled="loading">
          {{ loading ? '登录中…' : '登 录' }}
        </button>
      </form>

      <router-link
        to="/"
        class="block text-center text-sm mt-6 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
      >
        ← 返回前台
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { siteConfig } from '@/config/site'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const config = siteConfig

const username = ref('admin')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  if (!username.value || !password.value) {
    error.value = '请填写用户名和密码'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await auth.login(username.value, password.value)
    // 登录前想去的页面（被守卫拦下来的那个），登录后送回去
    const redirect = route.query.redirect
    router.replace(typeof redirect === 'string' ? redirect : '/admin')
  } catch (e) {
    error.value = e instanceof Error ? e.message : '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--color-bg);
}
.login-card {
  width: 100%;
  max-width: 22rem;
  padding: 2rem;
}
.login-avatar {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 999px;
  object-fit: cover;
  background: var(--color-primary-light);
  margin: 0 auto;
  display: block;
}
.field-label {
  display: block;
  font-size: 0.8125rem;
  color: var(--color-text-light);
  margin-bottom: 0.375rem;
}
.field {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.2s ease;
}
.field:focus {
  border-color: var(--color-primary);
}
.error-box {
  font-size: 0.8125rem;
  color: #d64545;
  background: rgba(214, 69, 69, 0.08);
  border: 1px solid rgba(214, 69, 69, 0.25);
  border-radius: 0.625rem;
  padding: 0.5rem 0.75rem;
}
</style>
