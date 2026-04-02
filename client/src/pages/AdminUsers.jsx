import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Fetch Users Error:', err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerify = async (userId) => {
    try {
      await adminService.verifyUser(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, is_verified: true } : u));
    } catch (err) {
      alert("Verification failed");
    }
  };

  const filteredUsers = users.filter(u => {
    if (filter === 'all') return true;
    if (filter === 'verified') return u.is_verified;
    if (filter === 'unverified') return !u.is_verified;
    return u.role === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">User Management</h1>
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1">
          {['all', 'unverified', 'citizen', 'authority'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filter===f ? 'bg-accent text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.1em]">
              <th className="py-4 px-6 text-center">ID</th>
              <th className="py-4 px-6">Name & Email</th>
              <th className="py-4 px-6">Username</th>
              <th className="py-4 px-6 text-center">Role</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="6" className="py-20 text-center text-gray-400">Fetching users...</td></tr>
            ) : error ? (
              <tr><td colSpan="6" className="py-20 text-center text-red-400">{error}</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="6" className="py-20 text-center text-gray-400">No users matched.</td></tr>
            ) : (
                filteredUsers.map(u => (
                <motion.tr layout key={u.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-center text-gray-400 text-sm font-medium">{u.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-gray-800 text-sm">{u.full_name}</p>
                    <p className="text-[11px] text-gray-400">{u.email}</p>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-xs font-medium">@{u.username}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${u.role==='admin'?'bg-purple-100 text-purple-600':u.role==='authority'?'bg-blue-100 text-blue-600':'bg-green-100 text-green-600'}`}>{u.role}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {u.is_verified ? (
                      <span className="inline-flex items-center text-[10px] text-green-500 font-bold bg-green-50 px-2 py-1 rounded-lg">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                        Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-1 rounded-lg">Pending</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {!u.is_verified && (
                      <button 
                        onClick={() => handleVerify(u.id)}
                        className="text-white bg-accent px-4 py-1.5 rounded-lg text-[11px] font-bold shadow-md hover:bg-opacity-90 active:scale-95 transition-all"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
