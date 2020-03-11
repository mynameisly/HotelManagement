import request from '@/utils/request'
// 查询客房服务历史记录列表
export const getServiceList = params => { return request({ url: '/HotelManagement/json/customerService/list', method: 'get', params: params }) }

// 查询正在进行的客房服务列表
export const getServiceHistoryList = params => { return request({ url: '/HotelManagement/json/customerService/listHistory', method: 'get', params: params }) }

// 新增客房服务列表
export const addService = params => { return request({ url: '/HotelManagement/json/customerService/add', method: 'post', params: params }) }

// 完成客房服务
export const finishService = params => { return request({ url: '/HotelManagement/json/customerService/finishService', method: 'put', params: params }) }

// 修改客房服务列表
export const updateService = params => { return request({ url: '/HotelManagement/json/customerService/update', method: 'put', params: params }) }

// 删除客房服务列表
export const delService = customerServiceId => { return request({ url: '/HotelManagement/json/customerService/delete?customerServiceId=' + customerServiceId, method: 'delete', params: customerServiceId }) }