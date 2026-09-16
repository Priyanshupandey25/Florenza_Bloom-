import { useRef, useState } from "react";
import gsap from "gsap";

function ProductGallery({ images = [], productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef(null);

  if (!images.length) {
    return null;
  }

  const animateImage = () => {
    const image = galleryRef.current?.querySelector(
      ".gallery-main-image"
    );

    if (!image) return;

    gsap.fromTo(
      image,
      {
        opacity: 0.4,
        scale: 0.98,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      }
    );
  };

  const nextImage = () => {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1
    );

    animateImage();
  };

  const previousImage = () => {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1
    );

    animateImage();
  };

  const selectImage = (index) => {
    if (index === activeIndex) return;

    setActiveIndex(index);
    animateImage();
  };

  return (
    <div className="product-gallery" ref={galleryRef}>
      <div className="gallery-main">
        <img
          src={images[activeIndex]}
          alt={`${productName} ${activeIndex + 1}`}
          className="gallery-main-image"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="gallery-arrow gallery-prev"
              onClick={previousImage}
              aria-label="Previous image"
            >
              ←
            </button>

            <button
              type="button"
              className="gallery-arrow gallery-next"
              onClick={nextImage}
              aria-label="Next image"
            >
              →
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              className={`gallery-thumbnail ${
                index === activeIndex ? "active" : ""
              }`}
              onClick={() => selectImage(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;