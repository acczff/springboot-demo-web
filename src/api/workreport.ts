import request from '../utils/request';

export const workreportApi = {

    /**
    * 根据工单ID分页查询报工记录列表
    * @param workOrderId 工单ID
    * @param pageNum 页码
    * @param pageSize 每页条数
    */
    getReportsByWorkOrderId(workOrderId: number, pageNum: number, pageSize: number) {
        console.log('📝 专职点菜员：getReportsByWorkOrderId');
        return request.get('/api/work-reports', { params: { workOrderId, pageNum, pageSize } });
    },

    /**
    * 创建报工记录
    * @param workOrderId 关联工单ID
    * @param reportedQty 报工数量
    */
    createReport(workOrderId: number, reportedQty: number, workOrderItemId?: number, productName?: string) {
        console.log('📝 专职点菜员：createReport');
        return request.post('/api/work-reports', { workOrderId, reportedQty, workOrderItemId, productName });
    },

    /**
    * 分页获取当前用户的报工记录列表
    * @param pageNum 页码
    * @param pageSize 每页条数
    */
    getMyReports(pageNum: number, pageSize: number) {
        console.log('📝 专职点菜员：getMyReports');
        return request.get('/api/work-reports/me', { params: { pageNum, pageSize } });
    },

    /**
    * 提交报工记录（DRAFT → SUBMITTED，进入审核流程）
    * @param id 报工记录ID
    */
    submitReport(id: number) {
        console.log('📝 专职点菜员：submitReport');
        return request.put(`/api/work-reports/${id}/submit`, {});
    },

    /**
    * 分页获取待审核的报工记录列表（审核人视角）
    * @param pageNum 页码
    * @param pageSize 每页条数
    */
    getPendingReview(pageNum: number, pageSize: number) {
        console.log('📝 专职点菜员：getPendingReview');
        return request.get('/api/work-reports/pending-review', { params: { pageNum, pageSize } });
    },

    /**
    * 审核通过报工记录（SUBMITTED → APPROVED）
    * @param id 报工记录ID
    */
    approveReport(id: number) {
        console.log('📝 专职点菜员：approveReport');
        return request.put(`/api/work-reports/${id}/approve`);
    },

    /**
     * 驳回报工记录（SUBMITTED → REJECTED）
     * @param id 报工记录ID
     * @param rejectReason 驳回原因
     */
    rejectReport(id: number, rejectReason: string) {
        console.log('📝 专职点菜员：rejectReport');
        return request.put(`/api/work-reports/${id}/reject`, { rejectReason });
    },

};