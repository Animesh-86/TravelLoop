/* ────────────────────────────────────────────
   CostBreakdown — Bar chart: estimated vs actual
   ──────────────────────────────────────────── */

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { ChartSkeleton } from '../ui/LoadingSkeleton';

export default function CostBreakdown({ summary, isLoading }) {
  if (isLoading) return <ChartSkeleton />;

  if (!summary?.categories?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-neutral-400">
        No budget data yet
      </div>
    );
  }

  const data = summary.categories.map((cat) => ({
    category: cat.category,
    Estimated: parseFloat(cat.estimated) || 0,
    Actual: parseFloat(cat.actual) || 0,
  }));

  return (
    <div>
      <h4 className="font-display font-bold text-neutral-800 mb-3 text-sm">
        Estimated vs Actual
      </h4>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            formatter={(val) => `$${val.toFixed(2)}`}
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              fontSize: '12px',
            }}
          />
          <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="Estimated" fill="#2D5F5D" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Actual" fill="#E8956F" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Usage percentage */}
      {summary.usagePercentage != null && (
        <div className="mt-4 p-3 rounded-xl bg-neutral-50">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-neutral-600">
              Budget Usage
            </span>
            <span className="text-xs font-bold text-neutral-700">
              {parseFloat(summary.usagePercentage).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(parseFloat(summary.usagePercentage), 100)}%`,
                background:
                  parseFloat(summary.usagePercentage) > 100
                    ? '#ef4444'
                    : parseFloat(summary.usagePercentage) > 80
                    ? '#f59e0b'
                    : '#2D5F5D',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
