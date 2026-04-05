import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';
import AdminProfile from '../pages/AdminProfile';

const DashboardRouter = () => {
  const { user } = useContext(AuthContext);
  
  // Check if user has admin role
  const isAdmin = user?.role === 'admin';
  
  if (isAdmin) {
    return <AdminProfile />;
  }
  
  return <Dashboard />;
};

export default DashboardRouter;
