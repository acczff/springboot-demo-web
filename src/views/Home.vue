<script setup lang="ts">
import { useUserStore } from '../store/user';
import { onMounted } from 'vue';
import { userApi } from '../api/user';

const userStore = useUserStore();

const fetchCurrentUser = async () => {
    try {
        const res: any = await userApi.getCurrentUser();
        userStore.setUsername(res.username);
    } catch (error) {
        console.error('获取用户信息失败 ->', error);
    }
}

onMounted(() => {
    fetchCurrentUser();
})
</script>

<template>
  <div class="home-page">
    <div class="welcome-card">
      <div class="welcome-icon">👋</div>
      <h2 class="welcome-title">欢迎回来，{{ userStore.username || '用户' }}</h2>
      <p class="welcome-sub">今天也是充实学习的一天</p>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-label">用户管理</div>
        <div class="stat-desc">查看和管理系统用户</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-label">功能待开发</div>
        <div class="stat-desc">更多模块即将上线</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔐</div>
        <div class="stat-label">权限管理</div>
        <div class="stat-desc">RBAC 权限体系（阶段5）</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding: 24px;
}

.welcome-card {
  background: linear-gradient(135deg, #1677ff, #0958d9);
  border-radius: 12px;
  padding: 36px 32px;
  color: #fff;
  margin-bottom: 24px;
}

.welcome-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.welcome-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
}

.welcome-sub {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #e8e8e8;
  transition: box-shadow 0.2s;
}

.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  font-size: 28px;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.stat-desc {
  font-size: 13px;
  color: #999;
}
</style>