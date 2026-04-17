# springboot-web 前端项目

## 项目简介

个人学习全栈开发过程中，使用 Vue 3 和 Spring Boot 构建的一个简单的前端项目。该项目主要用于展示如何与后端 API 进行交互，并实现基本的用户认证和数据展示功能。

## 技术栈

- Vue 3 + TypeScript
- Vue Router — 用于管理前端路由，实现页面间的导航
- Pinia — 用于状态管理，集中管理应用的全局状态
- Axios — 用于发送 HTTP 请求，与后端 API 进行交互
- Vitest — 用于单元测试，确保代码功能正确

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

```bash
src/
├── api/        # 存放与后端 API 交互的模块
├── components/ # 存放可复用的 Vue 组件
├── router/     # 存放路由配置文件
├── store/      # 共享状态管理（Pinia）相关文件
├── utils/      # 存放工具函数和辅助模块
└── views/      # 存放页面级组件
```

## 主要功能

```bash
登录：
Login.vue 页面使用 Axios 向后端api/auth/login 发送登录请求，获取 token 和 username，使用 localStorage.setItem('token', token); 存储 token，使用 Pinia 的 userStore保存 username 共享给其他组件。
Home.vue  页面在 onMounted 生命周期钩子中调用 userApi.getCurrentUser() 获取当前用户信息，并将其存储在 Pinia 的 userStore 中，供其他组件使用。
```