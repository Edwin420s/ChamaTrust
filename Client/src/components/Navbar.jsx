import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">ChamaTrust</Link>
        <div className="flex space-x-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
          <Link to="/contribute" className="text-gray-700 hover:text-blue-600">Contribute</Link>
          <Link to="/loan" className="text-gray-700 hover:text-blue-600">Loans</Link>
          <Link to="/disputes" className="text-gray-700 hover:text-blue-600">Disputes</Link>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;