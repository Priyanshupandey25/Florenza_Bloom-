import { useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useProducts from "../hooks/useProducts";
import AddProductModal from "../components/seller/AddProductModal";

function SellerProducts() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  const {
    sellerProducts,
    sellerLoading,
    sellerError,
    addProduct,
    editProduct,
    removeProduct,
  } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  /* =========================================
     AUTH CHECK
  ========================================= */

  if (!isAuthenticated) {
    return (
      <div className="seller-products-page seller-products-center">
        <div className="seller-access-card">
          <div className="seller-access-icon">🔐</div>

          <h2>Seller Access Required</h2>

          <p>
            Please log in to your seller account to manage your bouquets.
          </p>

          <Link to="/login" className="seller-products-primary-btn">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (user?.role !== "seller") {
    return (
      <div className="seller-products-page seller-products-center">
        <div className="seller-access-card">
          <div className="seller-access-icon">🌸</div>

          <h2>Seller Account Required</h2>

          <p>
            This area is only available to Florenza Bloom sellers.
          </p>

          <Link to="/" className="seller-products-secondary-btn">
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  /* =========================================
     ADD PRODUCT
  ========================================= */

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  /* =========================================
     EDIT PRODUCT
  ========================================= */

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  /* =========================================
     SAVE PRODUCT
  ========================================= */

  const handleSaveProduct = async (formData) => {
    try {
      if (editingProduct) {
        await editProduct(editingProduct._id, formData);
      } else {
        await addProduct(formData);
      }

      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Product save failed:", error);
      alert(error.message || "Unable to save product.");
    }
  };

  /* =========================================
     DELETE PRODUCT
  ========================================= */

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(product._id);

      await removeProduct(product._id);
    } catch (error) {
      console.error("Product deletion failed:", error);

      alert(
        error.message || "Unable to delete this bouquet."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================
     PRODUCT DETAILS
  ========================================= */

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="seller-products-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="seller-products-header">

        <div className="seller-products-header-left">

          <button
            type="button"
            className="seller-back-btn"
            onClick={() => navigate("/seller/dashboard")}
          >
            ←
          </button>

          <div>
            <span className="seller-products-eyebrow">
              FLORENZA BLOOM STUDIO
            </span>

            <h1>Bouquet Inventory</h1>

            <p>
              Manage your handmade bouquet products.
            </p>
          </div>

        </div>

        <button
          type="button"
          className="seller-products-add-btn"
          onClick={handleAddProduct}
        >
          <span>+</span>
          Add Bouquet
        </button>

      </header>

      {/* =====================================
          CONTENT
      ===================================== */}

      <main className="seller-products-content">

        {/* PRODUCT COUNT */}

        <div className="seller-products-summary">
          <div>
            <span className="seller-summary-label">
              YOUR PRODUCTS
            </span>

            <strong>
              {sellerProducts.length}
            </strong>
          </div>

          <Link
            to="/"
            className="seller-view-store-link"
          >
            View Store →
          </Link>
        </div>

        {/* ERROR */}

        {sellerError && (
          <div className="seller-products-error">
            {sellerError}
          </div>
        )}

        {/* LOADING */}

        {sellerLoading ? (
          <div className="seller-products-loading">
            <div className="seller-products-spinner" />
            <p>Loading your bouquets...</p>
          </div>
        ) : sellerProducts.length === 0 ? (

          /* =================================
             EMPTY STATE
          ================================= */

          <div className="seller-products-empty">

            <div className="seller-empty-flower">
              🌷
            </div>

            <h2>No bouquets yet</h2>

            <p>
              Start building your collection by
              adding your first handmade bouquet.
            </p>

            <button
              type="button"
              className="seller-products-add-btn"
              onClick={handleAddProduct}
            >
              + Add Your First Bouquet
            </button>

          </div>

        ) : (

          /* =================================
             PRODUCT TABLE
          ================================= */

          <div className="seller-products-table-wrapper">

            <table className="seller-products-table">

              <thead>
                <tr>
                  <th>BOUQUET</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>

                {sellerProducts.map((product) => {

                  const stock = Number(product.stock || 0);

                  const image =
                    product.images?.[0] ||
                    "/products/bouquet-blue/bouquet-blue-1.png";

                  let stockStatus = "In Stock";

                  if (stock === 0) {
                    stockStatus = "Out of Stock";
                  } else if (stock <= 5) {
                    stockStatus = "Low Stock";
                  }

                  return (
                    <tr key={product._id}>

                      {/* PRODUCT */}

                      <td>
                        <div className="seller-product-info">

                          <div className="seller-product-image">
                            <img
                              src={image}
                              alt={product.title}
                            />
                          </div>

                          <div>
                            <strong>
                              {product.title}
                            </strong>

                            <span>
                              Handmade Bouquet
                            </span>
                          </div>

                        </div>
                      </td>

                      {/* PRICE */}

                      <td>
                        <span className="seller-product-price">
                          ₹
                          {Number(product.price || 0).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </td>

                      {/* STOCK */}

                      <td>
                        <span className="seller-product-stock">
                          {stock}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`seller-stock-status ${
                            stock === 0
                              ? "out"
                              : stock <= 5
                              ? "low"
                              : "available"
                          }`}
                        >
                          <span />
                          {stockStatus}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="seller-product-actions">

                          <button
                            type="button"
                            className="seller-action-btn details"
                            onClick={() =>
                              handleViewDetails(product)
                            }
                          >
                            Details
                          </button>

                          <button
                            type="button"
                            className="seller-action-btn edit"
                            onClick={() =>
                              handleEditProduct(product)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="seller-action-btn delete"
                            disabled={
                              deletingId === product._id
                            }
                            onClick={() =>
                              handleDeleteProduct(product)
                            }
                          >
                            {deletingId === product._id
                              ? "..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </main>

      {/* =====================================
          ADD / EDIT PRODUCT MODAL
      ===================================== */}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />

      {/* =====================================
          PRODUCT DETAILS MODAL
      ===================================== */}

      {selectedProduct && (

        <div
          className="seller-details-overlay"
          onClick={() => setSelectedProduct(null)}
        >

          <div
            className="seller-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="seller-details-close"
              onClick={() =>
                setSelectedProduct(null)
              }
            >
              ×
            </button>

            <div className="seller-details-image">

              <img
                src={
                  selectedProduct.images?.[0] ||
                  "/products/bouquet-blue/bouquet-blue-1.png"
                }
                alt={selectedProduct.title}
              />

            </div>

            <div className="seller-details-content">

              <span className="seller-products-eyebrow">
                HANDMADE COLLECTION
              </span>

              <h2>
                {selectedProduct.title}
              </h2>

              <div className="seller-details-price">
                ₹
                {Number(
                  selectedProduct.price || 0
                ).toLocaleString("en-IN")}
              </div>

              <div className="seller-details-stock">
                <span>Stock</span>
                <strong>
                  {selectedProduct.stock || 0}
                </strong>
              </div>

              <div className="seller-details-divider" />

              <h3>Description</h3>

              <p>
                {selectedProduct.description ||
                  "No description available."}
              </p>

              <button
                type="button"
                className="seller-products-add-btn seller-details-edit"
                onClick={() => {
                  setSelectedProduct(null);
                  handleEditProduct(selectedProduct);
                }}
              >
                Edit Bouquet
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default SellerProducts;