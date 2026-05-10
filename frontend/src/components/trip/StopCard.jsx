/* ────────────────────────────────────────────
   StopCard — Trip stop display card
   ──────────────────────────────────────────── */

import { MapPin, Calendar, Activity } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function StopCard({ stop, index }) {
  const activityCount = stop.activities?.length || 0;

  return (
    <div className="flex gap-4 p-4 rounded-xl bg-white/60 border border-neutral-200/50
                    hover:bg-white/80 transition-colors">
      {/* Order badge */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary
                      flex items-center justify-center text-sm font-bold">
        {index + 1}
      </div>

      <div className="flex-1 min-w-0">
        {/* City name */}
        <h4 className="font-semibold text-neutral-800 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-primary" />
          {stop.city?.cityName || 'Unknown City'}
          {stop.city?.country && (
            <span className="text-xs text-neutral-400 font-normal">
              , {stop.city.country}
            </span>
          )}
        </h4>

        {/* Dates */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(stop.arrivalDate)} — {formatDate(stop.departureDate)}
        </div>

        {/* Activities count */}
        {activityCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
            <Activity className="w-3.5 h-3.5" />
            {activityCount} activit{activityCount !== 1 ? 'ies' : 'y'}
          </div>
        )}

        {/* Notes */}
        {stop.notes && (
          <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{stop.notes}</p>
        )}
      </div>
    </div>
  );
}
