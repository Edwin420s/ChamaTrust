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