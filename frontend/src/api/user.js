import request from './index';

export const updateProfile = (data) => request.post('/user/update', data);
export const getProfile = () => request.get('/user/profile');