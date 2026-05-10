/* ────────────────────────────────────────────
   BudgetChart — Pie chart for category breakdown
   ──────────────────────────────────────────── */

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartSkeleton } from '../ui/LoadingSkeleton';

const COLORS = [
  '#2D5F5D', '#E8956F', '#F4A261', '#48bb78', '#667eea',
  '#ed64a6', '#4fd1c5', '#f6ad55', '#63b3ed', '#fc8181',
];

export default function BudgetChart({ summary, isLoading }) {
  if (isLoading) return <ChartSkeleton />;

  if (!summary?.categories?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-neutral-400">
        No budget data yet
      </div>
    );
  }

  const data = summary.categories.map((cat) => ({
    name: cat.category,
    value: parseFloat(cat.estimated) || 0,
  }));

  return (
    <div>
      <h4 className="font-display font-bold text-neutral-800 mb-3 text-sm">
        Budget by Category
      </h4>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val) => `$${val.toFixed(2)}`}
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              fontSize: '12px',
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="p-3 rounded-xl bg-emerald-50 text-center">
          <p className="text-xs text-emerald-600 font-medium">Estimated</p>
          <p className="text-lg font-bold text-emerald-700">
            ${parseFloat(summary.totalEstimated || 0).toFixed(0)}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-orange-50 text-center">
          <p className="text-xs text-orange-600 font-medium">Actual</p>
          <p className="text-lg font-bold text-orange-700">
            ${parseFloat(summary.totalActual || 0).toFixed(0)}
          </p>
        </div>
      </div>
    </div>
  );
}
