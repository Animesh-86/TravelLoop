/* ────────────────────────────────────────────
   App — Root component with routing
   ──────────────────────────────────────────── */

import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-light">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 flex flex-col min-h-0">
          <Routes>
            {/* ── Public Routes ── */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ── Protected Routes ── */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* ── Phase 2 placeholders ── */}
            <Route
              path="/trips"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title="My Trips" description="Coming in Phase 2" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-trip"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title="Create Trip" description="Coming in Phase 2" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title="Explore" description="Coming in Phase 2" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title="Profile" description="Coming in Phase 3" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title="Community" description="Coming in Phase 3" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/packing"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title="Packing List" description="Coming in Phase 3" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title="Trip Notes" description="Coming in Phase 3" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <PlaceholderPage title="Expenses" description="Coming in Phase 3" />
                </ProtectedRoute>
              }
            />

            {/* ── Fallback ── */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}

/* ── Placeholder for future pages ── */
function PlaceholderPage({ title, description }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚧</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-neutral-dark mb-2">{title}</h2>
        <p className="text-neutral-400">{description}</p>
      </div>
    </div>
  );
}
