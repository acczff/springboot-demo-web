<script setup lang="ts">
import { useUserStore } from '../store/user';
import { onMounted, ref } from 'vue';
import { userApi } from '../api/user';
import router from '../router';

const userStore = useUserStore();
const menuList = ref<any[]>([]);
const expandedMenus = ref<Set<number>>(new Set());

const toggleMenu = (id: number) => {
  if (expandedMenus.value.has(id)) {
    expandedMenus.value.delete(id);
  } else {
    expandedMenus.value.add(id);
  }
  // 触发响应式更新
  expandedMenus.value = new Set(expandedMenus.value);
};

onMounted(async () => {
  const res: any = await userApi.getMenuList();
  menuList.value = res;
  // 默认不展开
});

const handleLogout = () => {
  localStorage.removeItem('token');
  userStore.setUsername('');
  router.push('/login');
};
</script>

<template>
  <div class="layout">
    <!-- 顶部 Header -->
    <header class="layout-header">
      <span class="header-logo">🛠️ 学习系统后台</span>
      <div class="header-right">
        <span class="header-username">{{ userStore.username || '用户' }}</span>
        <button class="logout-btn" @click="handleLogout">退出</button>
      </div>
    </header>

    <div class="layout-body">
      <!-- 左侧 Sidebar -->
      <aside class="layout-sidebar">
        <nav>
          <router-link to="/home" class="nav-item">
            <span class="nav-icon">🏠</span> 首页
          </router-link>
          <!-- 动态菜单：一级菜单 -->
          <div v-for="menu in menuList" :key="menu.id" class="nav-group">
            <div class="nav-group-title" @click="toggleMenu(menu.id)">
              <span><span class="nav-icon">📁</span> {{ menu.name }}</span>
              <span class="nav-arrow" :class="{ expanded: expandedMenus.has(menu.id) }">▶</span>
            </div>
            <!-- 二级菜单 -->
            <div v-show="expandedMenus.has(menu.id)">
              <router-link
                v-for="child in menu.children"
                :key="child.id"
                :to="child.path"
                class="nav-item nav-item-child"
              >
                {{ child.name }}
              </router-link>
            </div>
          </div>
        </nav>
      </aside>

      <!-- 中间内容区 -->
      <main class="layout-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f0f2f5;
}

.layout-header {
  height: 56px;
  background: #001529;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
}

.header-logo {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-username {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);
}

.logout-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.75);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  border-color: #fff;
  color: #fff;
}

.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.layout-sidebar {
  width: 220px;
  background: #001529;
  padding: 12px 0;
  flex-shrink: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
}

.nav-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.nav-item.router-link-active {
  color: #fff;
  background: #1677ff;
}

.nav-icon {
  font-size: 16px;
}

.nav-group {
  margin-top: 8px;
}

.nav-group-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}

.nav-group-title:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.nav-arrow {
  font-size: 10px;
  transition: transform 0.2s;
  display: inline-block;
}

.nav-arrow.expanded {
  transform: rotate(90deg);
}

.nav-item-child {
  padding-left: 32px;
  font-size: 13px;
}

.layout-content {
  flex: 1;
  overflow-y: auto;
  background: #f0f2f5;
}
</style>