import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Signup({ cartCount }) {
  const pageRef = useRef(null);

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
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <div className="auth-field">
              <label htmlFor="signup-name">
                FULL NAME
              </label>

              <input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
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
                placeholder="Create a password"
                autoComplete="new-password"
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
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-button"
            >
              CREATE ACCOUNT
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