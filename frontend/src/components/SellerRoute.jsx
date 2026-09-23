import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";

function SellerRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  /* ========================================
     CHECKING SESSION
  ======================================== */

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-spinner" />
        <p className="auth-loading-text">
          Verifying seller access...
        </p>
      </div>
    );
  }

  /* ========================================
     NOT LOGGED IN
  ======================================== */

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  /* ========================================
     NOT A SELLER
  ======================================== */

  if (user?.role !== "seller") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  /* ========================================
     SELLER
  ======================================== */

  return children;
}

export default SellerRoute;