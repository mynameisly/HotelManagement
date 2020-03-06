import request from '@/utils/request'
// 登录
export const login = params => { return request({ url: '/HotelManagement/json/login/direct', method: 'get', params: params }) }
// 目前这个接口还没有
export const logout = params => { return request({ url: '/HotelManagement/json/logout/direct', method: 'get', params: params }) }