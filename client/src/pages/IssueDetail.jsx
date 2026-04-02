import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function IssueDetail() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    api.get('/issues').then(res => {
      const found = res.data.find(i => i.id === parseInt(id));
      if (found) setIssue(found);
    });
  }, [id]);

  const handleComment = () => {
    if(!newComment) return;
    setComments([...comments, { id: Date.now(), text: newComment, date: new Date().toISOString() }]);
    setNewComment('');
  };

  if (!issue) return (
    <div className="py-12 text-center text-gray-500 max-w-3xl mx-auto flex flex-col items-center">
       <div className="text-4xl mb-4 opacity-50">⏳</div>
       <p>Loading issue details...</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
      <Link to={-1}>
        <motion.button whileHover={{ x: -3 }} className="text-accent font-bold hover:underline mb-4 inline-flex items-center">
           ← Go Back
        </motion.button>
      </Link>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-2 h-full ${issue.status==='resolved'?'bg-success':issue.status==='in progress'?'bg-warning':'bg-gray-300'}`}></div>
        <div className="pl-4">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2 tracking-tight">{issue.title}</h1>
              <p className="text-gray-500 font-medium">{issue.location} • {new Date(issue.date).toLocaleDateString()}</p>
            </div>
            <span className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider ${issue.status==='resolved'?'bg-green-100 text-success':issue.status==='in progress'?'bg-orange-100 text-warning':'bg-gray-100 text-gray-500'}`}>{issue.status}</span>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8 border-y border-gray-100 py-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Category</p>
              <p className="font-semibold text-gray-800">{issue.category}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Priority</p>
              <p className="font-semibold text-gray-800">{issue.priority}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Assigned Authority</p>
              <p className="font-semibold text-gray-800">{issue.assignedName || <span className="text-gray-400 italic">Unassigned</span>}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">Description</h3>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{issue.description || 'No description provided.'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-primary mb-6">Discussion & Updates</h3>
        
        <div className="space-y-4 mb-8">
          {comments.length === 0 && <p className="text-gray-500 italic text-sm">No comments yet. Start the conversation!</p>}
          {comments.map(c => (
            <motion.div initial={{ opacity:0, y: 10 }} animate={{ opacity:1, y:0 }} key={c.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
               <p className="text-gray-800 mb-1 font-medium">{c.text}</p>
               <span className="text-xs text-gray-400">{new Date(c.date).toLocaleString()}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 flex flex-col gap-3">
          <textarea 
            rows="3" 
            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow resize-none" 
            placeholder="Add a comment or update..."
            value={newComment} onChange={e=>setNewComment(e.target.value)}
          ></textarea>
          <div className="flex justify-end">
             <motion.button 
               whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
               onClick={handleComment} 
               className="bg-accent text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-red-600 transition-colors"
             >
               Post Comment
             </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
