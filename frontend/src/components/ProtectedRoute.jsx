import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";

/**
 * Route guard component for authenticated pages.
 * Shows loading indicator while session check runs, redirects to /login if not logged in.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-spinner" />
        <p className="auth-loading-text">Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
