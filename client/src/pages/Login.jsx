import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard automatically
    if (user) {
      if (user.role === 'admin') navigate('/admin-dashboard', { replace: true });
      else if (user.role === 'authority') navigate('/authority-dashboard', { replace: true });
      else navigate('/user-dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      if (user?.role === 'admin') navigate('/admin-dashboard');
      else if (user?.role === 'authority') navigate('/authority-dashboard');
      else if (user) navigate('/user-dashboard');
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-main p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-primary text-center mb-6">Welcome Back</h1>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm mb-4">{typeof error === 'string' ? error : (error?.message || "Invalid login credentials")}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
              value={email} onChange={e => setEmail(e.target.value)} required 
              placeholder="admin@test.com or user@test.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
              value={password} onChange={e => setPassword(e.target.value)} required 
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className={`w-full text-white p-3 rounded-2xl font-semibold shadow-md transition-all ${loading ? 'bg-gray-400' : 'bg-secondary hover:bg-opacity-90'}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-accent underline">Register here</Link>
        </p>
      </motion.div>
    </div>
  );
}
