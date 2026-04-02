import { useAuth } from '../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const citizenLinks = [
    { path: '/user-dashboard', label: 'Dashboard' },
    { path: '/submit-issue', label: 'Submit Issue' },
    { path: '/notifications', label: 'Notifications' }
  ];

  const adminLinks = [
    { path: '/admin-dashboard', label: 'Dashboard' },
    { path: '/admin-users', label: 'User Management' },
    { path: '/reports', label: 'Reports' },
    { path: '/settings', label: 'Settings' }
  ];

  const authorityLinks = [
    { path: '/authority-dashboard', label: 'Dashboard' },
    { path: '/authority-issues', label: 'Assigned Issues' }
  ];

  const links = user?.role === 'admin' ? adminLinks : 
                user?.role === 'authority' ? authorityLinks : citizenLinks;

  return (
    <div className="w-64 bg-primary text-white h-screen p-6 flex flex-col shadow-2xl relative z-20">
      <div className="mb-8 flex items-center gap-2">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold">F</div>
        <h1 className="text-2xl font-bold tracking-wide">FixMyCity</h1>
      </div>
      <nav className="flex-1 space-y-3">
        {links.map((link, i) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link key={link.path} to={link.path} className="block">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`px-4 py-3 rounded-2xl transition-all font-medium ${isActive ? 'bg-accent shadow-md' : 'hover:bg-primary/80 hover:text-gray-200'}`}
              >
                {link.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>
      <motion.button 
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={logout} 
        className="mt-auto px-4 py-3 text-left w-full rounded-2xl hover:bg-red-500/20 text-red-200 hover:text-red-100 transition-colors font-medium border border-transparent hover:border-red-500/30"
      >
        Logout
      </motion.button>
    </div>
  );
}
