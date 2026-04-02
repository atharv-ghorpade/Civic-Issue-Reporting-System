import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import notificationService from '../services/notificationService';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getNotifications();
        setNotifications(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Fetch Notifications Error:', err);
        setError('Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-primary mb-6">Notifications</h1>
      
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading notifications...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No new notifications.</div>
      ) : (
        notifications.map(n => (
          <motion.div 
            key={n.id} 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            className={`bg-white p-5 rounded-2xl shadow-sm flex items-start space-x-4 border border-gray-100 ${n.is_read ? 'opacity-60' : ''}`}
            onClick={() => !n.is_read && handleMarkAsRead(n.id)}
          >
            <div className={`w-2 h-2 mt-2 rounded-full ${n.is_read ? 'bg-gray-300' : 'bg-accent'}`}></div>
            <div className="flex-1">
              <p className={`font-medium ${n.is_read ? 'text-gray-500' : 'text-gray-800'}`}>{n.message || n.text}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at || n.date).toLocaleDateString()}</p>
            </div>
            {!n.is_read && <span className="text-[10px] text-accent font-bold uppercase">New</span>}
          </motion.div>
        ))
      )}
    </div>
  );
}
