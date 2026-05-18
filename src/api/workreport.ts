import request from '../utils/request';

export const workreportApi = {

    getReportsByWorkOrderId(workOrderId: number, pageNum: number, pageSize: number) {
        console.log('📝 专职点菜员：getReportsByWorkOrderId');
        return request.get('/api/work-reports', { params: { workOrderId, pageNum, pageSize } });
    },

};