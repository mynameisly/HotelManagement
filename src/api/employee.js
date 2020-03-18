import request from '@/utils/request'
// 员工查询
export const getempList = params => { return request({ url: '/HotelManagement/json/employee/list', method: 'get', params: params }) }

// 新增员工
export const addemp = params => { return request({ url: '/HotelManagement/json/employee/add', method: 'post', params: params }) }

// 根据员工ID查询员工信息
export const getEmployeeById = employeeId => { return request({ url: '/HotelManagement/json/employee/getEmployeeById?employeeId=' + employeeId , method: 'get', params: employeeId }) }

// 修改员工信息
export const update = params => { return request({ url: '/HotelManagement/json/employee/update', method: 'put', params: params }) }

// 重置密码
export const resetPassword = employeeId => { return request({ url: '/HotelManagement/json/employee/resetPassword?employeeId=' + employeeId, method: 'put', params: employeeId }) }

// 修改密码
export const updatePassword = params => { return request({ url: '/HotelManagement/json/employee/updatePassword', method: 'put', params: params }) }

// 删除员工
export const delemp = employeeId => { return request({ url: '/HotelManagement/json/employee/delete?employeeId=' + employeeId, method: 'delete', params: employeeId }) }
