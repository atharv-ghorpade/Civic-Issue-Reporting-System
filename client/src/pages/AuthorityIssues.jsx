import { useState, useEffect } from 'react';
import issueService from '../services/issueService';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function AuthorityIssues() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIssuesData = async () => {
    try {
      setLoading(true);
      // Fetch ALL issues and filter for current authority as backend lacks role-specific /issues/my
      const data = await issueService.getAllIssues();
      const myData = Array.isArray(data) ? data.filter(i => i.assigned_to_id === user?.id) : [];
      setIssues(myData);
      setError(null);
    } catch (err) {
      console.error('Fetch Authority Issues Error:', err);
      setError('Failed to load assigned issues.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchIssuesData();
  }, [user?.id, navigate]);

  const updateStatus = async (id, status) => {
    try {
      await issueService.updateIssueStatus(id, { status });
      fetchIssuesData();
    } catch (err) {
      console.error('Update Status Error:', err);
      alert('Failed to update status.');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemRow = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Assigned Issues</h1>
          <p className="text-gray-500">List of all issues specifically assigned to your department.</p>
        </div>
        <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
           <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Active</span>
           <div className="text-2xl font-black text-accent text-center">{issues.length}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">Title</th>
                <th className="py-4 px-6 font-bold">Category</th>
                <th className="py-4 px-6 font-bold">Location</th>
                <th className="py-4 px-6 font-bold">Priority</th>
                <th className="py-4 px-6 font-bold">Status</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan="6" className="py-16 text-center text-gray-500 font-medium">Loading issues...</td>
                </tr>
              </tbody>
            ) : error ? (
              <tbody>
                <tr>
                  <td colSpan="6" className="py-16 text-center text-red-500 font-medium">{error}</td>
                </tr>
              </tbody>
            ) : issues.length > 0 ? (
              <motion.tbody variants={container} initial="hidden" animate="show">
                {issues.map(issue => (
                   <motion.tr variants={itemRow} key={issue.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-6 font-bold text-gray-800">{issue?.title}</td>
                    <td className="py-5 px-6 text-sm text-gray-600 font-medium">{issue?.category}</td>
                    <td className="py-5 px-6 text-sm text-gray-500 truncate max-w-[150px]">{issue?.location}</td>
                    <td className="py-5 px-6">
                       <span className={`text-xs font-bold px-3 py-1 rounded-lg ${issue?.priority === 'High' || issue?.priority === 'Critical' ? 'bg-red-100 text-danger' : 'bg-blue-100 text-primary'}`}>
                          {issue?.priority}
                       </span>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`text-xs font-bold px-3 py-1 rounded-lg uppercase ${issue?.status === 'resolved' ? 'bg-green-100 text-success' : issue?.status === 'in-progress' ? 'bg-orange-100 text-warning' : 'bg-gray-100 text-gray-600'}`}>
                        {issue?.status}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right w-64">
                      <div className="flex justify-end gap-2">
                        {(issue?.status === 'assigned' || issue?.status === 'open') && (
                          <motion.button 
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => updateStatus(issue.id, 'in-progress')} 
                            className="text-xs font-bold px-3 py-2 rounded-lg bg-warning text-white shadow-sm hover:bg-opacity-90"
                          >
                            Start Work
                          </motion.button>
                        )}
                        {issue?.status === 'in-progress' && (
                          <motion.button 
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => updateStatus(issue.id, 'resolved')} 
                            className="text-xs font-bold px-3 py-2 rounded-lg bg-success text-white shadow-sm hover:bg-opacity-90"
                          >
                            Mark Resolved
                          </motion.button>
                        )}
                        <motion.button 
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/issue/${issue.id}`)}
                          className="text-xs font-bold px-3 py-2 rounded-lg bg-accent text-white shadow-sm hover:bg-red-600 transition-colors"
                        >
                          View Details
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="6" className="py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-5xl mb-4 opacity-50">📋</div>
                      <p className="font-semibold text-lg">No assigned issues</p>
                      <p className="text-sm">You are all caught up for now!</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
