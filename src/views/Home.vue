<script setup lang="ts">
import UserCard from '../components/userCard.vue';
import { useUserStore } from '../store/user';
import { onMounted } from 'vue';
import { userApi } from '../api/user';

// 这里以后放老板看员工的逻辑

const userStore = useUserStore();

const fetchCurrentUser = async () => {
    try {
        const res: any = await userApi.getCurrentUser();
        console.log('老板：拿到用户信息 ->', res);
        userStore.setUsername(res.username);
    } catch (error) {
        console.error('老板：获取用户信息失败 ->', error);
    }
}

onMounted(() => {
    console.log('老板：我来查看员工了！');
    fetchCurrentUser();
})

</script>

<template>
  <div style="text-align: center; margin-top: 100px;">
    <h1>🏢 公司大厅（主页）</h1>
    <p>欢迎回来，{{ userStore.username }} 大老板！</p>
  </div>
  <UserCard 
    v-for="(employee, index) in userStore.employeeList" 
    :key="index" 
    :name="employee.name" 
    :age="employee.age"
    @grow-up="() => userStore.growUpEmployee(index)"
    >
  </UserCard>

</template>