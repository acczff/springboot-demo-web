<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { userApi } from '../api/user';

// 表单数据
const form = ref({
  username: '',
  password: '',
  email: ''
});
const userList = ref<any[]>([]);
const pageNum = ref(1)      // 当前第几页
const pageSize = ref(10)    // 每页几条
const total = ref(0)        // 总条数（从后端拿到后存起来）
const totalPages = computed(() => Math.ceil(total.value / pageSize.value)); // 总页数（计算属性，根据 total 和 pageSize 计算得出）
const keyword = ref('')   // 搜索关键词
const showDialog = ref(false);
const editId = ref<number | null>(null);
// 角色绑定弹窗
const showRoleDialog = ref(false);
const currentUser = ref<any>(null);
const allRoles = ref<any[]>([]);
const selectedRoleId = ref<number | null>(null);

onMounted(
  () => {
    loadUserList()
  }
);
// 加载用户列表
const loadUserList = async () => {
  const res: any = await userApi.getUserList(pageNum.value, pageSize.value, keyword.value);
  userList.value = res.content;
  total.value = res.totalElements;
}
// 提交
const handleSubmit = async () => {
  if (editId.value) {
    await userApi.updateUser(editId.value, form.value);
  } else {
    await userApi.createUser(form.value);
  }
  showDialog.value = false;
  await loadUserList();
};

const handleSearch = () => {
  pageNum.value = 1
  loadUserList()
}

const openAddDialog = () => {
  editId.value = null;
  form.value = { username: '', password: '', email: '' };
  showDialog.value = true;
};

const openEditDialog = (user: any) => {
  editId.value = user.id;
  form.value = { username: user.username, password: '', email: user.email };
  showDialog.value = true;
};

const goToPage = (page: number) => {
  // 1. 边界检查：page 不能小于 1，不能大于 totalPages
  if (page < 1 || page > totalPages.value) {
    return;
  }
  pageNum.value = page;
  loadUserList();
}

// 打开角色绑定弹窗
const openRoleDialog = async (user: any) => {
  currentUser.value = user;
  const [roles, current]: any = await Promise.all([
    userApi.getRoleList(),
    userApi.getUserRoles(user.id)
  ]);
  allRoles.value = roles;
  selectedRoleId.value = current.length > 0 ? current[0].id : null;
  showRoleDialog.value = true;
};

// 提交角色绑定
const handleRoleSubmit = async () => {
  await userApi.assignUserRoles(currentUser.value.id, selectedRoleId.value ? [selectedRoleId.value] : []);
  showRoleDialog.value = false;
};
</script>

<template>
  <div class="page">
    <!-- 页头 -->
    <div class="page-header">
      <h2 class="page-title">用户管理</h2>
      <button class="btn btn-primary" @click="openAddDialog">+ 新增用户</button>
    </div>
    <!-- 搜索栏 -->
    <div class="search-bar">
      <input v-model="keyword" type="text" placeholder="搜索用户名或邮箱" class="search-input" @keyup.enter="handleSearch" />
      <button class="btn btn-primary" @click="handleSearch">搜索</button>
    </div>
    <!-- 表格 -->
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in userList" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button class="btn btn-edit" @click="openEditDialog(user)">编辑</button>
              <button class="btn btn-default" @click="openRoleDialog(user)">分配角色</button>
            </td>
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
    <!-- 弹窗遮罩 -->
    <div v-if="showDialog" class="dialog-mask">
      <div class="dialog">
        <h3 class="dialog-title">{{ editId ? '编辑用户' : '新增用户' }}</h3>
        <div class="form-item">
          <label>用户名</label>
          <input v-model="form.username" type="text" placeholder="请输入用户名" />
        </div>
        <div class="form-item">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </div>
        <div class="form-item">
          <label>邮箱</label>
          <input v-model="form.email" type="email" placeholder="请输入邮箱" />
        </div>
        <div class="dialog-footer">
          <button class="btn btn-default" @click="showDialog = false">取消</button>
          <button class="btn btn-primary" @click="handleSubmit">保存</button>
        </div>
      </div>
    </div>
    <div v-if="showRoleDialog" class="dialog-mask" @click.self="showRoleDialog = false">
      <div class="dialog">
        <div class="dialog-header">
          <h3 class="dialog-title">分配角色 — {{ currentUser?.username }}</h3>
          <button class="dialog-close" @click="showRoleDialog = false">✕</button>
        </div>
        <div class="role-list">
          <label v-for="role in allRoles" :key="role.id" class="role-item">
            <input type="radio" :value="role.id" v-model="selectedRoleId" />
            <span>{{ role.name }}</span>
            <span class="role-desc">{{ role.description }}</span>
          </label>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-default" @click="showRoleDialog = false">取消</button>
          <button class="btn btn-primary" @click="handleRoleSubmit">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.search-input {
  padding: 7px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  width: 240px;
  outline: none;
}

.search-input:focus {
  border-color: #1677ff;
}

/* 表格 */
.table-wrapper {
  background: #fff;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table thead tr {
  background-color: #fafafa;
}

.table th,
.table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
  vertical-align: middle;
}

.table th {
  font-weight: 600;
  color: #555;
}

.table td {
  color: #333;
}

.table th:nth-child(1),
.table td:nth-child(1) {
  width: 80px;
}

.table th:nth-child(2),
.table td:nth-child(2) {
  width: 160px;
}

.table th:nth-child(4),
.table td:nth-child(4) {
  width: 100px;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr:hover {
  background-color: #f9f9f9;
}

/* 按钮 */
.btn {
  padding: 7px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background-color: #1677ff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #4096ff;
}

.btn-default {
  background-color: #fff;
  color: #333;
  border: 1px solid #d9d9d9;
  margin-right: 8px;
}

.btn-default:hover {
  border-color: #1677ff;
  color: #1677ff;
}

.btn-edit {
  background: #fff;
  color: #1677ff;
  border: 1px solid #1677ff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.btn-edit:hover {
  background: #e6f4ff;
}

/* 弹窗 */
.dialog-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.dialog {
  background: #fff;
  border-radius: 8px;
  width: 420px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.dialog-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.dialog-close {
  background: none;
  border: none;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.dialog-close:hover {
  color: #333;
}

.form-item {
  padding: 0 24px;
  margin-bottom: 16px;
}

.form-item:first-of-type {
  margin-top: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}

.form-item input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.2s;
  outline: none;
}

.form-item input:focus {
  border-color: #1677ff;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
}

/* 分页 */
.pagination {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  font-size: 14px;
  color: #555;
}

.pagination button {
  padding: 5px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.pagination button:hover:not(:disabled) {
  border-color: #1677ff;
  color: #1677ff;
}

.pagination button:disabled {
  color: #bbb;
  cursor: not-allowed;
}

.pagination button.page-active {
  background: #1677ff;
  color: #fff;
  border-color: #1677ff;
}

/* 角色绑定弹窗 */
.role-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 20px;
  max-height: 300px;
  overflow-y: auto;
}

.role-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.role-desc {
  color: #888;
  font-size: 12px;
}

</style>