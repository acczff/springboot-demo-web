<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { workorderApi } from '../api/workorder';
import { useUserStore } from '../store/user';
import { workreportApi } from '../api/workreport';

const userStore = useUserStore();
const workOrdersList = ref<any[]>([]);
const pageNum = ref(1)      // 当前第几页
const pageSize = ref(10)    // 每页几条
const total = ref(0)        // 总条数（从后端拿到后存起来）
const totalPages = computed(() => Math.ceil(total.value / pageSize.value)); // 总页数（计算属性，根据 total 和 pageSize 计算得出）
const workOrderStatus = ref(''); // 工单状态筛选条件
const showCreateDialog = ref(false); // 是否显示创建工单的对话框
const selectedOrder = ref<any>(null); // 当前选中的工单（用于显示详情）
const workReports = ref<any[]>([]); // 当前选中工单的工序报表列表
const showDetailDialog = ref(false); // 是否显示工单详情对话框
const productOptions = [
    { id: 1, name: '标准椅子 (P001)' },
    { id: 2, name: '办公桌 (P002)' },
    { id: 3, name: '文件柜 (P003)' },
]
const createForm = ref({
    name: '',
    createdBy: null as number | null,
    workOrderItemRequests: [
        { productId: null as number | null, plannedQty: 1 }
    ]
})

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
// 下发工单
const issueWorkOrder = async (workOrderId: number) => {
    await workorderApi.issueWorkOrder(workOrderId);
    loadWorkOrdersList();
}
// 添加一行产品
const addItem = () => {
    createForm.value.workOrderItemRequests.push({ productId: null, plannedQty: 1 })
}
// 删除指定行
const removeItem = (index: number) => {
    createForm.value.workOrderItemRequests.splice(index, 1)
}
// 提交
const submitCreate = async () => {
    if (!createForm.value.name.trim()) {
        alert('请输入工单名称')
        return
    }
    for (let i = 0; i < createForm.value.workOrderItemRequests.length; i++) {
        const item = createForm.value.workOrderItemRequests[i]
        if (!item.productId) {
            alert(`第 ${i + 1} 行明细：请选择产品`)
            return
        }
        if (!item.plannedQty || item.plannedQty < 1) {
            alert(`第 ${i + 1} 行明细：计划数量至少为 1`)
            return
        }
    }
    createForm.value.createdBy = userStore.userId
    if (!createForm.value.createdBy) {
        alert('用户信息已过期，请重新登录')
        return
    }
    await workorderApi.createWorkOrder(createForm.value)
    showCreateDialog.value = false
    createForm.value = { name: '', createdBy: null, workOrderItemRequests: [{ productId: null, plannedQty: 1 }] }
    loadWorkOrdersList()
}

const startWorkOrder = async (workOrderId: number) => {
    await workorderApi.startWorkOrder(workOrderId);
    loadWorkOrdersList();
}

const completeWorkOrder = async (workOrderId: number) => {
    await workorderApi.completeWorkOrder(workOrderId);
    loadWorkOrdersList();
}

const cancelWorkOrder = async (workOrderId: number) => {
    await workorderApi.cancelWorkOrder(workOrderId);
    loadWorkOrdersList();
}

const openDetailDialog = async (workOrder: any) => {
    selectedOrder.value = workOrder;
    const detailRes: any = await workorderApi.getWorkOrderDetails(workOrder.id);
    selectedOrder.value = { ...selectedOrder.value, ...detailRes };
    const res: any = await workreportApi.getReportsByWorkOrderId(workOrder.id, pageNum.value, pageSize.value);
    workReports.value = res.list;
    showDetailDialog.value = true;
}
</script>

<template>
    <div class="page">
        <!-- 页头 -->
        <div class="page-header">
            <h2 class="page-title">工单管理</h2>
            <div class="page-actions">
                <select v-model="workOrderStatus" class="search-select" @change="loadWorkOrdersList">
                    <option value="">全部状态</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="ISSUED">ISSUED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                </select>
                <button class="btn-primary" @click="showCreateDialog = true">创建工单</button>
            </div>
        </div>
        <!-- 表格 -->
        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>工单名称</th>
                        <th>状态</th>
                        <th>创建人</th>
                        <th>创建时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="workOrder in workOrdersList" :key="workOrder.id">
                        <td>{{ workOrder.id }}</td>
                        <td @click="openDetailDialog(workOrder)">{{ workOrder.name }}</td>
                        <td><span :class="'status-badge status-' + workOrder.status.toLowerCase()">{{ workOrder.status }}</span></td>
                        <td>{{ workOrder.createdByName }}</td>
                        <td>{{ new Date(workOrder.createdTime).toLocaleString() }}</td>
                        <td class="action-cell">
                            <button v-if="workOrder.status === 'DRAFT'" class="btn-action btn-issue"
                                @click="issueWorkOrder(workOrder.id)">下发</button>
                            <button v-if="workOrder.status === 'ISSUED'" class="btn-action btn-start"
                                @click="startWorkOrder(workOrder.id)">开始生产</button>
                            <button v-if="workOrder.status === 'IN_PROGRESS'" class="btn-action btn-complete"
                                @click="completeWorkOrder(workOrder.id)">完工</button>
                            <button v-if="workOrder.status === 'ISSUED' || workOrder.status === 'IN_PROGRESS'" class="btn-action btn-cancel"
                                @click="cancelWorkOrder(workOrder.id)">取消</button>
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
        <div v-if="showCreateDialog" class="dialog-mask">
            <div class="dialog">
                <div class="dialog-header">
                    <h3 class="dialog-title">新建工单</h3>
                    <button class="dialog-close" @click="showCreateDialog = false">✕</button>
                </div>
                <div class="form-item">
                    <label>创建人</label>
                    <div class="creator-info">
                        <span class="creator-id">ID: {{ userStore.userId }}</span>
                        <span class="creator-name">{{ userStore.username }}</span>
                    </div>
                </div>
                <div class="form-item">
                    <label>工单名称</label>
                    <input v-model="createForm.name" type="text" placeholder="请输入工单名称" />
                </div>
                <div class="form-item">
                    <div class="items-header">
                        <label>工单明细</label>
                        <button class="btn btn-sm btn-default" @click="addItem">+ 添加产品</button>
                    </div>
                    <div v-for="(item, index) in createForm.workOrderItemRequests" :key="index" class="item-row">
                        <select v-model.number="item.productId" class="item-select">
                            <option :value="null" disabled>请选择产品</option>
                            <option v-for="product in productOptions" :key="product.id" :value="product.id">{{
                                product.name }}</option>
                        </select>
                        <input v-model.number="item.plannedQty" type="number" min="1" class="item-qty"
                            placeholder="数量" />
                        <button class="btn btn-danger btn-sm" @click="removeItem(index)"
                            :disabled="createForm.workOrderItemRequests.length === 1">删除</button>
                    </div>
                </div>
                <div class="dialog-footer">
                    <button class="btn btn-default" @click="showCreateDialog = false">取消</button>
                    <button class="btn btn-primary" @click="submitCreate">提交</button>
                </div>
            </div>
        </div>
        <!-- 工单详情弹窗 -->
        <div v-if="showDetailDialog" class="dialog-mask">
            <div class="dialog detail-dialog">
                <div class="dialog-header">
                    <h3 class="dialog-title">工单详情 - {{ selectedOrder.name }}</h3>
                    <button class="dialog-close" @click="showDetailDialog = false">✕</button>
                </div>
                <div class="detail-body">
                <div class="detail-grid">
                    <div class="detail-field"><span class="detail-label">工单名称</span><span class="detail-value">{{ selectedOrder.name }}</span></div>
                    <div class="detail-field"><span class="detail-label">状态</span><span :class="'status-badge status-' + selectedOrder.status.toLowerCase()">{{ selectedOrder.status }}</span></div>
                    <div class="detail-field"><span class="detail-label">创建人</span><span class="detail-value">{{ selectedOrder.createdByName }}</span></div>
                    <div class="detail-field"><span class="detail-label">创建时间</span><span class="detail-value">{{ new Date(selectedOrder.createdTime).toLocaleString() }}</span></div>
                </div>
                <div class="detail-section">
                    <div class="detail-section-title">工单明细</div>
                    <table class="table">
                        <thead><tr><th>产品名称</th><th>计划数量</th><th>已完成数量</th></tr></thead>
                        <tbody>
                            <tr v-for="(item, index) in selectedOrder.items" :key="index">
                                <td>{{ item.product.name }}</td><td>{{ item.plannedQty }}</td><td>{{ item.completedQty }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="detail-section">
                    <div class="detail-section-title">报工记录</div>
                    <table class="table">
                        <thead><tr><th>报工人</th><th>报工数量</th><th>状态</th><th>报工时间</th></tr></thead>
                        <tbody>
                            <tr v-for="(report, index) in workReports" :key="index">
                                <td>{{ report.reportedByName }}</td>
                                <td>{{ report.reportedQty }}</td>
                                <td><span :class="'status-badge status-' + report.status.toLowerCase()">{{ report.status }}</span></td>
                                <td>{{ report.reportedTime ? new Date(report.reportedTime).toLocaleString() : '-' }}</td>
                            </tr>
                            <tr v-if="workReports.length === 0"><td colspan="4" style="text-align:center;color:#999;padding:16px">暂无报工记录</td></tr>
                        </tbody>
                    </table>
                </div>
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
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.page-title {
    margin: 0;
    font-size: 20px;
}

.search-bar {
    margin-bottom: 12px;
}

.page-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.search-select {
    padding: 6px 10px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
}

.table-wrapper {
    overflow-x: auto;
}

.table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.table th,
.table td {
    padding: 10px 12px;
    border: 1px solid #e8e8e8;
    text-align: left;
}

.table thead tr {
    background-color: #fafafa;
    font-weight: 600;
}

.table tbody tr:hover {
    background-color: #f5f5f5;
}

.table button {
    padding: 4px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    background-color: #1890ff;
    color: white;
}

.table button:hover {
    background-color: #40a9ff;
}

.pagination {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    font-size: 14px;
}

.pagination button {
    padding: 4px 10px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 13px;
}

.pagination button:disabled {
    color: #bfbfbf;
    cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
    border-color: #1890ff;
    color: #1890ff;
}

.page-active {
    background-color: #1890ff !important;
    color: white !important;
    border-color: #1890ff !important;
}

/* 页头"创建工单"按钮 */
.page-header>button {
    padding: 6px 16px;
    border: none;
    border-radius: 4px;
    background-color: #1677ff;
    color: white;
    cursor: pointer;
    font-size: 14px;
}

.page-header>button:hover {
    background-color: #4096ff;
}

/* 通用按钮 */
.btn {
    padding: 6px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 14px;
}

.btn-sm {
    padding: 3px 10px;
    font-size: 13px;
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

.btn-danger {
    background-color: #fff;
    color: #ff4d4f;
    border: 1px solid #ff4d4f;
}

.btn-danger:hover:not(:disabled) {
    background-color: #fff1f0;
}

.btn-danger:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* 弹窗 */
.dialog-mask {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.dialog {
    background: #fff;
    border-radius: 8px;
    width: 480px;
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

.form-item>label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    color: #555;
}

.form-item input,
.form-item select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
    outline: none;
}

.form-item input:focus,
.form-item select:focus {
    border-color: #1677ff;
    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

/* 工单明细区块 */
.items-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.items-header label {
    margin-bottom: 0;
}

.item-row {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
}

.item-select {
    flex: 1;
    width: auto !important;
}

.item-qty {
    width: 80px !important;
    flex: none;
}

.dialog-footer {
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: flex-end;
}

/* 创建人只读展示 */
.creator-info {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    background: #f0f5ff;
    border: 1px solid #adc6ff;
    border-radius: 6px;
    font-size: 14px;
}

.creator-name {
    font-weight: 600;
    color: #1677ff;
}

.creator-id {
    color: #8c8c8c;
    font-size: 12px;
    background: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 10px;
    padding: 1px 8px;
}

/* ── 状态徽章 ── */
.status-badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
}
.status-draft       { background: #f5f5f5; color: #595959; border: 1px solid #d9d9d9; }
.status-issued      { background: #e6f4ff; color: #1677ff; border: 1px solid #91caff; }
.status-in_progress { background: #fff7e6; color: #d46b08; border: 1px solid #ffd591; }
.status-completed   { background: #f6ffed; color: #389e0d; border: 1px solid #b7eb8f; }
.status-cancelled   { background: #fff1f0; color: #cf1322; border: 1px solid #ffa39e; }
.status-submitted   { background: #e6f4ff; color: #1677ff; border: 1px solid #91caff; }
.status-approved    { background: #f6ffed; color: #389e0d; border: 1px solid #b7eb8f; }
.status-rejected    { background: #fff1f0; color: #cf1322; border: 1px solid #ffa39e; }

/* ── 操作按钮 ── */
.action-cell { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.btn-action {
    padding: 3px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
}
.btn-issue    { background: #e6f4ff; color: #1677ff; border: 1px solid #91caff; }
.btn-issue:hover    { background: #bae0ff; }
.btn-start    { background: #fff7e6; color: #d46b08; border: 1px solid #ffd591; }
.btn-start:hover    { background: #ffe7ba; }
.btn-complete { background: #f6ffed; color: #389e0d; border: 1px solid #b7eb8f; }
.btn-complete:hover { background: #d9f7be; }
.btn-cancel   { background: #fff1f0; color: #cf1322; border: 1px solid #ffa39e; }
.btn-cancel:hover   { background: #ffccc7; }

/* ── 详情弹窗 ── */
.detail-dialog { width: 640px; max-width: 95vw; }
.detail-body { max-height: 70vh; overflow-y: auto; padding: 16px 24px 8px; }
.detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 24px;
    margin-bottom: 20px;
}
.detail-field { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
.detail-label { font-size: 12px; color: #8c8c8c; }
.detail-value { font-size: 14px; color: #262626; font-weight: 500; }
.detail-section { margin-bottom: 20px; }
.detail-section-title {
    font-size: 13px;
    font-weight: 600;
    color: #595959;
    margin-bottom: 8px;
    padding-left: 8px;
    border-left: 3px solid #1677ff;
}
</style>