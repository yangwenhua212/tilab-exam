import request from './index';

export const login = (data) => request.post('/auth/login', data);
export const register = (data) => request.post('/auth/register', data);
export const updateUser = (data) => request.post('/user/update', data);
export const getUserProfile = () => request.get('/user/profile');