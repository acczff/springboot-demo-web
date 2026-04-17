import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import MainLayout from '../layouts/MainLayout.vue'

// 这里的配置就是“交通调度员”的规则本
const router = createRouter({
  
  history: createWebHistory(), 
  routes: [
    { path: '/', redirect: '/login' }, 
    { path: '/login', component: Login }, 
    { 
      path: '/', 
      component: MainLayout,
      children: [ 
        { path: 'home', component: Home }
      ]
    }    
  ]

})

// 🌟 新增：公司的“门禁安保系统”（全局路由守卫）
router.beforeEach((to, _from, next) => {
  // to: 你要去哪个房间？
  // from: 你从哪个房间来？
  // next: 保安按下的放行按钮（必须调用，不然就会卡在过道里看到白屏）

  if (to.path === '/home') {
    // 如果想进总部大厅查生死簿，保安要查“工牌”（这里我们先去浏览器的本地存储里找 token）
    const hasBadge = localStorage.getItem('token'); 
    
    if (hasBadge) {
      next(); // 检测到工牌，放行！
    } else {
      next('/login'); // 没工牌，一脚踢回登录页
    }
  } else {
    // 如果是去不用权限的地方（比如本来就是去 /login），直接放行
    next();
  }
})

export default router