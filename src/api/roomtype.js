import request from '@/utils/request'
// 查询客房列表
export const getRoomTypeList = params => { return request({ url: '/HotelManagement/json/room/list', method: 'get', params: params }) }