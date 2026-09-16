import { useRef } from "react";
import gsap from "gsap";

function ProductCard({ product, onAddToCart }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);

  const mainImage = product.images?.[0];

  const handleMouseEnter = () => {
    if (window.innerWidth <= 768) return;

    gsap.to(cardRef.current, {
      y: -8,
      duration: 0.4,
      ease: "power3.out",
    });

    gsap.to(imageRef.current, {
      scale: 1.06,
      duration: 0.6,
      ease: "power3.out",
    });

    gsap.to(
      cardRef.current.querySelector(".product-flower"),
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
      }
    );
  };

  const handleMouseLeave = () => {
    if (window.innerWidth <= 768) return;

    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.4,
      ease: "power3.out",
    });

    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
    });

    gsap.to(
      cardRef.current.querySelector(".product-flower"),
      {
        opacity: 0,
        scale: 0,
        rotation: -20,
        duration: 0.3,
        ease: "power2.out",
      }
    );
  };

  const handleAddToCart = () => {
    gsap.fromTo(
      cardRef.current.querySelector(".add-cart-button"),
      { scale: 1 },
      {
        scale: 0.94,
        duration: 0.1,
        repeat: 1,
        yoyo: true,
        ease: "power2.out",
      }
    );

    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <article
      className="product-card"
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="product-image-wrapper">

        <img
          ref={imageRef}
          src={mainImage}
          alt={product.name}
          className="product-image"
        />

        <span className="product-flower">
          ✿
        </span>

        {product.tag && (
          <span className="product-tag">
            {product.tag}
          </span>
        )}

      </div>

      <div className="product-info">

        <p className="product-category">
          {product.category || "HANDCRAFTED BOUQUET"}
        </p>

        <h3>{product.name}</h3>

        {product.description && (
          <p className="product-description">
            {product.description}
          </p>
        )}

        <div className="product-bottom">

          <span className="product-price">
            ₹{product.price}
          </span>

          <button
            type="button"
            className="add-cart-button"
            onClick={handleAddToCart}
          >
            ADD TO CART <span>+</span>
          </button>

        </div>

      </div>
    </article>
  );
}

export default ProductCard;