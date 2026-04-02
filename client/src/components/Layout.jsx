import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

export default function Layout({ children }) {
  return (
    <div className="flex bg-background-main h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-10 transition-all">
           <Navbar />
        </div>
        <motion.main 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          exit={{ opacity: 0, x: -20 }}
          className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar"
        >
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
}
