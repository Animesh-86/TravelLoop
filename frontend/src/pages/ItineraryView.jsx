/* ────────────────────────────────────────────
   ItineraryView — Screen 9
   Day-wise layout, timeline, AI input, budget
   ──────────────────────────────────────────── */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Sparkles, Send, RefreshCw, Check,
  Clock, DollarSign, MapPin, Lightbulb,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useTrip } from '../hooks/useTrips';
import { useBudgetSummary } from '../hooks/useBudget';
import aiService from '../services/aiService';
import BudgetChart from '../components/budget/BudgetChart';
import CostBreakdown from '../components/budget/CostBreakdown';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function ItineraryView() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { data: trip } = useTrip(tripId);
  const { data: budgetSummary, isLoading: budgetLoading } = useBudgetSummary(tripId);

  const [prompt, setPrompt] = useState('');
  const [aiResult, setAiResult] = useState(null);

  const generateAi = useMutation({
    mutationFn: (data) => aiService.generateForTrip(tripId, data),
    onSuccess: (data) => {
      setAiResult(data);
      toast.success('AI itinerary generated!');
    },
    onError: () => toast.error('AI generation failed — check API key'),
  });

  const regenerate = useMutation({
    mutationFn: (refinement) => aiService.regenerateItinerary(tripId, refinement),
    onSuccess: (data) => {
      setAiResult(data);
      toast.success('Itinerary regenerated!');
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    generateAi.mutate({ prompt });
  };

  const display = aiResult;

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(`/trips/${tripId}`)}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Trip
        </button>

        <h1 className="font-display text-2xl font-bold text-neutral-800 mb-2">
          {trip?.tripName || 'Itinerary'} — AI Planner
        </h1>
        <p className="text-sm text-neutral-500 mb-8">
          Use AI to generate a day-by-day itinerary with budget estimates
        </p>

        {/* ── AI Input ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5
                     border border-primary/10 mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-neutral-800">AI Trip Planner</h3>
          </div>
          <p className="text-sm text-neutral-500 mb-4">
            Describe your ideal trip and let AI build your itinerary
          </p>
          <div className="flex gap-3">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder='e.g. "Plan 3 days in Paris under $1500 with food and culture focus"'
              className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 bg-white/80
                         text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <button
              onClick={handleGenerate}
              disabled={generateAi.isPending || !prompt.trim()}
              className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm
                         hover:bg-primary-dark transition-colors disabled:opacity-60
                         flex items-center gap-2"
            >
              {generateAi.isPending ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
              ) : (
                <><Send className="w-4 h-4" /> Generate</>
              )}
            </button>
          </div>
        </motion.div>

        {/* ── AI Results ── */}
        <AnimatePresence>
          {display && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Summary */}
              <div className="p-6 rounded-2xl bg-white/80 border border-neutral-200/50 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="font-display text-xl font-bold text-neutral-800">
                      {display.tripName || display.destination}
                    </h2>
                    <p className="text-sm text-neutral-500 mt-1">{display.summary}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => regenerate.mutate('Make it more adventurous')}
                      disabled={regenerate.isPending}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-neutral-200
                                 text-sm hover:bg-neutral-50 transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 ${regenerate.isPending ? 'animate-spin' : ''}`} />
                      Regenerate
                    </button>
                    <button
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500
                                 text-white text-sm hover:bg-emerald-600 transition-colors"
                    >
                      <Check className="w-4 h-4" /> Accept
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-primary" /> {display.totalDays} days</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-primary" /> {formatCurrency(display.estimatedTotalCost)}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-primary" /> {display.destination}</span>
                </div>
              </div>

              {/* Day-by-day */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {display.days?.map((day) => (
                    <motion.div
                      key={day.dayNumber}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: day.dayNumber * 0.05 }}
                      className="p-5 rounded-2xl bg-white/80 border border-neutral-200/50"
                    >
                      <h3 className="font-display font-bold text-neutral-800 mb-1">
                        Day {day.dayNumber}
                        {day.theme && <span className="text-sm text-primary font-normal ml-2">— {day.theme}</span>}
                      </h3>
                      <div className="space-y-2 mt-3">
                        {day.activities?.map((act, i) => (
                          <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-neutral-50">
                            <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-neutral-800">{act.name}</span>
                                {act.estimatedCost > 0 && (
                                  <span className="text-xs text-neutral-500">{formatCurrency(act.estimatedCost)}</span>
                                )}
                              </div>
                              {act.description && <p className="text-xs text-neutral-400 mt-0.5">{act.description}</p>}
                              <div className="flex gap-2 mt-1">
                                {act.timeSlot && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{act.timeSlot}</span>}
                                {act.category && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{act.category}</span>}
                                {act.durationMinutes && <span className="text-[10px] text-neutral-400">{act.durationMinutes}min</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Sidebar: Budget + Tips */}
                <div className="space-y-6">
                  {display.budgetBreakdown && (
                    <div className="p-5 rounded-2xl bg-white/80 border border-neutral-200/50">
                      <h4 className="font-display font-bold text-neutral-800 mb-3 text-sm">AI Budget Estimate</h4>
                      {Object.entries(display.budgetBreakdown).map(([cat, val]) => (
                        <div key={cat} className="flex justify-between py-1.5 text-sm border-b border-neutral-100 last:border-0">
                          <span className="text-neutral-600 capitalize">{cat}</span>
                          <span className="font-medium text-neutral-800">{formatCurrency(val)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {display.travelTips?.length > 0 && (
                    <div className="p-5 rounded-2xl bg-white/80 border border-neutral-200/50">
                      <h4 className="font-display font-bold text-neutral-800 mb-3 text-sm flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-yellow-500" /> Travel Tips
                      </h4>
                      <ul className="space-y-2">
                        {display.travelTips.map((tip, i) => (
                          <li key={i} className="text-xs text-neutral-600 flex gap-2">
                            <span className="text-primary">•</span> {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-5 rounded-2xl bg-white/80 border border-neutral-200/50">
                    <BudgetChart summary={budgetSummary} isLoading={budgetLoading} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state when no AI result yet */}
        {!display && !generateAi.isPending && (
          <div className="text-center py-16 rounded-2xl bg-white/60 border border-dashed border-neutral-200">
            <Sparkles className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-neutral-700 mb-1">Ready to Plan</h3>
            <p className="text-sm text-neutral-400">Enter a prompt above to generate your AI itinerary</p>
          </div>
        )}
      </div>
    </div>
  );
}
