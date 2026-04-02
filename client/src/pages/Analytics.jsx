import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function Analytics() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    api.get('/issues').then(res => setIssues(res.data));
  }, []);

  const total = issues.length;
  const pending = issues.filter(i => i.status === 'submitted').length;
  const inProgress = issues.filter(i => i.status === 'in progress' || i.status === 'assigned').length;
  const resolved = issues.filter(i => i.status === 'resolved').length;

  const cards = [
    { label: 'Total Issues', value: total, color: 'text-primary border-primary/20' },
    { label: 'Pending', value: pending, color: 'text-danger border-danger/20' },
    { label: 'In Progress', value: inProgress, color: 'text-warning border-warning/20' },
    { label: 'Resolved', value: resolved, color: 'text-success border-success/20' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">Analytics Overview</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {cards.map((card, i) => (
           <motion.div 
             key={card.label}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className={`bg-white p-6 rounded-2xl shadow-sm border-b-4 ${card.color.split(' ')[1]} flex flex-col items-center justify-center`}
           >
              <span className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2">{card.label}</span>
              <span className={`text-5xl font-black ${card.color.split(' ')[0]}`}>{card.value}</span>
           </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-primary mb-6">Category Breakdown</h2>
          <ul className="space-y-4">
            {Object.entries(issues.reduce((acc, issue) => {
              acc[issue.category] = (acc[issue.category] || 0) + 1;
              return acc;
            }, {})).map(([cat, count]) => (
              <li key={cat} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="font-bold text-gray-700">{cat}</span>
                <span className="text-accent font-black text-xl">{count}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
