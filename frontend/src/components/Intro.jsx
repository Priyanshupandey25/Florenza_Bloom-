import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Intro() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveal
      gsap.from(".intro-content", {
        opacity: 0,
        x: -60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      // Image reveal
      gsap.from(".intro-image-wrapper", {
        opacity: 0,
        x: 60,
        scale: 0.94,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      // Image parallax
      gsap.to(".intro-image", {
        yPercent: -7,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Decorative flower
      gsap.to(".intro-flower", {
        y: -12,
        rotation: 8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="stitch-intro"
      ref={sectionRef}
    >
      {/* Left Content */}

      <div className="intro-content">

        <p className="intro-label">
          ✦ OUR PHILOSOPHY
        </p>

        <h2>
          Not just flowers.
          <br />

          <span>
            Little pieces of
            <br />
            happiness.
          </span>
        </h2>

        <p className="intro-description">
          Each bouquet is lovingly crafted
          by hand, using pipe cleaners,
          patience and imagination.
        </p>

        <a
          href="#story"
          className="intro-link"
        >
          LEARN OUR STORY
          <span>→</span>
        </a>

      </div>


      {/* Right Image */}

      <div className="intro-image-wrapper">

        <div className="intro-image-frame">

          <img
            src="\products\bouquet-lavender\bouquet-lavender-1.png"
            alt="Handcrafted pipe cleaner bouquet"
            className="intro-image"
          />

        </div>

        {/* Decorative flower */}

        <div className="intro-flower">
          ✿
        </div>

      </div>

    </section>
  );
}

export default Intro;