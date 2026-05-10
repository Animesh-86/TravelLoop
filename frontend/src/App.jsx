/* ────────────────────────────────────────────
   App — Root component with routing
   ──────────────────────────────────────────── */

import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';
import MyTrips from './pages/MyTrips';
import Search from './pages/Search';

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

            {/* ── Phase 2 Routes (Active) ── */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-trip"
              element={
                <ProtectedRoute>
                  <CreateTrip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/:tripId"
              element={
                <ProtectedRoute>
                  <ItineraryBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <ProtectedRoute>
                  <MyTrips />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              }
            />

            {/* ── Phase 3 Placeholders ── */}
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

      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#1a1a1a',
            color: '#fff',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#2D5F5D', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
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
