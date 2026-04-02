import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const [issues, setIssues] = useState([]);
  const [filterCat, setFilterCat] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    api.get('/issues/my').then(res => setIssues(res.data)).catch(err => console.error(err));
  }, []);

  const filtered = issues.filter(i => {
    const matchCat = filterCat === 'All' || i.category === filterCat;
    const matchStatus = filterStatus === 'All' || i.status === filterStatus.toLowerCase();
    return matchCat && matchStatus;
  });

  const getStatusColor = (status) => {
    if (status === 'resolved') return 'bg-success text-white';
    if (status === 'in progress') return 'bg-warning text-white';
    return 'bg-gray-200 text-gray-700';
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-primary">My Issues</h1>
          <p className="text-gray-500">Track and manage your reports.</p>
        </div>
        <Link to="/submit-issue">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-accent text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-shadow">
            + Report New Issue
          </motion.button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
           <span className="text-gray-500 font-medium">Total Issues Reported</span>
           <span className="text-2xl font-bold text-primary">{issues.length}</span>
         </div>
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
           <span className="text-gray-500 font-medium">Resolved Issues</span>
           <span className="text-2xl font-bold text-success">{issues.filter(i => i.status === 'resolved').length}</span>
         </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex gap-4 mb-6">
          <select 
            className="flex-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
            value={filterCat} onChange={e => setFilterCat(e.target.value)}
          >
            <option>All Category</option>
            <option>Roads</option>
            <option>Utilities</option>
            <option>Sanitation</option>
          </select>
          <select 
            className="flex-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          >
            <option>All Status</option>
            <option value="submitted">Submitted</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(issue => (
              <motion.div key={issue.id} variants={item} whileHover={{ y: -5, scale: 1.02 }} className="border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all bg-white flex flex-col justify-between h-full cursor-pointer" onClick={() => window.location.href=`/issue/${issue.id}`}>
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">{issue.category}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg capitalize ${getStatusColor(issue.status)}`}>{issue.status}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-primary">{issue.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 truncate">{issue.location} • {new Date(issue.date).toLocaleDateString()}</p>
                </div>
                <span className="text-accent text-sm font-bold inline-flex items-center">View Details <span className="ml-1">→</span></span>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-12 text-center text-gray-500 flex flex-col items-center">
            <div className="text-4xl mb-4 opacity-50">📂</div>
            <p className="font-medium">No issues found.</p>
            <p className="text-sm">Try adjusting your filters or report a new issue.</p>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-primary mb-6">Community Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
             <motion.div key={i} whileHover={{ scale: 1.03 }} className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-32 bg-gray-200 w-full flex items-center justify-center text-gray-400">
                  📷 City Moment {i}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-primary text-sm mb-1">New Park Opening</h4>
                  <p className="text-xs text-gray-500">Join us this weekend for the community gathering.</p>
                </div>
             </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
