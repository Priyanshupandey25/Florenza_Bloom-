import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);

const flowerOptions = [
  {
    name: "Roses",
    icon: "✿",
    colors: [
      { name: "Soft Pink", value: "#e8bfc2" },
      { name: "Red", value: "#c96b72" },
      { name: "White", value: "#f5eeee" },
      { name: "Lavender", value: "#c9b6d8" },
    ],
  },
  {
    name: "Tulips",
    icon: "❀",
    colors: [
      { name: "Pink", value: "#e6aeb8" },
      { name: "Purple", value: "#b99ac9" },
      { name: "Yellow", value: "#e5ca78" },
      { name: "White", value: "#f5eeee" },
    ],
  },
  {
    name: "Sunflowers",
    icon: "✽",
    colors: [
      { name: "Sunny Yellow", value: "#e5ca78" },
      { name: "Orange", value: "#d99555" },
      { name: "Cream", value: "#eadcae" },
    ],
  },
  {
    name: "Mixed Blooms",
    icon: "✾",
    colors: [
      { name: "Pastel Mix", value: "#d8b8c4" },
      { name: "Bright Mix", value: "#d99a73" },
      { name: "Soft Mix", value: "#c7b7c9" },
    ],
  },
];

const occasions = [
  "Birthday",
  "Anniversary",
  "Just Because",
  "Celebration",
  "Thank You",
  "Other",
];

function CustomBouquets({ cartCount }) {
  const pageRef = useRef(null);

  const [flowerQuantities, setFlowerQuantities] = useState({
    Roses: 0,
    Tulips: 0,
    Sunflowers: 0,
    "Mixed Blooms": 0,
  });

  const [flowerColors, setFlowerColors] = useState({
    Roses: {},
    Tulips: {},
    Sunflowers: {},
    "Mixed Blooms": {},
  });

  const [selectedOccasion, setSelectedOccasion] = useState("");

  const [message, setMessage] = useState("");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const heroTimeline = gsap.timeline();

      heroTimeline
        .from(".custom-page-label", {
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: "power3.out",
        })
        .from(
          ".custom-page-title",
          {
            opacity: 0,
            y: 45,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.35"
        )
        .from(
          ".custom-page-intro",
          {
            opacity: 0,
            y: 25,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.55"
        )
        .from(
          ".custom-scroll-indicator",
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.35"
        );

      gsap.utils
        .toArray(".custom-builder-section")
        .forEach((section) => {
          gsap.from(section, {
            opacity: 0,
            y: 45,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
            },
          });
        });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  /* ========================================
     FLOWER QUANTITY
  ======================================== */

  const updateFlowerQuantity = (flowerName, change) => {
    setFlowerQuantities((current) => {
      const currentQuantity = current[flowerName];

      const newQuantity = Math.max(
        0,
        currentQuantity + change
      );

      return {
        ...current,
        [flowerName]: newQuantity,
      };
    });

    if (change < 0) {
      setFlowerColors((current) => {
        const existingColors = {
          ...current[flowerName],
        };

        const colorEntries = Object.entries(existingColors);

        let totalColors = colorEntries.reduce(
          (sum, [, quantity]) => sum + quantity,
          0
        );

        const currentFlowerQuantity =
          flowerQuantities[flowerName];

        const newFlowerQuantity = Math.max(
          0,
          currentFlowerQuantity + change
        );

        while (totalColors > newFlowerQuantity) {
          const colorToReduce = colorEntries.find(
            ([, quantity]) => quantity > 0
          );

          if (!colorToReduce) break;

          const [colorName] = colorToReduce;

          existingColors[colorName] -= 1;
          totalColors -= 1;

          if (existingColors[colorName] <= 0) {
            delete existingColors[colorName];
          }
        }

        return {
          ...current,
          [flowerName]: existingColors,
        };
      });
    }
  };

  /* ========================================
     COLOR QUANTITY
  ======================================== */

  const updateColorQuantity = (
    flowerName,
    colorName,
    change
  ) => {
    setFlowerColors((current) => {
      const existingColors = {
        ...current[flowerName],
      };

      const currentColorQuantity =
        existingColors[colorName] || 0;

      const totalSelectedColors = Object.values(
        existingColors
      ).reduce(
        (sum, quantity) => sum + quantity,
        0
      );

      const flowerQuantity =
        flowerQuantities[flowerName];

      if (
        change > 0 &&
        totalSelectedColors >= flowerQuantity
      ) {
        return current;
      }

      const newQuantity = Math.max(
        0,
        currentColorQuantity + change
      );

      if (newQuantity === 0) {
        delete existingColors[colorName];
      } else {
        existingColors[colorName] = newQuantity;
      }

      return {
        ...current,
        [flowerName]: existingColors,
      };
    });
  };

  /* ========================================
     OCCASION
  ======================================== */

  const handleOccasionSelect = (occasion) => {
    setSelectedOccasion(occasion);
  };

  /* ========================================
     TOTAL FLOWERS
  ======================================== */

  const totalFlowers = Object.values(
    flowerQuantities
  ).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  /* ========================================
     CREATE BOUQUET
  ======================================== */

  const handleCreateBouquet = () => {
    console.log("Custom Bouquet:", {
      flowers: flowerQuantities,
      colors: flowerColors,
      occasion: selectedOccasion,
      message,
    });

    alert("Your custom bouquet has been created! 🌸");

    window.location.reload();
  };

  return (
    <div
      className="custom-page"
      ref={pageRef}
    >
      <Navbar cartCount={cartCount} />

      <main>

        {/* ========================================
            HERO
        ======================================== */}

        <section className="custom-page-header">
          <p className="custom-page-label">
            ✦ CUSTOM BOUQUETS
          </p>

          <h1 className="custom-page-title">
           Your preference,
            <br />
            <span>Our priority</span>
          </h1>

          <p className="custom-page-intro">
            Create a bouquet that feels completely
            yours. Choose your blooms, colours and
            little details to make something truly
            special.
          </p>

          <div className="custom-scroll-indicator">
            <span>SCROLL</span>
            <span className="custom-scroll-arrow">
              ↓
            </span>
          </div>
        </section>

        {/* ========================================
            INTRO
        ======================================== */}

        <section className="custom-builder-section custom-builder-intro">
          <p className="custom-section-label">
            START CREATING
          </p>

          <h2>
            Your bouquet,
            <br />
            <span>your story.</span>
          </h2>

          <p>
            There are no rules here. Pick what you
            love, choose the colours that feel right
            and create a bouquet made especially for
            someone special.
          </p>
        </section>

        {/* ========================================
            FLOWER SELECTION
        ======================================== */}

        <section className="custom-builder-section custom-choice-section">

          <div className="custom-choice-heading">

            <p className="custom-section-label">
              CHOOSE YOUR BLOOMS
            </p>

            <h2>
              Pick your flowers.
            </h2>

            <p>
              Choose how many flowers you want in
              your bouquet.
            </p>

          </div>

          <div className="custom-choice-grid">

            {flowerOptions.map((flower) => {

              const quantity =
                flowerQuantities[flower.name];

              return (
                <div
                  className={`custom-choice-card ${
                    quantity > 0
                      ? "selected"
                      : ""
                  }`}
                  key={flower.name}
                >

                  <span className="custom-choice-icon">
                    {flower.icon}
                  </span>

                  <span className="custom-choice-name">
                    {flower.name}
                  </span>

                  <div className="flower-quantity">

                    <button
                      type="button"
                      onClick={() =>
                        updateFlowerQuantity(
                          flower.name,
                          -1
                        )
                      }
                      disabled={quantity === 0}
                      aria-label={`Remove ${flower.name}`}
                    >
                      −
                    </button>

                    <span>
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateFlowerQuantity(
                          flower.name,
                          1
                        )
                      }
                      aria-label={`Add ${flower.name}`}
                    >
                      +
                    </button>

                  </div>

                  {quantity > 0 && (
                    <span className="flower-selected-text">
                      {quantity}{" "}
                      {quantity === 1
                        ? "flower"
                        : "flowers"}{" "}
                      selected
                    </span>
                  )}

                </div>
              );
            })}

          </div>

          {totalFlowers > 0 && (
            <div className="total-flower-count">
              <span>Total flowers</span>
              <strong>{totalFlowers}</strong>
            </div>
          )}

        </section>

        {/* ========================================
            COLOR SELECTION
        ======================================== */}

        {flowerOptions
          .filter(
            (flower) =>
              flowerQuantities[flower.name] > 0
          )
          .map((flower) => {

            const flowerQuantity =
              flowerQuantities[flower.name];

            const selectedColors =
              flowerColors[flower.name] || {};

            const selectedColorTotal =
              Object.values(
                selectedColors
              ).reduce(
                (sum, quantity) =>
                  sum + quantity,
                0
              );

            return (
              <section
                className="custom-builder-section custom-flower-color-section"
                key={`${flower.name}-colors`}
              >

                <div className="custom-choice-heading">

                  <p className="custom-section-label">
                    {flower.name.toUpperCase()}{" "}
                    — CHOOSE COLORS
                  </p>

                  <h2>
                    Pick your{" "}
                    <span>colours.</span>
                  </h2>

                  <p>
                    You selected{" "}
                    <strong>
                      {flowerQuantity}{" "}
                      {flower.name.toLowerCase()}
                    </strong>
                    . Choose how you'd like to
                    distribute their colours.
                  </p>

                  <div
                    className={`color-selection-count ${
                      selectedColorTotal ===
                      flowerQuantity
                        ? "complete"
                        : ""
                    }`}
                  >
                    {selectedColorTotal} /{" "}
                    {flowerQuantity} selected
                  </div>

                </div>

                <div className="custom-flower-color-grid">

                  {flower.colors.map((color) => {

                    const quantity =
                      selectedColors[
                        color.name
                      ] || 0;

                    return (
                      <div
                        className={`custom-flower-color-card ${
                          quantity > 0
                            ? "selected"
                            : ""
                        }`}
                        key={color.name}
                      >

                        <span
                          className="custom-color-large-swatch"
                          style={{
                            backgroundColor:
                              color.value,
                          }}
                        />

                        <span className="custom-flower-color-name">
                          {color.name}
                        </span>

                        <div className="flower-quantity color-quantity">

                          <button
                            type="button"
                            onClick={() =>
                              updateColorQuantity(
                                flower.name,
                                color.name,
                                -1
                              )
                            }
                            disabled={
                              quantity === 0
                            }
                            aria-label={`Remove ${color.name} ${flower.name}`}
                          >
                            −
                          </button>

                          <span>
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateColorQuantity(
                                flower.name,
                                color.name,
                                1
                              )
                            }
                            disabled={
                              selectedColorTotal >=
                              flowerQuantity
                            }
                            aria-label={`Add ${color.name} ${flower.name}`}
                          >
                            +
                          </button>

                        </div>

                      </div>
                    );
                  })}

                </div>

              </section>
            );
          })}

        {/* ========================================
            OCCASION
        ======================================== */}

        <section className="custom-builder-section custom-choice-section">

          <div className="custom-choice-heading">

            <p className="custom-section-label">
              CHOOSE AN OCCASION
            </p>

            <h2>
              What's it for?
            </h2>

            <p>
              Give your bouquet a little more
              meaning.
            </p>

          </div>

          <div className="custom-occasion-grid">

            {occasions.map((occasion) => (

              <button
                type="button"
                key={occasion}
                className={
                  selectedOccasion === occasion
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  handleOccasionSelect(
                    occasion
                  )
                }
              >
                {occasion}
              </button>

            ))}

          </div>

        </section>

        {/* ========================================
            MESSAGE
        ======================================== */}

        <section className="custom-builder-section custom-message-section">

          <div>

            <p className="custom-section-label">
              ADD A MESSAGE
            </p>

            <h2>
              Say it with
              <br />
              <span>a few words.</span>
            </h2>

          </div>

          <div className="custom-message-box">

            <textarea
              placeholder="Write a little message..."
              maxLength={200}
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
            />

            <span>
              {message.length} / 200
            </span>

          </div>

        </section>

        {/* ========================================
            FINAL CTA
        ======================================== */}

        <section className="custom-builder-section custom-final-section">

          <p className="custom-section-label">
            YOUR CREATION
          </p>

          <h2>
            Ready to make
            <br />
            <span>something beautiful?</span>
          </h2>

          <p>
            Your custom bouquet will be handcrafted
            with care, just for you.
          </p>

          {totalFlowers === 0 && (
            <p className="custom-final-warning">
              Choose at least one flower to create
              your bouquet.
            </p>
          )}

          {totalFlowers > 0 &&
            flowerOptions.some(
              (flower) => {
                const flowerQuantity =
                  flowerQuantities[
                    flower.name
                  ];

                const colorTotal =
                  Object.values(
                    flowerColors[
                      flower.name
                    ] || {}
                  ).reduce(
                    (sum, quantity) =>
                      sum + quantity,
                    0
                  );

                return (
                  colorTotal !==
                  flowerQuantity
                );
              }
            ) && (
              <p className="custom-final-warning">
                Please select colours for all
                your flowers before creating
                your bouquet.
              </p>
            )}

          <button
            type="button"
            className="custom-create-button"
            disabled={
              totalFlowers === 0 ||
              flowerOptions.some(
                (flower) => {
                  const flowerQuantity =
                    flowerQuantities[
                      flower.name
                    ];

                  const colorTotal =
                    Object.values(
                      flowerColors[
                        flower.name
                      ] || {}
                    ).reduce(
                      (sum, quantity) =>
                        sum + quantity,
                      0
                    );

                  return (
                    colorTotal !==
                    flowerQuantity
                  );
                }
              )
            }
            onClick={
              handleCreateBouquet
            }
          >
            CREATE MY BOUQUET

            <span>
              →
            </span>
          </button>

        </section>

      </main>

      <Footer />
    </div>
  );
}

export default CustomBouquets;