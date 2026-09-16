import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login({ cartCount }) {
  const pageRef = useRef(null);

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
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <div className="auth-field">
              <label htmlFor="login-email">
                EMAIL ADDRESS
              </label>

              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
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
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-button"
            >
              LOGIN
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