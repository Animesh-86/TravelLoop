/* ────────────────────────────────────────────
   ItineraryBuilder — Screen 5
   Add sections, assign dates & budget
   ──────────────────────────────────────────── */

import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Calendar, MapPin, DollarSign,
  Share2, Edit3, Globe, Lock, MousePointer2, Luggage
} from 'lucide-react';
import { useTrip } from '../hooks/useTrips';
import { useBudgetSummary } from '../hooks/useBudget';
import useWebSocket from '../hooks/useWebSocket';
import TimelineView from '../components/itinerary/TimelineView';
import BudgetChart from '../components/budget/BudgetChart';
import CostBreakdown from '../components/budget/CostBreakdown';
import TripMap from '../components/itinerary/TripMap';
import AddStopModal from '../components/itinerary/AddStopModal';
import AddExpenseModal from '../components/budget/AddExpenseModal';
import PackingList from '../components/packing/PackingList';
import { LineSkeleton } from '../components/ui/LoadingSkeleton';
import { formatDate, formatCurrency, getTripCurrency } from '../utils/formatters';
import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Custom hook to throttle mouse movements
function useThrottledMouse(delay = 50) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let lastCall = 0;
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        setPosition({ x: e.clientX, y: e.clientY });
        lastCall = now;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [delay]);
  return position;
}

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: trip, isLoading, error } = useTrip(tripId);
  
  const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary' | 'packing'
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const { data: budgetSummary, isLoading: budgetLoading } = useBudgetSummary(tripId);
  const { connected, activeUsers, lastEdit, sendEdit } = useWebSocket(tripId);

  // Store peer cursors: { userId: { x, y, userName } }
  const [peerCursors, setPeerCursors] = useState({});

  useEffect(() => {
    if (lastEdit?.editType === 'CURSOR_MOVED') {
      try {
        const payload = JSON.parse(lastEdit.payload);
        setPeerCursors(prev => ({
          ...prev,
          [lastEdit.userId]: { ...payload, userName: lastEdit.userName }
        }));
      } catch(e) {}
    }
  }, [lastEdit]);

  const handleMouseMove = (e) => {
    if (!connected) return;
    // Debounce/throttle in a real app. Sending every 100ms
    sendEdit('CURSOR_MOVED', {
      payload: JSON.stringify({ x: e.clientX, y: e.clientY })
    });
  };

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
    <div className="flex-1 overflow-y-auto relative" onMouseMove={handleMouseMove}>
      {/* ── Render Peer Cursors ── */}
      <AnimatePresence>
        {Object.entries(peerCursors).map(([userId, cursor]) => (
          <motion.div
            key={userId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: cursor.x, y: cursor.y }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="pointer-events-none fixed z-[9999] flex flex-col items-start"
            style={{ left: 0, top: 0 }}
          >
            <MousePointer2 className="w-5 h-5 text-accent fill-accent" style={{ transform: 'rotate(-25deg)', transformOrigin: 'top left' }} />
            <div className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-3 mt-1 shadow-sm whitespace-nowrap">
              {cursor.userName}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        {/* ── Back Button & Active Users ── */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/trips')}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Trips
          </button>
          
          {connected && activeUsers?.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-medium">{activeUsers.length} active</span>
              <div className="flex -space-x-2">
                {activeUsers.map(u => (
                  <div key={u.userId} className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm" title={u.name}>
                    {u.name.charAt(0)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10">
                    <DollarSign className="w-4 h-4 text-secondary" />
                    {formatCurrency(trip.totalBudget, getTripCurrency(trip))} budget
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
                className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors text-white"
                title="Edit trip"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors text-white"
                title="Share trip"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Immersive Full-Width Map ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-1 rounded-3xl bg-white/80 backdrop-blur-sm border border-neutral-200/50 shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
             <h2 className="font-display text-lg font-bold text-neutral-800 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> Route Map
              </h2>
              <span className="text-xs text-neutral-500 font-medium px-2 py-1 bg-neutral-100 rounded-full">
                {trip.stops?.length || 0} stops planned
              </span>
          </div>
          <div className="h-[450px]">
            <TripMap stops={trip.stops} tripCity={trip.city} tripCountry={trip.country} />
          </div>
        </motion.div>

        {/* ── Main Content Area ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Tabs + Content (2/3 width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Tab Switcher */}
            <div className="flex p-1 bg-neutral-100 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'itinerary' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <MapPin className="w-4 h-4" /> Itinerary
              </button>
              <button
                onClick={() => setActiveTab('packing')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'packing' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <Luggage className="w-4 h-4" /> Packing List
              </button>
            </div>

            {activeTab === 'itinerary' ? (
              <div className="space-y-4">
                <h2 className="font-display text-lg font-bold text-neutral-800">📍 Itinerary</h2>
                <TimelineView stops={trip.stops} onAddStop={() => setShowAddStopModal(true)} />
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-display text-lg font-bold text-neutral-800">🎒 Packing Essentials</h2>
                <PackingList tripId={tripId} />
              </div>
            )}
          </motion.div>

          {/* Budget Sidebar (1/3 width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-neutral-200/50 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-neutral-800">Budget</h2>
                <button 
                  onClick={() => setShowAddExpenseModal(true)}
                  className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all"
                  title="Add Expense"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <BudgetChart summary={budgetSummary} isLoading={budgetLoading} />
            </div>

            <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-neutral-200/50 shadow-sm">
              <CostBreakdown summary={budgetSummary} isLoading={budgetLoading} />
            </div>
          </motion.div>
        </div>
      </div>
      <AddStopModal isOpen={showAddStopModal} onClose={() => setShowAddStopModal(false)} trip={trip} />
      <AddExpenseModal 
        isOpen={showAddExpenseModal} 
        onClose={() => setShowAddExpenseModal(false)} 
        tripId={tripId}
        currency={getTripCurrency(trip)}
      />
    </div>
  );
}
