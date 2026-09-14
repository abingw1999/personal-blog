import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: Number(process.env.DEPLOY_RUN_PORT) || 5000,
    host: '0.0.0.0',
    // 本地开发时把 /api 转发到后端服务
    // 生产环境不需要这段：nginx 会把 /api 反向代理到 backend:8080
    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
