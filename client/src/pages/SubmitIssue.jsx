import { useState } from 'react';
import issueService from '../services/issueService';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function SubmitIssue() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', category: 'Roads', description: '', location: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.description) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await issueService.createIssue({ ...formData, image });
      setSuccess(true);
      setTimeout(() => navigate('/user-dashboard'), 2000);
    } catch (err) {
      console.error('Submit Issue Error:', err);
      setError('Failed to submit the issue. Please try again.');
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-primary mb-2">Report a Civic Issue</h1>
      <p className="text-gray-500 mb-8 border-b border-gray-100 pb-4">Help us improve FixMyCity by reporting issues you encounter.</p>
      
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-50 text-danger p-4 rounded-xl font-medium mb-6">
            ⚠️ {typeof error === 'string' ? error : (error?.message || JSON.stringify(error) || "Submission failed")}
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-green-50 text-success p-4 rounded-xl font-medium mb-6">
            ✅ Issue submitted successfully! Redirecting...
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Title <span className="text-danger">*</span></label>
          <input type="text" placeholder="E.g. Broken Streetlight" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <select className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option>Roads</option>
              <option>Utilities</option>
              <option>Sanitation</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Location / Address <span className="text-danger">*</span></label>
          <input type="text" placeholder="123 Example Street" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Description <span className="text-danger">*</span></label>
          <textarea rows="4" placeholder="Describe the issue in detail..." className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Attach Image (Optional)</label>
          <div className="flex items-center space-x-4">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-sm text-gray-500">Click to upload issue image</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            {preview && (
              <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
        
        <motion.button 
          whileHover={!loading ? { scale: 1.02, boxShadow: '0 10px 15px -3px rgba(231, 76, 60, 0.3)' } : {}} 
          whileTap={!loading ? { scale: 0.98 } : {}} 
          type="submit" 
          disabled={loading || success}
          className={`w-full text-white p-4 rounded-xl font-bold shadow-md transition-colors mt-6 flex justify-center items-center ${loading || success ? 'bg-gray-400' : 'bg-accent hover:bg-red-600'}`}
        >
          {loading ? 'Submitting...' : 'Submit Issue'}
        </motion.button>
      </form>
    </motion.div>
  );
}
