/* ────────────────────────────────────────────
   Sidebar — Collapsible left navigation
   ──────────────────────────────────────────── */

import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  PlusCircle,
  Search,
  Users,
  CheckSquare,
  BookOpen,
  Receipt,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const sidebarLinks = [
  { section: 'Main', items: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/trips', label: 'My Trips', icon: Map },
    { path: '/create-trip', label: 'New Trip', icon: PlusCircle },
    { path: '/search', label: 'Explore', icon: Search },
  ]},
  { section: 'Planning', items: [
    { path: '/packing', label: 'Packing List', icon: CheckSquare },
    { path: '/notes', label: 'Trip Notes', icon: BookOpen },
    { path: '/expenses', label: 'Expenses', icon: Receipt },
  ]},
  { section: 'Social', items: [
    { path: '/community', label: 'Community', icon: Users },
  ]},
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Don't show on auth pages
  if (['/login', '/signup'].includes(location.pathname)) return null;

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="hidden lg:flex flex-col h-[calc(100vh-64px)] sticky top-16
                 bg-white border-r border-neutral-200/60 overflow-hidden"
    >
      {/* ── Nav Sections ── */}
      <div className="flex-1 py-4 overflow-y-auto scrollbar-hidden">
        {sidebarLinks.map(({ section, items }) => (
          <div key={section} className="mb-4">
            {!collapsed && (
              <p className="px-5 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                {section}
              </p>
            )}
            <div className="space-y-0.5 px-2.5">
              {items.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    title={collapsed ? label : undefined}
                    className={`
                      relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${isActive
                        ? 'text-primary bg-primary-50 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-dark hover:bg-neutral-50'
                      }
                    `}
                  >
                    <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {label}
                      </motion.span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Collapse Toggle ── */}
      <div className="p-3 border-t border-neutral-100">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                     text-sm text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50
                     transition-colors"
          id="sidebar-toggle"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
