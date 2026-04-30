<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from './store/user';
import { userApi } from './api/user';

const userStore = useUserStore();

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (token && !userStore.username) {
    try {
      const res: any = await userApi.getCurrentUser();
      userStore.setUsername(res.username);
    } catch {
      // token 失效，拦截器会自动跳登录页
    }
  }
});
</script>

<template>
  <router-view></router-view>
</template>

