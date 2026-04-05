import api from './api';

export const authService = {
  googleLogin: async (email, name) => {
    const response = await api.post('/auth/google/mock', { email, name });
    return response.data;
  },

  emailLogin: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  }
};
