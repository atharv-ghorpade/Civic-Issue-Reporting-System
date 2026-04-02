import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import UserDashboard from '../pages/UserDashboard';
import SubmitIssue from '../pages/SubmitIssue';
import IssueDetail from '../pages/IssueDetail';
import Notifications from '../pages/Notifications';
import AdminDashboard from '../pages/AdminDashboard';
import Reports from '../pages/Reports';
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';
import AuthorityDashboard from '../pages/AuthorityDashboard';
import AuthorityIssues from '../pages/AuthorityIssues';

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" />;
    if (user.role === 'authority') return <Navigate to="/authority-dashboard" />;
    return <Navigate to="/user-dashboard" />;
  }
  return <Layout>{children}</Layout>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Citizen Routes */}
      <Route path="/user-dashboard" element={<PrivateRoute role="citizen"><UserDashboard /></PrivateRoute>} />
      <Route path="/submit-issue" element={<PrivateRoute role="citizen"><SubmitIssue /></PrivateRoute>} />
      <Route path="/issue/:id" element={<PrivateRoute><IssueDetail /></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute role="citizen"><Notifications /></PrivateRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin-dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute role="admin"><Reports /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute role="admin"><Analytics /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute role="admin"><Settings /></PrivateRoute>} />

      {/* Authority Routes */}
      <Route path="/authority-dashboard" element={<PrivateRoute role="authority"><AuthorityDashboard /></PrivateRoute>} />
      <Route path="/authority-issues" element={<PrivateRoute role="authority"><AuthorityIssues /></PrivateRoute>} />
    </Routes>
  );
}
