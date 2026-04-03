<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/api/request'

const router = useRouter()

// 表单数据
const loginForm = ref({
  account: '',
  password: ''
})

// 错误提示
const errorMsg = ref('')

// 加载状态 ← 新增
const loading = ref(false)

// 登录方法
const handleLogin = async () => {
  // 1. 表单验证
  if (!loginForm.value.account || loginForm.value.account.trim() === '') {
    errorMsg.value = '请输入用户名'
    return
  }
  
  if (!loginForm.value.password || loginForm.value.password.length < 6) {
    errorMsg.value = '密码至少 6 位'
    return
  }
  
  // 2. 清空错误提示
  errorMsg.value = ''
  
  try {
    // 3. 设置加载中
    loading.value = true
    
    // 4. 发送登录请求
    const res = await request.post('/api/auth/login', loginForm.value)
    
    // 5. 检查响应
    if (res.code === 200) {
      // 6. 保存 token 到 localStorage
      localStorage.setItem('token', res.data.token)
      
      // 7. 跳转到用户列表页
      router.push('/UserList')  // 注意：改成小写，与路由配置一致
    } else if (res.code === 401) {
      // 8. 区分认证错误
      if (res.message && res.message.includes('帐号')) {
        errorMsg.value = '账号不存在'
      } else if (res.message && res.message.includes('密码')) {
        errorMsg.value = '密码错误'
      } else {
        errorMsg.value = res.message || '登录失败'
      }
    } else {
      // 9. 其他错误
      errorMsg.value = res.message || '登录失败'
    }
  } catch (error) {
    // 10. 网络错误
    console.error('登录失败:', error)
    errorMsg.value = '网络错误，请稍后重试'
  } finally {
    // 11. 关闭加载状态
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">用户登录</h2>
      
      <!-- 错误提示 -->
      <div v-if="errorMsg" class="error-msg">
        {{ errorMsg }}
      </div>
      
      <!-- 登录表单 -->
      <form @submit.prevent="handleLogin">
        <div class="form-item">
          <label>用户名：</label>
          <input 
            v-model="loginForm.account" 
            type="text" 
            placeholder="请输入用户名"
            required
          />
        </div>
        
        <div class="form-item">
          <label>密码：</label>
          <input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
            required
          />
        </div>
        
        <button 
          type="submit" 
          class="login-btn"
          :disabled="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.login-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  color: #666;
}

.form-item input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-item input:focus {
  border-color: #42b983;
  outline: none;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #369970;
}

.login-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-btn:disabled:hover {
  background-color: #ccc;
}

.error-msg {
  background-color: #fef0f0;
  color: #f56c6c;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}
</style>