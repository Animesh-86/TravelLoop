/* ────────────────────────────────────────────
   Screen 2 — Signup Page
   Name, email, phone, city, country + password
   ──────────────────────────────────────────── */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Globe,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plane,
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { validators, validateForm } from '../utils/validators';

const passwordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: 'Weak', color: 'bg-error', width: '20%' };
  if (score <= 2) return { label: 'Fair', color: 'bg-warning', width: '40%' };
  if (score <= 3) return { label: 'Good', color: 'bg-accent', width: '60%' };
  if (score <= 4) return { label: 'Strong', color: 'bg-success', width: '80%' };
  return { label: 'Excellent', color: 'bg-primary', width: '100%' };
};

export default function Signup() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    city: '',
    country: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1 = basics, 2 = location

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();
  };

  const validateStep1 = () => {
    const { isValid, errors } = validateForm(
      { fullName: formData.fullName, email: formData.email, password: formData.password },
      {
        fullName: validators.fullName,
        email: validators.email,
        password: validators.password,
      }
    );
    setFieldErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate optional fields in step 2
    const { isValid, errors } = validateForm(
      { phoneNumber: formData.phoneNumber, city: formData.city, country: formData.country },
      {
        phoneNumber: validators.phoneNumber,
        city: validators.city,
        country: validators.country,
      }
    );

    if (!isValid) {
      setFieldErrors(errors);
      return;
    }

    // Build request — filter out empty optional fields
    const requestData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };
    if (formData.phoneNumber.trim()) requestData.phoneNumber = formData.phoneNumber.trim();
    if (formData.city.trim()) requestData.city = formData.city.trim();
    if (formData.country.trim()) requestData.country = formData.country.trim();

    try {
      await register(requestData);
      navigate('/dashboard', { replace: true });
    } catch {
      // Errors handled in store — if it's a step 1 error, go back
      setStep(1);
    }
  };

  const strength = passwordStrength(formData.password);

  const inputClass = (field) => `
    w-full pl-11 pr-4 py-3 rounded-xl border bg-white text-sm
    placeholder:text-neutral-300 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
    ${fieldErrors[field]
      ? 'border-error focus:ring-error/20 focus:border-error'
      : 'border-neutral-200 hover:border-neutral-300'
    }
  `;

  return (
    <div className="min-h-screen flex" id="signup-page">
      {/* ── Left Panel — Decorative ── */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-dots" />

        {/* Floating decorative elements */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[12%] right-[18%] w-16 h-16 rounded-2xl bg-white/10
                     backdrop-blur-sm flex items-center justify-center"
        >
          <Plane className="w-8 h-8 text-white/60 rotate-45" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute top-[55%] left-[12%] w-12 h-12 rounded-xl bg-accent/20
                     backdrop-blur-sm flex items-center justify-center"
        >
          <Globe className="w-6 h-6 text-accent-light" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-[20%] right-[25%] w-10 h-10 rounded-lg bg-secondary/20
                     backdrop-blur-sm flex items-center justify-center"
        >
          <MapPin className="w-5 h-5 text-secondary-light" />
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
              Start your{' '}
              <span className="text-gradient-warm">adventure today.</span>
            </h2>

            <p className="text-lg text-white/60 max-w-md leading-relaxed">
              Join thousands of travelers who plan smarter. Get AI-powered suggestions,
              collaborate with friends, and track every penny.
            </p>

            {/* Feature highlights */}
            <div className="mt-12 space-y-4">
              {[
                'AI-generated itineraries tailored to your style',
                'Real-time collaboration with travel buddies',
                'Smart budget tracking with visual breakdowns',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-success/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-sm text-white/60">{feature}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-900/50 to-transparent" />
      </div>

      {/* ── Right Panel — Signup Form ── */}
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

          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-neutral-dark mb-2">
              Create your account
            </h1>
            <p className="text-neutral-400">
              {step === 1 ? "Let's get you started — fill in your basics" : "Almost there! Where are you from?"}
            </p>
          </div>

          {/* ── Step Indicator ── */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold
                    transition-all duration-300
                    ${step >= s
                      ? 'bg-primary text-white'
                      : 'bg-neutral-200 text-neutral-400'
                    }
                  `}
                >
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {s < 2 && (
                  <div className="flex-1 h-0.5 rounded-full bg-neutral-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: step > 1 ? '100%' : '0%' }}
                      className="h-full bg-primary rounded-full"
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Server Error ── */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 p-3.5 mb-6 rounded-xl bg-error-50
                         border border-error/20 text-error text-sm"
              id="signup-error"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-4" id="signup-form">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-neutral-600 mb-1.5">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      autoComplete="name"
                      className={inputClass('fullName')}
                    />
                  </div>
                  {fieldErrors.fullName && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-error mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{fieldErrors.fullName}
                    </motion.p>
                  )}
                </div>

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
                      className={inputClass('email')}
                    />
                  </div>
                  {fieldErrors.email && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-error mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{fieldErrors.email}
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
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      className={`${inputClass('password')} !pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400
                                 hover:text-neutral-600 transition-colors"
                      id="toggle-password-signup"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-error mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{fieldErrors.password}
                    </motion.p>
                  )}

                  {/* Password Strength Meter */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: strength.width }}
                          className={`h-full rounded-full ${strength.color}`}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Strength: <span className="font-medium">{strength.label}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Next Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={handleNext}
                  id="signup-next"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                             bg-gradient-primary text-white text-sm font-semibold
                             shadow-glow-primary hover:shadow-lg transition-all duration-200"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-600 mb-1.5">
                    Phone number <span className="text-neutral-300 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                      autoComplete="tel"
                      className={inputClass('phoneNumber')}
                    />
                  </div>
                  {fieldErrors.phoneNumber && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-error mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{fieldErrors.phoneNumber}
                    </motion.p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-neutral-600 mb-1.5">
                    City <span className="text-neutral-300 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      autoComplete="address-level2"
                      className={inputClass('city')}
                    />
                  </div>
                  {fieldErrors.city && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-error mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{fieldErrors.city}
                    </motion.p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-neutral-600 mb-1.5">
                    Country <span className="text-neutral-300 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="India"
                      autoComplete="country-name"
                      className={inputClass('country')}
                    />
                  </div>
                  {fieldErrors.country && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-error mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{fieldErrors.country}
                    </motion.p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleBack}
                    id="signup-back"
                    className="flex-1 py-3.5 rounded-xl border border-neutral-200 text-sm font-medium
                               text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    id="signup-submit"
                    className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl
                               bg-gradient-primary text-white text-sm font-semibold
                               shadow-glow-primary hover:shadow-lg transition-all duration-200
                               disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </form>

          {/* ── Login Link ── */}
          <p className="text-center text-sm text-neutral-400 mt-8">
            Already have an account?{' '}
            <Link
              to="/login"
              id="signup-login-link"
              className="font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
