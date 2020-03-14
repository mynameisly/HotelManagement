import request from '@/utils/request'
// 查询客房列表
export const uploadFile = params => { return request({ url: '/HotelManagement/json/file/add', method: 'post', params: params }) }