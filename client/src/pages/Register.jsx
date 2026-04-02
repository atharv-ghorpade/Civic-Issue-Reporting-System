import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [formData, setFormData] = useState({ 
    full_name: '', 
    username: '', 
    email: '', 
    password: '',
    role: 'citizen',
    is_active: true,
    is_verified: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role || "citizen",
        is_active: true,
        is_verified: false
      };
      await register(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Registration Error:', err.response?.data);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
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
        <h1 className="text-2xl font-bold text-primary text-center mb-6">Create Account</h1>
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity:0, height: 0 }} animate={{ opacity:1, height: 'auto' }} className="bg-green-50 text-green-600 p-3 rounded-xl text-sm mb-4 font-bold text-center">
              Account Created! Redirecting to login...
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity:0, height: 0 }} animate={{ opacity:1, height: 'auto' }} className="bg-red-50 text-red-500 p-3 rounded-xl text-sm mb-4">
              {typeof error === 'string' ? error : (error?.message || JSON.stringify(error) || "Registration failed")}
            </motion.div>
          )}
        </AnimatePresence>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Full Name</label>
            <input 
              type="text" 
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
              value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Username</label>
            <input 
              type="text" 
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
              value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Account Role</label>
            <select 
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-white"
              value={formData.role} 
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="citizen">Citizen</option>
              <option value="authority">Department Authority</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Min. 8 characters"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required 
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className={`w-full text-white p-3 rounded-2xl font-semibold shadow-md transition-all ${loading ? 'bg-gray-400' : 'bg-primary hover:bg-opacity-90'}`}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </motion.button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account? <Link to="/" className="text-accent underline">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
}
