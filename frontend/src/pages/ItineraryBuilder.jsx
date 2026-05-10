/* ────────────────────────────────────────────
   ItineraryBuilder — Screen 5
   Add sections, assign dates & budget
   ──────────────────────────────────────────── */

import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Calendar, MapPin, DollarSign,
  Share2, Edit3, Globe, Lock,
} from 'lucide-react';
import { useTrip } from '../hooks/useTrips';
import { useBudgetSummary } from '../hooks/useBudget';
import TimelineView from '../components/itinerary/TimelineView';
import BudgetChart from '../components/budget/BudgetChart';
import CostBreakdown from '../components/budget/CostBreakdown';
import { LineSkeleton } from '../components/ui/LoadingSkeleton';
import { formatDate, formatCurrency } from '../utils/formatters';

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { data: trip, isLoading } = useTrip(tripId);
  const { data: budgetSummary, isLoading: budgetLoading } =
    useBudgetSummary(tripId);

  if (isLoading) {
    return (
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-48 animate-pulse" />
          <div className="h-48 bg-neutral-200 rounded-2xl animate-pulse" />
          <LineSkeleton lines={6} />
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-neutral-700 mb-2">
            Trip not found
          </h2>
          <button
            onClick={() => navigate('/trips')}
            className="text-sm text-primary hover:text-primary-dark font-medium"
          >
            Go to My Trips
          </button>
        </div>
      </div>
    );
  }

  const STATUS_COLORS = {
    upcoming: 'bg-blue-100 text-blue-700',
    active: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-neutral-100 text-neutral-600',
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        {/* ── Back Button ── */}
        <button
          onClick={() => navigate('/trips')}
          className="flex items-center gap-1.5 text-sm text-neutral-500
                     hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Trips
        </button>

        {/* ── Trip Header Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6 lg:p-8 mb-8
                     bg-gradient-to-br from-primary via-primary-dark to-[#1a4a48]"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">
                  {trip.tripName}
                </h1>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold uppercase
                              ${STATUS_COLORS[trip.status] || STATUS_COLORS.upcoming}`}
                >
                  {trip.status}
                </span>
              </div>

              {trip.description && (
                <p className="text-white/70 text-sm mb-4 max-w-xl">
                  {trip.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-secondary" />
                  {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-secondary" />
                  {trip.stops?.length || 0} stops
                </span>
                {trip.totalBudget > 0 && (
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-secondary" />
                    {formatCurrency(trip.totalBudget)} budget
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  {trip.isPublic ? (
                    <Globe className="w-4 h-4 text-secondary" />
                  ) : (
                    <Lock className="w-4 h-4 text-secondary" />
                  )}
                  {trip.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm
                           hover:bg-white/20 transition-colors text-white"
                title="Edit trip"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm
                           hover:bg-white/20 transition-colors text-white"
                title="Share trip"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Main Content: Timeline + Budget Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline (2/3 width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h2 className="font-display text-lg font-bold text-neutral-800 mb-4">
              📍 Itinerary
            </h2>
            <TimelineView stops={trip.stops} />
          </motion.div>

          {/* Budget Sidebar (1/3 width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm
                            border border-neutral-200/50 shadow-sm">
              <BudgetChart summary={budgetSummary} isLoading={budgetLoading} />
            </div>

            <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm
                            border border-neutral-200/50 shadow-sm">
              <CostBreakdown summary={budgetSummary} isLoading={budgetLoading} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
