import request from './index';

export const batchImport = (data) => request.post('/admin/batch-import', data);
export const getAllUsers = () => request.get('/admin/users');
export const deleteUser = (id) => request.delete(`/admin/users/${id}`);