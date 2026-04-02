import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

export default function AuthorityDashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = () => {
    api.get('/issues').then(res => {
      // Filter issues assigned to this authority
      const myIssues = res.data.filter(issue => issue.assignedTo === user.id);
      setIssues(myIssues);
    }).catch(err => console.error(err));
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/issues/${id}`, { status });
    fetchIssues();
  };

  const getStatusColor = (status) => {
    if (status === 'resolved') return 'bg-success text-white';
    if (status === 'in progress') return 'bg-warning text-white';
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
        {issues.map(issue => (
          <motion.div key={issue.id} whileHover={{ y: -5 }} className="border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all bg-white relative">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">{issue.category}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-lg capitalize ${getStatusColor(issue.status)}`}>{issue.status}</span>
            </div>
            <h3 className="font-bold text-lg mb-2 text-primary">{issue.title}</h3>
            <p className="text-sm text-gray-500 mb-6">{issue.location} • {new Date(issue.date).toLocaleDateString()}</p>
            
            <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-50">
              {issue.status === 'assigned' && (
                <button 
                  onClick={() => updateStatus(issue.id, 'in progress')} 
                  className="flex-1 bg-warning text-white text-sm py-2 rounded-xl font-bold shadow-sm hover:bg-opacity-90 transition"
                >
                  Start Work
                </button>
              )}
              {issue.status === 'in progress' && (
                <button 
                  onClick={() => updateStatus(issue.id, 'resolved')} 
                  className="flex-1 bg-success text-white text-sm py-2 rounded-xl font-bold shadow-sm hover:bg-opacity-90 transition"
                >
                  Mark Resolved
                </button>
              )}
              {issue.status === 'resolved' && (
                <span className="flex-1 text-center text-success font-semibold text-sm py-2">
                  Completed
                </span>
              )}
            </div>
          </motion.div>
        ))}
        {issues.length === 0 && (
          <div className="col-span-full bg-white p-10 rounded-2xl border border-gray-100 text-center text-gray-500 shadow-sm">
            You currently have no assigned issues.
          </div>
        )}
      </div>
    </div>
  );
}
