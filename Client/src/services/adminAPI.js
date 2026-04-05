import api from './api';

const adminAPI = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  
  getAllLoans: async () => {
    const response = await api.get('/admin/loans');
    return response.data;
  },
  
  getAllDisputes: async () => {
    const response = await api.get('/admin/disputes');
    return response.data;
  },
  
  updateDisputeStatus: async (disputeId, action, resolution = '') => {
    const response = await api.put(`/admin/disputes/${disputeId}/status`, { action, resolution });
    return response.data;
  },
  
  getSystemStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  }
};

export default adminAPI;
