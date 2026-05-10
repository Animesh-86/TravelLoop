/* ────────────────────────────────────────────
   Community — Screen 10
   Public feed of shared trips, filters
   ──────────────────────────────────────────── */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, Users, TrendingUp } from 'lucide-react';
import { usePublicTrips } from '../hooks/useTrips';
import TripCard from '../components/trip/TripCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import CommunityChat from '../components/social/CommunityChat';

export default function Community() {
  const { data: trips, isLoading } = usePublicTrips();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const filtered = useMemo(() => {
    let list = trips || [];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.tripName?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'recent') {
      list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'popular') {
      list = [...list].sort((a, b) => (b.collaboratorCount || 0) - (a.collaboratorCount || 0));
    }
    return list;
  }, [trips, search, sortBy]);

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-2xl font-bold text-neutral-800 flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" /> Community Trips
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Discover trips shared by the TravelLoop community</p>
        </motion.div>

        {/* Search + Sort */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search community trips..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 bg-white/80
                         text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl border border-neutral-200 bg-white/80 text-sm
                       focus:border-primary outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* Stats bar */}
        {trips && (
          <div className="flex gap-4 mb-6">
            {[
              { icon: Globe, label: 'Public Trips', value: trips.length },
              { icon: Users, label: 'Contributors', value: new Set(trips.map((t) => t.owner?.userId)).size },
              { icon: TrendingUp, label: 'Showing', value: filtered.length },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 border border-neutral-200/50 text-sm">
                <Icon className="w-4 h-4 text-primary" />
                <span className="font-bold text-neutral-800">{value}</span>
                <span className="text-neutral-400 text-xs">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <CardSkeleton count={6} />
        ) : filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((trip) => (
                <TripCard key={trip.tripId} trip={trip} showActions={false} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16 rounded-2xl bg-white/60 border border-dashed border-neutral-200">
            <Globe className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-neutral-700 mb-1">No public trips yet</h3>
            <p className="text-sm text-neutral-400">Be the first to share a trip with the community!</p>
          </div>
        )}
      </div>

      <CommunityChat />
    </div>
  );
}
