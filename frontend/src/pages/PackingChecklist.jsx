/* ────────────────────────────────────────────
   PackingChecklist — Screen 11
   Categories, checkboxes, progress bar
   ──────────────────────────────────────────── */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Package, Plus, Trash2, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useTrip } from '../hooks/useTrips';

const DEFAULT_CATEGORIES = [
  { name: 'Clothing', items: ['T-shirts', 'Pants', 'Underwear', 'Socks', 'Jacket'] },
  { name: 'Toiletries', items: ['Toothbrush', 'Toothpaste', 'Shampoo', 'Sunscreen'] },
  { name: 'Electronics', items: ['Phone charger', 'Power bank', 'Camera'] },
  { name: 'Documents', items: ['Passport', 'ID card', 'Insurance', 'Tickets'] },
  { name: 'Essentials', items: ['Wallet', 'Keys', 'Medications', 'Water bottle'] },
];

export default function PackingChecklist() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { data: trip } = useTrip(tripId);

  const storageKey = tripId ? `travelloop-packing-${tripId}` : 'travelloop-packing-global';

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
    return DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      expanded: true,
      items: cat.items.map((name) => ({ name, packed: false })),
    }));
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(categories));
  }, [categories, storageKey]);
  const [newItem, setNewItem] = useState('');
  const [newCat, setNewCat] = useState('');

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);
  const packedItems = categories.reduce(
    (sum, c) => sum + c.items.filter((i) => i.packed).length,
    0
  );
  const progress = totalItems > 0 ? (packedItems / totalItems) * 100 : 0;

  const toggleItem = (catIdx, itemIdx) => {
    setCategories((prev) => {
      const next = [...prev];
      next[catIdx] = {
        ...next[catIdx],
        items: next[catIdx].items.map((item, i) =>
          i === itemIdx ? { ...item, packed: !item.packed } : item
        ),
      };
      return next;
    });
  };

  const addItem = (catIdx) => {
    if (!newItem.trim()) return;
    setCategories((prev) => {
      const next = [...prev];
      next[catIdx] = {
        ...next[catIdx],
        items: [...next[catIdx].items, { name: newItem.trim(), packed: false }],
      };
      return next;
    });
    setNewItem('');
  };

  const deleteItem = (catIdx, itemIdx) => {
    setCategories((prev) => {
      const next = [...prev];
      next[catIdx] = {
        ...next[catIdx],
        items: next[catIdx].items.filter((_, i) => i !== itemIdx),
      };
      return next;
    });
  };

  const toggleExpand = (catIdx) => {
    setCategories((prev) =>
      prev.map((c, i) => (i === catIdx ? { ...c, expanded: !c.expanded } : c))
    );
  };

  const addCategory = () => {
    if (!newCat.trim()) return;
    setCategories((prev) => [...prev, { name: newCat.trim(), expanded: true, items: [] }]);
    setNewCat('');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(tripId ? `/trips/${tripId}` : '/trips')}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-neutral-800 flex items-center gap-2 mb-1">
            <Package className="w-6 h-6 text-primary" /> Packing Checklist
          </h1>
          {trip && <p className="text-sm text-neutral-500 mb-6">for {trip.tripName}</p>}
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-2xl bg-white/80 border border-neutral-200/50 shadow-sm mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700">Progress</span>
            <span className="text-sm font-bold text-neutral-800">
              {packedItems}/{totalItems} packed ({Math.round(progress)}%)
            </span>
          </div>
          <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: progress === 100 ? '#10b981' : progress > 60 ? '#2D5F5D' : '#E8956F',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {progress === 100 && (
            <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> All packed! Ready to go 🎉
            </p>
          )}
        </motion.div>

        {/* Categories */}
        <div className="space-y-4">
          {categories.map((cat, catIdx) => {
            const catPacked = cat.items.filter((i) => i.packed).length;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.05 }}
                className="rounded-2xl bg-white/80 border border-neutral-200/50 overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(catIdx)}
                  className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="font-display font-bold text-neutral-800 text-sm">{cat.name}</h3>
                    <span className="text-xs text-neutral-400">
                      {catPacked}/{cat.items.length}
                    </span>
                  </div>
                  {cat.expanded ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </button>

                <AnimatePresence>
                  {cat.expanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-1">
                        {cat.items.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-neutral-50 group"
                          >
                            <button
                              onClick={() => toggleItem(catIdx, itemIdx)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0
                                         ${item.packed ? 'bg-primary border-primary' : 'border-neutral-300'}`}
                            >
                              {item.packed && <Check className="w-3 h-3 text-white" />}
                            </button>
                            <span
                              className={`flex-1 text-sm transition-colors
                                         ${item.packed ? 'text-neutral-400 line-through' : 'text-neutral-700'}`}
                            >
                              {item.name}
                            </span>
                            <button
                              onClick={() => deleteItem(catIdx, itemIdx)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded text-neutral-400 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        {/* Add item inline */}
                        <div className="flex gap-2 pt-2">
                          <input
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addItem(catIdx)}
                            placeholder="Add item..."
                            className="flex-1 px-3 py-2 rounded-lg border border-dashed border-neutral-200
                                       text-sm focus:border-primary outline-none bg-transparent"
                          />
                          <button
                            onClick={() => addItem(catIdx)}
                            className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Add category */}
        <div className="flex gap-2 mt-4">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            placeholder="Add new category..."
            className="flex-1 px-4 py-3 rounded-xl border border-dashed border-neutral-200
                       text-sm focus:border-primary outline-none bg-white/60"
          />
          <button
            onClick={addCategory}
            className="px-4 py-3 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
