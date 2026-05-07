<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from './store/user';
import { userApi } from './api/user';
import { setupDynamicRoutes } from './utils/permission';

const userStore = useUserStore();

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (token && !userStore.username) {
    try {
      const res: any = await userApi.getCurrentUser()
      userStore.setUsername(res.username)
      userStore.setRoles(res.roles || [])
      const menuRes: any = await userApi.getMenuList()
      await setupDynamicRoutes(menuRes)
    } catch {
      // token 失效，拦截器会自动跳登录页
    }
  }
});
</script>

<template>
  <router-view></router-view>
</template>
