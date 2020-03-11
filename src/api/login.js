import request from '@/utils/request'
// 登录
export const login = params => { return request({ url: '/HotelManagement/json/login/direct', method: 'get', params: params }) }
// 退出登录
export const loginout = params => { return request({ url: '/HotelManagement/json/login/out', method: 'get', params: params }) }
// 获取当前登录用户的信息
export const getLoginEmployee = params => { return request({ url: '/HotelManagement/json/login/getLoginEmployee', method: 'get', params: params }) }