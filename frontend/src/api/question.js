import request from './index';

export const getQuestions = (params) => request.get('/questions', { params });
export const addQuestion = (data) => request.post('/questions', data);
export const deleteQuestion = (id) => request.delete(`/questions/${id}`);
export const batchDeleteQuestions = (ids) => request.delete('/questions/batch', { data: { ids } });
export const getSubjects = () => request.get('/questions/subjects');
export const getQuestionTypes = () => request.get('/questions/question-types');
