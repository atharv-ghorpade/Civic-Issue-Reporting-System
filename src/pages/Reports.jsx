import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function Reports() {
  const [issues, setIssues] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    fetchIssues();
    api.get('/authorities').then(res => setAuthorities(res.data)).catch(err => console.error(err));
  }, []);

  const fetchIssues = () => {
    api.get('/issues').then(res => setIssues(res.data));
  };

  const assignAuthority = async (id) => {
    const authorityId = parseInt(assignments[id]);
    if (!authorityId) return;
    const authority = authorities.find(a => a.id === authorityId);
    
    await api.patch(`/issues/${id}`, { 
      status: 'assigned', 
      assignedTo: authority.id, 
      assignedName: authority.name 
    });
    fetchIssues();
  };

  const filtered = issues.filter(i => {
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || i.category === filterCat;
    const matchStatus = filterStatus === 'All' || i.status === filterStatus.toLowerCase();
    return matchSearch && matchCat && matchStatus;
  });

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const itemRow = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">Manage Reports</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" placeholder="Search by title..."
            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
            value={search} onChange={e => setSearch(e.target.value)}
          />
          <select 
            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
            value={filterCat} onChange={e => setFilterCat(e.target.value)}
          >
            <option>All Category</option>
            <option>Roads</option>
            <option>Utilities</option>
            <option>Sanitation</option>
            <option>Other</option>
          </select>
          <select 
            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          >
            <option>All Status</option>
            <option value="submitted">Submitted</option>
            <option value="assigned">Assigned</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse bg-white">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">Title</th>
                <th className="py-4 px-6 font-bold">Category</th>
                <th className="py-4 px-6 font-bold">Status</th>
                <th className="py-4 px-6 font-bold">Authority</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            {filtered.length > 0 ? (
              <motion.tbody variants={container} initial="hidden" animate="show">
                {filtered.map(issue => (
                  <motion.tr variants={itemRow} key={issue.id} className="border-b border-gray-50 hover:bg-red-50/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-800">{issue.title}</td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-600">{issue.category}</td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-lg uppercase">{issue.status}</span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {issue.assignedName ? (
                        <span className="text-gray-700 font-bold">{issue.assignedName}</span>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {issue.status === 'submitted' && (
                        <div className="flex justify-end items-center space-x-2">
                          <select 
                            className="text-xs p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-accent font-medium bg-white"
                            value={assignments[issue.id] || ''}
                            onChange={e => setAssignments({...assignments, [issue.id]: e.target.value})}
                          >
                            <option value="" disabled>Select Authority</option>
                            {authorities.map(a => (
                              <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                          </select>
                          <motion.button 
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => assignAuthority(issue.id)} 
                            className="text-xs font-bold px-4 py-2.5 rounded-lg bg-accent text-white shadow-md hover:bg-red-600 transition-colors"
                          >
                            Assign
                          </motion.button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-3 opacity-50">📭</div>
                      <p className="font-semibold text-lg">No issues found</p>
                      <p className="text-sm">Try relaxing your filters.</p>
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
