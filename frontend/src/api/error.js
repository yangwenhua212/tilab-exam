import request from './index';

export const addError = (data) => request.post('/errors', data);
export const getErrors = (params) => request.get('/errors', { params });
export const deleteError = (id) => request.delete(`/errors/${id}`);
export const getErrorQuestions = (params) => request.get('/errors/questions', { params });