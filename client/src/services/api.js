import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// attach token automatically if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// POSTS
export const getPosts = (params) => api.get('/posts', { params });
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post('/posts', data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const likePost = (id) => api.post(`/posts/${id}/like`);

// CATEGORIES
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);

// AUTH
export const register = (payload) => api.post('/auth/register', payload);
export const login = (payload) => api.post('/auth/login', payload);

// UPLOAD
export const uploadImage = (formData) => api.post('/uploads', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// COMMENTS
export const getCommentsForPost = (postId) => api.get(`/comments/post/${postId}`);
export const createComment = (payload) => api.post('/comments', payload);
export const deleteComment = (id) => api.delete(`/comments/${id}`);

export default api;
