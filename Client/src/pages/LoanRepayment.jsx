import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency, formatRelativeTime } from '../utils/helpers';
import { transactionService } from '../services/transactionService';

const LoanRepayment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeLoans, setActiveLoans] = useState([]);
  const [repaymentHistory, setRepaymentHistory] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { path: '/contribute', label: 'Contribute', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
    { path: '/loan', label: 'Loans', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { path: '/repayment', label: 'Repayment', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { path: '/disputes', label: 'Disputes', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { path: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleUserClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        // Fetch user's loans
        const loansData = await transactionService.getLoans();
        const activeLoans = loansData.filter(loan => loan.status === 'active' || loan.status === 'approved');
        
        // Fetch transactions for repayment history
        const transactions = await transactionService.getTransactions();
        const repayments = transactions.filter(tx => tx.type === 'loan_repayment');
        
        setActiveLoans(activeLoans);
        setRepaymentHistory(repayments);
      } catch (error) {
        console.error('Failed to fetch loan data:', error);
        setActiveLoans([]);
        setRepaymentHistory([]);
      }
    };

    fetchLoanData();
  }, []);

  const handleRepayment = async (loanId) => {
    if (!repaymentAmount || parseFloat(repaymentAmount) <= 0) {
      setError('Please enter a valid repayment amount');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update loan balance
      setActiveLoans(prev => prev.map(loan => {
        if (loan.id === loanId) {
          const newBalance = loan.remainingBalance - parseFloat(repaymentAmount);
          return {
            ...loan,
            remainingBalance: Math.max(0, newBalance),
            status: newBalance <= 0 ? 'repaid' : 'active'
          };
        }
        return loan;
      }));

      // Add to repayment history
      const newRepayment = {
        id: repaymentHistory.length + 1,
        loanId,
        amount: parseFloat(repaymentAmount),
        date: new Date(),
        status: 'completed',
        method: 'Stellar',
        transactionHash: 'new' + Math.random().toString(36).substring(7)
      };

      setRepaymentHistory(prev => [newRepayment, ...prev]);
      setMessage(`Repayment of ${formatCurrency(repaymentAmount)} processed successfully!`);
      setRepaymentAmount('');
      setSelectedLoan(null);

    } catch (err) {
      setError('Repayment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'repaid':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside 
        className={`bg-white shadow-lg transition-all duration-300 fixed h-full z-10 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && (
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">ChamaTrust</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {sidebarOpen && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Info Footer */}
        {sidebarOpen && user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <div className="relative">
              <button
                onClick={handleUserClick}
                className="flex items-center space-x-3 w-full hover:bg-gray-50 rounded-lg p-2 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500">Trust Score: {user.trustScore || 0}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                  >
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm text-red-600 font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8">
          {/* Breadcrumb & Back Navigation */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 font-medium">Loan Repayment</span>
            </div>
            
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Go Back</span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Repayment</h1>
            <p className="text-gray-600">Manage your loan repayments and track payment history</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Outstanding</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(activeLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Next Payment Due</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {activeLoans.length > 0 ? 'Calculate based on loan terms' : 'No active loans'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Payments Made</p>
                  <p className="text-xl font-semibold text-gray-900">{repaymentHistory.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Loans */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Active Loans</h2>
            </div>

            <div className="p-6">
              {activeLoans.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">No active loans to repay</p>
                  <Link 
                    to="/loan"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply for a loan
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeLoans.map((loan) => (
                    <div key={loan.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{formatCurrency(loan.amount)}</h4>
                          <p className="text-sm text-gray-500">{loan.purpose}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Remaining</p>
                          <p className="font-semibold text-orange-600">{formatCurrency(loan.remainingBalance)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Monthly Payment</p>
                          <p className="font-medium">{formatCurrency(loan.monthlyPayment)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Next Due</p>
                          <p className="font-medium">{loan.nextDueDate}</p>
                        </div>
                      </div>

                      {selectedLoan === loan.id ? (
                        <div className="border-t pt-4">
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Repayment Amount (KES)
                            </label>
                            <input
                              type="number"
                              value={repaymentAmount}
                              onChange={(e) => setRepaymentAmount(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              placeholder="Enter amount"
                              min="1"
                              max={loan.remainingBalance}
                            />
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleRepayment(loan.id)}
                              disabled={loading}
                              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
                            >
                              {loading ? 'Processing...' : 'Make Repayment'}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedLoan(null);
                                setRepaymentAmount('');
                              }}
                              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedLoan(loan.id)}
                          className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                        >
                          Make Repayment
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Repayment History */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Repayment History</h2>
            </div>

            <div className="p-6">
              {repaymentHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No repayment history available</p>
              ) : (
                <div className="space-y-3">
                  {repaymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Loan Repayment</p>
                        <p className="text-sm text-gray-500">{formatRelativeTime(payment.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">-{formatCurrency(payment.amount)}</p>
                        <p className="text-xs text-gray-500">{payment.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg z-50">
              {message}
            </div>
          )}

          {error && (
            <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg z-50">
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LoanRepayment;
