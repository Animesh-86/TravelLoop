/* ────────────────────────────────────────────
   CreateTrip — Screen 4
   Name, dates, place, description
   ──────────────────────────────────────────── */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import TripForm from '../components/trip/TripForm';
import { useCreateTrip } from '../hooks/useTrips';

export default function CreateTrip() {
  const navigate = useNavigate();
  const createTrip = useCreateTrip();

  const handleSubmit = (data) => {
    createTrip.mutate(data, {
      onSuccess: (trip) => {
        navigate(`/trips/${trip.tripId}`);
      },
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6 lg:p-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-neutral-500
                       hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark
                            flex items-center justify-center shadow-lg shadow-primary/25">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-neutral-800">
                Create New Trip
              </h1>
              <p className="text-sm text-neutral-500">
                Plan your next adventure
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Form Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 lg:p-8 rounded-2xl bg-white/80 backdrop-blur-sm
                     border border-neutral-200/50 shadow-sm"
        >
          <TripForm
            onSubmit={handleSubmit}
            isLoading={createTrip.isPending}
            submitLabel="Create Trip"
          />
        </motion.div>

        {/* ── Tips ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10"
        >
          <h4 className="text-sm font-semibold text-primary mb-2">💡 Pro Tips</h4>
          <ul className="text-xs text-neutral-600 space-y-1.5">
            <li>• Give your trip a memorable name — you can always change it later</li>
            <li>• Set a budget to help track your expenses throughout the trip</li>
            <li>• Make it public to share with the TravelLoop community</li>
            <li>• After creating, you can add stops and build your itinerary</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
