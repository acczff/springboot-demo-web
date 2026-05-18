import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' 
// 🌟 引入状态管理（公司物资总库）
import { createPinia } from 'pinia' 
import { useUserStore } from './store/user'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// 刷新后从 localStorage 恢复用户基本信息
const userStore = useUserStore()
const savedUserId = localStorage.getItem('userId')
const savedUsername = localStorage.getItem('username')
if (savedUserId) userStore.setUserId(Number(savedUserId))
if (savedUsername) userStore.setUsername(savedUsername)

app.mount('#app')
