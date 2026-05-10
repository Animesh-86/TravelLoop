import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Plus, Trash2, Tag, Loader2, Sparkles } from 'lucide-react';
import api from '../../services/api';

export default function PackingList({ tripId }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [tripId]);

  const fetchItems = async () => {
    try {
      const res = await api.get(`/api/trips/${tripId}/packing`);
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch packing items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    setIsAdding(true);
    try {
      const res = await api.post(`/api/trips/${tripId}/packing`, {
        itemName: newItem.trim(),
        category: newCategory,
        isPacked: false
      });
      setItems(prev => [...prev, res.data]);
      setNewItem('');
    } catch (err) {
      console.error('Failed to add item:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleItem = async (itemId) => {
    try {
      const res = await api.patch(`/api/trips/${tripId}/packing/${itemId}/toggle`);
      setItems(prev => prev.map(item => item.itemId === itemId ? res.data : item));
    } catch (err) {
      console.error('Failed to toggle item:', err);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/api/trips/${tripId}/packing/${itemId}`);
      setItems(prev => prev.filter(item => item.itemId !== itemId));
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const categories = [...new Set(items.map(i => i.category || 'General'))];
  const packedCount = items.filter(i => i.isPacked).length;
  const progress = items.length > 0 ? (packedCount / items.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-sm">Loading your essentials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-neutral-800 flex items-center gap-2">
            Packing Progress
            {progress === 100 && <Sparkles className="w-4 h-4 text-yellow-500" />}
          </h3>
          <span className="text-sm font-bold text-primary">
            {packedCount}/{items.length} Items
          </span>
        </div>
        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary"
          />
        </div>
      </div>

      {/* Add Item Form */}
      <form onSubmit={addItem} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add something (e.g. Passport, Charger)..."
            className="w-full pl-4 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary outline-none transition-all"
          />
        </div>
        <select 
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm font-medium outline-none focus:border-primary"
        >
          <option>General</option>
          <option>Electronics</option>
          <option>Clothing</option>
          <option>Documents</option>
          <option>Health</option>
        </select>
        <button 
          disabled={isAdding || !newItem.trim()}
          className="p-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50"
        >
          {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
        </button>
      </form>

      {/* Items List */}
      <div className="space-y-8">
        {categories.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-3xl">
            <p className="text-neutral-400 text-sm">Your packing list is empty. Start adding essentials!</p>
          </div>
        ) : (
          categories.sort().map(category => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-neutral-400" />
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{category}</h4>
              </div>
              <div className="grid gap-2">
                <AnimatePresence mode="popLayout">
                  {items.filter(i => i.category === category).map(item => (
                    <motion.div
                      layout
                      key={item.itemId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
                        item.isPacked 
                          ? 'bg-neutral-50 border-neutral-100 opacity-60' 
                          : 'bg-white border-neutral-200 hover:border-primary shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleItem(item.itemId)}>
                        {item.isPacked ? (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : (
                          <Circle className="w-5 h-5 text-neutral-300 group-hover:text-primary transition-colors" />
                        )}
                        <span className={`text-sm font-medium ${item.isPacked ? 'line-through text-neutral-400' : 'text-neutral-700'}`}>
                          {item.itemName}
                        </span>
                      </div>
                      <button 
                        onClick={() => deleteItem(item.itemId)}
                        className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
