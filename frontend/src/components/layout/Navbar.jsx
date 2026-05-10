/* ────────────────────────────────────────────
   Navbar — Top navigation bar
   ──────────────────────────────────────────── */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Menu,
  X,
  LogOut,
  User,
  Map,
  PlusCircle,
  LayoutDashboard,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { getInitials } from '../../utils/formatters';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/trips', label: 'My Trips', icon: Map },
  { path: '/create-trip', label: 'Create Trip', icon: PlusCircle },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setProfileOpen(false);
  };

  // Don't render navbar on auth pages
  if (['/login', '/signup'].includes(location.pathname)) return null;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group" id="nav-logo">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary"
            >
              <Compass className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-display text-xl font-bold text-gradient-primary hidden sm:block">
              TravelLoop
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    id={`nav-${label.toLowerCase().replace(/\s/g, '-')}`}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${isActive
                        ? 'text-primary bg-primary-50'
                        : 'text-neutral-500 hover:text-neutral-dark hover:bg-neutral-100'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* ── Right side ── */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Profile Dropdown */}
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileOpen(!profileOpen)}
                    id="nav-profile-btn"
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full
                               hover:bg-neutral-100 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-warm flex items-center justify-center
                                    text-white text-xs font-semibold shadow-sm">
                      {getInitials(user?.fullName)}
                    </div>
                    <span className="text-sm font-medium text-neutral-dark hidden sm:block max-w-[120px] truncate">
                      {user?.fullName}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-12 z-50 w-56 bg-white rounded-xl shadow-elevated
                                     border border-neutral-200/60 py-1.5 overflow-hidden"
                        >
                          <div className="px-4 py-2.5 border-b border-neutral-100">
                            <p className="text-sm font-semibold text-neutral-dark truncate">
                              {user?.fullName}
                            </p>
                            <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
                          </div>

                          <Link
                            to="/profile"
                            onClick={() => setProfileOpen(false)}
                            id="nav-profile-link"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-600
                                       hover:bg-neutral-50 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            My Profile
                          </Link>

                          <Link
                            to="/"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-600
                                       hover:bg-neutral-50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Visit Home
                          </Link>

                          <button
                            onClick={handleLogout}
                            id="nav-logout-btn"
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-error
                                       hover:bg-error-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Hamburger */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                  id="nav-mobile-toggle"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  id="nav-login-btn"
                  className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark
                             transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  id="nav-signup-btn"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary
                             rounded-lg hover:shadow-glow-primary transition-all duration-200"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && isAuthenticated && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-neutral-200/60 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors
                    ${location.pathname === path
                      ? 'text-primary bg-primary-50'
                      : 'text-neutral-600 hover:bg-neutral-100'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
