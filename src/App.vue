<script setup>
// 不需要导入 HelloWorld 了
</script>

<template>
  <!-- 路由出口：路由匹配的组件会渲染在这里 -->
  <router-view />
</template>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>