import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Settings() {
  const [categories, setCategories] = useState(['Roads', 'Utilities', 'Sanitation', 'Parks', 'Public Safety']);
  const [newCat, setNewCat] = useState('');

  const addCategory = () => {
    if(newCat && !categories.includes(newCat)) {
      setCategories([...categories, newCat]);
      setNewCat('');
    }
  };

  const deleteCategory = (cat) => {
    setCategories(categories.filter(c => c !== cat));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary mb-6">System Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-primary mb-6">Admin Profile</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
              <input type="text" defaultValue="System Admin" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Department</label>
              <input type="text" defaultValue="Public Works" className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full mt-4 bg-primary text-white p-4 rounded-xl font-bold shadow-md">
              Save Profile Changes
            </motion.button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-primary mb-6">Category Management</h3>
          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              placeholder="New category name" 
              className="flex-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
              value={newCat} onChange={e=>setNewCat(e.target.value)}
            />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={addCategory} className="bg-accent text-white px-6 py-3 rounded-xl font-bold shadow-md">
              Add
            </motion.button>
          </div>
          
          <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {categories.map(cat => (
              <li key={cat} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                <span className="font-semibold text-gray-700">{cat}</span>
                <button onClick={() => deleteCategory(cat)} className="text-danger opacity-70 hover:opacity-100 text-sm font-bold p-2 hover:bg-red-50 rounded-lg transition-colors">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
