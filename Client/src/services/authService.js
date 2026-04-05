import api from './api';

export const authService = {
  googleLogin: async (email, name) => {
    const response = await api.post('/auth/google', { email, name });
    return response.data;
  },

  getProfile: async (token) => {
    const response = await api.get('/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
