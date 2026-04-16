import request from '../utils/request';

// 2. 将关于“用户”的所有请求，都在这里定义好并导出
export const userApi = {
  // 命名一个顾名思义的方法：登录
  login(loginData: any) {
    console.log('📝 专职点菜员：收到 Login.vue 客人的点菜需求，正前往服务台提交...');
    
    // 告诉 request 服务台：我要发一个 POST 请求，去后厨的 /login 窗口，顺便把客人填的账号密码（数据）带上
    // 注意：这里的 URL 是 '/api/auth/login'，它会自动被 request 基础配置拼成 'http://localhost:8080/api/auth/login'
    return request.post('/api/auth/login', loginData);
  },

  //获取用户信息
  getCurrentUser() {
    console.log('📝 专职点菜员：收到 Home.vue 客人的点菜需求，正前往服务台提交...');
    return request.get('/api/auth/me');
  }
}