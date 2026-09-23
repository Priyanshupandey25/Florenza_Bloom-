import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import gsap from "gsap";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useAuth from "../hooks/useAuth";

function Signup({ cartCount }) {
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "seller") {
        navigate("/seller/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline
        .from(".signup-card", {
          opacity: 0,
          y: 45,
          duration: 0.9,
          ease: "power3.out",
        })
        .from(
          ".signup-label",
          {
            opacity: 0,
            y: 15,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .from(
          ".signup-title",
          {
            opacity: 0,
            y: 25,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.35"
        )
        .from(
          ".signup-form > *",
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

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password should be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        isSeller,
      });

      if (isSeller) {
        navigate("/seller/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setErrorMessage(
        err.message || "Failed to create account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page" ref={pageRef}>
      <Navbar cartCount={cartCount} />

      <main className="auth-main">
        <section className="signup-card">
          <div className="signup-header">
            <p className="signup-label">
              ✦ JOIN FLORENZA BLOOM
            </p>

            <h1 className="signup-title">
              Create
              <br />
              <span>something beautiful.</span>
            </h1>

            <p className="signup-description">
              Create your Florenza Bloom account and
              keep your favourite bouquets and
              creations close.
            </p>
          </div>

          <form
            className="signup-form"
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
              <label htmlFor="signup-name">
                FULL NAME
              </label>

              <input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-email">
                EMAIL ADDRESS
              </label>

              <input
                id="signup-email"
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
              <label htmlFor="signup-password">
                PASSWORD
              </label>

              <input
                id="signup-password"
                type="password"
                placeholder="Create a password (min. 6 characters)"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-confirm-password">
                CONFIRM PASSWORD
              </label>

              <input
                id="signup-confirm-password"
                type="password"
                placeholder="Confirm your password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
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
              {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
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
              Already have an account?
            </p>

            <Link to="/login">
              LOGIN TO YOUR ACCOUNT
              <span>↗</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Signup;
