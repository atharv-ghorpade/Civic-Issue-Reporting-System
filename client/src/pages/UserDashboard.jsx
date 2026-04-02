import { useState, useEffect } from 'react';
import issueService from '../services/issueService';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function UserDashboard() {
  const [issues, setIssues] = useState([]);
  const [filterCat, setFilterCat] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        // Fetch ALL issues and filter for current user as backend lacks /issues/my
        const data = await issueService.getAllIssues();
        const myData = Array.isArray(data) ? data.filter(i => i.user_id === user?.id) : [];
        setIssues(myData);
        setError(null);
      } catch (err) {
        console.error('Error fetching issues:', err);
        setError('Failed to load issues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchIssues();
  }, [user?.id]);

  const filtered = issues.filter(i => {
    const matchCat = filterCat === 'All' || i.category === filterCat;
    const matchStatus = filterStatus === 'All' || i.status === filterStatus.toLowerCase();
    return matchCat && matchStatus;
  });

  const getStatusColor = (status) => {
    if (status === 'resolved') return 'bg-success text-white';
    if (status === 'in-progress') return 'bg-warning text-white';
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
            <option value="open">Open / Submitted</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500 font-medium">Loading issues...</div>
        ) : error ? (
          <div className="py-12 text-center text-red-500 font-medium">{typeof error === 'string' ? error : (error?.message || "Something went wrong loading issues")}</div>
        ) : filtered.length > 0 ? (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(issue => {
              const mainImage = issue.images?.[0]?.image_url;
              const fullImageUrl = mainImage 
                  ? (mainImage.startsWith('http') ? mainImage : `http://localhost:8000${mainImage}`)
                  : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5907?auto=format&fit=crop&q=80&w=400';

              return (
                <motion.div 
                  key={issue.id} 
                  variants={item} 
                  whileHover={{ y: -8, scale: 1.01 }} 
                  className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all border border-gray-100 overflow-hidden flex flex-col cursor-pointer group"
                  onClick={() => window.location.href=`/issue/${issue.id}`}
                >
                  {/* Image Section */}
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={fullImageUrl} 
                      alt={issue.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                       <span className="text-[10px] font-bold text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full uppercase tracking-wider">{issue.category}</span>
                    </div>
                    <div className="absolute top-4 right-4">
                       <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm ${getStatusColor(issue.status)}`}>
                         {issue.status}
                       </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Reported {issue?.created_at && new Date(issue.created_at).toLocaleDateString()}
                    </p>
                    <h3 className="font-black text-xl mb-3 text-primary line-clamp-1 group-hover:text-accent transition-colors">{issue.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed flex-1">
                       {issue.description || 'No description provided.'}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center text-gray-400">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span className="text-xs font-medium truncate max-w-[120px]">{issue?.location || 'Unknown location'}</span>
                      </div>
                      <span className="text-accent text-xs font-black uppercase tracking-tighter inline-flex items-center group-hover:translate-x-1 transition-transform">
                        Track Progress <span className="ml-1 text-sm">→</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="py-12 text-center text-gray-500 flex flex-col items-center">
            <div className="text-4xl mb-4 opacity-50">📂</div>
            <p className="font-medium">No issues found.</p>
            <p className="text-sm">Try adjusting your filters or report a new issue.</p>
          </div>
        )}
      </div>

    </div>
  );
}
