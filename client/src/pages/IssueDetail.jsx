import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import issueService from '../services/issueService';
import commentService from '../services/commentService';
import adminService from '../services/adminService';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export default function IssueDetail() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '', priority: '', category: '' });
  const [authorities, setAuthorities] = useState([]);
  const [selectedAuthority, setSelectedAuthority] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const issueData = await issueService.getIssueById(id);
        setIssue(issueData);
        setEditForm({ 
          title: issueData.title, 
          description: issueData.description,
          priority: issueData.priority,
          category: issueData.category
        });
        setSelectedAuthority(issueData.assigned_to_id || '');
        
        try {
          const [commentData, historyData] = await Promise.all([
            commentService.getIssueComments(id),
            issueService.getIssueHistory(id)
          ]);
          setComments(Array.isArray(commentData) ? commentData : []);
          setHistory(Array.isArray(historyData) ? historyData : []);

          if (user?.role === 'admin') {
            const usersData = await adminService.getAllUsers();
            const auths = Array.isArray(usersData) ? usersData.filter(u => u.role === 'authority') : [];
            setAuthorities(auths);
          }
        } catch (cErr) {
          console.error("Error fetching related data", cErr);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching issue details:', err);
        setError('Failed to load issue details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user?.role]);

  const handleComment = async () => {
    if(!newComment) return;
    try {
      const addedComment = await commentService.addComment(id, { content: newComment });
      setComments([...comments, addedComment]);
      setNewComment('');
    } catch (err) {
      console.error("Error adding comment", err);
    }
  };

  const handleDelete = async () => {
    if(!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      await issueService.deleteIssue(id);
      window.history.back();
    } catch (err) {
      alert("Failed to delete issue");
    }
  };

  const handleUpdate = async () => {
    try {
      const updatePayload = { 
        ...editForm, 
        assigned_to_id: selectedAuthority ? parseInt(selectedAuthority) : null 
      };
      const updated = await issueService.updateIssue(id, updatePayload);
      setIssue(updated);
      setIsEditing(false);
      
      // Update history after change
      const historyData = await issueService.getIssueHistory(id);
      setHistory(Array.isArray(historyData) ? historyData : []);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update issue");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    try {
      await issueService.uploadIssueImage(id, file);
      // Refresh issue to see new images if backend returns them in detail
      const refreshed = await issueService.getIssueById(id);
      setIssue(refreshed);
    } catch (err) {
      alert("Image upload failed");
    }
  };

  if (loading) return (
    <div className="py-12 text-center text-gray-500 max-w-3xl mx-auto flex flex-col items-center">
       <div className="text-4xl mb-4 opacity-50">⏳</div>
       <p>Loading issue details...</p>
    </div>
  );

  if (error) return (
    <div className="py-12 text-center text-red-500 max-w-3xl mx-auto">
       <p>{typeof error === 'string' ? error : (error?.message || "Failed to load issue details")}</p>
       <Link to="/user-dashboard" className="text-accent underline mt-4 inline-block">Back to Dashboard</Link>
    </div>
  );

  if (!issue) return (
    <div className="py-12 text-center text-gray-500 max-w-3xl mx-auto">
       <p>Issue not found.</p>
       <Link to="/user-dashboard" className="text-accent underline mt-4 inline-block">Back to Dashboard</Link>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center mb-4">
        <Link to={-1}>
          <motion.button whileHover={{ x: -3 }} className="text-accent font-bold hover:underline inline-flex items-center">
            ← Go Back
          </motion.button>
        </Link>
        {(user?.id === issue.user_id || user?.role === 'admin') && (
          <div className="flex space-x-2">
            <button onClick={() => setIsEditing(!isEditing)} className="text-sm font-bold px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              {isEditing ? 'Cancel Edit' : 'Edit Issue'}
            </button>
            <button onClick={handleDelete} className="text-sm font-bold px-4 py-2 rounded-xl bg-red-100 text-red-500 hover:bg-red-200 transition-colors">
              Delete
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-2 h-full ${issue.status==='resolved'?'bg-success':issue.status==='in-progress'?'bg-warning':'bg-gray-300'}`}></div>
        <div className="pl-4">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 mr-4">
              {isEditing ? (
                <input 
                  className="text-3xl font-bold text-primary mb-2 tracking-tight w-full border-b-2 border-accent focus:outline-none"
                  value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})}
                />
              ) : (
                <h1 className="text-3xl font-bold text-primary mb-2 tracking-tight">{issue.title}</h1>
              )}
              <p className="text-gray-500 font-medium">{issue.location} • {issue.created_at ? new Date(issue.created_at).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="flex flex-col items-end">
              {isEditing && user?.role === 'admin' && (
                <div className="mb-2 w-full">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Status</label>
                  <select 
                    className="text-xs bg-gray-50 border border-gray-200 rounded p-1 w-full"
                    value={issue.status}
                    onChange={async (e) => {
                      try {
                        const updated = await issueService.updateIssueStatus(id, { status: e.target.value });
                        setIssue(updated);
                      } catch (err) { alert("Failed to update status"); }
                    }}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              )}
              <span className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider ${issue.status==='resolved'?'bg-green-100 text-success':issue.status==='in-progress'?'bg-orange-100 text-warning':'bg-gray-100 text-gray-500'}`}>{issue.status}</span>
              {isEditing && (
                 <button onClick={handleUpdate} className="mt-2 text-xs font-bold bg-accent text-white px-3 py-1 rounded-lg">Save Changes</button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8 border-y border-gray-100 py-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Category</p>
              <p className="font-semibold text-gray-800">{issue.category}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Priority</p>
              {isEditing && user?.role === 'admin' ? (
                <select 
                  className="p-1 border border-gray-200 rounded text-sm font-semibold text-gray-800"
                  value={editForm.priority}
                  onChange={e => setEditForm({...editForm, priority: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              ) : (
                <p className="font-semibold text-gray-800">{issue.priority}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Assigned Authority</p>
              {isEditing && user?.role === 'admin' ? (
                <select 
                  className="p-1 border border-gray-200 rounded text-sm font-semibold text-gray-800 w-full"
                  value={selectedAuthority}
                  onChange={e => setSelectedAuthority(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {authorities.map(auth => (
                    <option key={auth.id} value={auth.id}>{auth.full_name}</option>
                  ))}
                </select>
              ) : (
                <p className="font-semibold text-gray-800">{issue.assigned_to?.full_name || <span className="text-gray-400 italic">Unassigned</span>}</p>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-bold text-primary mb-3">Description</h3>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              {isEditing ? (
                <textarea 
                  className="w-full bg-transparent text-gray-700 leading-relaxed focus:outline-none min-h-[100px]"
                  value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})}
                />
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{issue.description || 'No description provided.'}</p>
              )}
            </div>
          </div>

          {issue.images?.length > 0 && (
            <div className="mb-6">
               <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Attached Images</h3>
               <div className="flex flex-wrap gap-4">
                  {issue.images.map(img => (
                    <img key={img.id} src={`http://localhost:8000${img.image_url}`} alt="issue" className="w-32 h-32 object-cover rounded-xl border border-gray-200" />
                  ))}
               </div>
            </div>
          )}

          {(user?.id === issue.user_id || user?.role === 'admin') && (
            <div className="border-t border-gray-100 pt-4 mt-6">
               <label className="text-xs font-bold text-primary uppercase cursor-pointer hover:underline">
                 + Add Image
                 <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
               </label>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-primary mb-6">Discussion</h3>
          
          <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2">
            {comments.length === 0 && <p className="text-gray-500 italic text-sm">No comments yet. Start the conversation!</p>}
            {comments?.map(c => (
              <motion.div initial={{ opacity:0, y: 10 }} animate={{ opacity:1, y:0 }} key={c.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                 <p className="text-gray-800 mb-1 font-medium text-sm">{c.content}</p>
                 <span className="text-[10px] text-gray-400">{new Date(c.created_at).toLocaleString()}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 flex flex-col gap-3">
            <textarea 
              rows="2" 
              className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow resize-none" 
              placeholder="Add a comment..."
              value={newComment} onChange={e=>setNewComment(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
               <button onClick={handleComment} className="bg-accent text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-opacity-90">Post</button>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-primary mb-6">Status History</h3>
          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
             {history.length === 0 && <p className="text-gray-500 italic text-sm">No status changes yet.</p>}
             {history.map(h => (
               <div key={h.id} className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 mt-2 rounded-full bg-accent flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Changed to <span className="text-accent font-bold uppercase">{h.new_status}</span>
                    </p>
                    <p className="text-[10px] text-gray-400">{new Date(h.changed_at).toLocaleString()}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
