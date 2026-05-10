/* ────────────────────────────────────────────
   TimelineView — Vertical timeline of trip stops
   ──────────────────────────────────────────── */

import DayBlock from './DayBlock';
import { motion } from 'framer-motion';

export default function TimelineView({ stops = [] }) {
  if (stops.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📍</span>
        </div>
        <h3 className="font-display text-lg font-bold text-neutral-700 mb-1">
          No Stops Added Yet
        </h3>
        <p className="text-sm text-neutral-400">
          Add your first destination to start building your itinerary
        </p>
      </div>
    );
  }

  // Sort stops by order
  const sorted = [...stops].sort((a, b) => a.stopOrder - b.stopOrder);

  return (
    <div className="space-y-4">
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
    </div>
  );
}
