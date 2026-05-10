/* ────────────────────────────────────────────
   TimelineView — Vertical timeline of trip stops
   ──────────────────────────────────────────── */

import DayBlock from './DayBlock';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function TimelineView({ stops = [], onAddStop }) {
  const sorted = [...stops].sort((a, b) => a.stopOrder - b.stopOrder);

  return (
    <div className="space-y-4">
      {stops.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📍</span>
          </div>
          <h3 className="font-display text-lg font-bold text-neutral-700 mb-1">
            No Stops Added Yet
          </h3>
          <p className="text-sm text-neutral-400 mb-6">
            Add your first destination to start building your itinerary
          </p>
          <button
            onClick={onAddStop}
            className="px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors inline-flex items-center gap-2 shadow-sm shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> Add First Destination
          </button>
        </div>
      ) : (
        <>
          {sorted.map((stop, i) => (
            <motion.div
              key={stop.stopId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <DayBlock stop={stop} index={i} />
            </motion.div>
          ))}
          
          <button
            onClick={onAddStop}
            className="w-full py-4 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-500 font-medium hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Another Destination
          </button>
        </>
      )}
    </div>
  );
}
