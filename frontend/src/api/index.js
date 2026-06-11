import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/api',
});

export const getMines = () => api.get(`/mines?t=${new Date().getTime()}`);
export const getMineDetails = (id) => api.get(`/mines/${id}?t=${new Date().getTime()}`);
export const getMineAlerts = (id) => api.get(`/alerts/${id}?t=${new Date().getTime()}`);
export const getGroqInsight = (data) => api.post('/groq/insight', data);

export default api;
