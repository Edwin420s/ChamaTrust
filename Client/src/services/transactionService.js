import api from './api';

export const transactionService = {
  contribute: async (amount, senderSecret, receiverPublic) => {
    const response = await api.post('/transactions/contribute', {
      amount,
      senderSecret,
      receiverPublic
    });
    return response.data;
  },
  getTransactions: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },
  applyLoan: async (amount) => {
    const response = await api.post('/loans/apply', { amount });
    return response.data;
  },
  getLoans: async () => {
    const response = await api.get('/loans');
    return response.data;
  },
  getLoanRisk: async (amount) => {
    const response = await api.get('/loans/risk', { params: { amount } });
    return response.data;
  },
  getTrustScore: async () => {
    const response = await api.get('/users/trust-score');
    return response.data;
  },
  createDispute: async (description, evidenceUrl) => {
    const response = await api.post('/disputes', { description, evidenceUrl });
    return response.data;
  },
  getDisputes: async () => {
    const response = await api.get('/disputes');
    return response.data;
  }
};