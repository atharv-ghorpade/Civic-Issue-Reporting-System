import { motion } from 'framer-motion';

export default function Notifications() {
  const notifications = [
    { id: 1, message: 'Your issue "Pothole on Main St" is now In Progress', date: '2023-10-02' },
    { id: 2, message: 'Welcome to CivicConnect!', date: '2023-10-01' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-primary mb-6">Notifications</h1>
      {notifications.map(n => (
        <motion.div key={n.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-5 rounded-2xl shadow-sm flex items-start space-x-4 border border-gray-100">
          <div className="w-2 h-2 mt-2 rounded-full bg-accent"></div>
          <div>
            <p className="font-medium text-gray-800">{n.message}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleDateString()}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
