import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

function Hero() {
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero content entrance
      gsap.from(".hero-content > *", {
        opacity: 0,
        y: 35,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Flowers entrance
      const flowers = gsap.utils.toArray(".hero-flower");

      gsap.fromTo(
        flowers,
        {
          opacity: 0,
          scale: 0,
          rotation: -25,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.2,
          stagger: 0.2,
          delay: 0.2,
          ease: "back.out(1.7)",
        }
      );

      // Gentle floating
      flowers.forEach((flower, index) => {
        gsap.to(flower, {
          y: index % 2 === 0 ? -12 : 12,
          x: index % 2 === 0 ? 6 : -6,
          rotation: index % 2 === 0 ? 4 : -4,
          duration: 3 + index * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.3,
        });
      });

      // Decorative dots
      gsap.to(".hero-dot", {
        opacity: 0.2,
        scale: 0.6,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.4,
      });

      // Mouse parallax
      const handleMouseMove = (event) => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;

        gsap.to(flowers, {
          x: (index) => x * (8 + index * 5),
          y: (index) => y * (6 + index * 4),
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="stitch-hero"
      id="home"
      ref={heroRef}
    >
      {/* Decorative flowers */}

      <div className="hero-flower flower-1">
        <div className="hero-flower-inner">
          <span className="petal petal-a"></span>
          <span className="petal petal-b"></span>
          <span className="petal petal-c"></span>
          <span className="petal petal-d"></span>
          <span className="petal petal-e"></span>
          <span className="flower-center"></span>
        </div>
      </div>

      <div className="hero-flower flower-2">
        <div className="hero-flower-inner">
          <span className="petal petal-a"></span>
          <span className="petal petal-b"></span>
          <span className="petal petal-c"></span>
          <span className="petal petal-d"></span>
          <span className="petal petal-e"></span>
          <span className="flower-center"></span>
        </div>
      </div>

      <div className="hero-flower flower-3">
        <div className="hero-flower-inner">
          <span className="petal petal-a"></span>
          <span className="petal petal-b"></span>
          <span className="petal petal-c"></span>
          <span className="petal petal-d"></span>
          <span className="petal petal-e"></span>
          <span className="flower-center"></span>
        </div>
      </div>

      <div className="hero-flower flower-4">
        <div className="hero-flower-inner">
          <span className="petal petal-a"></span>
          <span className="petal petal-b"></span>
          <span className="petal petal-c"></span>
          <span className="petal petal-d"></span>
          <span className="petal petal-e"></span>
          <span className="flower-center"></span>
        </div>
      </div>

      {/* Main Hero Content */}

      <div className="hero-content">

        <p className="hero-eyebrow">
          ✦ HANDCRAFTED WITH LOVE
        </p>

        <h1>
          Flowers that
          <br />
          <span>never fade.</span>
        </h1>

        <p className="hero-description">
          Handcrafted pipe cleaner bouquets
          <br />
          made to last forever.
        </p>

        <a
          href="#bouquets"
          className="hero-button"
        >
          EXPLORE BOUQUETS
          <span>→</span>
        </a>

      </div>

      {/* Decorative dots */}

      <span className="hero-dot dot-1"></span>
      <span className="hero-dot dot-2"></span>
      <span className="hero-dot dot-3"></span>
      <span className="hero-dot dot-4"></span>

    </section>
  );
}

export default Hero;