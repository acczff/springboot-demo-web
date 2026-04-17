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

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户登录</title>
  </head>

  <body>
    <header>
      <h1>用户登录</h1>
    </header>
    <main>
      <p v-if="errorMsg" class="error-tip">{{ errorMsg }}</p>
      <form id="loginForm">
        <div>
          <label for="username">用户名：</label>
          <input v-model="loginForm.account" type="text" id="username" name="username" required placeholder="请输入用户名">
        </div>
        <div>
          <label for="password">密码：</label>
          <input v-model="loginForm.password" type="password" id="password" name="password" required
            placeholder="请输入密码">
        </div>
        <!-- <div>
          <input type="checkbox" id="remember" name="remember">
          <label for="remember">记住密码</label>
        </div> -->
        <div>
          <button type="submit" id="loginbtn" @click.prevent="handleLogin" :disabled="isLoading">
            <span v-if="isLoading">登录中...</span>
            <span v-else>登录</span>
          </button>
        </div>
      </form>
    </main>
    <footer>
      <p>2026 学习系统</p>
    </footer>
  </body>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

main {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

form div {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

input[type="text"],
input[type="password"],
input[type="email"],
input[type="tel"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type="text"]:focus,
input[type="password"]:focus,
input[type="email"]:focus,
input[type="tel"]:focus {
  outline: none;
  border-color: #007bff;
}

/* 8. 复选框样式 */
input[type="checkbox"] {
  margin-right: 8px;
}

/* 复选框的 label 改为行内显示 */
input[type="checkbox"]+label {
  display: inline;
  font-weight: normal;
}

/* 9. 按钮样式 */
button {
  width: 100%;
  padding: 12px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* 按钮悬停效果 */
button[type="submit"]:hover {
  background-color: #40a9ff;
}

/* 10. 页脚样式 */
footer {
  text-align: center;
  margin-top: 20px;
  color: #999;
  font-size: 12px;
}

.error-tip {
  color: #ff4d4f;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 16px;
  font-size: 14px;
}
</style>