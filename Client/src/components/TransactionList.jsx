import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { formatCurrency, formatRelativeTime, truncateHash } from '../utils/helpers';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionService.getTransactions();
        // Mock data for demonstration
        const mockTransactions = [
          {
            id: 1,
            amount: 5000,
            type: 'contribution',
            status: 'completed',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            description: 'Monthly contribution',
            stellarTxHash: 'abc123def456'
          },
          {
            id: 2,
            amount: 2500,
            type: 'loan_repayment',
            status: 'completed',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            description: 'Loan repayment - March',
            stellarTxHash: 'xyz789uvw456'
          },
          {
            id: 3,
            amount: 10000,
            type: 'loan_disbursement',
            status: 'completed',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            description: 'Business loan approved',
            stellarTxHash: 'def456ghi789'
          },
          {
            id: 4,
            amount: 500,
            type: 'penalty',
            status: 'pending',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
            description: 'Late payment penalty',
            stellarTxHash: null
          }
        ];
        setTransactions(mockTransactions);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(tx => 
    filter === 'all' || tx.type === filter
  );

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'contribution':
        return (
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case 'loan_disbursement':
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case 'loan_repayment':
        return (
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        );
      case 'penalty':
        return (
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAmountColor = (type) => {
    return type === 'contribution' || type === 'loan_disbursement' ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
        <p className="text-gray-500">Your transaction history will appear here once you start contributing or taking loans.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {['all', 'contribution', 'loan_disbursement', 'loan_repayment', 'penalty'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              filter === type
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {type === 'all' ? 'All' : 
             type === 'contribution' ? 'Contributions' :
             type === 'loan_disbursement' ? 'Loans' :
             type === 'loan_repayment' ? 'Repayments' : 'Penalties'}
          </button>
        ))}
      </div>

      {/* Transaction Cards */}
      <div className="space-y-4">
        {filteredTransactions.map((tx) => (
          <div key={tx.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {getTransactionIcon(tx.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {tx.type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-500">{tx.description}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${getAmountColor(tx.type)}`}>
                        {tx.type === 'contribution' || tx.type === 'loan_disbursement' ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatRelativeTime(tx.timestamp)}
                      </span>
                      {tx.stellarTxHash && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Verified on Stellar
                        </span>
                      )}
                    </div>
                    {tx.stellarTxHash && (
                      <button
                        onClick={() => navigator.clipboard.writeText(tx.stellarTxHash)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                        title="Copy transaction hash"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {truncateHash(tx.stellarTxHash)}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {filteredTransactions.length > 0 && (
        <div className="text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Load more transactions
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;