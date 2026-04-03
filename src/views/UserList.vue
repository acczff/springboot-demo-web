<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/api/request'

const router = useRouter()

// 用户列表数据
const userList = ref([])

// 加载状态
const loading = ref(true)

// 错误信息
const errorMsg = ref('')

// 获取用户列表
const fetchUserList = async () => {
  try {
    loading.value = true
    const res = await request.get('/api/users')
    
    if (res.code === 200) {
      userList.value = res.data
    } else {
      errorMsg.value = res.message || '获取用户列表失败'
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    errorMsg.value = '获取用户列表失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await request.post('/api/auth/logout')
    // 清除 token
    localStorage.removeItem('token')
    // 跳转到登录页
    router.push('/Login')
  } catch (error) {
    console.error('退出失败:', error)
    alert('退出失败')
  }
}

// 页面加载时获取用户列表
onMounted(() => {
  fetchUserList()
})
</script>

<template>
  <div class="user-list-container">
    <!-- 头部 -->
    <div class="header">
      <h2>用户列表</h2>
      <button @click="handleLogout" class="logout-btn">退出登录</button>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      加载中...
    </div>
    
    <!-- 错误信息 -->
    <div v-else-if="errorMsg" class="error-msg">
      {{ errorMsg }}
    </div>
    
    <!-- 用户列表 -->
    <div v-else class="user-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in userList" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
          </tr>
        </tbody>
      </table>
      
      <!-- 空状态 -->
      <div v-if="userList.length === 0" class="empty-state">
        暂无用户数据
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-list-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.header h2 {
  color: #333;
  margin: 0;
}

.logout-btn {
  padding: 8px 16px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #e74c3c;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-msg {
  background-color: #fef0f0;
  color: #f56c6c;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
}

.user-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f5f7fa;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 600;
  color: #666;
}

tr:hover {
  background-color: #f5f7fa;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>