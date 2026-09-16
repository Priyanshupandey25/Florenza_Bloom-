import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Reviews() {
  const sectionRef = useRef(null);

  const reviews = [
    {
      text: "The bouquet was even more beautiful in person. You can really see the love and effort in every flower.",
      name: "Aarohi",
      occasion: "Birthday Gift",
    },
    {
      text: "Such a unique gift idea! The flowers looked absolutely beautiful and I love that they will last forever.",
      name: "Riya",
      occasion: "Special Gift",
    },
    {
      text: "The detailing is amazing. It felt so personal and thoughtful, and the bouquet made the moment extra special.",
      name: "Ananya",
      occasion: "Anniversary Gift",
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.from(".reviews-heading > *", {
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

      // Cards fade in without shifting their position
      gsap.from(".review-card", {
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".reviews-grid",
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="stitch-reviews" ref={sectionRef}>
      <div className="reviews-content">

        <div className="reviews-heading">
          <p className="reviews-label">
            ✦ KIND WORDS
          </p>

          <h2>
            Loved by the people
            <br />
            who <span>matter.</span>
          </h2>

          <p className="reviews-description">
            A little love from the people who chose to make
            their moments bloom with Florenza.
          </p>
        </div>

        <div className="reviews-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.name}>

              <div className="review-quote">
                “
              </div>

              <div className="review-stars">
                ★ ★ ★ ★ ★
              </div>

              <p className="review-text">
                {review.text}
              </p>

              <div className="review-line"></div>

              <h3>{review.name}</h3>

              <p className="review-occasion">
                {review.occasion}
              </p>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Reviews;