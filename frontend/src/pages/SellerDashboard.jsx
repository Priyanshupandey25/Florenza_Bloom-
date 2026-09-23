import { useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useProducts from "../hooks/useProducts";
import InventoryTable from "../components/seller/InventoryTable";
import AddProductModal from "../components/seller/AddProductModal";

export function SellerDashboard() {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const {
    filteredProducts,
    sellerLoading,
    sellerError,
    metrics,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    addProduct,
    editProduct,
    removeProduct,
  } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Product selected for Details modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  /*
   * =========================================
   * AUTHORIZATION
   * =========================================
   */

  if (!isAuthenticated) {
    return (
      <div className="seller-unauthorized-page">
        <div className="seller-unauthorized-card">
          <div className="seller-unauth-icon">🔐</div>

          <h2>Artisan Studio Access</h2>

          <p>
            Please log in to your artisan seller account to manage your
            bouquet inventory.
          </p>

          <div className="seller-unauth-actions">
            <Link to="/login" className="seller-btn-primary">
              Log In as Seller
            </Link>

            <Link to="/signup" className="seller-btn-secondary">
              Create Seller Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role !== "seller") {
    return (
      <div className="seller-unauthorized-page">
        <div className="seller-unauthorized-card">
          <div className="seller-unauth-icon">🌸</div>

          <h2>Seller Access Required</h2>

          <p>
            Your account is registered as a customer. Only seller accounts can
            access the artisan studio dashboard.
          </p>

          <div className="seller-unauth-actions">
            <Link to="/signup" className="seller-btn-primary">
              Register as Seller
            </Link>

            <Link to="/" className="seller-btn-secondary">
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /*
   * =========================================
   * CREATE PRODUCT
   * =========================================
   */

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  /*
   * =========================================
   * EDIT PRODUCT
   * =========================================
   */

  const handleOpenEdit = (product) => {
    if (!product) {
      console.error("Product is missing.");
      return;
    }

    setSelectedProduct(null);
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  /*
   * =========================================
   * DETAILS
   * =========================================
   */

  const handleOpenDetails = (product) => {
    if (!product) {
      console.error("Product is missing.");
      return;
    }

    setSelectedProduct(product);
  };

  /*
   * =========================================
   * DELETE PRODUCT
   * =========================================
   */

  const handleDelete = async (productId) => {
    if (!productId) {
      console.error("Product ID is missing.");
      return;
    }

    const product = filteredProducts.find(
      (item) =>
        String(item._id || item.id) === String(productId)
    );

    const productName =
      product?.title ||
      product?.name ||
      "this bouquet";

    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?`
    );

    if (!confirmed) return;

    try {
      await removeProduct(productId);

      // If deleted product was open in Details modal,
      // close the modal.
      if (
        selectedProduct &&
        String(selectedProduct._id || selectedProduct.id) ===
          String(productId)
      ) {
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error("Delete bouquet failed:", error);

      alert(
        error.message ||
          "Failed to delete bouquet."
      );
    }
  };

  /*
   * =========================================
   * SAVE CREATE / EDIT
   * =========================================
   */

  const handleSaveProduct = async (formData) => {
    try {
      if (editingProduct) {
        const id =
          editingProduct._id ||
          editingProduct.id;

        await editProduct(id, formData);
      } else {
        await addProduct(formData);
      }

      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Save bouquet failed:", error);
      throw error;
    }
  };

  /*
   * =========================================
   * LOGOUT
   * =========================================
   */

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  /*
   * =========================================
   * DETAILS HELPERS
   * =========================================
   */

  const getProductImage = (product) => {
    const image = product?.images?.[0];

    if (typeof image === "string") {
      return image;
    }

    if (image?.url) {
      return image.url;
    }

    return "/products/bouquet-blue/bouquet-blue-1.png";
  };

  const getProductVariants = (product) => {
    if (
      Array.isArray(product?.variants) &&
      product.variants.length > 0
    ) {
      return product.variants;
    }

    const description =
      product?.description || "";

    const marker =
      "\n\n--- VARIANTS ---";

    if (!description.includes(marker)) {
      return [];
    }

    try {
      const parsed = JSON.parse(
        description.split(marker)[1].trim()
      );

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch {
      return [];
    }
  };

  const getCleanDescription = (product) => {
    const description =
      product?.description || "";

    const marker =
      "\n\n--- VARIANTS ---";

    return description
      .split(marker)[0]
      .trim();
  };

  const getStockStatus = (stock) => {
    const numericStock = Number(stock || 0);

    if (numericStock === 0) {
      return {
        label: "Out of Stock",
        className: "out",
      };
    }

    if (numericStock <= 5) {
      return {
        label: "Low Stock",
        className: "low",
      };
    }

    return {
      label: "In Stock",
      className: "available",
    };
  };

  return (
    <div className="seller-dashboard-layout">

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className="seller-sidebar">

        <div className="seller-sidebar-top">

          {/* BRAND */}

          <div className="seller-brand">

            <div className="seller-brand-mark">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 3a9 9 0 0 0 0 18" />
                <path d="M12 3a9 9 0 0 1 0 18" />
                <path d="M3 12h18" />
              </svg>
            </div>

            <div className="seller-brand-text">
              <span className="seller-brand-name">
                Florenza
              </span>

              <span className="seller-brand-tag">
                BLOOM STUDIO
              </span>
            </div>

          </div>

          {/* NAVIGATION */}

          <nav className="seller-nav-menu">

            <Link
              to="/seller/dashboard"
              className="seller-nav-item active"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="7"
                />
                <rect
                  x="14"
                  y="3"
                  width="7"
                  height="7"
                />
                <rect
                  x="14"
                  y="14"
                  width="7"
                  height="7"
                />
                <rect
                  x="3"
                  y="14"
                  width="7"
                  height="7"
                />
              </svg>

              <span>Products</span>
            </Link>

            <Link
              to="/seller/feedback"
              className="seller-nav-item"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 9.7 9.7 0 0 1-4-.9L3 21l1.9-4.4A8.4 8.4 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z" />
              </svg>

              <span>Feedback</span>
            </Link>

          </nav>

          <div className="seller-sidebar-divider" />

          {/* STOREFRONT */}

          <Link
            to="/"
            className="seller-storefront-link"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>

            <span>Storefront View</span>
          </Link>

        </div>

        {/* PROFILE */}

        <div className="seller-profile-card">

          <div className="seller-profile-avatar">
            <span>🌿</span>
          </div>

          <div className="seller-profile-info">

            <span className="seller-profile-name">
              {user?.name || "Flora Studio"}
            </span>

            <span className="seller-profile-status">
              • Online
            </span>

          </div>

          <button
            type="button"
            className="seller-profile-logout"
            onClick={handleLogout}
            title="Log out"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line
                x1="21"
                y1="12"
                x2="9"
                y2="12"
              />
            </svg>
          </button>

        </div>

      </aside>

      {/* =========================================
          MAIN
      ========================================= */}

      <div className="seller-main-wrapper">

        {/* TOP BAR */}

        <header className="seller-topbar">

          <div className="seller-topbar-search">

            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
              />

              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
              />
            </svg>

            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
            />

          </div>

          <div className="seller-topbar-actions">

            <div className="seller-status-pill">
              <span className="status-dot" />
              <span>Store Open</span>
            </div>

            {/* ONLY NEW BOUQUET BUTTON */}

            <button
              type="button"
              className="seller-btn-primary-sm"
              onClick={handleOpenAddModal}
            >
              + New Bouquet
            </button>

            <div
              className="seller-top-avatar"
              title={user?.email}
            >
              🌸
            </div>

          </div>

        </header>

        {/* CONTENT */}

        <main className="seller-content">

          {/* PAGE HEADER */}

          <div className="seller-header-banner">

            <div>

              <span className="seller-breadcrumb">
                ARTISAN STUDIO
              </span>

              <h1 className="seller-page-title">
                Bouquet Inventory
              </h1>

              <p className="seller-page-description">
                Manage your handmade pipe-cleaner bouquet
                collection, pricing and stock.
              </p>

            </div>

          </div>

          {/* METRICS */}

          <div className="seller-metrics-grid">

            <div className="seller-metric-card">

              <span className="seller-metric-label">
                TOTAL BOUQUETS
              </span>

              <strong className="seller-metric-value">
                {metrics.total}
              </strong>

              <span className="seller-metric-note">
                All listings
              </span>

            </div>

            <div className="seller-metric-card">

              <span className="seller-metric-label">
                ACTIVE LISTINGS
              </span>

              <strong className="seller-metric-value">
                {metrics.active}
              </strong>

              <span className="seller-metric-note">
                {metrics.activePercentage}% public
              </span>

            </div>

            <div className="seller-metric-card">

              <span className="seller-metric-label">
                LOW STOCK ALERT
              </span>

              <strong className="seller-metric-value">
                {metrics.lowStock}
              </strong>

              <span className="seller-metric-note">
                Needs attention
              </span>

            </div>

            <div className="seller-metric-card">

              <span className="seller-metric-label">
                OUT OF STOCK
              </span>

              <strong className="seller-metric-value">
                {metrics.drafts}
              </strong>

              <span className="seller-metric-note">
                Currently unavailable
              </span>

            </div>

          </div>

          {/* FILTERS */}

          <div className="seller-filter-row">

            <div className="seller-filter-tabs">

              <button
                type="button"
                className={`seller-tab-btn ${
                  activeFilter === "all"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveFilter("all")
                }
              >
                All ({metrics.total})
              </button>

              <button
                type="button"
                className={`seller-tab-btn ${
                  activeFilter === "active"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveFilter("active")
                }
              >
                In Stock ({metrics.active})
              </button>

              <button
                type="button"
                className={`seller-tab-btn ${
                  activeFilter === "low_stock"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveFilter("low_stock")
                }
              >
                Low Stock ({metrics.lowStock})
              </button>

              <button
                type="button"
                className={`seller-tab-btn ${
                  activeFilter === "drafts"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveFilter("drafts")
                }
              >
                Out of Stock ({metrics.drafts})
              </button>

            </div>

            <div className="seller-sub-search">

              <div className="seller-search-inline">

                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                  />

                  <line
                    x1="21"
                    y1="21"
                    x2="16.65"
                    y2="16.65"
                  />
                </svg>

                <input
                  type="text"
                  placeholder="Search bouquet..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                />

              </div>

            </div>

          </div>

          {/* ERROR */}

          {sellerError && (
            <div className="auth-error-banner">
              <p className="auth-error-text">
                {sellerError}
              </p>
            </div>
          )}

          {/* INVENTORY TABLE */}

          <InventoryTable
            products={filteredProducts}
            loading={sellerLoading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onDetails={handleOpenDetails}
          />

          {/* FOOTER */}

          <div className="seller-pagination-bar">

            <span className="seller-pagination-info">
              Showing {filteredProducts.length} of{" "}
              {metrics.total} bouquets
            </span>

          </div>

        </main>

      </div>

      {/* =========================================
          CREATE / EDIT MODAL
      ========================================= */}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />

      {/* =========================================
          PRODUCT DETAILS MODAL
      ========================================= */}

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

            {/* CLOSE */}

            <button
              type="button"
              className="seller-details-close"
              onClick={() =>
                setSelectedProduct(null)
              }
              aria-label="Close details"
            >
              ×
            </button>

            {/* IMAGE */}

            <div className="seller-details-image">

              <img
                src={getProductImage(
                  selectedProduct
                )}
                alt={
                  selectedProduct.title ||
                  "Bouquet"
                }
              />

            </div>

            {/* DETAILS */}

            <div className="seller-details-content">

              <span className="seller-products-eyebrow">
                HANDMADE COLLECTION
              </span>

              <h2>
                {selectedProduct.title ||
                  selectedProduct.name ||
                  "Handcrafted Bouquet"}
              </h2>

              

              {/* PRICE */}

              <div className="seller-details-price">
                ₹
                {Number(
                  selectedProduct.price || 0
                ).toLocaleString("en-IN")}
              </div>

              {/* STOCK */}

              <div className="seller-details-stock">

                <span>Stock</span>

                <strong>
                  {Number(
                    selectedProduct.stock || 0
                  )}
                </strong>

                <span
                  className={`seller-details-stock-status ${
                    getStockStatus(
                      selectedProduct.stock
                    ).className
                  }`}
                >
                  {
                    getStockStatus(
                      selectedProduct.stock
                    ).label
                  }
                </span>

              </div>

              <div className="seller-details-divider" />

              {/* DESCRIPTION */}

              <h3>Description</h3>

              <p>
                {getCleanDescription(
                  selectedProduct
                ) ||
                  "No description available."}
              </p>

              {/* VARIANTS */}

              {getProductVariants(
                selectedProduct
              ).length > 0 && (
                <div className="seller-details-variants">

                  <h3>Variants</h3>

                  <div className="seller-details-variant-list">

                    {getProductVariants(
                      selectedProduct
                    ).map(
                      (variant, index) => (
                        <div
                          key={index}
                          className="seller-details-variant"
                        >

                          <div>
                            <strong>
                              {variant.name}
                            </strong>

                            <span>
                              {variant.option}
                            </span>
                          </div>

                          <div className="seller-details-variant-meta">

                            {Number(
                              variant.priceDelta || 0
                            ) !== 0 && (
                              <span>
                                {Number(
                                  variant.priceDelta
                                ) > 0
                                  ? "+"
                                  : ""}
                                ₹
                                {Number(
                                  variant.priceDelta
                                )}
                              </span>
                            )}

                            <span>
                              {Number(
                                variant.stock || 0
                              )}{" "}
                              stock
                            </span>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

              {/* EDIT */}

              <button
                type="button"
                className="seller-btn-primary seller-details-edit"
                onClick={() => {
                  const product =
                    selectedProduct;

                  setSelectedProduct(null);
                  handleOpenEdit(product);
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

export default SellerDashboard;