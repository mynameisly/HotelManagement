import request from '@/utils/request'

// 查询退房记录列表
export const getCheckoutList = params => { return request({ url: '/HotelManagement/json/checkout/list', method: 'get', params: params }) }

// 根据ID查询退房记录
export const getCheckoutById = checkoutId => { return request({ url: '/HotelManagement/json/checkout/getCheckoutById?checkoutId=' + checkoutId, method: 'get', params: checkoutId }) }

// 退房
export const addCheckout = params => { return request({ url: '/HotelManagement/json/checkout/add', method: 'post', params: params }) }