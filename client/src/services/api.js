import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// POSTS
export const getPosts = () => api.get('/posts');
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post('/posts', data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);

// CATEGORIES
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);

export default api;
