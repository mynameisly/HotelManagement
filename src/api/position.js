import request from '@/utils/request'
// 职位查询
export const getPositionList = params => { return request({ url: '/HotelManagement/json/position/list', method: 'get', params: params }) }

// 职位新增
export const addPosition = params => { return request({ url: '/HotelManagement/json/position/add', method: 'post', params: params }) }

// 职位修改
export const updatePosition = params => { return request({ url: '/HotelManagement/json/position/update', method: 'update', params: params }) }

// 职位删除
export const deletePosition = params => { return request({ url: '/HotelManagement/json/position/delete', method: 'delete', params: params }) }