import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductGallery from "../components/ProductGallery";
import products from "../data/products";

gsap.registerPlugin(ScrollTrigger);

function Collection({ cartCount, onAddToCart }) {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /* =========================================
         COLLECTION HEADER
      ========================================= */

      gsap.from(".collection-page-label", {
        opacity: 0,
        y: 25,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".collection-page-title", {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.1,
        ease: "power3.out",
      });

      gsap.from(".collection-page-intro", {
        opacity: 0,
        y: 25,
        duration: 0.8,
        delay: 0.25,
        ease: "power3.out",
      });

      gsap.from(".collection-scroll-indicator", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.45,
        ease: "power3.out",
      });

      /* =========================================
         PRODUCT SECTIONS
      ========================================= */

      gsap.utils
        .toArray(".collection-product-section")
        .forEach((section) => {
          const image = section.querySelector(
            ".collection-product-content .product-gallery"
          );

          const content = section.querySelector(
            ".collection-product-info"
          );

          const category = section.querySelector(
            ".collection-product-category"
          );

          const title = section.querySelector(
            ".collection-product-info h2"
          );

          const description = section.querySelector(
            ".collection-product-description"
          );

          const price = section.querySelector(
            ".collection-product-price"
          );

          const button = section.querySelector(
            ".collection-add-button"
          );

          const number = section.querySelector(
            ".collection-product-number"
          );

          /* =========================================
             IMAGE REVEAL
          ========================================= */

          if (image) {
            const imageElement = image.querySelector("img");

            if (imageElement) {
              gsap.set(image, {
                clipPath: "inset(0 100% 0 0)",
              });

              gsap.set(imageElement, {
                scale: 1.12,
              });

              const imageTimeline = gsap.timeline({
                scrollTrigger: {
                  trigger: section,
                  start: "top 85%",
                  end: "top 35%",
                  scrub: 1.2,
                },
              });

              imageTimeline
                .to(image, {
                  clipPath: "inset(0 0% 0 0)",
                  ease: "none",
                })
                .to(
                  imageElement,
                  {
                    scale: 1,
                    ease: "none",
                  },
                  "<"
                );
            }
          }

          /* =========================================
             PRODUCT NUMBER
          ========================================= */

          if (number) {
            gsap.fromTo(
              number,
              {
                opacity: 0,
                x: -25,
              },
              {
                opacity: 1,
                x: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 80%",
                  end: "top 45%",
                  scrub: 1,
                },
              }
            );
          }

          /* =========================================
             TEXT + SCROLL ANIMATION
          ========================================= */

          if (content) {
            gsap.set(content, {
              opacity: 1,
            });
          }

          const textElements = [
            category,
            title,
            description,
            price,
            button,
          ].filter(Boolean);

          if (textElements.length > 0) {
            gsap.set(textElements, {
              opacity: 0,
              y: 45,
            });

            const textTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 72%",
                end: "top 25%",
                scrub: 1,
              },
            });

            textTimeline.to(category, {
              opacity: 1,
              y: 0,
              ease: "none",
            });

            textTimeline.to(
              title,
              {
                opacity: 1,
                y: 0,
                ease: "none",
              },
              "-=0.25"
            );

            textTimeline.to(
              description,
              {
                opacity: 1,
                y: 0,
                ease: "none",
              },
              "-=0.2"
            );

            textTimeline.to(
              price,
              {
                opacity: 1,
                y: 0,
                ease: "none",
              },
              "-=0.15"
            );

            textTimeline.to(
              button,
              {
                opacity: 1,
                y: 0,
                ease: "none",
              },
              "-=0.1"
            );
          }

          /* =========================================
             SUBTLE TEXT PARALLAX
          ========================================= */

          if (content) {
            gsap.to(content, {
              y: -35,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
            });
          }
        });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div
      className="collection-page"
      ref={pageRef}
    >
      <Navbar cartCount={cartCount} />

      <main>
        {/* =========================================
            COLLECTION HEADER
        ========================================= */}

        <section className="collection-page-header">
          <p className="collection-page-label">
            ✦ THE FLORENZA COLLECTION
          </p>

          <h1 className="collection-page-title">
            Flowers made to
            <br />
            <span>last forever.</span>
          </h1>

          <p className="collection-page-intro">
            Discover our handcrafted bouquets, each thoughtfully
            created to bring a little more beauty into everyday moments.
          </p>

          <div className="collection-scroll-indicator">
            <span>SCROLL</span>

            <span className="collection-scroll-arrow">
              ↓
            </span>
          </div>
        </section>

        {/* =========================================
            PRODUCTS
        ========================================= */}

        <section className="collection-products">
          {products.map((product, index) => (
            <article
              className="collection-product-section"
              key={product.id}
            >
              <div className="collection-product-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="collection-product-content">
                <ProductGallery
                  images={product.images}
                  productName={product.name}
                />

                <div className="collection-product-info">
                  <p className="collection-product-category">
                    {product.tag}
                  </p>

                  <h2>{product.name}</h2>

                  <p className="collection-product-description">
                    {product.description}
                  </p>

                  <p className="collection-product-price">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>

                  <button
                    type="button"
                    className="collection-add-button"
                    onClick={() =>
                      handleAddToCart(product)
                    }
                  >
                    ADD TO CART
                    <span>+</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Collection;