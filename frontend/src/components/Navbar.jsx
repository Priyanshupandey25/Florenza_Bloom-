import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router";

import gsap from "gsap";
import useAuth from "../hooks/useAuth";

function Navbar({ cartCount = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navbarRef = useRef(null);
  const cartRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  /* ========================================
     SCROLL EFFECT
  ======================================== */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* ========================================
     CLOSE MOBILE MENU ON PAGE CHANGE
  ======================================== */

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* ========================================
     NAVBAR ENTRANCE ANIMATION
  ======================================== */

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stitch-navbar > *", {
        opacity: 0,
        y: -15,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, navbarRef);

    return () => ctx.revert();
  }, []);

  /* ========================================
     CART COUNT ANIMATION
  ======================================== */

  useEffect(() => {
    if (!cartRef.current || cartCount <= 0) {
      return;
    }

    gsap.fromTo(
      cartRef.current,
      {
        scale: 0.7,
      },
      {
        scale: 1,
        duration: 0.4,
        ease: "back.out(2)",
      }
    );
  }, [cartCount]);

  /* ========================================
     CART CLICK
  ======================================== */

  const handleCartClick = () => {
    setMobileOpen(false);
    navigate("/cart");
  };

  /* ========================================
     MOBILE MENU TOGGLE
  ======================================== */

  const toggleMobileMenu = () => {
    setMobileOpen((current) => !current);
  };

  return (
    <header
      ref={navbarRef}
      className={`stitch-navbar ${scrolled ? "navbar-scrolled" : ""
        }`}
    >

      {/* ========================================
          BRAND
      ======================================== */}

      <NavLink
        to="/"
        className={({ isActive }) =>
          `brand ${isActive ? "brand-active" : ""
          }`
        }
        onClick={() => setMobileOpen(false)}
      >
        Florenza Bloom
      </NavLink>


      {/* ========================================
          NAVIGATION
      ======================================== */}

      <nav
        className={`nav-links ${mobileOpen ? "mobile-open" : ""
          }`}
      >

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""
            }`
          }
          onClick={() => setMobileOpen(false)}
        >
          Home
        </NavLink>


        <NavLink
          to="/collection"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""
            }`
          }
          onClick={() => setMobileOpen(false)}
        >
          Our Collection
        </NavLink>


        <NavLink
          to="/custom-bouquets"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""
            }`
          }
          onClick={() => setMobileOpen(false)}
        >
          Custom Bouquets
        </NavLink>

      </nav>


      {/* ========================================
          RIGHT SIDE ACTIONS
      ======================================== */}

      <div className="navbar-actions">

        {/* LOGIN / SIGNUP / USER STATE */}

        {isAuthenticated && user ? (
          <div className="navbar-auth-user">
            {user.role === "seller" && (
              <NavLink to="/seller/dashboard" className="navbar-seller-badge-link">
                Studio
              </NavLink>
            )}
            <button
              type="button"
              className="navbar-logout-btn"
              onClick={async () => {
                setMobileOpen(false);
                await logout();
                navigate("/login");
              }}
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `navbar-auth-link ${isActive ? "active" : ""
              }`
            }
            onClick={() => setMobileOpen(false)}
          >
            Login / Signup
          </NavLink>
        )}

        {/* ========================================
            CART
        ======================================== */}

        <button
          type="button"
          className="nav-icon cart-icon"
          onClick={handleCartClick}
          aria-label={`Cart with ${cartCount} items`}
        >

          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >

            <path
              d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.95-1.55L20.5 8H6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.45"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <circle
              cx="10"
              cy="20"
              r="1"
              fill="currentColor"
            />

            <circle
              cx="18"
              cy="20"
              r="1"
              fill="currentColor"
            />

          </svg>

          {cartCount > 0 && (
            <span
              ref={cartRef}
              className="cart-count"
            >
              {cartCount}
            </span>
          )}

        </button>


        {/* ========================================
            MOBILE MENU BUTTON
        ======================================== */}

        <button
          type="button"
          className={`menu-button ${mobileOpen
              ? "menu-active"
              : ""
            }`}
          onClick={toggleMobileMenu}
          aria-label={
            mobileOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>

      </div>

    </header>
  );
}

export default Navbar;