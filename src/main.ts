import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' 
// 🌟 引入状态管理（公司物资总库）
import { createPinia } from 'pinia' 

const app = createApp(App)

app.use(createPinia()) // 告诉老板，公司现在多了一个总库体系！
app.use(router) 
app.mount('#app')
