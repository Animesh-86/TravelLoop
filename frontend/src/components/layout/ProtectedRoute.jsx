/* ────────────────────────────────────────────
   ProtectedRoute — Auth guard for private pages
   ──────────────────────────────────────────── */

import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
