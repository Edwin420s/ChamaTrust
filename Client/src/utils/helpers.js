import { TRUST_SCORE_RANGES } from './constants';

export const formatCurrency = (amount, currency = 'KES') => {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency }).format(amount);
};

export const truncateHash = (hash, length = 6) => {
  if (!hash) return '';
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
};

export const getRiskColor = (risk) => {
  switch (risk) {
    case 'LOW': return 'text-green-600';
    case 'MEDIUM': return 'text-yellow-600';
    case 'HIGH': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const getTrustScoreInfo = (score) => {
  const range = Object.values(TRUST_SCORE_RANGES).find(
    r => score >= r.min && score <= r.max
  );
  return range || TRUST_SCORE_RANGES.POOR;
};

export const formatDate = (date) => {
  if (!date) return 'Invalid date';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

export const formatRelativeTime = (date) => {
  if (!date) return 'Invalid date';
  const past = new Date(date);
  if (isNaN(past.getTime())) return 'Invalid date';
  
  const now = new Date();
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(date);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateStellarAddress = (address) => {
  return /^G[A-Z0-9]{55}$/.test(address);
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};