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
    console.log('📝 专职点菜员：getCurrentUser');
    return request.get('/api/auth/me');
  },

  // 获取用户列表（支持分页和关键词搜索）
  getUserList(pageNum: number, pageSize: number, keyword: string) {
    console.log('📝 专职点菜员：getUserList');
    return request.get('/api/users', { params: { pageNum, pageSize, keyword } });
  },

  // 新增用户
  createUser(data: any) {
    console.log('📝 专职点菜员：createUser');
    return request.post('/api/users', data);
  },

  // 编辑用户
  updateUser(id: number, data: any) {
    console.log('📝 专职点菜员：updateUser');
    return request.put(`/api/users/${id}`, data);
  },

  // 获取菜单树（用于侧边栏动态渲染）
  getMenuList() {
    console.log('📝 专职点菜员：getMenuList');
    return request.get('/api/menus');
  },

  // 获取所有权限列表
  getPermissionList() {
    console.log('📝 专职点菜员：getPermissionList');
    return request.get('/api/permissions');
  },

  // 获取角色列表
  getRoleList() {
    console.log('📝 专职点菜员：getRoleList');
    return request.get('/api/roles');
  },

  // 新增角色
  createRole(data: any) {
    console.log('📝 专职点菜员：createRole');
    return request.post('/api/roles', data);
  },

  // 查询角色的权限列表
  getRolePermissions(roleId: number) {
    console.log('📝 专职点菜员：getRolePermissions');
    return request.get(`/api/roles/${roleId}/permissions`);
  },

  // 分配权限给角色
  assignRolePermissions(roleId: number, permissionIds: number[]) {
    console.log('📝 专职点菜员：assignRolePermissions');
    return request.put(`/api/roles/${roleId}/permissions`, permissionIds);
  },

  // 查询用户角色
  getUserRoles(userId: number) {
    console.log('📝 专职点菜员：getUserRoles');
    return request.get(`/api/users/${userId}/roles`);
  },
  
  // 绑定用户角色
  assignUserRoles(userId: number, roleIds: number[]) {
    console.log('📝 专职点菜员：assignUserRoles');
    return request.put(`/api/users/${userId}/roles`, roleIds);
  },
}