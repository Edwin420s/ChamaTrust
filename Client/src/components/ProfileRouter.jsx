import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Profile from '../pages/Profile';
import AdminProfile from '../pages/AdminProfile';

const ProfileRouter = () => {
  const { user } = useContext(AuthContext);
  
  // Check if user has admin role
  const isAdmin = user?.role === 'admin';
  
  if (isAdmin) {
    return <AdminProfile />;
  }
  
  return <Profile />;
};

export default ProfileRouter;
