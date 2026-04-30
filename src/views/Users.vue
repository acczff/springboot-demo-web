<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { userApi } from '../api/user';

// 表单数据
const form = ref({
  username: '',
  password: '',
  email: ''
});
const userList = ref<any[]>([]);
const showDialog = ref(false);
const editId = ref<number | null>(null);

onMounted(
  () => {
    loadUserList()
  }
);
// 加载用户列表
const loadUserList = async () => {
  const res: any = await userApi.getUserList()
  userList.value = res
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
</script>

<template>
  <div class="page">
    <!-- 页头 -->
    <div class="page-header">
      <h2 class="page-title">用户管理</h2>
      <button class="btn btn-primary" @click="openAddDialog">+ 新增用户</button>
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
            </td>
          </tr>
        </tbody>
      </table>
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
.table td:nth-child(1) { width: 80px; }

.table th:nth-child(2),
.table td:nth-child(2) { width: 160px; }

.table th:nth-child(4),
.table td:nth-child(4) { width: 100px; }

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
  padding: 24px;
  width: 420px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}

.dialog-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
  color: #333;
}

.dialog-placeholder {
  color: #999;
  font-size: 14px;
  margin-bottom: 24px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>