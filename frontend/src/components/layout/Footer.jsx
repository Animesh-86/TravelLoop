/* ────────────────────────────────────────────
   Footer — Site footer
   ──────────────────────────────────────────── */

import { Compass, Heart, ExternalLink, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();

  // Don't show footer on auth pages
  if (['/login', '/signup'].includes(location.pathname)) return null;

  return (
    <footer className="bg-white border-t border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* ── Brand ── */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold text-gradient-primary">
              TravelLoop
            </span>
          </div>

          {/* ── Links ── */}
          <div className="flex items-center gap-6 text-sm text-neutral-400">
            <Link to="/community" className="hover:text-primary transition-colors">
              Community
            </Link>
            <a
              href="https://github.com/Animesh-86/TravelLoop"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              GitHub
            </a>
            <a
              href="mailto:support@travelloop.app"
              className="hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              Contact
            </a>
          </div>

          {/* ── Copyright ── */}
          <p className="text-xs text-neutral-400 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-secondary fill-secondary" /> by Animesh & Kajol
            <span className="mx-1.5">·</span>
            © {new Date().getFullYear()} TravelLoop
          </p>
        </div>
      </div>
    </footer>
  );
}
