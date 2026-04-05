import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';

const Loan = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loans, setLoans] = useState([]);
  const [trustScore, setTrustScore] = useState(null);

  useEffect(() => {
    transactionService.getLoans()
      .then(data => setLoans(data.loans || []))
      .catch(console.error);
    transactionService.getTrustScore()
      .then(data => setTrustScore(data.trustScore))
      .catch(console.error);
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const result = await transactionService.applyLoan(amount);
      setMessage(`Loan application submitted. Risk level: ${result.riskLevel}. ${result.recommendation || ''}`);
      setAmount('');
      // refresh loans
      const updatedLoans = await transactionService.getLoans();
      setLoans(updatedLoans.loans);
    } catch (err) {
      setError(err.response?.data?.error || 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (risk) => {
    const colors = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-red-100 text-red-800'
    };
    return colors[risk] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Loan Management</h1>

      {trustScore !== null && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-sm text-blue-700">Your current trust score: <strong>{trustScore}/100</strong></p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Apply for a Loan</h2>
        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (KES)</label>
            <input
              type="number"
              step="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          {message && <div className="bg-green-100 text-green-700 p-3 rounded">{message}</div>}
          {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Apply Now'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Loans</h2>
        {loans.length === 0 ? (
          <p className="text-gray-500">No loans yet.</p>
        ) : (
          <div className="space-y-4">
            {loans.map(loan => (
              <div key={loan.id} className="border rounded p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">KES {loan.amount}</p>
                  <p className="text-sm text-gray-500">Status: {loan.status}</p>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getRiskBadge(loan.risk_level)}`}>
                    Risk: {loan.risk_level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Loan;