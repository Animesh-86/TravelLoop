/* ────────────────────────────────────────────
   LoadingSkeleton — Reusable shimmer placeholders
   ──────────────────────────────────────────── */

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white/60 border border-neutral-200/50 overflow-hidden animate-pulse"
        >
          <div className="h-44 bg-neutral-200" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-neutral-200 rounded w-3/4" />
            <div className="h-4 bg-neutral-200 rounded w-1/2" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 bg-neutral-200 rounded-full w-20" />
              <div className="h-6 bg-neutral-200 rounded-full w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LineSkeleton({ lines = 4 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-neutral-200 rounded"
          style={{ width: `${80 - i * 10}%` }}
        />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="flex items-center justify-center h-64 animate-pulse">
      <div className="w-48 h-48 rounded-full bg-neutral-200" />
    </div>
  );
}
