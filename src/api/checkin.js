import request from '@/utils/request'

// 查询入住列表
export const getCheckinList = params => { return request({ url: '/HotelManagement/json/checkin/list', method: 'get', params: params }) }

// 新增入住列表
export const addCheckin = (params,headers) => { return request({ url: '/HotelManagement/json/checkin/add', method: 'post', data: params, headers: headers }) }

// 根据ID查询入住列表
export const getCheckinById = CheckinId => { return request({ url: '/HotelManagement/json/checkin/getCheckinById?checkinId=' + CheckinId, method: 'get', params: CheckinId }) }

// 修改入住天数
export const updateCheckin = params => { return request({ url: '/HotelManagement/json/checkin/update', method: 'put', params: params }) }

// 换房
export const updateRoom = params => { return request({ url: '/HotelManagement/json/checkin/updateRoom', method: 'put', params: params }) }