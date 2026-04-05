import { useState } from 'react';
import { transactionService } from '../services/transactionService';
import { useAuth } from '../hooks/useAuth';

const Contribute = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [senderSecret, setSenderSecret] = useState('');
  const [receiverPublic, setReceiverPublic] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const result = await transactionService.contribute(amount, senderSecret, receiverPublic);
      setMessage(`Contribution successful! Transaction hash: ${result.hash}`);
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.error || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Make a Contribution</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (XLM)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Secret Key (for demo)</label>
            <input
              type="text"
              value={senderSecret}
              onChange={(e) => setSenderSecret(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
            <p className="text-xs text-gray-500 mt-1">In production this would be securely stored.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Receiver Public Key</label>
            <input
              type="text"
              value={receiverPublic}
              onChange={(e) => setReceiverPublic(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          {message && <div className="bg-green-100 text-green-700 p-3 rounded">{message}</div>}
          {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Send Contribution'}
          </button>
        </form>
      </div>
      <div className="mt-6 text-sm text-gray-600">
        <p>⚠️ Demo note: Use a funded Stellar testnet account. Get free test XLM from <a href="https://friendbot.stellar.org" target="_blank" className="text-blue-600">Friendbot</a>.</p>
      </div>
    </div>
  );
};

export default Contribute;