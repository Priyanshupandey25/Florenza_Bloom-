import { useEffect, useRef } from "react";
import gsap from "gsap";

function MouseTrail() {
  const trailRef = useRef(null);

  useEffect(() => {
    const container = trailRef.current;

    if (!container) return;

    // Disable on touch/mobile devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const symbols = ["✦", "✧", "✿", "❀", "✦"];

    const handleMouseMove = (event) => {
      const element = document.createElement("span");

      element.className = "mouse-trail-element";
      element.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

      element.style.left = `${event.clientX}px`;
      element.style.top = `${event.clientY}px`;

      container.appendChild(element);

      const size = gsap.utils.random(10, 18);
      const rotation = gsap.utils.random(-30, 30);
      const driftX = gsap.utils.random(-18, 18);
      const driftY = gsap.utils.random(-28, -8);

      gsap.set(element, {
        fontSize: size,
        rotation,
        scale: 0,
        opacity: 0,
      });

      const timeline = gsap.timeline({
        onComplete: () => {
          element.remove();
        },
      });

      timeline
        .to(element, {
          scale: 1,
          opacity: 0.85,
          duration: 0.18,
          ease: "back.out(2)",
        })
        .to(
          element,
          {
            x: driftX,
            y: driftY,
            rotation: rotation + gsap.utils.random(-25, 25),
            opacity: 0,
            scale: 0.4,
            duration: 2.5,
            ease: "power2.out",
          },
          "-=0.02"
        );
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={trailRef}
      className="mouse-trail-container"
      aria-hidden="true"
    />
  );
}

export default MouseTrail;