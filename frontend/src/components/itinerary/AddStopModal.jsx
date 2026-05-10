import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MapPin, Plus, Calendar } from 'lucide-react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import DestinationGuide from './DestinationGuide';
import tripService from '../../services/tripService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export default function AddStopModal({ trip, isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const queryClient = useQueryClient();

  // Selected city form state
  const [arrivalDate, setArrivalDate] = useState(trip?.startDate || '');
  const [departureDate, setDepartureDate] = useState(trip?.endDate || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [recommendations, setRecommendations] = useState([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch recommendations on mount if trip has a destination
  useEffect(() => {
    if ((trip?.city || trip?.country) && recommendations.length === 0) {
      setIsLoadingRecs(true);
      const loc = trip.city || trip.country;
      axios.get(`${API_BASE_URL}/recommendations?location=${encodeURIComponent(loc)}`)
        .then(res => setRecommendations(res.data))
        .catch(err => console.error("Failed to load recommendations", err))
        .finally(() => setIsLoadingRecs(false));
    }
  }, [trip]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsSearching(true);
      axios.get(`${API_BASE_URL}/cities/search?q=${debouncedQuery}`)
        .then(res => setSearchResults(res.data))
        .catch(console.error)
        .finally(() => setIsSearching(false));
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  const handleAddStop = async () => {
    if (!selectedCity || !arrivalDate || !departureDate) return;
    
    setIsSubmitting(true);
    try {
      // Prepare updated trip request
      const currentStops = trip.stops?.map(s => ({
        cityId: s.city.cityId,
        arrivalDate: s.arrivalDate,
        departureDate: s.departureDate,
        stopOrder: s.stopOrder,
        notes: s.notes
      })) || [];

      const newStop = {
        cityId: selectedCity.cityId,
        arrivalDate,
        departureDate,
        stopOrder: currentStops.length + 1,
        notes: ''
      };

      const payload = {
        tripName: trip.tripName,
        description: trip.description,
        startDate: trip.startDate,
        endDate: trip.endDate,
        coverPhotoUrl: trip.coverPhotoUrl,
        isPublic: trip.isPublic,
        totalBudget: trip.totalBudget,
        stops: [...currentStops, newStop]
      };

      await tripService.updateTrip(trip.tripId, payload);

      queryClient.invalidateQueries(['trip', trip.tripId]);
      onClose();
      setSelectedCity(null);
      setSearchQuery('');
    } catch (err) {
      console.error(err);
      alert('Failed to add stop');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] bg-neutral-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-neutral-100 bg-white flex justify-between items-center shrink-0">
          <h2 className="font-display font-bold text-xl text-neutral-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Add Destination
          </h2>
          <button onClick={onClose} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors">
            <X className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!selectedCity ? (
            <>
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a city or place (e.g. Baga Beach)..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              {/* Recommendations */}
              {!searchQuery && (trip?.city || trip?.country) && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-neutral-600 mb-3">Popular in {trip.city || trip.country}</h3>
                  {isLoadingRecs ? (
                    <div className="flex gap-2 flex-wrap">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-8 w-24 bg-neutral-200 animate-pulse rounded-full"></div>
                      ))}
                    </div>
                  ) : recommendations.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {recommendations.map((rec, i) => (
                        <button
                          key={i}
                          onClick={() => setSearchQuery(rec)}
                          className="px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary-dark rounded-full text-sm font-medium transition-colors border border-primary/20"
                        >
                          {rec}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Results */}
              <div className="space-y-3 mt-6">
                {isSearching ? (
                  <p className="text-sm text-neutral-400 text-center py-4">Searching...</p>
                ) : searchResults.length > 0 ? (
                  searchResults.map(city => (
                    <div
                      key={city.cityId}
                      onClick={() => setSelectedCity(city)}
                      className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-primary cursor-pointer transition-colors flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center overflow-hidden shrink-0">
                        {city.imageUrl ? <img src={city.imageUrl} alt={city.cityName} className="w-full h-full object-cover" /> : <MapPin className="w-5 h-5 text-neutral-400" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-800">{city.cityName}</h4>
                        <p className="text-xs text-neutral-500">{city.country}</p>
                      </div>
                    </div>
                  ))
                ) : debouncedQuery.length >= 2 ? (
                  <p className="text-sm text-neutral-400 text-center py-4">No cities found. Try another search.</p>
                ) : null}
              </div>
            </>
          ) : (
            <>
              {/* Selected City Details */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-bold text-2xl text-neutral-800">{selectedCity.cityName}</h3>
                  <p className="text-sm text-neutral-500">{selectedCity.country}</p>
                </div>
                <button onClick={() => setSelectedCity(null)} className="text-sm text-primary font-medium hover:underline">
                  Change
                </button>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Arrival
                  </label>
                  <input
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    min={trip?.startDate}
                    max={trip?.endDate}
                    className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Departure
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={arrivalDate || trip?.startDate}
                    max={trip?.endDate}
                    className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:border-primary outline-none"
                  />
                </div>
              </div>

              {/* Scraped Info */}
              <DestinationGuide cityName={selectedCity.cityName} />

              <button
                onClick={handleAddStop}
                disabled={isSubmitting || !arrivalDate || !departureDate}
                className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Adding...' : <><Plus className="w-5 h-5" /> Add to Trip</>}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
