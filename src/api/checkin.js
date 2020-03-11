import request from '@/utils/request'
// 查询入住列表
export const getCheckinList = params => { return request({ url: '/HotelManagement/json/room/list', method: 'get', params: params }) }

// 新增入住列表
export const addCheckin = params => { return request({ url: '/HotelManagement/json/Checkin/add', method: 'post', params: params }) }

// 根据ID查询入住列表
export const getCheckinById = CheckinId => { return request({ url: '/HotelManagement/json/Checkin/getCheckinById?CheckinId=' + CheckinId, method: 'get', params: CheckinId }) }

// 修改入住列表
export const updateCheckin = params => { return request({ url: '/HotelManagement/json/Checkin/update', method: 'put', params: params }) }

// 删除入住列表
export const delCheckin = CheckinId => { return request({ url: '/HotelManagement/json/Checkin/delete?CheckinId=' + CheckinId, method: 'delete', params: CheckinId }) }