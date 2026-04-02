import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import adminService from '../services/adminService';
import issueService from '../services/issueService';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, resolved: 0 });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, issuesData] = await Promise.all([
          adminService.getStats(),
          issueService.getAllIssues()
        ]);
        setStats(statsData);
        setRecentIssues(Array.isArray(issuesData) ? issuesData.slice(0, 5) : []);
        setError(null);
      } catch (err) {
        console.error('Fetch Admin Dashboard Data Error:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Issues', value: stats.total, color: 'text-primary' },
    { label: 'Open', value: stats.open, color: 'text-danger' },
    { label: 'In Progress', value: stats.in_progress, color: 'text-warning' },
    { label: 'Resolved', value: stats.resolved, color: 'text-success' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
        <Link to="/admin-users">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-accent text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md">
             Manage Users
          </motion.button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 font-medium mb-2">{stat.label}</p>
            <h2 className={`text-4xl font-bold ${stat.color}`}>{stat.value}</h2>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-primary mb-6">Recent Reports</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="pb-3 px-2">Title</th>
                <th className="pb-3 px-2">Category</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">Date</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="py-10 text-center text-gray-400">Loading data...</td></tr>
              ) : error ? (
                <tr><td colSpan="5" className="py-10 text-center text-red-500">{error}</td></tr>
              ) : recentIssues.length === 0 ? (
                <tr><td colSpan="5" className="py-10 text-center text-gray-500">No recent reports found.</td></tr>
              ) : (
                recentIssues.map(issue => (
                  <tr key={issue.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                    <td className="py-4 px-2 font-bold text-gray-800 text-sm">{issue?.title}</td>
                    <td className="py-4 px-2 text-xs text-gray-500 font-medium">{issue?.category}</td>
                    <td className="py-4 px-2">
                       <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-400 uppercase">{issue?.status}</span>
                    </td>
                    <td className="py-4 px-2 text-[10px] font-medium text-gray-400">{issue?.created_at ? new Date(issue.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td className="py-4 px-2 text-right">
                       <Link to={`/issue/${issue.id}`} className="text-[10px] font-bold text-accent uppercase hover:underline">View Detail</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
