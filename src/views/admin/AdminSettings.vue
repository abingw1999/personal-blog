<template>
  <section>
    <header class="head">
      <div>
        <h2 class="head__title">设置</h2>
        <p class="head__sub">账号安全与站点信息</p>
      </div>
    </header>

    <div class="cols">
      <!-- 修改密码 -->
      <div class="panel">
        <h3 class="panel__title">修改登录密码</h3>
        <form @submit.prevent="changePassword">
          <label class="label" for="old">当前密码</label>
          <input id="old" v-model="oldPassword" type="password" class="input" autocomplete="current-password" />

          <label class="label mt" for="new">新密码</label>
          <input id="new" v-model="newPassword" type="password" class="input" autocomplete="new-password" />
          <p class="hint">至少 6 位。改完请自己记牢——这个系统没有找回密码功能。</p>

          <label class="label mt" for="confirm">确认新密码</label>
          <input id="confirm" v-model="confirmPassword" type="password" class="input" autocomplete="new-password" />

          <p v-if="pwError" class="banner banner--error mt">{{ pwError }}</p>
          <p v-if="pwOk" class="banner banner--ok mt">{{ pwOk }}</p>

          <button type="submit" class="btn-primary mt" :disabled="saving">
            {{ saving ? '提交中…' : '更新密码' }}
          </button>
        </form>
      </div>

      <!-- 账号信息 -->
      <div class="panel">
        <h3 class="panel__title">当前账号</h3>
        <ul class="info">
          <li><span>用户名</span><strong>{{ profile?.username || '—' }}</strong></li>
          <li><span>昵称</span><strong>{{ profile?.nickname || '—' }}</strong></li>
          <li><span>状态</span><strong>{{ profile?.enabled ? '正常' : '已停用' }}</strong></li>
          <li><span>登录令牌</span><strong>JWT，有效期 24 小时</strong></li>
        </ul>
        <button class="btn-ghost mt" @click="doLogout">退出登录</button>
      </div>
    </div>

    <!-- 不能在这里改的东西，说清楚去哪改 -->
    <div class="panel mt">
      <h3 class="panel__title">这些设置不在后台，改文件更合适</h3>
      <ul class="notes">
        <li>
          <strong>站点名 / 头像 / 标语 / 公告 / 社交链接 / 是否开启橱窗</strong>
          <span>改 <code>src/config/site.ts</code>，然后 <code>docker compose up -d --build frontend</code>。</span>
        </li>
        <li>
          <strong>后台账号名</strong>
          <span>直接改数据库 <code>admin_users</code> 表（当前后台只支持改密码）。</span>
        </li>
        <li>
          <strong>数据库连接 / JWT 密钥</strong>
          <span>改服务器上的 <code>.env</code>，然后 <code>docker compose up -d --build backend</code>。</span>
        </li>
        <li>
          <strong>图片上传目录</strong>
          <span>由 <code>file.upload-path</code> 决定，容器里是 <code>/app/uploads</code>（Docker 卷）。</span>
        </li>
      </ul>
    </div>

    <div class="panel mt">
      <h3 class="panel__title">这个后台能管什么</h3>
      <div class="grid">
        <div>
          <h4>内容</h4>
          <p>文章（写 / 改 / 删 / 设为精选）、留言（审核 / 驳回 / 回复 / 删除）、建站日记</p>
        </div>
        <div>
          <h4>展示</h4>
          <p>收藏单（书 / 影 / 游戏）、Now 状态、足迹、徽章</p>
        </div>
        <div>
          <h4>站点</h4>
          <p>友情链接、橱窗商品、音乐播放列表</p>
        </div>
        <div>
          <h4>其他</h4>
          <p>图片上传（文章封面 / 各种插图，最大 5MB）、修改密码</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminApi } from '@/api/admin'
import { useAuthStore } from '@/stores/auth'
import type { AdminProfile } from '@/types'

const auth = useAuthStore()
const router = useRouter()

const profile = ref<AdminProfile | null>(null)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const saving = ref(false)
const pwError = ref('')
const pwOk = ref('')

async function changePassword() {
  pwError.value = ''
  pwOk.value = ''
  if (!oldPassword.value || !newPassword.value) {
    pwError.value = '请填写当前密码和新密码'
    return
  }
  if (newPassword.value.length < 6) {
    pwError.value = '新密码至少 6 位'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    pwError.value = '两次输入的新密码不一致'
    return
  }

  saving.value = true
  try {
    await adminApi.changePassword(oldPassword.value, newPassword.value)
    pwOk.value = '密码已更新。下次登录请用新密码。'
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (e) {
    pwError.value = e instanceof Error ? e.message : '修改失败'
  } finally {
    saving.value = false
  }
}

function doLogout() {
  auth.logout()
  router.replace('/admin/login')
}

onMounted(async () => {
  try {
    profile.value = await adminApi.profile()
  } catch {
    // 拿不到就不显示，不影响改密码
  }
})
</script>

<style scoped>
.head {
  margin-bottom: 1rem;
}
.head__title {
  font-size: 1.125rem;
  font-weight: 600;
}
.head__sub {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}
.cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1rem;
}
.panel {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.25rem;
}
.panel__title {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 0.875rem;
}
.mt {
  margin-top: 1rem;
}
.label {
  display: block;
  font-size: 0.8125rem;
  color: var(--color-text-light);
  margin-bottom: 0.375rem;
}
.hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.375rem;
}
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.625rem;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.875rem;
  outline: none;
}
.input:focus {
  border-color: var(--color-primary);
}
.banner {
  font-size: 0.8125rem;
  border-radius: 0.625rem;
  padding: 0.5rem 0.75rem;
}
.banner--error {
  color: #d64545;
  background: rgba(214, 69, 69, 0.08);
  border: 1px solid rgba(214, 69, 69, 0.25);
}
.banner--ok {
  color: #2e7d4f;
  background: rgba(46, 125, 79, 0.08);
  border: 1px solid rgba(46, 125, 79, 0.25);
}
.info {
  list-style: none;
  font-size: 0.875rem;
}
.info li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}
.info li:last-child {
  border-bottom: none;
}
.info span {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}
.notes {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.8125rem;
}
.notes li {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}
.notes span {
  color: var(--color-text-muted);
  line-height: 1.7;
}
code {
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 0.05rem 0.3rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
  gap: 1rem;
}
.grid h4 {
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.grid p {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  line-height: 1.7;
}
.btn-ghost {
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-light);
  cursor: pointer;
  font-size: 0.875rem;
}
</style>
