import TrustScore from '../components/TrustScore';
import TransactionList from '../components/TransactionList';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TrustScore />
        </div>
        <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
          <div className="flex space-x-4">
            <a href="/contribute" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Contribute</a>
            <a href="/loan" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Apply for Loan</a>
            <a href="/disputes" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Raise Dispute</a>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <TransactionList />
      </div>
    </div>
  );
};

export default Dashboard;