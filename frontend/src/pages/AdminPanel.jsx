/* ────────────────────────────────────────────
   AdminPanel — Screen 12
   Charts (Recharts), user table, stats cards
   ──────────────────────────────────────────── */

import { motion } from 'framer-motion';
import {
  Users, Map, Globe, TrendingUp, Trash2, Shield,
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../services/adminService';
import { LineSkeleton } from '../components/ui/LoadingSkeleton';
import { getInitials } from '../utils/formatters';
import toast from 'react-hot-toast';

const COLORS = ['#2D5F5D', '#E8956F', '#F4A261', '#48bb78', '#667eea', '#ed64a6'];

export default function AdminPanel() {
  const qc = useQueryClient();
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminService.getStats,
  });
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminService.getAllUsers,
  });
  const deleteUser = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin'] });
      toast.success('User deleted');
    },
  });

  const kpis = [
    { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Trips', value: stats?.totalTrips, icon: Map, color: 'from-primary to-primary-dark' },
    { label: 'Active Trips', value: stats?.activeTrips, icon: TrendingUp, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Public Trips', value: stats?.publicTrips, icon: Globe, color: 'from-secondary to-[#d17a55]' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-neutral-800 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" /> Admin Panel
          </h1>
          <p className="text-sm text-neutral-500">Platform analytics and user management</p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-5 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}
            >
              <Icon className="w-6 h-6 mb-3 opacity-70" />
              <p className="text-2xl font-bold">{statsLoading ? '—' : value ?? 0}</p>
              <p className="text-xs text-white/70 mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <div className="p-5 rounded-2xl bg-white/80 border border-neutral-200/50 shadow-sm">
            <h3 className="font-display font-bold text-neutral-800 mb-4 text-sm">User Growth</h3>
            {statsLoading ? <LineSkeleton /> : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={stats?.userGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
                  <Line type="monotone" dataKey="count" stroke="#2D5F5D" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Trip Growth */}
          <div className="p-5 rounded-2xl bg-white/80 border border-neutral-200/50 shadow-sm">
            <h3 className="font-display font-bold text-neutral-800 mb-4 text-sm">Trip Growth</h3>
            {statsLoading ? <LineSkeleton /> : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats?.tripGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
                  <Bar dataKey="count" fill="#E8956F" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Cities + Budget Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top cities */}
          <div className="p-5 rounded-2xl bg-white/80 border border-neutral-200/50 shadow-sm">
            <h3 className="font-display font-bold text-neutral-800 mb-4 text-sm">Top Destinations</h3>
            {statsLoading ? <LineSkeleton /> : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats?.topCities || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="cityName" type="category" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
                  <Bar dataKey="tripCount" fill="#2D5F5D" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Budget by category */}
          <div className="p-5 rounded-2xl bg-white/80 border border-neutral-200/50 shadow-sm">
            <h3 className="font-display font-bold text-neutral-800 mb-4 text-sm">Avg Budget by Category</h3>
            {statsLoading || !stats?.avgBudgetByCategory ? <LineSkeleton /> : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={Object.entries(stats.avgBudgetByCategory).map(([name, value]) => ({ name, value }))}
                    cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value"
                  >
                    {Object.keys(stats.avgBudgetByCategory).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `$${v.toFixed(0)}`} contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl bg-white/80 border border-neutral-200/50 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-neutral-100">
            <h3 className="font-display font-bold text-neutral-800 text-sm">
              All Users ({users?.length || 0})
            </h3>
          </div>
          {usersLoading ? (
            <div className="p-5"><LineSkeleton lines={6} /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 text-left">
                    <th className="px-5 py-3 font-medium text-neutral-500 text-xs">User</th>
                    <th className="px-5 py-3 font-medium text-neutral-500 text-xs">Email</th>
                    <th className="px-5 py-3 font-medium text-neutral-500 text-xs">Location</th>
                    <th className="px-5 py-3 font-medium text-neutral-500 text-xs">Role</th>
                    <th className="px-5 py-3 font-medium text-neutral-500 text-xs">Joined</th>
                    <th className="px-5 py-3 font-medium text-neutral-500 text-xs"></th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((u) => (
                    <tr key={u.userId} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-bold">
                          {getInitials(u.fullName)}
                        </div>
                        <span className="font-medium text-neutral-800">{u.fullName}</span>
                      </td>
                      <td className="px-5 py-3 text-neutral-500">{u.email}</td>
                      <td className="px-5 py-3 text-neutral-500">{[u.city, u.country].filter(Boolean).join(', ') || '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                                         ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-neutral-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => deleteUser.mutate(u.userId)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
