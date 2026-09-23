import { useState } from "react";

export function InventoryTable({
  products = [],
  onEdit,
  onDelete,
  onDetails,
  loading = false,
}) {
  const [expandedId, setExpandedId] = useState(null);

  if (loading) {
    return (
      <div className="seller-table-loading">
        <div className="auth-loading-spinner" />
        <p>Loading artisan bouquet inventory...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="seller-table-empty">
        <div className="seller-empty-icon">🌸</div>

        <h3>
          No bouquets found in inventory
        </h3>

        <p>
          Add a new bouquet listing above to
          manage your studio creations.
        </p>
      </div>
    );
  }

  const getCollectionBadge = (product) => {
    const collection =
      product.collection?.toLowerCase() || "";

    const title =
      product.title?.toLowerCase() || "";

    if (
      collection.includes("lavender") ||
      title.includes("lavender")
    ) {
      return {
        text: "LAVENDER MIST",
        class: "badge-lavender",
      };
    }

    if (
      collection.includes("spring") ||
      title.includes("rose") ||
      title.includes("blush")
    ) {
      return {
        text: "SPRING BOTANICAL",
        class: "badge-spring",
      };
    }

    if (
      collection.includes("royal") ||
      title.includes("royal") ||
      title.includes("bellflower")
    ) {
      return {
        text: "ROYAL HERITAGE",
        class: "badge-heritage",
      };
    }

    if (
      collection.includes("midnight") ||
      title.includes("midnight") ||
      title.includes("sapphire")
    ) {
      return {
        text: "MIDNIGHT SERIES",
        class: "badge-midnight",
      };
    }

    if (
      collection.includes("single") ||
      title.includes("daisy") ||
      title.includes("stem")
    ) {
      return {
        text: "SINGLE STEMS",
        class: "badge-stems",
      };
    }

    return {
      text:
        product.collection?.toUpperCase() ||
        "BOTANICAL",
      class: "badge-default",
    };
  };

  const getVariants = (product) => {
    if (
      Array.isArray(product.variants) &&
      product.variants.length > 0
    ) {
      return product.variants;
    }

    const desc =
      product.description || "";

    const marker =
      "\n\n--- VARIANTS ---";

    if (desc.includes(marker)) {
      try {
        const parsed = JSON.parse(
          desc.split(marker)[1].trim()
        );

        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        return [];
      }
    }

    return [];
  };

  const getCleanDescription = (product) => {
    const desc =
      product.description || "";

    const marker =
      "\n\n--- VARIANTS ---";

    return desc
      .split(marker)[0]
      .trim();
  };

  const getImage = (product) => {
    const image = product.images?.[0];

    if (typeof image === "string") {
      return image;
    }

    if (image?.url) {
      return image.url;
    }

    return "/products/bouquet-blue/bouquet-blue-1.png";
  };

  return (
    <div className="seller-table-wrapper">

      <table className="seller-table">

        <thead>
          <tr>

            <th className="col-item">
              BOUQUET ITEM
            </th>

            

            <th className="col-price">
              RETAIL PRICE
            </th>

            <th className="col-stock">
              STOCK LEVEL
            </th>

            

            <th className="col-actions text-right">
              ACTIONS
            </th>

          </tr>
        </thead>

        <tbody>

          {products.map((item) => {

            const collectionBadge =
              getCollectionBadge(item);

            const variants =
              getVariants(item);

            const cleanDesc =
              getCleanDescription(item);

            const stock =
              Number(item.stock || 0);

            let statusBadge = {
              label: "• Active",
              class: "status-active",
            };

            let stockPip =
              "pip-green";

            let stockLabel =
              `${stock} in stock`;

            if (stock === 0) {

              statusBadge = {
                label: "Sold Out",
                class: "status-soldout",
              };

              stockPip =
                "pip-gray";

              stockLabel =
                "0 stems";

            } else if (stock <= 5) {

              statusBadge = {
                label: "Low Stock",
                class: "status-lowstock",
              };

              stockPip =
                "pip-red";

              stockLabel =
                `${stock} units left`;
            }

            const itemId =
              item._id || item.id;

            const isExpanded =
              expandedId === itemId;

            return (
              <tr
                key={itemId}
                className="seller-table-row"
              >

                {/* =================================
                    BOUQUET ITEM
                ================================= */}

                <td className="col-item">

                  <div className="seller-item-cell">

                    <div className="seller-item-thumbnail">

                      <img
                        src={getImage(item)}
                        alt={
                          item.title ||
                          "Bouquet"
                        }
                        loading="lazy"
                      />

                    </div>

                    <div className="seller-item-info">

                      <span className="seller-item-title">
                        {item.title ||
                          item.name ||
                          "Handcrafted Bouquet"}
                      </span>

                      <span className="seller-item-sku">

                        SKU: FB-
                        {itemId
                          ? String(
                              itemId
                            )
                              .slice(-4)
                              .toUpperCase()
                          : "0000"}

                        {" • "}

                        {cleanDesc
                          ? cleanDesc.slice(
                              0,
                              35
                            ) +
                            (cleanDesc.length >
                            35
                              ? "..."
                              : "")
                          : "Artisan chenille"}

                      </span>

                      {variants.length > 0 && (
                        <button
                          type="button"
                          className="seller-variants-toggle-btn"
                          onClick={() =>
                            setExpandedId(
                              isExpanded
                                ? null
                                : itemId
                            )
                          }
                        >
                          {variants.length}{" "}
                          variant
                          {variants.length >
                          1
                            ? "s"
                            : ""}

                          {" "}

                          <span>
                            {isExpanded
                              ? "▲"
                              : "▼"}
                          </span>

                        </button>
                      )}

                    </div>

                  </div>

                  {/* VARIANTS */}

                  {isExpanded &&
                    variants.length >
                      0 && (
                      <div className="seller-expanded-variants">

                        <div className="seller-variants-chips">

                          {variants.map(
                            (
                              variant,
                              index
                            ) => (
                              <span
                                key={
                                  index
                                }
                                className="seller-variant-chip"
                              >

                                <strong>
                                  {
                                    variant.name
                                  }
                                  :
                                </strong>

                                {" "}

                                {
                                  variant.option
                                }

                                {Number(
                                  variant.priceDelta ||
                                    0
                                ) > 0 &&
                                  ` (+₹${variant.priceDelta})`}

                                <em
                                  style={{
                                    fontStyle:
                                      "normal",
                                    color:
                                      "#8a7577",
                                  }}
                                >
                                  {" • "}
                                  {
                                    variant.stock
                                  }{" "}
                                  in stock
                                </em>

                              </span>
                            )
                          )}

                        </div>

                      </div>
                    )}

                </td>

                

                {/* =================================
                    PRICE
                ================================= */}

                <td className="col-price">

                  <span className="seller-price-value">

                    ₹
                    {Number(
                      item.price || 0
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </span>

                </td>

                {/* =================================
                    STOCK
                ================================= */}

                <td className="col-stock">

                  <div className="seller-stock-indicator">

                    <span
                      className={`stock-pip ${stockPip}`}
                    />

                    <span
                      className={`stock-text ${
                        stock <= 5 &&
                        stock > 0
                          ? "stock-urgent"
                          : ""
                      }`}
                    >
                      {stockLabel}
                    </span>

                  </div>

                </td>


                {/* =================================
                    ACTIONS
                ================================= */}

                <td className="col-actions text-right">

                  <div className="seller-action-buttons">

                    {/* DETAILS */}

                    <button
                      type="button"
                      className="seller-action-btn details-btn"
                      onClick={() =>
                        onDetails &&
                        onDetails(item)
                      }
                      title="View bouquet details"
                      aria-label="View bouquet details"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="15"
                        height="15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                        />

                        <line
                          x1="12"
                          y1="10"
                          x2="12"
                          y2="16"
                        />

                        <circle
                          cx="12"
                          cy="7"
                          r="0.8"
                          fill="currentColor"
                          stroke="none"
                        />
                      </svg>
                    </button>

                    {/* EDIT */}

                    <button
                      type="button"
                      className="seller-action-btn edit-btn"
                      onClick={() =>
                        onEdit &&
                        onEdit(item)
                      }
                      title="Edit bouquet"
                      aria-label="Edit bouquet"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="15"
                        height="15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />

                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      className="seller-action-btn delete-btn"
                      onClick={() => {
                        if (
                          onDelete
                        ) {
                          onDelete(
                            itemId
                          );
                        }
                      }}
                      title="Delete bouquet"
                      aria-label="Delete bouquet"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="15"
                        height="15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <polyline points="3 6 5 6 21 6" />

                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>

                  </div>

                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

    </div>
  );
}

export default InventoryTable;