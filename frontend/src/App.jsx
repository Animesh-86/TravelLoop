/* ────────────────────────────────────────────
   App — Root component with routing
   ──────────────────────────────────────────── */

import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Phase 2
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';
import MyTrips from './pages/MyTrips';
import Search from './pages/Search';

// Phase 3
import ItineraryView from './pages/ItineraryView';
import Community from './pages/Community';
import Profile from './pages/Profile';
import PackingChecklist from './pages/PackingChecklist';
import TripNotes from './pages/TripNotes';
import AdminPanel from './pages/AdminPanel';
import ExpenseInvoice from './pages/ExpenseInvoice';
import ExpensesIndex from './pages/ExpensesIndex';
import OfflineBanner from './components/ui/OfflineBanner';
import GenieChat from './components/itinerary/GenieChat';

function GlobalChat() {
  const location = useLocation();
  // Extract tripId from URL if on a trip page
  const match = location.pathname.match(/\/trips\/([^\/]+)/);
  const tripId = match ? match[1] : null;
  
  // Don't show on login/signup
  if (location.pathname === '/login' || location.pathname === '/signup') return null;

  return <GenieChat tripId={tripId} />;
}

/* Pages that render their OWN navbar/footer (full-screen layouts) */
const STANDALONE_ROUTES = ['/', '/login', '/signup'];

export default function App() {
  const location = useLocation();
  const isStandalone = STANDALONE_ROUTES.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-light">
      <OfflineBanner />
      
      {/* Only show app chrome on non-standalone pages */}
      {!isStandalone && <Navbar />}

      <div className="flex flex-1">
        {!isStandalone && <Sidebar />}

        <main className="flex-1 flex flex-col min-h-0">
          <Routes>
            {/* ── Landing ── */}
            <Route path="/" element={<LandingPage />} />

            {/* ── Auth ── */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ── Phase 2 ── */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
            <Route path="/trips/:tripId" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
            <Route path="/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />

            {/* ── Phase 3 ── */}
            <Route path="/trips/:tripId/ai" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/trips/:tripId/packing" element={<ProtectedRoute><PackingChecklist /></ProtectedRoute>} />
            <Route path="/trips/:tripId/notes" element={<ProtectedRoute><TripNotes /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            <Route path="/trips/:tripId/expenses" element={<ProtectedRoute><ExpenseInvoice /></ProtectedRoute>} />

            {/* ── Global routes ── */}
            <Route path="/expenses" element={<ProtectedRoute><ExpensesIndex /></ProtectedRoute>} />
            <Route path="/packing" element={<ProtectedRoute><PackingChecklist /></ProtectedRoute>} />
            <Route path="/notes" element={<ProtectedRoute><TripNotes /></ProtectedRoute>} />

            {/* ── Fallback ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {!isStandalone && <Footer />}
      <GlobalChat />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', background: '#1a1a1a', color: '#fff', fontSize: '14px' },
          success: { iconTheme: { primary: '#2D5F5D', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </div>
  );
}
