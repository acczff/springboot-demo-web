import request from '../utils/request';

export const workorderApi = {

    getWorkOrdersList(pageNum: number, pageSize: number, status: string) {
        console.log('📝 专职点菜员：getWorkOrdersList');
        return request.get('/api/work-orders', { params: { pageNum, pageSize, status } });
    },

    getWorkOrderDetails(id: number) {
        console.log('📝 专职点菜员：getWorkOrderDetails');
        return request.get(`/api/work-orders/${id}`);
    },

    createWorkOrder(data: any) {
        console.log('📝 专职点菜员：createWorkOrder');
        return request.post('/api/work-orders', data);
    },

    issueWorkOrder(id: number) {
        console.log('📝 专职点菜员：issueWorkOrder');
        return request.put(`/api/work-orders/${id}/issue`,{});
    },

    completeWorkOrder(id: number) {
        console.log('📝 专职点菜员：completeWorkOrder');
        return request.put(`/api/work-orders/${id}/complete`,{});
    },

    startWorkOrder(id: number) {
        console.log('📝 专职点菜员：startWorkOrder');
        return request.put(`/api/work-orders/${id}/start`,{});
    },

    cancelWorkOrder(id: number) {
        console.log('📝 专职点菜员：cancelWorkOrder');
        return request.put(`/api/work-orders/${id}/cancel`,{});
    }
};
