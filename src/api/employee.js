import request from '@/utils/request'
// 员工查询
export const getempList = params => { return request({ url: '/HotelManagement/json/employee/list', method: 'get', params: params }) }