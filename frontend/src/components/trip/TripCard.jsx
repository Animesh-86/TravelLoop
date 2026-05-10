/* ────────────────────────────────────────────
   TripCard — Reusable trip card (Dashboard, MyTrips, Community)
   ──────────────────────────────────────────── */

import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate, formatCurrency } from '../../utils/formatters';

const STATUS_STYLES = {
  upcoming: 'bg-blue-100 text-blue-700',
  active: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-neutral-100 text-neutral-600',
};

const COVER_FALLBACKS = [
  'linear-gradient(135deg, #2D5F5D 0%, #3A7B79 50%, #E8956F 100%)',
  'linear-gradient(135deg, #1a365d 0%, #2d5f5d 50%, #48bb78 100%)',
  'linear-gradient(135deg, #E8956F 0%, #F4A261 50%, #E76F51 100%)',
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
];

export default function TripCard({ trip, onDelete, showActions = true }) {
  const navigate = useNavigate();

  const stopCount = trip.stops?.length || 0;
  const coverBg =
    COVER_FALLBACKS[trip.tripName?.charCodeAt(0) % COVER_FALLBACKS.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl bg-white/80 backdrop-blur-sm border border-neutral-200/50
                 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => navigate(`/trips/${trip.tripId}`)}
    >
      {/* ── Cover Image ── */}
      <div className="relative h-44 overflow-hidden">
        {trip.coverPhotoUrl ? (
          <img
            src={trip.coverPhotoUrl}
            alt={trip.tripName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: coverBg }}
          >
            <MapPin className="w-10 h-10 text-white/40" />
          </div>
        )}

        {/* Status badge */}
        <span
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                      ${STATUS_STYLES[trip.status] || STATUS_STYLES.upcoming}`}
        >
          {trip.status}
        </span>
      </div>

      {/* ── Card Body ── */}
      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-neutral-800 truncate mb-1">
          {trip.tripName}
        </h3>

        {trip.description && (
          <p className="text-sm text-neutral-500 line-clamp-2 mb-3">
            {trip.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
          </span>

          {stopCount > 0 && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {stopCount} stop{stopCount !== 1 ? 's' : ''}
            </span>
          )}

          {trip.totalBudget > 0 && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              {formatCurrency(trip.totalBudget)}
            </span>
          )}

          {trip.collaboratorCount > 0 && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {trip.collaboratorCount}
            </span>
          )}
        </div>

        {/* Actions */}
        {showActions && onDelete && (
          <div className="flex justify-end mt-3 pt-3 border-t border-neutral-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(trip.tripId);
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500
                         hover:bg-red-50 transition-colors"
              title="Delete trip"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
