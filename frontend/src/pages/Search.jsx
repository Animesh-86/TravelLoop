/* ────────────────────────────────────────────
   Search — Screen 8
   City/Activity Search — search bar, filters, sort, results list
   ──────────────────────────────────────────── */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search as SearchIcon, MapPin, Star, DollarSign,
  SlidersHorizontal, X, Globe, TrendingUp,
} from 'lucide-react';
import { useSearchCities, usePopularCities, useCountries } from '../hooks/useCities';
import useTripStore from '../store/tripStore';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';

const COST_LABELS = ['', 'Budget', 'Affordable', 'Moderate', 'Premium', 'Luxury'];

export default function SearchPage() {
  const {
    searchQuery, setSearchQuery,
    selectedCountry, setSelectedCountry,
    maxBudget, setMaxBudget,
    sortBy, setSortBy,
    resetFilters,
  } = useTripStore();

  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults, isLoading: searching } =
    useSearchCities(debouncedQuery);
  const { data: popularCities, isLoading: loadingPopular } =
    usePopularCities();
  const { data: countries } = useCountries();

  // Determine which cities to display
  const displayCities = debouncedQuery?.length >= 2 ? searchResults : popularCities;
  const isLoading = debouncedQuery?.length >= 2 ? searching : loadingPopular;

  // Apply filters
  const filteredCities = useMemo(() => {
    let cities = displayCities || [];

    // Country filter
    if (selectedCountry) {
      cities = cities.filter((c) => c.country === selectedCountry);
    }

    // Budget filter (cost index)
    if (maxBudget < 5) {
      cities = cities.filter((c) => (c.costIndex || 3) <= maxBudget);
    }

    // Sort
    if (sortBy === 'name') {
      cities = [...cities].sort((a, b) => a.cityName.localeCompare(b.cityName));
    } else {
      cities = [...cities].sort(
        (a, b) => (b.popularityScore || 0) - (a.popularityScore || 0)
      );
    }

    return cities;
  }, [displayCities, selectedCountry, maxBudget, sortBy]);

  const hasActiveFilters = selectedCountry || maxBudget < 5;

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-2xl font-bold text-neutral-800 flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            Explore Destinations
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Discover cities and activities for your next trip
          </p>
        </motion.div>

        {/* ── Search Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex gap-3 mb-6"
        >
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cities by name or country..."
              className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-neutral-200
                         bg-white/80 backdrop-blur-sm text-sm
                         focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full
                           hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all
                       ${showFilters || hasActiveFilters
                         ? 'bg-primary text-white border-primary'
                         : 'bg-white/80 text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                       }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-secondary" />
            )}
          </button>
        </motion.div>

        {/* ── Filters Panel ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-neutral-200/50 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Country Filter */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                      Country
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-neutral-200
                                 text-sm bg-white focus:border-primary outline-none"
                    >
                      <option value="">All Countries</option>
                      {countries?.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Budget Filter */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                      Max Budget Level: {COST_LABELS[maxBudget]}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
                      <span>Budget</span>
                      <span>Luxury</span>
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-neutral-200
                                 text-sm bg-white focus:border-primary outline-none"
                    >
                      <option value="popularity">Popularity</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-primary hover:text-primary-dark font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results Header ── */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-neutral-500">
            {debouncedQuery?.length >= 2
              ? `Results for "${debouncedQuery}"`
              : '🔥 Popular Destinations'}
            {!isLoading && ` · ${filteredCities.length} cities`}
          </p>
        </div>

        {/* ── City Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-56 rounded-2xl bg-neutral-200 animate-pulse"
              />
            ))}
          </div>
        ) : filteredCities.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence>
              {filteredCities.map((city, i) => (
                <motion.div
                  key={city.cityId}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -4 }}
                  className="group rounded-2xl bg-white/80 backdrop-blur-sm border border-neutral-200/50
                             shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-36 overflow-hidden">
                    {city.imageUrl ? (
                      <img
                        src={city.imageUrl}
                        alt={city.cityName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/70 to-secondary/70
                                      flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-white/40" />
                      </div>
                    )}
                    {/* Cost badge */}
                    {city.costIndex && (
                      <div className="absolute top-2 right-2 flex items-center gap-0.5 px-2 py-1
                                      rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium">
                        <DollarSign className="w-3 h-3 text-emerald-600" />
                        {COST_LABELS[city.costIndex]}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <h3 className="font-display font-bold text-neutral-800 text-sm">
                      {city.cityName}
                    </h3>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {city.country}
                      {city.region && ` · ${city.region}`}
                    </p>

                    {city.description && (
                      <p className="text-xs text-neutral-400 line-clamp-2 mt-2">
                        {city.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-3">
                      {city.popularityScore > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-neutral-500">
                          <TrendingUp className="w-3 h-3" />
                          {city.popularityScore}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16 rounded-2xl bg-white/60 border border-dashed border-neutral-200">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-7 h-7 text-neutral-400" />
            </div>
            <h3 className="font-display text-lg font-bold text-neutral-700 mb-1">
              No cities found
            </h3>
            <p className="text-sm text-neutral-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
