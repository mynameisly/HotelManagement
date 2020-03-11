import request from '@/utils/request'

// 查询分类列表
export const getCategoryList = params => { return request({ url: '/HotelManagement/json/category/list', method: 'get', params: params }) }

// 新增分类
export const addCategory = params => { return request({ url: '/HotelManagement/json/category/add', method: 'post', params: params }) }

// 修改分类
export const updateCategory = params => { return request({ url: '/HotelManagement/json/category/update', method: 'put', params: params }) }

// 删除分类
export const delCategory = categoryId => { return request({ url: '/HotelManagement/json/category/delete?categoryId=' + categoryId, method: 'delete', params: categoryId }) }
