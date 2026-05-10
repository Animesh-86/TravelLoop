/* ────────────────────────────────────────────
   Profile — Screen 7
   Editable fields, preplanned trips, previous trips
   ──────────────────────────────────────────── */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, Camera, Save, Map } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useMyTrips } from '../hooks/useTrips';
import TripCard from '../components/trip/TripCard';
import toast from 'react-hot-toast';
import { getInitials } from '../utils/formatters';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const { data: trips } = useMyTrips();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    city: user?.city || '',
    country: user?.country || '',
    profilePhotoUrl: user?.profilePhotoUrl || '',
  });

  const upcomingTrips = trips?.filter((t) => t.status === 'upcoming') || [];
  const completedTrips = trips?.filter((t) => t.status === 'completed') || [];

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    // Profile update API not available yet — save locally
    toast.success('Profile saved (local only)');
    setEditing(false);
  };

  const inputClass =
    'w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-white/80 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:bg-neutral-50 disabled:text-neutral-500';

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ── Profile Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 lg:p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-neutral-200/50 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg">
                {form.profilePhotoUrl ? (
                  <img src={form.profilePhotoUrl} alt="" className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  getInitials(form.fullName)
                )}
              </div>
              {editing && (
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-neutral-800">{user?.fullName}</h1>
              <p className="text-sm text-neutral-500">{user?.email}</p>
              <div className="flex gap-3 mt-3 text-xs text-neutral-400">
                <span>{trips?.length || 0} trips</span>
                <span>•</span>
                <span>Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</span>
              </div>
            </div>

            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors
                         ${editing ? 'bg-primary text-white hover:bg-primary-dark' : 'border border-neutral-200 hover:bg-neutral-50'}`}
            >
              {editing ? <><Save className="w-4 h-4" /> Save</> : 'Edit Profile'}
            </button>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'fullName', label: 'Full Name', icon: User },
              { name: 'phoneNumber', label: 'Phone', icon: Phone },
              { name: 'city', label: 'City', icon: MapPin },
              { name: 'country', label: 'Country', icon: Globe },
            ].map(({ name, label, icon: Icon }) => (
              <div key={name}>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    disabled={!editing}
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Upcoming Trips ── */}
        {upcomingTrips.length > 0 && (
          <section>
            <h2 className="font-display text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
              <Map className="w-5 h-5 text-primary" /> Upcoming Trips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingTrips.map((t) => (
                <TripCard key={t.tripId} trip={t} showActions={false} />
              ))}
            </div>
          </section>
        )}

        {/* ── Completed Trips ── */}
        {completedTrips.length > 0 && (
          <section>
            <h2 className="font-display text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
              ✅ Previous Trips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedTrips.map((t) => (
                <TripCard key={t.tripId} trip={t} showActions={false} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
