import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Cart({
  cart = [],
  onUpdateQuantity,
  onRemoveItem,
}) {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cart-page-header > *", {
        opacity: 0,
        y: 25,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.from(".cart-content", {
        opacity: 0,
        y: 35,
        duration: 0.8,
        delay: 0.25,
        ease: "power3.out",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  /*
    Convert the current cart array into grouped items.

    This allows:
    - Adding the same product multiple times
    - Showing it as one cart item
    - Controlling its quantity
  */
  const groupedCart = cart.reduce((items, product) => {
    const existingItem = items.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({
        ...product,
        quantity: 1,
      });
    }

    return items;
  }, []);

  const subtotal = groupedCart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const totalItems = groupedCart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleIncrease = (product) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(product.id, 1);
    }
  };

  const handleDecrease = (product) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(product.id, -1);
    }
  };

  const handleRemove = (product) => {
    if (onRemoveItem) {
      onRemoveItem(product.id);
    }
  };

  return (
    <div className="cart-page" ref={pageRef}>
      <Navbar cartCount={cart.length} />

      <main>
        {/* ========================================
            CART HEADER
        ======================================== */}

        <section className="cart-page-header">
          <p className="cart-page-label">
            ✦ YOUR FLORENZA CART
          </p>

          <h1 className="cart-page-title">
            Little things,
            <br />
            <span>beautifully gathered.</span>
          </h1>

          <p className="cart-page-intro">
            Review your handcrafted blooms before
            making them yours.
          </p>
        </section>

        {/* ========================================
            CART CONTENT
        ======================================== */}

        <section className="cart-content">

          {groupedCart.length === 0 ? (
            /* ========================================
               EMPTY CART
            ======================================== */

            <div className="empty-cart">
              <span className="empty-cart-flower">
                ✿
              </span>

              <p className="cart-section-label">
                YOUR CART IS EMPTY
              </p>

              <h2>
                Nothing here
                <br />
                <span>yet.</span>
              </h2>

              <p>
                Discover something beautiful from
                our collection and bring a little
                Florenza magic home.
              </p>

              <Link
                to="/collection"
                className="cart-shop-button"
              >
                EXPLORE THE COLLECTION
                <span>→</span>
              </Link>
            </div>
          ) : (
            <>
              {/* ========================================
                  CART ITEMS
              ======================================== */}

              <div className="cart-items-section">

                <div className="cart-items-heading">
                  <p className="cart-section-label">
                    YOUR SELECTION
                  </p>

                  <span>
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "ITEM"
                      : "ITEMS"}
                  </span>
                </div>

                <div className="cart-items">

                  {groupedCart.map((item) => (
                    <article
                      className="cart-item"
                      key={item.id}
                    >
                      {/* IMAGE */}

                      <div className="cart-item-image">
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                        />
                      </div>

                      {/* DETAILS */}

                      <div className="cart-item-details">

                        <p className="cart-item-category">
                          {item.tag ||
                            "HANDCRAFTED BOUQUET"}
                        </p>

                        <h2>
                          {item.name}
                        </h2>

                        <p className="cart-item-description">
                          {item.description}
                        </p>

                        <button
                          type="button"
                          className="cart-remove-button"
                          onClick={() =>
                            handleRemove(item)
                          }
                        >
                          REMOVE
                        </button>

                      </div>

                      {/* QUANTITY */}

                      <div className="cart-item-quantity">
                        <span>
                          QUANTITY
                        </span>

                        <div className="cart-quantity-controls">

                          <button
                            type="button"
                            onClick={() =>
                              handleDecrease(item)
                            }
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            −
                          </button>

                          <strong>
                            {item.quantity}
                          </strong>

                          <button
                            type="button"
                            onClick={() =>
                              handleIncrease(item)
                            }
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </button>

                        </div>
                      </div>

                      {/* PRICE */}

                      <div className="cart-item-price">
                        <span>
                          PRICE
                        </span>

                        <strong>
                          ₹
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </div>

                    </article>
                  ))}

                </div>
              </div>

              {/* ========================================
                  ORDER SUMMARY
              ======================================== */}

              <aside className="cart-summary">

                <div className="cart-summary-header">
                  <p className="cart-section-label">
                    ORDER SUMMARY
                  </p>

                  <h2>
                    Your
                    <br />
                    <span>bouquets.</span>
                  </h2>
                </div>

                <div className="cart-summary-lines">

                  <div>
                    <span>
                      Subtotal
                    </span>

                    <strong>
                      ₹
                      {subtotal.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Delivery
                    </span>

                    <strong>
                      To be calculated
                    </strong>
                  </div>

                </div>

                <div className="cart-summary-total">

                  <span>
                    TOTAL
                  </span>

                  <strong>
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

                <button
                  type="button"
                  className="cart-checkout-button"
                  onClick={() => {
                    alert(
                      "Checkout will be connected after authentication and backend integration."
                    );
                  }}
                >
                  PROCEED TO CHECKOUT
                  <span>→</span>
                </button>

                <Link
                  to="/collection"
                  className="continue-shopping"
                >
                  ← CONTINUE SHOPPING
                </Link>

              </aside>
            </>
          )}

        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Cart;