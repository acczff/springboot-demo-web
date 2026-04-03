# Springboot Demo Web

一个基于 Vue 3 + Vite + Vue Router 的前端项目，与 Springboot 后端服务配套使用。

## 项目功能

- 🔐 用户登录/登出
- 📋 用户列表展示
- 🎯 前后端分离架构
- 🔄 HTTP 请求拦截与处理

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Vue Router 4** - 路由管理
- **Axios** - HTTP 客户端
- **Pinia** - 状态管理
- **ES Module** - 现代模块系统

## 项目结构

```
src/
├── components/     # 可复用组件
├── router/        # 路由配置
├── views/         # 页面组件
│   ├── Login.vue     # 登录页
│   └── UserList.vue  # 用户列表页
├── api/           # 接口请求
│   └── request.js    # Axios 配置与拦截
├── App.vue        # 根组件
├── main.js        # 入口文件
└── style.css      # 全局样式
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

开发服务器地址：`http://localhost:5173/`

### 3. 生产构建

```bash
npm run build
```

### 4. 预览构建结果

```bash
npm run preview
```

## 后端服务配置

项目已配置代理，所有 `/api` 请求会转发到后端服务：

```
http://localhost:8080
```

在 `vite.config.js` 中可修改代理配置。

## 相关仓库

- [Springboot Demo 后端](https://github.com/acczff/springboot-demo.git)

## License

MIT
