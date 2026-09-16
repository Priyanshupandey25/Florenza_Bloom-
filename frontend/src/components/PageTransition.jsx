import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router";
import gsap from "gsap";

function PageTransition({ children }) {
  const overlayRef = useRef(null);
  const flowerRef = useRef(null);
  const particlesRef = useRef(null);
  const contentRef = useRef(null);

  const location = useLocation();

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const flower = flowerRef.current;
    const particlesContainer = particlesRef.current;
    const content = contentRef.current;

    if (
      !overlay ||
      !flower ||
      !particlesContainer ||
      !content
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();

      /* --------------------------------
         CREATE PARTICLES
      -------------------------------- */

      const symbols = [
        "✦",
        "✧",
        "✿",
        "❀",
        "✦",
        "·",
        "✧",
        "❀",
      ];

      const particles = [];

      symbols.forEach((symbol, index) => {
        const particle =
          document.createElement("span");

        particle.className =
          "page-transition-particle";

        particle.textContent = symbol;

        particlesContainer.appendChild(
          particle
        );

        particles.push(particle);

        const angle =
          (index / symbols.length) *
            Math.PI *
            2 +
          gsap.utils.random(
            -0.25,
            0.25
          );

        const distance =
          gsap.utils.random(
            100,
            190
          );

        const x =
          Math.cos(angle) *
          distance;

        const y =
          Math.sin(angle) *
          distance;

        gsap.set(particle, {
          x: 0,
          y: 0,
          scale: 0,
          opacity: 0,
          rotation:
            gsap.utils.random(
              -40,
              40
            ),
        });

        particle.dataset.x = x;
        particle.dataset.y = y;
      });


      /* --------------------------------
         INITIAL STATE
      -------------------------------- */

      // IMPORTANT:
      // Only use opacity on the page wrapper.
      // Do NOT use transform here.
      //
      // This keeps the fixed Navbar stable.

      gsap.set(content, {
        opacity: 0,
      });

      gsap.set(overlay, {
        opacity: 1,
        pointerEvents: "auto",
      });

      gsap.set(flower, {
        scale: 0,
        opacity: 0,
        rotation: -25,
      });


      /* --------------------------------
         FLOWER BLOOM
      -------------------------------- */

      timeline.to(flower, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.55,
        ease: "back.out(1.8)",
      });


      /* --------------------------------
         FLOWER PULSE
      -------------------------------- */

      timeline.to(flower, {
        scale: 1.12,
        duration: 0.18,
        ease: "power1.out",
      });

      timeline.to(flower, {
        scale: 1,
        duration: 0.18,
        ease: "power1.inOut",
      });


      /* --------------------------------
         PARTICLES RADIATE
      -------------------------------- */

      particles.forEach(
        (particle, index) => {
          timeline.to(
            particle,
            {
              x: Number(
                particle.dataset.x
              ),
              y: Number(
                particle.dataset.y
              ),
              scale:
                gsap.utils.random(
                  0.65,
                  1
                ),
              opacity:
                gsap.utils.random(
                  0.45,
                  0.8
                ),
              rotation:
                gsap.utils.random(
                  -90,
                  90
                ),
              duration: 0.65,
              ease: "power2.out",
            },
            index === 0
              ? "-=0.25"
              : "<0.03"
          );
        }
      );


      /* --------------------------------
         PARTICLES FADE
      -------------------------------- */

      timeline.to(
        particles,
        {
          opacity: 0,
          scale: 0.25,
          duration: 0.45,
          ease: "power2.in",
          stagger: 0.025,
        },
        "-=0.25"
      );


      /* --------------------------------
         FLOWER FADES
      -------------------------------- */

      timeline.to(
        flower,
        {
          scale: 1.5,
          opacity: 0,
          rotation: 12,
          duration: 0.45,
          ease: "power2.in",
        },
        "-=0.35"
      );


      /* --------------------------------
         OVERLAY FADES
      -------------------------------- */

      timeline.to(
        overlay,
        {
          opacity: 0,
          duration: 0.65,
          ease: "power2.out",
          pointerEvents: "none",
        },
        "-=0.15"
      );


      /* --------------------------------
         PAGE FADES IN
      -------------------------------- */

      timeline.to(
        content,
        {
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
        },
        "-=0.45"
      );
    });

    return () => {
      ctx.revert();
    };
  }, [location.pathname]);

  return (
    <>
      <div
        ref={contentRef}
        className="page-transition-content"
      >
        {children}
      </div>

      <div
        ref={overlayRef}
        className="page-transition-overlay"
        aria-hidden="true"
      >
        <div
          ref={particlesRef}
          className="page-transition-particles"
        />

        <div
          ref={flowerRef}
          className="page-transition-flower"
        >
          ✿
        </div>
      </div>
    </>
  );
}

export default PageTransition;