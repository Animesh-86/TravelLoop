/* ────────────────────────────────────────────
   MyTrips — Screen 6
   Tabs (Ongoing/Upcoming/Completed), trip cards
   ──────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Map, Filter } from 'lucide-react';
import { useMyTrips, useDeleteTrip } from '../hooks/useTrips';
import useTripStore from '../store/tripStore';
import TripCard from '../components/trip/TripCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';

const TABS = [
  { key: 'upcoming', label: 'Upcoming', emoji: '🗓️' },
  { key: 'active', label: 'Active', emoji: '✈️' },
  { key: 'completed', label: 'Completed', emoji: '✅' },
];

export default function MyTrips() {
  const navigate = useNavigate();
  const { activeTab, setActiveTab } = useTripStore();
  const { data: trips, isLoading } = useMyTrips();
  const deleteTrip = useDeleteTrip();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = trips?.filter((t) => t.status === activeTab) || [];

  const handleDelete = (tripId) => {
    setDeleteConfirm(tripId);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteTrip.mutate(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-800 flex items-center gap-2">
              <Map className="w-6 h-6 text-primary" />
              My Trips
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              {trips?.length || 0} total trip{(trips?.length || 0) !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={() => navigate('/create-trip')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white
                       font-semibold text-sm hover:bg-primary-dark transition-colors
                       shadow-lg shadow-primary/25"
          >
            <Plus className="w-4 h-4" /> New Trip
          </button>
        </motion.div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 rounded-xl bg-neutral-100/80 mb-6 w-fit">
          {TABS.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                         ${activeTab === key
                           ? 'text-primary'
                           : 'text-neutral-500 hover:text-neutral-700'
                         }`}
            >
              {activeTab === key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {emoji} {label}
                {trips && (
                  <span className="text-xs text-neutral-400">
                    ({trips.filter((t) => t.status === key).length})
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* ── Trip Grid ── */}
        {isLoading ? (
          <CardSkeleton count={6} />
        ) : filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((trip) => (
                <TripCard
                  key={trip.tripId}
                  trip={trip}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 rounded-2xl bg-white/60
                       border border-dashed border-neutral-200"
          >
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">
                {activeTab === 'upcoming' ? '🗓️' : activeTab === 'active' ? '✈️' : '🏁'}
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-neutral-700 mb-1">
              No {activeTab} trips
            </h3>
            <p className="text-sm text-neutral-400 mb-4">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming trips planned"
                : activeTab === 'active'
                ? "You don't have any active trips right now"
                : "You haven't completed any trips yet"}
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={() => navigate('/create-trip')}
                className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold
                           hover:bg-primary-dark transition-colors"
              >
                Plan a Trip
              </button>
            )}
          </motion.div>
        )}

        {/* ── Delete Confirmation Modal ── */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50
                         flex items-center justify-center p-4"
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              >
                <h3 className="font-display text-lg font-bold text-neutral-800 mb-2">
                  Delete Trip?
                </h3>
                <p className="text-sm text-neutral-500 mb-6">
                  This action cannot be undone. All stops, activities, and budget
                  data for this trip will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-2.5 rounded-xl border border-neutral-200
                               text-sm font-medium hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleteTrip.isPending}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold
                               hover:bg-red-600 transition-colors disabled:opacity-60"
                  >
                    {deleteTrip.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
