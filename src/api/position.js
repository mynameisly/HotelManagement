import request from '@/utils/request'
// 职位查询
export const getPositionList = params => { return request({ url: '/HotelManagement/json/position/list', method: 'get', params: params }) }

// 职位新增
export const addPosition = params => { return request({ url: '/HotelManagement/json/position/add', method: 'post', params: params }) }

// 职位修改
export const updatePosition = params => { return request({ url: '/HotelManagement/json/position/update', method: 'put', params: params }) }

// 职位删除
export const deletePosition = positionId => { return request({ url: '/HotelManagement/json/position/delete?positionId=' + positionId, method: 'delete', params: positionId }) }