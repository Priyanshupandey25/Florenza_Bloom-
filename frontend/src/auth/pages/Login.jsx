import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import gsap from "gsap";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useAuth from "../hooks/useAuth";

function Login({ cartCount }) {
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to destination or home
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline
        .from(".login-card", {
          opacity: 0,
          y: 45,
          duration: 0.9,
          ease: "power3.out",
        })
        .from(
          ".login-label",
          {
            opacity: 0,
            y: 15,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .from(
          ".login-title",
          {
            opacity: 0,
            y: 25,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.35"
        )
        .from(
          ".login-form > *",
          {
            opacity: 0,
            y: 15,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.4"
        );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(
        err.message || "Invalid email or password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page" ref={pageRef}>
      <Navbar cartCount={cartCount} />

      <main className="auth-main">
        <section className="login-card">
          <div className="login-header">
            <p className="login-label">
              ✦ WELCOME BACK
            </p>

            <h1 className="login-title">
              Welcome
              <br />
              <span>back.</span>
            </h1>

            <p className="login-description">
              Sign in to continue creating beautiful
              moments with Florenza Bloom.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {errorMessage && (
              <div className="auth-error-banner" role="alert">
                <span className="auth-error-icon">!</span>
                <p className="auth-error-text">{errorMessage}</p>
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="login-email">
                EMAIL ADDRESS
              </label>

              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="auth-field">
              <div className="password-label-row">
                <label htmlFor="login-password">
                  PASSWORD
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    alert(
                      "Password reset will be available after backend integration."
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>

              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                disabled={isSubmitting}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "LOGGING IN..." : "LOGIN"}
              <span>→</span>
            </button>
          </form>

          <div className="auth-divider">
            <span />
            <p>OR</p>
            <span />
          </div>

          <div className="auth-signup-link">
            <p>
              Don't have an account?
            </p>

            <Link to="/signup">
              CREATE AN ACCOUNT
              <span>↗</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Login;