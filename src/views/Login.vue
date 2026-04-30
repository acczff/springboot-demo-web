<script setup lang="ts">
import { ref } from 'vue';
import router from '../router';
import { useUserStore } from '../store/user';
import { userApi } from '../api/user';
import { validateLoginForm } from '../utils/validate';

const userStore = useUserStore();
const loginForm = ref({
  account: '',
  password: ''
});
const isLoading = ref(false);
const errorMsg = ref('');

const handleLogin = async () => {
  
  //验证表单
  const error = validateLoginForm(loginForm.value.account, loginForm.value.password);
  if (error) {
    errorMsg.value = error;
    return;
  }

  // 初筛通过，开始真正的请求
  isLoading.value = true;
  try {
    const res: any = await userApi.login({
      account: loginForm.value.account,
      password: loginForm.value.password
    });

    const token = res.token;
    const username = res.username || loginForm.value.account;

    localStorage.setItem('token', token);
    userStore.setUsername(username);

    router.push('/home');
  } catch (error) {
    errorMsg.value = String(error);
  } finally {
    isLoading.value = false;
  }
}

</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">🛠️</div>
      <h2 class="login-title">学习系统后台</h2>
      <p class="login-subtitle">请登录您的账号</p>

      <p v-if="errorMsg" class="error-tip">{{ errorMsg }}</p>

      <div class="form-item">
        <label>用户名</label>
        <input v-model="loginForm.account" type="text" placeholder="请输入用户名" />
      </div>
      <div class="form-item">
        <label>密码</label>
        <input v-model="loginForm.password" type="password" placeholder="请输入密码" />
      </div>

      <button class="login-btn" @click.prevent="handleLogin" :disabled="isLoading">
        <span v-if="isLoading">登录中...</span>
        <span v-else>登 录</span>
      </button>

      <p class="login-footer">© 2026 学习系统</p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  background: #fff;
  border-radius: 12px;
  padding: 48px 40px;
  width: 380px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.login-logo {
  font-size: 40px;
  text-align: center;
  margin-bottom: 12px;
}

.login-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin: 0 0 6px;
}

.login-subtitle {
  font-size: 14px;
  color: #999;
  text-align: center;
  margin: 0 0 32px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.form-item input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.2s;
  outline: none;
}

.form-item input:focus {
  border-color: #1677ff;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

.login-btn {
  width: 100%;
  padding: 11px;
  background: #1677ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}

.login-btn:hover:not(:disabled) {
  background: #4096ff;
}

.login-btn:disabled {
  background: #a0c4ff;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  font-size: 12px;
  color: #bbb;
  margin-top: 24px;
  margin-bottom: 0;
}

.error-tip {
  color: #ff4d4f;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 20px;
  font-size: 13px;
}
</style>