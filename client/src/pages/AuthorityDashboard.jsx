import { useState, useEffect } from 'react';
import issueService from '../services/issueService';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

export default function AuthorityDashboard() {
  const { user } = useAuth();
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
  }, [user?.id]);

  const updateStatus = async (id, status) => {
    try {
      await issueService.updateIssueStatus(id, { status });
      fetchIssuesData();
    } catch (err) {
      console.error('Update Status Error:', err);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'resolved') return 'bg-success text-white';
    if (status === 'in-progress') return 'bg-warning text-white';
    if (status === 'assigned') return 'bg-accent text-white';
    return 'bg-gray-200 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-primary">Authority Dashboard</h1>
        <p className="text-gray-500">Manage and resolve issues assigned to you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-500 font-medium">Loading issues...</div>
        ) : error ? (
          <div className="col-span-full py-12 text-center text-red-500 font-medium">{typeof error === 'string' ? error : (error?.message || "Failed to load dashboard data")}</div>
        ) : issues.length > 0 ? (
          issues.map(issue => (
            <motion.div key={issue.id} whileHover={{ y: -5 }} className="border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all bg-white relative">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">{issue?.category}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg capitalize ${getStatusColor(issue?.status)}`}>{issue?.status}</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-primary">{issue?.title}</h3>
              <p className="text-sm text-gray-500 mb-6">{issue?.location} • {issue?.date ? new Date(issue.date).toLocaleDateString() : 'N/A'}</p>
              
              <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-50">
                {(issue?.status === 'assigned' || issue?.status === 'open') && (
                  <button 
                    onClick={() => updateStatus(issue.id, 'in-progress')} 
                    className="flex-1 bg-warning text-white text-sm py-2 rounded-xl font-bold shadow-sm hover:bg-opacity-90 transition"
                  >
                    Start Work
                  </button>
                )}
                {issue?.status === 'in-progress' && (
                  <button 
                    onClick={() => updateStatus(issue.id, 'resolved')} 
                    className="flex-1 bg-success text-white text-sm py-2 rounded-xl font-bold shadow-sm hover:bg-opacity-90 transition"
                  >
                    Mark Resolved
                  </button>
                )}
                {issue?.status === 'resolved' && (
                  <span className="flex-1 text-center text-success font-semibold text-sm py-2">
                    Completed
                  </span>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full bg-white p-10 rounded-2xl border border-gray-100 text-center text-gray-500 shadow-sm">
            You currently have no assigned issues.
          </div>
        )}
      </div>
    </div>
  );
}
