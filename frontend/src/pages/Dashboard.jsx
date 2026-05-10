/* ────────────────────────────────────────────
   Dashboard — Screen 3
   Banner, welcome, recent trips, top cities
   ──────────────────────────────────────────── */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Map, Search, Compass, MapPin,
  TrendingUp, ArrowRight, Star,
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useMyTrips } from '../hooks/useTrips';
import { usePopularCities } from '../hooks/useCities';
import TripCard from '../components/trip/TripCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { data: trips, isLoading: tripsLoading } = useMyTrips();
  const { data: popularCities, isLoading: citiesLoading } = usePopularCities();

  const recentTrips = trips?.slice(0, 3) || [];
  const tripStats = {
    total: trips?.length || 0,
    upcoming: trips?.filter((t) => t.status === 'upcoming').length || 0,
    active: trips?.filter((t) => t.status === 'active').length || 0,
  };

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
      {/* ── Welcome Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-8 lg:p-10
                   bg-gradient-to-br from-primary via-primary-dark to-[#1a4a48]"
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5" />

        <div className="relative z-10">
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-white mb-2">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Traveler'} ✈️
          </h1>
          <p className="text-white/70 text-sm lg:text-base mb-6 max-w-xl">
            Your journey continues. You have {tripStats.upcoming} upcoming
            {tripStats.upcoming !== 1 ? ' trips' : ' trip'} and{' '}
            {tripStats.active} active adventure{tripStats.active !== 1 ? 's' : ''}.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Total Trips', value: tripStats.total, icon: Map },
              { label: 'Upcoming', value: tripStats.upcoming, icon: TrendingUp },
              { label: 'Active', value: tripStats.active, icon: Compass },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm"
              >
                <Icon className="w-4 h-4 text-secondary" />
                <span className="text-white font-bold">{value}</span>
                <span className="text-white/60 text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: 'Create Trip',
            desc: 'Plan a new adventure',
            icon: Plus,
            path: '/create-trip',
            gradient: 'from-primary to-primary-dark',
          },
          {
            title: 'My Trips',
            desc: 'View all your trips',
            icon: Map,
            path: '/trips',
            gradient: 'from-secondary to-[#d17a55]',
          },
          {
            title: 'Explore Cities',
            desc: 'Search destinations',
            icon: Search,
            path: '/search',
            gradient: 'from-accent to-[#e0844d]',
          },
        ].map(({ title, desc, icon: Icon, path, gradient }) => (
          <motion.button
            key={path}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(path)}
            className={`flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br ${gradient}
                        text-white text-left shadow-lg hover:shadow-xl transition-shadow`}
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold">{title}</h3>
              <p className="text-white/70 text-xs">{desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* ── Recent Trips ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-neutral-800">
            Recent Trips
          </h2>
          {trips?.length > 3 && (
            <button
              onClick={() => navigate('/trips')}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark
                         font-medium transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {tripsLoading ? (
          <CardSkeleton count={3} />
        ) : recentTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTrips.map((trip) => (
              <TripCard key={trip.tripId} trip={trip} showActions={false} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 rounded-2xl bg-white/60 border border-dashed border-neutral-200"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Map className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-lg font-bold text-neutral-700 mb-1">
              No trips yet
            </h3>
            <p className="text-sm text-neutral-400 mb-4">
              Start planning your first adventure!
            </p>
            <button
              onClick={() => navigate('/create-trip')}
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold
                         hover:bg-primary-dark transition-colors"
            >
              Create Your First Trip
            </button>
          </motion.div>
        )}
      </section>

      {/* ── Popular Cities ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-neutral-800">
            🔥 Top Cities
          </h2>
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark
                       font-medium transition-colors"
          >
            Explore All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {citiesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-2xl bg-neutral-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {popularCities?.slice(0, 10).map((city, i) => (
              <motion.div
                key={city.cityId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate('/search')}
                className="relative h-36 rounded-2xl overflow-hidden cursor-pointer group"
              >
                {city.imageUrl ? (
                  <img
                    src={city.imageUrl}
                    alt={city.cityName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/80 to-secondary/80" />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-white font-bold text-sm truncate">
                    {city.cityName}
                  </h4>
                  <p className="text-white/70 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {city.country}
                  </p>
                </div>
                {/* Popularity badge */}
                {city.popularityScore > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-0.5
                                  px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                    <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                    <span className="text-[10px] text-white font-medium">
                      {city.popularityScore}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
