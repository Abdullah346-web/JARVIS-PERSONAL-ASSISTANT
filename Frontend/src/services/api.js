import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Ensure token is properly formatted and doesn't have extra whitespace
    const cleanToken = token.trim();
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }
  return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Assistant endpoints
export const assistantService = {
  getAssistants: () => api.get('/assistants'),
  selectAssistant: (data) => api.post('/assistants/select', data),
  getUserAssistant: () => api.get('/assistants/my-assistant'),
  updateAssistant: (data) => api.put('/assistants/update', data),
};

// Chat endpoints
export const chatService = {
  createChat: (data) => api.post('/chats/create', data),
  getUserChats: () => api.get('/chats/all'),
  getChat: (chatId) => api.get(`/chats/${chatId}`),
  addMessage: (chatId, data) => api.post(`/chats/${chatId}/message`, data),
  deleteChat: (chatId) => api.delete(`/chats/${chatId}`),
  clearChatHistory: (chatId) => api.patch(`/chats/${chatId}/clear`),
};

export const aiService = {
  getReply: (message) => api.post('/ai/respond', { message }),
};

// Settings endpoints
export const settingsService = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings/update', data),
};

export default api;
