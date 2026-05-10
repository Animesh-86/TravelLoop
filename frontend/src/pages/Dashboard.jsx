/* ────────────────────────────────────────────
   Screen 3 — Dashboard (Placeholder for Phase 2)
   ──────────────────────────────────────────── */

import { motion } from 'framer-motion';
import { Compass, Map, Sparkles, ArrowRight, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();
  const firstName = user?.fullName?.split(' ')[0] || 'Traveler';

  return (
    <div className="flex-1 p-6 lg:p-8 max-w-6xl mx-auto w-full" id="dashboard-page">
      {/* ── Welcome Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-hero p-8 lg:p-10 mb-8"
      >
        <div className="absolute inset-0 opacity-10 pattern-dots" />
        <div className="relative z-10">
          <p className="text-sm text-white/50 mb-1">Good to see you back 👋</p>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-3">
            Welcome, {firstName}!
          </h1>
          <p className="text-white/60 max-w-lg mb-6">
            Ready to plan your next adventure? Create a trip, explore cities, or let AI
            build the perfect itinerary for you.
          </p>
          <Link
            to="/create-trip"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-white/15 backdrop-blur-sm text-white text-sm font-semibold
                       hover:bg-white/25 transition-all duration-200 border border-white/10"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Trip
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Decorative floating elements */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-6 right-8 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm
                     flex items-center justify-center"
        >
          <Sparkles className="w-6 h-6 text-accent-light" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute bottom-8 right-28 w-10 h-10 rounded-xl bg-secondary/20 backdrop-blur-sm
                     flex items-center justify-center"
        >
          <Map className="w-5 h-5 text-secondary-light" />
        </motion.div>
      </motion.div>

      {/* ── Quick Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            icon: PlusCircle,
            title: 'Create a Trip',
            description: 'Plan a new adventure with smart suggestions',
            to: '/create-trip',
            gradient: 'from-primary to-primary-light',
          },
          {
            icon: Compass,
            title: 'Explore Cities',
            description: 'Discover activities in 50+ destinations',
            to: '/search',
            gradient: 'from-secondary to-accent',
          },
          {
            icon: Sparkles,
            title: 'AI Planner',
            description: 'Let AI build your perfect itinerary',
            to: '/create-trip',
            gradient: 'from-accent to-warning',
          },
        ].map(({ icon: Icon, title, description, to, gradient }) => (
          <Link
            key={title}
            to={to}
            className="group relative overflow-hidden rounded-2xl bg-white border border-neutral-200/60
                       p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4
                           group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-display text-lg font-semibold text-neutral-dark mb-1">{title}</h3>
            <p className="text-sm text-neutral-400">{description}</p>
            <ArrowRight className="absolute bottom-6 right-6 w-4 h-4 text-neutral-300
                                   group-hover:text-primary group-hover:translate-x-1
                                   transition-all duration-200" />
          </Link>
        ))}
      </motion.div>

      {/* ── Empty State ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 text-center py-16 rounded-2xl border-2 border-dashed border-neutral-200"
      >
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
          <Map className="w-8 h-8 text-neutral-300" />
        </div>
        <h3 className="font-display text-lg font-semibold text-neutral-dark mb-2">
          No trips yet
        </h3>
        <p className="text-sm text-neutral-400 mb-6 max-w-sm mx-auto">
          Your upcoming trips and recent activity will appear here.
          Start by creating your first trip!
        </p>
        <Link
          to="/create-trip"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-gradient-primary text-white text-sm font-semibold
                     shadow-glow-primary hover:shadow-lg transition-all duration-200"
        >
          <PlusCircle className="w-4 h-4" />
          Create Your First Trip
        </Link>
      </motion.div>
    </div>
  );
}
