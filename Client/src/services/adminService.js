import api from './api';

const adminService = {
  // User management
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  
  getUserDetails: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },
  
  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/status`, { isActive });
    return response.data;
  },
  
  // Loan management
  getAllLoans: async () => {
    const response = await api.get('/admin/loans');
    return response.data;
  },
  
  // Dispute management
  getAllDisputes: async () => {
    const response = await api.get('/admin/disputes');
    return response.data;
  },
  
  updateDisputeStatus: async (disputeId, action, resolution = '') => {
    const response = await api.put(`/admin/disputes/${disputeId}/status`, { action, resolution });
    return response.data;
  },
  
  // System statistics
  getSystemStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  }
};

export default adminService;
