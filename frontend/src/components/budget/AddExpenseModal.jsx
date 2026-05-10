import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, DollarSign, Tag, FileText, ChevronRight } from 'lucide-react';
import budgetService from '../../services/budgetService';
import { useQueryClient } from '@tanstack/react-query';

const CATEGORIES = [
  { id: 'TRANSPORT', label: 'Transport', icon: '🚗' },
  { id: 'STAY', label: 'Stay', icon: '🏨' },
  { id: 'FOOD', label: 'Food', icon: '🍴' },
  { id: 'SIGHTSEEING', label: 'Sightseeing', icon: '🎟️' },
  { id: 'SHOPPING', label: 'Shopping', icon: '🛍️' },
  { id: 'OTHER', label: 'Other', icon: '📦' }
];

export default function AddExpenseModal({ tripId, isOpen, onClose, currency }) {
  const [formData, setFormData] = useState({
    category: 'OTHER',
    amount: '',
    description: '',
    expenseDate: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    setIsSubmitting(true);
    try {
      await budgetService.addBudgetItem(tripId, {
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description,
        expenseDate: formData.expenseDate
      });
      queryClient.invalidateQueries(['budgetSummary', tripId]);
      onClose();
      setFormData({
        category: 'OTHER',
        amount: '',
        description: '',
        expenseDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Failed to add expense:', error);
      alert('Failed to add expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
          <h2 className="font-display font-bold text-xl text-neutral-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" /> Add Expense
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category Picker */}
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`p-3 rounded-xl border text-sm flex flex-col items-center gap-1.5 transition-all ${
                    formData.category === cat.id
                      ? 'border-primary bg-primary/5 text-primary shadow-sm'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-medium text-[11px]">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Amount ({currency})
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                {currency === 'INR' ? '₹' : '$'}
              </div>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              What was this for?
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Lunch at beach, taxi to hotel..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Date
            </label>
            <input
              type="date"
              required
              value={formData.expenseDate}
              onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (
              <>
                Add Expense
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
