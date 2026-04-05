const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const formatCurrency = (amount, currency = 'KES') => {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency }).format(amount);
};

module.exports = { sleep, formatCurrency };