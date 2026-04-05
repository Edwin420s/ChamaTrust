import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Contribute from './pages/Contribute';
import Loan from './pages/Loan';
import LoanRepayment from './pages/LoanRepayment';
import Disputes from './pages/Disputes';
import Profile from './pages/Profile';
import AdminProfile from './pages/AdminProfile';
import AdminLoanManagement from './pages/AdminLoanManagement';
import AdminDisputeResolution from './pages/AdminDisputeResolution';
import Admin from './pages/Admin';
import Landing from './pages/Landing';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import ProfileRouter from './components/ProfileRouter';
import DashboardRouter from './components/DashboardRouter';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardRouter /></PrivateRoute>} />
            <Route path="/contribute" element={<PrivateRoute><Contribute /></PrivateRoute>} />
            <Route path="/loan" element={<PrivateRoute><Loan /></PrivateRoute>} />
            <Route path="/repayment" element={<PrivateRoute><LoanRepayment /></PrivateRoute>} />
            <Route path="/disputes" element={<PrivateRoute><Disputes /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfileRouter /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
            <Route path="/admin/loans" element={<PrivateRoute><AdminLoanManagement /></PrivateRoute>} />
            <Route path="/admin/disputes" element={<PrivateRoute><AdminDisputeResolution /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;