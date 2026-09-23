import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Footer() {
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-brand, .footer-column", {
        opacity: 0,
        y: 25,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(".footer-bottom", {
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer-main">
        {/* Brand */}
        <div className="footer-brand">
          <h2>
            <span>✿</span> Florenza Bloom
          </h2>

          <p>Handmade flowers that never fade.</p>

          <p className="footer-note">
            Crafted with patience, creativity
            <br />
            and a little bit of love.
          </p>
        </div>

        {/* Explore */}
        <div className="footer-column">
          <h4>Explore</h4>

          <a href="/">Home</a>
          <a href="/collection">Our Collection</a>
          <a href="/custom-bouquets">Custom Bouquets</a>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h4>Connect</h4>

          <a
            href="https://www.instagram.com/florenza.bloom_/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>

          <a
            href="https://wa.me/919987998625"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>

          <a href="mailto:pandeypriyanshu7890@gmail.com">Email</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Florenza Bloom</span>

        <span>
          Handmade with <span className="footer-heart">♥</span>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
