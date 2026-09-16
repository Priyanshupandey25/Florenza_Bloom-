import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function WhyUs() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(".why-heading > *", {
        opacity: 0,
        y: 25,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      // Cards fade in only — NO vertical movement
      gsap.from(".why-card", {
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".why-grid",
          start: "top 85%",
          once: true,
        },
      });

      // Very subtle background flower movement
      gsap.to(".why-background-flower", {
        y: -12,
        x: 6,
        scale: 1.02,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      title: "Made by Hand",
      text: "Every flower is carefully shaped and assembled by hand.",
      icon: (
        <svg
          viewBox="0 0 64 64"
          className="why-svg"
          aria-hidden="true"
        >
          <path d="M32 51V27" />
          <path d="M32 35C25 35 20 30 20 24C27 24 32 29 32 35Z" />
          <path d="M32 41C39 41 44 36 44 30C37 30 32 35 32 41Z" />
          <path d="M32 27C25 27 22 22 24 17C29 17 32 21 32 27Z" />
          <path d="M32 27C39 27 42 22 40 17C35 17 32 21 32 27Z" />
        </svg>
      ),
    },
    {
      title: "Made to Last",
      text: "Beautiful blooms that stay special long after the moment.",
      icon: (
        <svg
          viewBox="0 0 64 64"
          className="why-svg"
          aria-hidden="true"
        >
          <path d="M32 49C29 46 17 38 17 27C17 21 21 17 27 17C30 17 32 19 32 22C32 19 34 17 37 17C43 17 47 21 47 27C47 38 35 46 32 49Z" />
        </svg>
      ),
    },
    {
      title: "Made with Love",
      text: "Thoughtful details that make every bouquet feel personal.",
      icon: (
        <svg
          viewBox="0 0 64 64"
          className="why-svg"
          aria-hidden="true"
        >
          <path d="M32 14L34 21L41 23L34 25L32 32L30 25L23 23L30 21Z" />
          <path d="M46 30L48 36L54 38L48 40L46 46L44 40L38 38L44 36Z" />
          <path d="M20 34L22 39L27 41L22 43L20 48L18 43L13 41L18 39Z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="stitch-why" ref={sectionRef}>

      {/* Background sunflower */}
      <img
        src="/products/sunflower.png"
        alt=""
        aria-hidden="true"
        className="why-background-flower"
      />

      <div className="why-content">

        {/* Heading */}
        <div className="why-heading">
          <p className="why-label">
            ✦ WHY FLORENZA BLOOM
          </p>

          <h2>
            Made with purpose.
            <br />
            Made for <span>you.</span>
          </h2>

          <p className="why-description">
            Every bouquet we create carries thought,
            <br className="desktop-break" />
            care and a little bit of love.
          </p>
        </div>


        {/* Feature Cards */}
        <div className="why-grid">

          {features.map((feature) => (
            <article className="why-card" key={feature.title}>

              <div className="why-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <div className="why-divider"></div>

              <p>{feature.text}</p>

            </article>
          ))}

        </div>

      </div>
    </section>
  );
}

export default WhyUs;