/* ────────────────────────────────────────────
   Expenses Index — Prompts user to select a trip
   ──────────────────────────────────────────── */

import { motion } from 'framer-motion';
import { Receipt, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMyTrips } from '../hooks/useTrips';

export default function ExpensesIndex() {
  const navigate = useNavigate();
  const { data: trips, isLoading } = useMyTrips();

  return (
    <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 text-center"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Receipt className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="font-display text-2xl font-bold text-neutral-800 mb-2">
          Manage Expenses
        </h1>
        <p className="text-neutral-500 mb-8">
          Select a trip to view its budget, track expenses, and split costs.
        </p>

        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-neutral-100 rounded-xl" />
            ))}
          </div>
        ) : trips?.length > 0 ? (
          <div className="space-y-3 text-left">
            {trips.map((trip) => (
              <button
                key={trip.tripId}
                onClick={() => navigate(`/trips/${trip.tripId}/expenses`)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:border-primary hover:bg-primary/5 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Map className="w-5 h-5 text-neutral-400 group-hover:text-primary transition-colors" />
                  <span className="font-medium text-neutral-700">{trip.name}</span>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-neutral-100 text-neutral-500 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  Select
                </span>
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={() => navigate('/create-trip')}
            className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
          >
            Create Your First Trip
          </button>
        )}
      </motion.div>
    </div>
  );
}
