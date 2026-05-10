/* ────────────────────────────────────────────
   ActivityItem — Single activity in itinerary
   ──────────────────────────────────────────── */

import { Clock, DollarSign, Tag } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const CATEGORY_COLORS = {
  sightseeing: 'bg-blue-100 text-blue-700',
  food: 'bg-orange-100 text-orange-700',
  adventure: 'bg-emerald-100 text-emerald-700',
  culture: 'bg-purple-100 text-purple-700',
  shopping: 'bg-pink-100 text-pink-700',
  nightlife: 'bg-indigo-100 text-indigo-700',
  relaxation: 'bg-teal-100 text-teal-700',
  transport: 'bg-neutral-100 text-neutral-600',
};

const STATUS_DOT = {
  planned: 'bg-blue-400',
  completed: 'bg-emerald-400',
  skipped: 'bg-neutral-300',
};

export default function ActivityItem({ activity }) {
  const catStyle =
    CATEGORY_COLORS[activity.category?.toLowerCase()] ||
    'bg-neutral-100 text-neutral-600';

  return (
    <div className="flex items-start gap-3 py-2.5 px-3 rounded-lg
                    hover:bg-neutral-50 transition-colors group">
      {/* Status dot */}
      <div className="mt-1.5 flex-shrink-0">
        <div
          className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[activity.status] || STATUS_DOT.planned}`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h5 className="text-sm font-medium text-neutral-800">
            {activity.customName || activity.activityName}
          </h5>
          {activity.estimatedCost > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-neutral-500 flex-shrink-0">
              <DollarSign className="w-3 h-3" />
              {formatCurrency(activity.estimatedCost)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1">
          {activity.category && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${catStyle}`}>
              {activity.category}
            </span>
          )}

          {activity.scheduledTime && (
            <span className="flex items-center gap-0.5 text-[11px] text-neutral-400">
              <Clock className="w-3 h-3" />
              {activity.scheduledTime}
            </span>
          )}

          {activity.durationMinutes > 0 && (
            <span className="text-[11px] text-neutral-400">
              {activity.durationMinutes}min
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
