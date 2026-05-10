/* ────────────────────────────────────────────
   TripForm — Create / Edit trip form
   ──────────────────────────────────────────── */

import { useState, useEffect } from 'react';
import { MapPin, Calendar, FileText, Globe, DollarSign, Image } from 'lucide-react';
import { motion } from 'framer-motion';

const INITIAL = {
  tripName: '',
  description: '',
  startDate: '',
  endDate: '',
  coverPhotoUrl: '',
  isPublic: false,
  totalBudget: '',
};

export default function TripForm({ initialData, onSubmit, isLoading, submitLabel = 'Create Trip' }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        tripName: initialData.tripName || '',
        description: initialData.description || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        coverPhotoUrl: initialData.coverPhotoUrl || '',
        isPublic: initialData.isPublic || false,
        totalBudget: initialData.totalBudget || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.tripName.trim()) e.tripName = 'Trip name is required';
    if (!form.startDate) e.startDate = 'Start date is required';
    if (!form.endDate) e.endDate = 'End date is required';
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = 'End date must be after start date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      totalBudget: form.totalBudget ? parseFloat(form.totalBudget) : 0,
    };
    onSubmit(payload);
  };

  const inputClass = (field) =>
    `w-full pl-10 pr-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm
     text-sm transition-all duration-200 outline-none
     ${errors[field]
       ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
       : 'border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
     }`;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Trip Name */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          Trip Name *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            name="tripName"
            value={form.tripName}
            onChange={handleChange}
            placeholder="e.g. Summer in Europe"
            className={inputClass('tripName')}
          />
        </div>
        {errors.tripName && (
          <p className="text-xs text-red-500 mt-1">{errors.tripName}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          Description
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="What's this trip about?"
            rows={3}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200
                       bg-white/80 backdrop-blur-sm text-sm resize-none
                       focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Start Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className={inputClass('startDate')}
            />
          </div>
          {errors.startDate && (
            <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            End Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              min={form.startDate}
              className={inputClass('endDate')}
            />
          </div>
          {errors.endDate && (
            <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>
          )}
        </div>
      </div>

      {/* Budget & Cover Photo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Total Budget
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="number"
              name="totalBudget"
              value={form.totalBudget}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={inputClass('totalBudget')}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Cover Photo URL
          </label>
          <div className="relative">
            <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              name="coverPhotoUrl"
              value={form.coverPhotoUrl}
              onChange={handleChange}
              placeholder="https://..."
              className={inputClass('coverPhotoUrl')}
            />
          </div>
        </div>
      </div>

      {/* Public Toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-10 h-6 bg-neutral-200 peer-checked:bg-primary rounded-full
                          transition-colors duration-200" />
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow
                          peer-checked:translate-x-4 transition-transform duration-200" />
        </div>
        <div className="flex items-center gap-1.5 text-sm text-neutral-600">
          <Globe className="w-4 h-4" />
          Make this trip public
        </div>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold
                   hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </span>
        ) : (
          submitLabel
        )}
      </button>
    </motion.form>
  );
}
