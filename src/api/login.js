import request from '../utils/request';

export const login = query => {
    return request({
        url: '/json/login/direct',
        method: 'get',
        params: query
    });
};
