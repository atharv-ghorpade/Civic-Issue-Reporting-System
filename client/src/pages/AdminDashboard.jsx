import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    api.get('/issues').then(res => setIssues(res.data)).catch(err => console.error(err));
  }, []);

  const total = issues.length;
  const open = issues.filter(i => i.status === 'submitted').length;
  const inProgress = issues.filter(i => i.status === 'in progress').length;
  const resolved = issues.filter(i => i.status === 'resolved').length;

  const statCards = [
    { label: 'Total Issues', value: total, color: 'text-primary' },
    { label: 'Open', value: open, color: 'text-danger' },
    { label: 'In Progress', value: inProgress, color: 'text-warning' },
    { label: 'Resolved', value: resolved, color: 'text-success' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 font-medium mb-2">{stat.label}</p>
            <h2 className={`text-4xl font-bold ${stat.color}`}>{stat.value}</h2>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-primary mb-6">Recent Issues</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-sm">
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {issues.slice(0, 5).map(issue => (
                <tr key={issue.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-4 font-medium text-gray-800">{issue.title}</td>
                  <td className="py-4 text-sm">{issue.category}</td>
                  <td className="py-4">
                    <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-lg uppercase">{issue.status}</span>
                  </td>
                  <td className="py-4 text-sm text-gray-500">{new Date(issue.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
