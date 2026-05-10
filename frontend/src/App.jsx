/* ────────────────────────────────────────────
   App — Root component with routing
   ──────────────────────────────────────────── */

import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Phase 2 Pages
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';
import MyTrips from './pages/MyTrips';
import Search from './pages/Search';

// Phase 3 Pages
import ItineraryView from './pages/ItineraryView';
import Community from './pages/Community';
import Profile from './pages/Profile';
import PackingChecklist from './pages/PackingChecklist';
import TripNotes from './pages/TripNotes';
import AdminPanel from './pages/AdminPanel';
import ExpenseInvoice from './pages/ExpenseInvoice';

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

            {/* ── Phase 2 Routes ── */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
            <Route path="/trips/:tripId" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
            <Route path="/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />

            {/* ── Phase 3 Routes ── */}
            <Route path="/trips/:tripId/ai" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/trips/:tripId/packing" element={<ProtectedRoute><PackingChecklist /></ProtectedRoute>} />
            <Route path="/trips/:tripId/notes" element={<ProtectedRoute><TripNotes /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            <Route path="/trips/:tripId/expenses" element={<ProtectedRoute><ExpenseInvoice /></ProtectedRoute>} />

            {/* ── Standalone packing/notes (no trip context) ── */}
            <Route path="/packing" element={<ProtectedRoute><PackingChecklist /></ProtectedRoute>} />
            <Route path="/notes" element={<ProtectedRoute><TripNotes /></ProtectedRoute>} />

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
          success: { iconTheme: { primary: '#2D5F5D', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </div>
  );
}
