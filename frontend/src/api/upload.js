import request from './index';

export const uploadImage = (formData) => request.post('/upload-image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});