<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { workorderApi } from '../api/workorder';


const workOrdersList = ref<any[]>([]);
const pageNum = ref(1)      // 当前第几页
const pageSize = ref(10)    // 每页几条
const total = ref(0)        // 总条数（从后端拿到后存起来）
const totalPages = computed(() => Math.ceil(total.value / pageSize.value)); // 总页数（计算属性，根据 total 和 pageSize 计算得出）
const workOrderStatus = ref(''); // 工单状态筛选条件

onMounted(
    () => {
        loadWorkOrdersList()
    }
);
// 加载工单列表
const loadWorkOrdersList = async () => {
    const res: any = await workorderApi.getWorkOrdersList(pageNum.value, pageSize.value, workOrderStatus.value);
    workOrdersList.value = res.list;
    total.value = res.total;
}
//翻页
const goToPage = (page: number) => {
  // 1. 边界检查：page 不能小于 1，不能大于 totalPages
  if (page < 1 || page > totalPages.value) {
    return;
  }
  pageNum.value = page;
  loadWorkOrdersList();
}
</script>

<template>
    <div class="page">
        <!-- 页头 -->
        <div class="page-header">
            <h2 class="page-title">工单管理</h2>
        </div>
        <!-- 搜索栏 -->
        
        <!-- 表格 -->
        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>状态</th>
                        <th>创建人ID</th>
                        <th>创建时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="workOrder in workOrdersList" :key="workOrder.id">
                        <td>{{ workOrder.id }}</td>
                        <td>{{ workOrder.status }}</td>
                        <td>{{ workOrder.createdBy }}</td>
                        <td>{{ workOrder.createdTime }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination">
            <span>总数为： {{ total }} 条</span>
            <button @click="goToPage(pageNum - 1)" :disabled="pageNum === 1">上一页</button>
            <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
                :class="{ 'page-active': page === pageNum }">{{ page }}</button>
            <button @click="goToPage(pageNum + 1)" :disabled="pageNum === totalPages">下一页</button>
            <span>第 {{ pageNum }} / {{ totalPages }} 页</span>

        </div>
    </div>

</template>

<style scoped></style>