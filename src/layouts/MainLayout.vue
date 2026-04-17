<script setup lang="ts">

</script>

<template>
    <div class="layout">
        <!-- 顶部 Header -->
        <header class="layout-header">
            <span>学习系统后台</span>
        </header>

        <div class="layout-body">
            <!-- 左侧 Sidebar -->
            <aside class="layout-sidebar">
                <ul>
                    <li>首页</li>
                    <li>用户管理</li>
                </ul>
            </aside>

            <!-- 中间内容区：router-view 放在这里 -->
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
}

.layout-header {
    height: 60px;
    background-color: #333;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
}

.layout-body {
    display: flex;
    flex: 1;
}

.layout-sidebar {
    width: 200px;
    background-color: #f4f4f4;
}

.layout-content {
    flex: 1;
    padding: 20px;
}
</style>