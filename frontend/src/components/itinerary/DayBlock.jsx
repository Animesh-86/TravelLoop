/* ────────────────────────────────────────────
   DayBlock — Single stop/day in itinerary timeline
   ──────────────────────────────────────────── */

import { MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityItem from './ActivityItem';
import { formatDate } from '../../utils/formatters';

export default function DayBlock({ stop, index }) {
  const [expanded, setExpanded] = useState(true);
  const activities = stop.activities || [];

  return (
    <div className="relative">
      {/* ── City Header ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/80 backdrop-blur-sm
                   border border-neutral-200/50 hover:bg-white transition-colors text-left"
      >
        {/* Order circle */}
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark
                        flex items-center justify-center text-white font-bold text-sm shadow-md">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-display font-bold text-neutral-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            {stop.city?.cityName || 'Stop ' + (index + 1)}
            {stop.city?.country && (
              <span className="text-xs text-neutral-400 font-normal">
                , {stop.city.country}
              </span>
            )}
          </h4>
          <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(stop.arrivalDate)} → {formatDate(stop.departureDate)}
            </span>
            <span>{activities.length} activities</span>
          </div>
        </div>

        {expanded ? (
          <ChevronUp className="w-5 h-5 text-neutral-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-400" />
        )}
      </button>

      {/* ── Activities List ── */}
      <AnimatePresence>
        {expanded && activities.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-8 mt-2 pl-4 border-l-2 border-primary/20 space-y-1">
              {activities.map((act) => (
                <ActivityItem key={act.tripActivityId} activity={act} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {expanded && activities.length === 0 && (
        <div className="ml-8 mt-2 pl-4 border-l-2 border-dashed border-neutral-200 py-4">
          <p className="text-xs text-neutral-400 italic">
            No activities planned yet
          </p>
        </div>
      )}
    </div>
  );
}
