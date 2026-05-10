/* ────────────────────────────────────────────
   Screen 1 — Login Page
   Email/password authentication with validation
   ──────────────────────────────────────────── */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  MapPin,
  Plane,
  Globe,
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { validators, validateForm } from '../utils/validators';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear store error on unmount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const { isValid, errors } = validateForm(formData, {
      email: validators.email,
      password: validators.password,
    });

    if (!isValid) {
      setFieldErrors(errors);
      return;
    }

    try {
      await login(formData.email, formData.password);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch {
      // Error is handled in the store
    }
  };

  return (
    <div className="min-h-screen flex" id="login-page">
      {/* ── Left Panel — Decorative ── */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-gradient-hero overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10 pattern-dots" />

        {/* Floating icons */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[15%] left-[15%] w-14 h-14 rounded-2xl bg-white/10
                     backdrop-blur-sm flex items-center justify-center"
        >
          <Plane className="w-7 h-7 text-white/70" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[40%] right-[20%] w-12 h-12 rounded-2xl bg-secondary/20
                     backdrop-blur-sm flex items-center justify-center"
        >
          <MapPin className="w-6 h-6 text-secondary-light" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[25%] left-[25%] w-10 h-10 rounded-xl bg-accent/20
                     backdrop-blur-sm flex items-center justify-center"
        >
          <Globe className="w-5 h-5 text-accent-light" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm
                              flex items-center justify-center">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <h1 className="font-display text-3xl font-bold text-white">TravelLoop</h1>
            </div>

            <h2 className="font-display text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Your journey,{' '}
              <span className="text-gradient-warm">beautifully planned.</span>
            </h2>

            <p className="text-lg text-white/60 max-w-md leading-relaxed">
              AI-powered itineraries, real-time collaboration, and smart budgeting — 
              all in one place. Start planning your next adventure.
            </p>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[
                { value: '50+', label: 'Cities' },
                { value: '200+', label: 'Activities' },
                { value: 'AI', label: 'Powered' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-sm text-white/40">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-900/50 to-transparent" />
      </div>

      {/* ── Right Panel — Login Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-neutral-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-gradient-primary">TravelLoop</span>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-neutral-dark mb-2">
              Welcome back
            </h1>
            <p className="text-neutral-400">
              Sign in to continue planning your adventures
            </p>
          </div>

          {/* ── Server Error ── */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 p-3.5 mb-6 rounded-xl bg-error-50
                         border border-error/20 text-error text-sm"
              id="login-error"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-600 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`
                    w-full pl-11 pr-4 py-3 rounded-xl border bg-white text-sm
                    placeholder:text-neutral-300 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    ${fieldErrors.email
                      ? 'border-error focus:ring-error/20 focus:border-error'
                      : 'border-neutral-200 hover:border-neutral-300'
                    }
                  `}
                />
              </div>
              {fieldErrors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-error mt-1.5 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.email}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`
                    w-full pl-11 pr-12 py-3 rounded-xl border bg-white text-sm
                    placeholder:text-neutral-300 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    ${fieldErrors.password
                      ? 'border-error focus:ring-error/20 focus:border-error'
                      : 'border-neutral-200 hover:border-neutral-300'
                    }
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400
                             hover:text-neutral-600 transition-colors"
                  id="toggle-password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-error mt-1.5 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.password}
                </motion.p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              id="login-submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                         bg-gradient-primary text-white text-sm font-semibold
                         shadow-glow-primary hover:shadow-lg transition-all duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* ── Register Link ── */}
          <p className="text-center text-sm text-neutral-400 mt-8">
            Don't have an account?{' '}
            <Link
              to="/signup"
              id="login-signup-link"
              className="font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              Create one for free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
