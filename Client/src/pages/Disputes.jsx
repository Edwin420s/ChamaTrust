import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';

const Disputes = () => {
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    transactionService.getDisputes()
      .then(data => setDisputes(data.disputes || []))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const result = await transactionService.createDispute(description, evidenceUrl);
      setMessage(`Dispute #${result.id} created. Status: ${result.status}`);
      setDescription('');
      setEvidenceUrl('');
      // refresh disputes
      const updated = await transactionService.getDisputes();
      setDisputes(updated.disputes);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create dispute');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      open: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Dispute Resolution</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Raise a Dispute</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Evidence URL (optional)</label>
            <input
              type="url"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="https://..."
            />
          </div>
          {message && <div className="bg-green-100 text-green-700 p-3 rounded">{message}</div>}
          {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Dispute'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Disputes</h2>
        {disputes.length === 0 ? (
          <p className="text-gray-500">No disputes filed.</p>
        ) : (
          <div className="space-y-4">
            {disputes.map(dispute => (
              <div key={dispute.id} className="border rounded p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{dispute.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {dispute.evidence_url && <a href={dispute.evidence_url} target="_blank" className="text-blue-600">View Evidence</a>}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(dispute.status)}`}>
                    {dispute.status}
                  </span>
                </div>
                {dispute.resolution && (
                  <p className="mt-2 text-sm bg-gray-50 p-2 rounded">Resolution: {dispute.resolution}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Disputes;