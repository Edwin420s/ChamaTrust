import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { formatCurrency, formatRelativeTime, getRiskColor } from '../utils/helpers';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Loan = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [amount, setAmount] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [repaymentPeriod, setRepaymentPeriod] = useState('6');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loans, setLoans] = useState([]);
  const [trustScore, setTrustScore] = useState(0);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [showRiskDetails, setShowRiskDetails] = useState(false);
  const [activeTab, setActiveTab] = useState(location.search.includes('tab=repayment') ? 'repayment' : 'application');
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  const loanPurposes = [
    { id: 'business', label: 'Business Expansion', description: 'Expand or start a business' },
    { id: 'emergency', label: 'Emergency', description: 'Emergency financial needs' },
    { id: 'education', label: 'Education', description: 'School fees or educational expenses' },
    { id: 'personal', label: 'Personal Development', description: 'Personal growth and development' }
  ];

  const repaymentPeriods = [
    { id: '3', label: '3 months', multiplier: 1.05 },
    { id: '6', label: '6 months', multiplier: 1.10 },
    { id: '12', label: '12 months', multiplier: 1.20 },
    { id: '24', label: '24 months', multiplier: 1.35 },
    { id: '36', label: '36 months', multiplier: 1.50 },
    { id: '48', label: '48 months', multiplier: 1.65 }
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch user's trust score
      const trustData = await transactionService.getTrustScore();
      setTrustScore(trustData.trustScore || 0);

      // Fetch user's loans
      const loansData = await transactionService.getLoans();
      setLoans(loansData || []);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // Set empty state if API fails
      setLoans([]);
      setTrustScore(0);
    }
  };

  const assessRisk = async (loanAmount) => {
    // Try to get real risk assessment from API
    try {
      const riskData = await transactionService.getLoanRisk(loanAmount);
      setRiskAssessment(riskData);
      return;
    } catch (error) {
      console.log('Using mock risk assessment');
    }

    // Mock risk assessment as fallback
    const score = trustScore;
    let riskLevel = 'LOW';
    let riskScore = 0;
    let recommendation = '';

    if (score >= 80) {
      riskLevel = 'LOW';
      riskScore = 15;
      recommendation = 'Excellent credit profile. Auto-approval recommended.';
    } else if (score >= 60) {
      riskLevel = 'MEDIUM';
      riskScore = 45;
      recommendation = 'Good credit profile. Additional documentation may be required.';
    } else {
      riskLevel = 'HIGH';
      riskScore = 75;
      recommendation = 'Higher risk profile. Collateral or guarantor required.';
    }

    // Adjust based on amount
    if (loanAmount > 50000) {
      riskScore += 15;
      recommendation += ' High amount requires additional review.';
    }

    setRiskAssessment({
      riskLevel,
      riskScore,
      recommendation,
      maxAmount: score >= 80 ? 100000 : score >= 60 ? 50000 : 25000,
      interestRate: score >= 80 ? 8 : score >= 60 ? 12 : 18,
      approvalProbability: score >= 80 ? 95 : score >= 60 ? 70 : 40
    });
  };

  const handleAmountChange = (value) => {
    setAmount(value);
    if (value && Number(value) > 0) {
      assessRisk(Number(value));
    } else {
      setRiskAssessment(null);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    // Validation
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid loan amount');
      setLoading(false);
      return;
    }
    
    if (!loanPurpose) {
      setError('Please select a loan purpose to continue');
      setLoading(false);
      return;
    }
    
    if (!repaymentPeriod) {
      setError('Please select a repayment period');
      setLoading(false);
      return;
    }

    try {
      const response = await transactionService.applyLoan({
        amount: Number(amount),
        interestRate: riskAssessment?.interestRate || 12,
        repaymentPeriod: parseInt(repaymentPeriod),
        purpose: loanPurposes.find(p => p.id === loanPurpose)?.label || 'General'
      });
      
      setMessage(`Loan application submitted successfully! Application ID: #LOAN${String(response.loan.id).padStart(6, '0')}`);
      
      // Refresh loans data
      fetchUserData();
      
      setAmount('');
      setLoanPurpose('');
      setRepaymentPeriod('6');
      setRiskAssessment(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Application failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'repaid':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateTotalRepayment = () => {
    if (!amount) return 0;
    const period = repaymentPeriods.find(p => p.id === repaymentPeriod);
    return Math.ceil(Number(amount) * period.multiplier);
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
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${!sidebarOpen && 'justify-center'}`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {sidebarOpen && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </Link>
            );
          })}
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
        <div className="p-8 space-y-8">
          {/* Breadcrumb & Back Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 font-medium">Loans</span>
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
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Management</h1>
        <p className="text-gray-600">Access quick loans based on your trust score and community reputation</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('application')}
            className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              activeTab === 'application'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Apply for Loan
          </button>
          <button
            onClick={() => setActiveTab('repayment')}
            className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              activeTab === 'repayment'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Loan Repayment
          </button>
        </div>
      </div>

      {/* Loan Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Loans</p>
              <p className="text-xl font-semibold text-gray-900">{loans.filter(l => l.status === 'active').length}</p>
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
              <p className="text-sm font-medium text-gray-500">Repaid</p>
              <p className="text-xl font-semibold text-gray-900">{loans.filter(l => l.status === 'repaid').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Credit Score</p>
              <p className="text-xl font-semibold text-gray-900">{trustScore}/100</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Debt</p>
              <p className="text-xl font-semibold text-gray-900">{formatCurrency(loans.reduce((sum, loan) => sum + (loan.remainingBalance || 0), 0))}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Loan Application Form */}
        {activeTab === 'application' && (
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Apply for a Loan</h2>
            </div>

            <div className="p-6">
              <form onSubmit={handleApply} className="space-y-6">
                {/* Loan Purpose */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Loan Purpose <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {loanPurposes.map((purpose) => (
                      <div key={purpose.id} className="relative">
                        <input
                          type="radio"
                          id={purpose.id}
                          name="loanPurpose"
                          value={purpose.id}
                          checked={loanPurpose === purpose.id}
                          onChange={(e) => setLoanPurpose(e.target.value)}
                          className="sr-only peer"
                        />
                        <label
                          htmlFor={purpose.id}
                          className={`block w-full p-4 border-2 rounded-lg cursor-pointer text-left transition-all duration-200 peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:bg-gray-50 ${
                            !loanPurpose && error?.includes('purpose') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        >
                          <div className="font-medium text-gray-900">{purpose.label}</div>
                          <div className="text-sm text-gray-500 mt-1">{purpose.description}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                  {!loanPurpose && error?.includes('purpose') && (
                    <p className="mt-2 text-sm text-red-600">Please select a loan purpose</p>
                  )}
                </div>

                {/* Loan Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Loan Amount (KES)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">KES</span>
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder="0.00"
                      min="1000"
                      max="100000"
                      step="100"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum: KES 1,000 | Maximum: KES 100,000</p>
                </div>

                {/* Repayment Period */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Repayment Period</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {repaymentPeriods.map((period) => (
                      <div key={period.id} className="relative">
                        <input
                          type="radio"
                          id={period.id}
                          name="repaymentPeriod"
                          value={period.id}
                          checked={repaymentPeriod === period.id}
                          onChange={(e) => setRepaymentPeriod(e.target.value)}
                          className="sr-only peer"
                        />
                        <label
                          htmlFor={period.id}
                          className="block w-full p-3 border-2 rounded-lg cursor-pointer text-center transition-all duration-200 peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:bg-gray-50"
                        >
                          <div className="font-medium text-gray-900">{period.label}</div>
                          <div className="text-xs text-gray-500">{(period.multiplier - 1) * 100}% interest</div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Assessment */}
                {riskAssessment && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Risk Assessment</h3>
                      <button
                        type="button"
                        onClick={() => setShowRiskDetails(!showRiskDetails)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {showRiskDetails ? 'Hide' : 'Show'} Details
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          riskAssessment.riskLevel === 'LOW' ? 'bg-green-100 text-green-800' :
                          riskAssessment.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {riskAssessment.riskLevel} Risk
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Interest Rate</div>
                        <div className="font-medium text-gray-900">{riskAssessment?.interestRate || 12}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Approval Chance</div>
                        <div className="font-medium text-gray-900">{riskAssessment?.approvalProbability || 0}%</div>
                      </div>
                    </div>

                    {showRiskDetails && (
                      <div className="text-sm text-gray-600 space-y-2">
                        <p>• {riskAssessment?.recommendation || 'Risk assessment being calculated...'}</p>
                        <p>• Maximum eligible amount: {formatCurrency(riskAssessment?.maxAmount || 0)}</p>
                        <p>• Total repayment: {formatCurrency(calculateTotalRepayment())}</p>
                        <p>• Monthly payment: {formatCurrency(Math.ceil(calculateTotalRepayment() / parseInt(repaymentPeriod)))}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Messages */}
                {message && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm text-green-800">{message}</div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm text-red-800">{error}</div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !amount || !loanPurpose || !repaymentPeriod}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Application...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Submit Application
                    </div>
                  )}
                </button>
                
                {/* Helper text */}
                {!amount || !loanPurpose || !repaymentPeriod ? (
                  <div className="mt-3 text-sm text-gray-500 text-center">
                    {!amount && !loanPurpose && !repaymentPeriod 
                      ? 'Please enter an amount, select a loan purpose, and choose a repayment period to continue'
                      : !amount && !loanPurpose
                      ? 'Please enter an amount and select a loan purpose to continue'
                      : !amount && !repaymentPeriod
                      ? 'Please enter an amount and choose a repayment period to continue'
                      : !loanPurpose && !repaymentPeriod
                      ? 'Please select a loan purpose and choose a repayment period to continue'
                      : !amount 
                      ? 'Please enter a loan amount to continue'
                      : !loanPurpose
                      ? 'Please select a loan purpose to continue'
                      : 'Please choose a repayment period to continue'
                    }
                  </div>
                ) : null}
              </form>
            </div>
          </div>
        </div>
        )}

        {/* Sidebar */}
        {activeTab === 'application' && (
          <div className="space-y-6">
            {/* Loan Calculator */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Calculator</h3>
              {amount ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Principal Amount</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Interest Rate</span>
                    <span className="font-medium">{riskAssessment?.interestRate || 12}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Repayment Period</span>
                    <span className="font-medium">{repaymentPeriods.find(p => p.id === repaymentPeriod)?.label}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-900">Total Repayment</span>
                      <span className="font-bold text-lg text-blue-600">{formatCurrency(calculateTotalRepayment())}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-600">Monthly Payment</span>
                      <span className="font-medium">{formatCurrency(Math.ceil(calculateTotalRepayment() / parseInt(repaymentPeriod)))}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Enter an amount to see calculations</p>
              )}
            </div>

          {/* Your Loans */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Loans</h3>
              {loans.length === 0 ? (
                <p className="text-sm text-gray-500">No loans yet. Apply for your first loan!</p>
              ) : (
                <div className="space-y-3">
                  {loans.slice(0, 3).map((loan) => (
                    <div key={loan.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{formatCurrency(loan.amount)}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(loan.status)}`}>
                          {loan.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        <div>{loan.purpose}</div>
                        <div>Applied {formatRelativeTime(loan.appliedDate)}</div>
                      </div>
                    </div>
                  ))}
                  {loans.length > 3 && (
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View all loans
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Loan Guidelines</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Loans are based on your trust score</li>
                <li>• Higher scores = better rates & limits</li>
                <li>• Repayments are automatic</li>
                <li>• No collateral required for low-risk loans</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 mt-4">
                Learn More
              </button>
            </div>
          </div>
        )}

        {/* Loan Repayment Section */}
        {activeTab === 'repayment' && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Repayment Header */}
              <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Loan Repayment</h2>
              </div>

              <div className="p-6">
                {/* Active Loans for Repayment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Select Loan to Repay</h3>
                
                  {loans.filter(loan => loan.status === 'active').length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <p className="text-gray-500">No active loans to repay</p>
                      <button 
                        onClick={() => setActiveTab('application')}
                        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Apply for a loan
                      </button>
                    </div>
                  ) : (
                    loans.filter(loan => loan.status === 'active').map((loan) => (
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
                            <p className="font-medium">{loan.nextDueDate || '15th of month'}</p>
                          </div>
                        </div>
                        
                        <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                          Make Repayment
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Repayment History */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Repayments</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Monthly Repayment</p>
                        <p className="text-sm text-gray-500">March 2026</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">-KES 2,500</p>
                        <p className="text-xs text-gray-500">Completed</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Monthly Repayment</p>
                        <p className="text-sm text-gray-500">February 2026</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">-KES 2,500</p>
                        <p className="text-xs text-gray-500">Completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Repayment Tips */}
            <div className="bg-orange-50 rounded-xl p-6 mt-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">Repayment Tips</h3>
              <ul className="text-sm text-orange-800 space-y-2">
                <li>• On-time repayments improve your trust score</li>
                <li>• Early repayments may reduce interest</li>
                <li>• Set up automatic payments for convenience</li>
                <li>• Contact support if you need a payment extension</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      </div>
      </main>
    </div>
  );
};

export default Loan;
