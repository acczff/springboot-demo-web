# springboot-web 前端项目

> **更新日期**: 2026-05-07  
> **版本**: v2.0.0

个人学习全栈开发过程中，使用 Vue 3 + TypeScript 构建的后台管理系统前端，对接 Spring Boot 后端，实现了完整的 RBAC 权限管理功能。

## 功能清单

- ✅ 登录 / 退出（Token 存储 + 路由守卫）
- ✅ 首页（当前用户信息展示）
- ✅ 用户管理（列表分页+搜索、新增、编辑、分配角色）
- ✅ 角色管理（列表、新增、分配权限）
- ✅ 动态侧边栏菜单（从后端拉取，可折叠展开）
- ✅ 统一请求封装（Axios 拦截器，自动附带 Token）
- ✅ 全局路由守卫（未登录跳转登录页）
- ✅ 表单单元测试（Vitest）

## 技术栈

- **框架**: Vue 3 + TypeScript + Vite
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **HTTP**: Axios（已封装拦截器）
- **单元测试**: Vitest

## 启动步骤

```bash
# 安装依赖
npm install

# 启动开发服务器（需要后端同时运行在 localhost:8080）
npm run dev

# 运行单元测试
npm test
```

## 目录结构

```
src/
├── api/
│   └── user.ts          # 所有后端 API 调用（登录/用户/角色/权限/菜单）
├── layouts/
│   └── MainLayout.vue   # 主布局（动态侧边栏 + Header + 路由出口）
├── router/
│   └── index.ts         # 路由配置 + 全局路由守卫
├── store/
│   └── user.ts          # 用户全局状态（Pinia）
├── utils/
│   ├── request.ts       # Axios 封装（baseURL + 拦截器）
│   └── validate.ts      # 表单校验纯函数
└── views/
    ├── Login.vue         # 登录页
    ├── Home.vue          # 首页
    ├── Users.vue         # 用户管理页（分页+搜索+弹窗+分配角色）
    └── Roles.vue         # 角色管理页（列表+分配权限）
```

## 与后端对接说明

- 后端地址：`http://localhost:8080`
- 所有请求通过 `src/utils/request.ts` 统一发出，自动在 Header 携带 `token`
- 响应拦截器自动解包 `res.data`，组件内直接使用数据，无需手动 `.data`
- Token 存储在 `localStorage`，刷新后自动恢复登录状态

## 测试账号

| 用户名 | 密码 | 权限 |
|--------|------|------|
| admin | 123456 | 全部功能 |
