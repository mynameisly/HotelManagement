import request from '@/utils/request'
// 员工查询
export const getempList = params => { return request({ url: '/HotelManagement/json/employee/list', method: 'get', params: params }) }

// 重置密码
export const resetPassword = params => { return request({ url: '/HotelManagement/json/employee/resetPassword', method: 'put', params: params }) }

// 修改密码
export const updatePassword = params => { return request({ url: '/HotelManagement/json/employee/updatePassword', method: 'put', params: params }) }