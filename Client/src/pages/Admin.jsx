import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { formatCurrency, formatRelativeTime } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

const Admin = () => {
  const { user } = useAuth();
  const [pendingLoans, setPendingLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingLoans();
  }, []);

  const fetchPendingLoans = async () => {
    try {
      const data = await transactionService.getPendingLoans();
      setPendingLoans(data || []);
    } catch (err) {
      console.error('Failed to fetch pending loans:', err);
      setError('Failed to fetch pending loans');
    } finally {
      setLoading(false);
    }
  };

  const handleLoanAction = async (loanId, action) => {
    setActionLoading(loanId);
    setMessage(null);
    setError(null);

    try {
      const response = await transactionService.approveLoan(loanId, action);
      
      if (action === 'approve') {
        setMessage(`Loan #LOAN${String(loanId).padStart(6, '0')} approved and funded successfully! TX: ${response.stellarTxHash}`);
      } else {
        setMessage(`Loan #LOAN${String(loanId).padStart(6, '0')} rejected`);
      }
      
      // Refresh the pending loans list
      fetchPendingLoans();
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${action} loan`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending loans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Loan Administration</h1>
          <p className="mt-2 text-gray-600">Review and approve pending loan applications</p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="text-green-800">{message}</div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {/* Pending Loans */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Pending Loans ({pendingLoans.length})
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Review loan applications and approve or reject them
            </p>
          </div>
          
          {pendingLoans.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pending loans</h3>
              <p className="mt-1 text-sm text-gray-500">All loan applications have been processed</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pendingLoans.map((loan) => (
                <li key={loan.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              Loan Application #{String(loan.id).padStart(6, '0')}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Applied {formatRelativeTime(loan.appliedDate)}
                            </p>
                          </div>
                          <div className="ml-6 flex-shrink-0">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              loan.riskLevel === 'LOW' ? 'bg-green-100 text-green-800' :
                              loan.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {loan.riskLevel} RISK
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Applicant</p>
                            <p className="text-sm text-gray-500">{loan.user.name}</p>
                            <p className="text-sm text-gray-500">{loan.user.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Loan Details</p>
                            <p className="text-sm text-gray-500">Amount: {formatCurrency(loan.amount)}</p>
                            <p className="text-sm text-gray-500">Interest: {loan.interestRate}%</p>
                            <p className="text-sm text-gray-500">Purpose: {loan.purpose}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Risk Assessment</p>
                            <p className="text-sm text-gray-500">Trust Score: {loan.user.trustScore}/100</p>
                            <p className="text-sm text-gray-500">Risk Score: {loan.riskScore}</p>
                            <p className="text-sm text-gray-500">Wallet: {loan.user.stellarPublicKey?.slice(0, 8)}...{loan.user.stellarPublicKey?.slice(-8)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end space-x-3">
                          <button
                            onClick={() => handleLoanAction(loan.id, 'reject')}
                            disabled={actionLoading === loan.id}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {actionLoading === loan.id ? (
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : null}
                            Reject
                          </button>
                          <button
                            onClick={() => handleLoanAction(loan.id, 'approve')}
                            disabled={actionLoading === loan.id}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {actionLoading === loan.id ? (
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : null}
                            Approve & Fund
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
