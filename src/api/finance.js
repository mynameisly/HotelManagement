import request from '@/utils/request'

// 财务核算
export const getfinList = params => { return request({ url: '/HotelManagement/json/finance/check', method: 'get', params: params }) }
