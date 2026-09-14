import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)

/**
 * token 过期统一跳登录。
 * 由 src/api/index.ts 在收到 401/403 时广播 —— 那边不能直接调 router，
 * 否则 api 和 router 会互相 import。
 */
window.addEventListener('auth:expired', () => {
  if (router.currentRoute.value.meta.admin) {
    router.replace({
      name: 'admin-login',
      query: { redirect: router.currentRoute.value.fullPath },
    })
  }
})

app.mount('#app')
