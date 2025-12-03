import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// Task APIs
export const getTasks = () => api.get('/tasks');
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// Mood APIs
export const getMoods = () => api.get('/moods');
export const logMood = (moodData) => api.post('/moods', moodData);
export const updateMood = (id, moodData) => api.put(`/moods/${id}`, moodData);
export const deleteMood = (id) => api.delete(`/moods/${id}`);

// AI APIs
export const chatWithAI = (message, context = null) => api.post('/ai/chat', { message, context });
export const generateSchedule = () => api.post('/ai/schedule');

// Analytics APIs
export const getAnalytics = () => api.get('/analytics');

// User APIs
export const getUsers = () => api.get('/users');

export default api;
