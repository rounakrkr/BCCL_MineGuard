import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/api',
});

export const getMines = () => api.get('/mines');
export const getMineDetails = (id) => api.get(`/mines/${id}`);
export const getMineAlerts = (id) => api.get(`/alerts/${id}`);
export const getGroqInsight = (data) => api.post('/groq/insight', data);

export default api;
