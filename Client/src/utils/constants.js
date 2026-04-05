// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE_LOGIN: '/auth/google/mock',
    EMAIL_LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/users/profile'
  },
  TRANSACTIONS: {
    CONTRIBUTE: '/transactions/contribute',
    HISTORY: '/transactions'
  },
  LOANS: {
    APPLY: '/loans/apply',
    STATUS: '/loans',
    RISK: '/loans/risk'
  },
  DISPUTES: {
    CREATE: '/disputes',
    LIST: '/disputes'
  },
  TRUST: {
    SCORE: '/users/trust-score'
  }
};

// Transaction Types
export const TRANSACTION_TYPES = {
  CONTRIBUTION: 'contribution',
  LOAN_DISBURSEMENT: 'loan_disbursement',
  LOAN_REPAYMENT: 'loan_repayment',
  PENALTY: 'penalty'
};

// Loan Status
export const LOAN_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  REPAID: 'repaid',
  DEFAULTED: 'defaulted'
};

// Risk Levels
export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

// Dispute Status
export const DISPUTE_STATUS = {
  OPEN: 'open',
  UNDER_REVIEW: 'under_review',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
};

// Trust Score Ranges
export const TRUST_SCORE_RANGES = {
  EXCELLENT: { min: 80, max: 100, color: 'green', label: 'Excellent' },
  GOOD: { min: 60, max: 79, color: 'blue', label: 'Good' },
  FAIR: { min: 40, max: 59, color: 'yellow', label: 'Fair' },
  POOR: { min: 20, max: 39, color: 'orange', label: 'Poor' },
  VERY_POOR: { min: 0, max: 19, color: 'red', label: 'Very Poor' }
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  INVALID_INPUT: 'Please check your input and try again.',
  INSUFFICIENT_FUNDS: 'Insufficient funds for this transaction.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  CONTRIBUTION_SUCCESS: 'Contribution successful!',
  LOAN_APPLIED: 'Loan application submitted successfully!',
  DISPUTE_CREATED: 'Dispute created successfully!'
};

// Performance Settings
export const PERFORMANCE = {
  DEBOUNCE_DELAY: 300,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  ANIMATION_DURATION: 200,
  LAZY_LOAD_THRESHOLD: 200
};

// UI Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px'
};

// Accessibility Settings
export const ACCESSIBILITY = {
  FOCUS_VISIBLE_CLASS: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  SKIP_LINKS_CLASS: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
  ANNOUNCEMENT_DELAY: 1000
};

// Security Settings
export const SECURITY = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 3,
  PASSWORD_MIN_LENGTH: 8,
  TOKEN_REFRESH_BUFFER: 5 * 60 * 1000 // 5 minutes
};
