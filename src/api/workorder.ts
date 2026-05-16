import request from '../utils/request';

export const workorderApi = {

    getWorkOrdersList(pageNum: number, pageSize: number, status: string) {
        console.log('📝 专职点菜员：getWorkOrdersList');
        return request.get('/api/workorders', { params: { pageNum, pageSize, status } });
    },

    createWorkOrder(data: any) {
        console.log('📝 专职点菜员：createWorkOrder');
        return request.post('/api/workorders', data);
    },

    issueWorkOrder(id: number) {
        console.log('📝 专职点菜员：issueWorkOrder');
        return request.put(`/api/workorders/${id}/issue`,{});
    }
};