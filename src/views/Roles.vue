<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { userApi } from '../api/user';


const roleList = ref<any[]>([]);
// 弹窗控制
const showDialog = ref(false);
// 表单数据
const form = ref({ name: '', description: '' });
// 所有权限列表
const allPermissions = ref<any[]>([]);
// 当前操作的角色
const currentRole = ref<any>(null);
// 已选中的权限ID
const selectedPermIds = ref<number[]>([]);
// 弹窗控制
const showPermDialog = ref(false);

onMounted(
    () => {
        loadRoleList()
    }
);

const loadRoleList = async () => {
    const roledata: any = await userApi.getRoleList();
    roleList.value = roledata;
};

// 打开弹窗（
const createRole = () => {
    form.value = { name: '', description: '' }
    showDialog.value = true
}
// 提交表单
const handleSubmit = async () => {
    await userApi.createRole(form.value)
    showDialog.value = false
    loadRoleList()  // 提交后刷新列表
}
// 打开权限分配弹窗
const openPermDialog = async (role: any) => {
    currentRole.value = role;
    // 同时拉取：所有权限 + 该角色已有权限
    const [all, current]: any = await Promise.all([
        userApi.getPermissionList(),
        userApi.getRolePermissions(role.id)
    ]);
    allPermissions.value = all;
    selectedPermIds.value = current.map((p: any) => p.id);
    showPermDialog.value = true;
};

// 提交权限分配
const handlePermSubmit = async () => {
    await userApi.assignRolePermissions(currentRole.value.id, selectedPermIds.value);
    showPermDialog.value = false;
};

</script>

<template>
    <div class="page">
        <!-- 页头 -->
        <div class="page-header">
            <h2 class="page-title">角色管理</h2>
            <button class="btn btn-primary" @click="createRole">+ 新增角色</button>
        </div>
        <!-- 表格 -->
        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>角色名称</th>
                        <th>描述</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="role in roleList" :key="role.id">
                        <td>{{ role.id }}</td>
                        <td>{{ role.name }}</td>
                        <td>{{ role.description }}</td>
                        <td>
                            <button class="btn btn-default" @click="openPermDialog(role)">分配权限</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-if="showDialog" class="dialog-mask" @click.self="showDialog = false">
        <div class="dialog">
            <div class="dialog-header">
                <h3 class="dialog-title">新增角色</h3>
                <button class="dialog-close" @click="showDialog = false">✕</button>
            </div>
            <div class="form-item">
                <label>角色名称</label>
                <input v-model="form.name" type="text" placeholder="请输入角色名称" />
            </div>
            <div class="form-item">
                <label>描述</label>
                <input v-model="form.description" type="text" placeholder="请输入描述" />
            </div>
            <div class="dialog-footer">
                <button class="btn btn-default" @click="showDialog = false">取消</button>
                <button class="btn btn-primary" @click="handleSubmit">保存</button>
            </div>
        </div>
    </div>
    <div v-if="showPermDialog" class="dialog-mask" @click.self="showPermDialog = false">
        <div class="dialog">
            <div class="dialog-header">
                <h3 class="dialog-title">分配权限 — {{ currentRole?.name }}</h3>
                <button class="dialog-close" @click="showPermDialog = false">✕</button>
            </div>
            <div class="perm-list">
                <label v-for="perm in allPermissions" :key="perm.id" class="perm-item">
                    <input type="checkbox" :value="perm.id" v-model="selectedPermIds" />
                    <span>{{ perm.code }}</span>
                    <span class="perm-desc">{{ perm.description }}</span>
                </label>
            </div>
            <div class="dialog-footer">
                <button class="btn btn-default" @click="showPermDialog = false">取消</button>
                <button class="btn btn-primary" @click="handlePermSubmit">保存</button>
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
}

.table th {
    font-weight: 600;
    color: #555;
}

.table tbody tr:last-child td {
    border-bottom: none;
}

.table tbody tr:hover {
    background-color: #f9f9f9;
}

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

.btn-default {
    background: #fff;
    color: #333;
    border: 1px solid #d9d9d9;
}

.btn-default:hover {
    border-color: #1677ff;
    color: #1677ff;
}

.perm-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px 20px;
    max-height: 300px;
    overflow-y: auto;
}

.perm-item {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
}

.perm-desc {
    color: #888;
    font-size: 12px;
}
</style>