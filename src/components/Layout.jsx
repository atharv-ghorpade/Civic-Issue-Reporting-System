import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

export default function Layout({ children }) {
  return (
    <div className="flex bg-background-main min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col px-6">
        <Navbar />
        <motion.main 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0 }}
          className="flex-1 pb-10"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
