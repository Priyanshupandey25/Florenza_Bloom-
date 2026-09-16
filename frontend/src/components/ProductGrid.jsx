import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "./ProductCard";

gsap.registerPlugin(ScrollTrigger);

function ProductGrid({ products, onAddToCart }) {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".collection-heading > *", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.from(".product-card", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".products-grid",
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="stitch-collection"
      id="bouquets"
      ref={sectionRef}
    >
      <div className="collection-heading">

        <p className="collection-label">
          ✦ THE COLLECTION
        </p>

        <h2>
          Made to be
          <br />
          <span>remembered.</span>
        </h2>

        <p className="collection-description">
          Thoughtfully handcrafted bouquets for
          birthdays, celebrations, surprises and
          all the little moments in between.
        </p>

      </div>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductGrid;