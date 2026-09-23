import { useEffect, useState } from "react";

/**
 * Add / Edit Product Modal
 * Supports:
 * - Create product
 * - Edit product
 * - Title
 * - Collection
 * - Price
 * - Stock
 * - Description
 * - Up to 5 images
 * - Product variants
 */

export function AddProductModal({
  isOpen,
  onClose,
  onSave,
  initialProduct = null,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collection, setCollection] =
    useState("Spring Botanical");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [selectedFiles, setSelectedFiles] =
    useState([]);

  const [previewUrls, setPreviewUrls] =
    useState([]);

  const [variants, setVariants] =
    useState([]);

  const [submitting, setSubmitting] =
    useState(false);

  const [formError, setFormError] =
    useState("");

  /* =========================================
     POPULATE FORM
  ========================================= */

  useEffect(() => {
    if (!isOpen) return;

    setFormError("");

    if (initialProduct) {
      /*
       * EDIT MODE
       */

      setTitle(
        initialProduct.title ||
          initialProduct.name ||
          ""
      );

      const desc =
        initialProduct.rawDescription ||
        initialProduct.description ||
        "";

      const variantMarker =
        "\n\n--- VARIANTS ---";

      let cleanDescription = desc;
      let parsedVariants = [];

      if (desc.includes(variantMarker)) {
        const parts =
          desc.split(variantMarker);

        cleanDescription =
          parts[0]?.trim() || "";

        try {
          const parsed = JSON.parse(
            parts[1]?.trim() || "[]"
          );

          if (Array.isArray(parsed)) {
            parsedVariants = parsed;
          }
        } catch (error) {
          console.warn(
            "Unable to parse variants:",
            error
          );

          parsedVariants = [];
        }
      }

      /*
       * If normalizeProduct already extracted variants,
       * prefer those.
       */
      if (
        Array.isArray(
          initialProduct.variants
        ) &&
        initialProduct.variants.length > 0
      ) {
        parsedVariants =
          initialProduct.variants;
      }

      setDescription(
        cleanDescription
      );

      setVariants(parsedVariants);

      setPrice(
        initialProduct.price !==
          undefined &&
          initialProduct.price !== null
          ? String(initialProduct.price)
          : ""
      );

      setStock(
        initialProduct.stock !==
          undefined &&
          initialProduct.stock !== null
          ? String(initialProduct.stock)
          : ""
      );

      setCollection(
        initialProduct.collection ||
          "Spring Botanical"
      );

      /*
       * Existing server images
       */
      const existingImages =
        Array.isArray(
          initialProduct.images
        )
          ? initialProduct.images
              .map((image) =>
                typeof image === "string"
                  ? image
                  : image?.url
              )
              .filter(Boolean)
          : [];

      setSelectedFiles([]);
      setPreviewUrls(existingImages);
    } else {
      /*
       * CREATE MODE
       */

      setTitle("");
      setDescription("");
      setCollection(
        "Spring Botanical"
      );
      setPrice("");
      setStock("");

      setSelectedFiles([]);
      setPreviewUrls([]);

      setVariants([
        {
          name: "Palette",
          option: "Blush Pink",
          priceDelta: 0,
          stock: 5,
        },
      ]);
    }
  }, [initialProduct, isOpen]);

  /* =========================================
     CLOSE RESET
  ========================================= */

  const handleClose = () => {
    if (submitting) return;

    setFormError("");
    onClose();
  };

  /* =========================================
     IMAGE UPLOAD
  ========================================= */

  const handleFileChange = (event) => {
    const files = Array.from(
      event.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    /*
     * Existing server images are previews only.
     * selectedFiles contains only newly uploaded files.
     */

    if (
      selectedFiles.length +
        files.length >
      5
    ) {
      setFormError(
        "You can upload a maximum of 5 new images."
      );

      event.target.value = "";
      return;
    }

    const validFiles = files.filter(
      (file) => {
        if (!file.type.startsWith("image/")) {
          return false;
        }

        if (
          file.size >
          5 * 1024 * 1024
        ) {
          return false;
        }

        return true;
      }
    );

    if (
      validFiles.length !==
      files.length
    ) {
      setFormError(
        "Only image files up to 5MB are allowed."
      );
    } else {
      setFormError("");
    }

    const updatedFiles = [
      ...selectedFiles,
      ...validFiles,
    ].slice(0, 5);

    setSelectedFiles(updatedFiles);

    /*
     * Important:
     * When user selects new images during edit,
     * the backend replaces the old images.
     *
     * Therefore preview should show the NEW files.
     */

    const newPreviewUrls =
      updatedFiles.map((file) =>
        URL.createObjectURL(file)
      );

    setPreviewUrls(
      newPreviewUrls
    );

    event.target.value = "";
  };

  /* =========================================
     REMOVE IMAGE
  ========================================= */

  const handleRemoveImage = (
    index
  ) => {
    /*
     * CREATE MODE
     * ----------------
     * All previews are new files.
     */

    if (!initialProduct) {
      const updatedFiles =
        selectedFiles.filter(
          (_, i) => i !== index
        );

      setSelectedFiles(
        updatedFiles
      );

      const updatedPreviews =
        updatedFiles.map((file) =>
          URL.createObjectURL(file)
        );

      setPreviewUrls(
        updatedPreviews
      );

      return;
    }

    /*
     * EDIT MODE
     *
     * If there are selected files,
     * previews represent the new files.
     */

    if (selectedFiles.length > 0) {
      const updatedFiles =
        selectedFiles.filter(
          (_, i) => i !== index
        );

      setSelectedFiles(
        updatedFiles
      );

      const updatedPreviews =
        updatedFiles.map((file) =>
          URL.createObjectURL(file)
        );

      setPreviewUrls(
        updatedPreviews
      );

      return;
    }

    /*
     * Existing server image:
     *
     * We cannot delete it individually
     * because your backend replaces images
     * only when new files are uploaded.
     *
     * So we simply remove it from the
     * visual preview.
     */

    setPreviewUrls((previous) =>
      previous.filter(
        (_, i) => i !== index
      )
    );
  };

  /* =========================================
     ADD VARIANT
  ========================================= */

  const handleAddVariant = () => {
    setVariants((previous) => [
      ...previous,
      {
        name: "Palette",
        option: "",
        priceDelta: 0,
        stock: 0,
      },
    ]);
  };

  /* =========================================
     CHANGE VARIANT
  ========================================= */

  const handleVariantChange = (
    index,
    field,
    value
  ) => {
    setVariants((previous) =>
      previous.map(
        (variant, i) =>
          i === index
            ? {
                ...variant,
                [field]: value,
              }
            : variant
      )
    );
  };

  /* =========================================
     REMOVE VARIANT
  ========================================= */

  const handleRemoveVariant = (
    index
  ) => {
    setVariants((previous) =>
      previous.filter(
        (_, i) => i !== index
      )
    );
  };

  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setFormError("");

    /* -------------------------------
       VALIDATION
    -------------------------------- */

    if (!title.trim()) {
      setFormError(
        "Product title is required."
      );
      return;
    }

    if (!description.trim()) {
      setFormError(
        "Botanical description is required."
      );
      return;
    }

    if (
      price === "" ||
      Number(price) <= 0
    ) {
      setFormError(
        "Please enter a valid retail price."
      );
      return;
    }

    if (
      stock === "" ||
      Number(stock) < 0
    ) {
      setFormError(
        "Please specify a valid stock count."
      );
      return;
    }

    try {
      setSubmitting(true);

      /* -------------------------------
         BUILD DESCRIPTION
      -------------------------------- */

      let finalDescription =
        description.trim();

      const validVariants =
        variants
          .filter(
            (variant) =>
              variant.option &&
              String(
                variant.option
              ).trim()
          )
          .map((variant) => ({
            name:
              variant.name ||
              "Palette",

            option:
              String(
                variant.option
              ).trim(),

            priceDelta:
              Number(
                variant.priceDelta || 0
              ),

            stock:
              Number(
                variant.stock || 0
              ),
          }));

      if (
        validVariants.length > 0
      ) {
        finalDescription +=
          `\n\n--- VARIANTS ---\n${JSON.stringify(
            validVariants
          )}`;
      }

      /* -------------------------------
         CREATE FORM DATA
      -------------------------------- */

      const formData =
        new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "description",
        finalDescription
      );

      formData.append(
        "price",
        String(Number(price))
      );

      formData.append(
        "stock",
        String(Number(stock))
      );

      /*
       * IMPORTANT:
       *
       * Your backend currently does NOT
       * save collection.
       *
       * We intentionally do not append
       * collection here because your
       * product controller does not read it.
       */

      /* -------------------------------
         NEW IMAGE FILES
      -------------------------------- */

      selectedFiles.forEach(
        (file) => {
          formData.append(
            "images",
            file
          );
        }
      );

      /* -------------------------------
         SAVE
      -------------------------------- */

      await onSave(formData);

      /*
       * Only close if save succeeded.
       */

      onClose();
    } catch (error) {
      console.error(
        "Product save failed:",
        error
      );

      setFormError(
        error?.message ||
          "Failed to save bouquet listing."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================
     DO NOT RENDER
  ========================================= */

  if (!isOpen) {
    return null;
  }

  /* =========================================
     UI
  ========================================= */

  return (
    <div
      className="seller-modal-overlay"
      onClick={handleClose}
    >
      <div
        className="seller-modal-container"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* =================================
            HEADER
        ================================= */}

        <div className="seller-modal-header">
          <div>
            <span className="seller-modal-badge">
              {initialProduct
                ? "EDIT BOUQUET"
                : "NEW ARTISAN LISTING"}
            </span>

            <h2 className="seller-modal-title">
              {initialProduct
                ? "Update Bouquet Details"
                : "Create Bouquet Listing"}
            </h2>
          </div>

          <button
            type="button"
            className="seller-modal-close"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* =================================
            ERROR
        ================================= */}

        {formError && (
          <div
            className="auth-error-banner"
            style={{
              margin:
                "0 28px 16px",
            }}
          >
            <span className="auth-error-icon">
              !
            </span>

            <p className="auth-error-text">
              {formError}
            </p>
          </div>
        )}

        {/* =================================
            FORM
        ================================= */}

        <form
          onSubmit={handleSubmit}
          className="seller-modal-form"
        >
          <div className="seller-modal-body">

            {/* =================================
                TITLE + COLLECTION
            ================================= */}

            <div className="seller-form-row">

              <div className="seller-form-group flex-2">
                <label>
                  BOUQUET TITLE *
                </label>

                <input
                  type="text"
                  placeholder="e.g. The Blush Meadow Lily Bouquet"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="seller-form-group flex-1">
                <label>
                  COLLECTION
                </label>

                <select
                  value={collection}
                  onChange={(event) =>
                    setCollection(
                      event.target.value
                    )
                  }
                >
                  <option value="Spring Botanical">
                    Spring Botanical
                  </option>

                  <option value="Lavender Mist">
                    Lavender Mist
                  </option>

                  <option value="Royal Heritage">
                    Royal Heritage
                  </option>

                  <option value="Midnight Series">
                    Midnight Series
                  </option>

                  <option value="Single Stems">
                    Single Stems
                  </option>

                  <option value="Wildflower Petals">
                    Wildflower Petals
                  </option>
                </select>
              </div>

            </div>

            {/* =================================
                PRICE + STOCK
            ================================= */}

            <div className="seller-form-row">

              <div className="seller-form-group flex-1">
                <label>
                  RETAIL PRICE (₹) *
                </label>

                <input
                  type="number"
                  placeholder="e.g. 450"
                  min="1"
                  step="0.01"
                  value={price}
                  onChange={(event) =>
                    setPrice(
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="seller-form-group flex-1">
                <label>
                  STUDIO STOCK LEVEL *
                </label>

                <input
                  type="number"
                  placeholder="e.g. 14"
                  min="0"
                  value={stock}
                  onChange={(event) =>
                    setStock(
                      event.target.value
                    )
                  }
                  required
                />
              </div>

            </div>

            {/* =================================
                DESCRIPTION
            ================================= */}

            <div className="seller-form-group">

              <label>
                BOTANICAL DESCRIPTION &
                CRAFTING NOTES *
              </label>

              <textarea
                rows="3"
                placeholder="Describe stem materials, chenille textures, colors, and arrangement details..."
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                required
              />

            </div>

            {/* =================================
                IMAGES
            ================================= */}

            <div className="seller-form-group">

              <div className="seller-label-with-hint">

                <label>
                  BOUQUET PHOTOGRAPHS
                  (MAX 5)
                </label>

                <span className="seller-label-hint">
                  PNG, JPG or WEBP up to 5MB
                </span>

              </div>

              <div className="seller-image-upload-area">

                <input
                  type="file"
                  id="bouquet-images-input"
                  multiple
                  accept="image/*"
                  onChange={
                    handleFileChange
                  }
                  style={{
                    display: "none",
                  }}
                  disabled={
                    selectedFiles.length >=
                    5
                  }
                />

                <label
                  htmlFor="bouquet-images-input"
                  className={`seller-upload-box ${
                    selectedFiles.length >=
                    5
                      ? "disabled"
                      : ""
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                    />

                    <circle
                      cx="8.5"
                      cy="8.5"
                      r="1.5"
                    />

                    <polyline points="21 15 16 10 5 21" />
                  </svg>

                  <span>
                    Click to browse
                    photographs
                  </span>
                </label>

                {previewUrls.length >
                  0 && (
                  <div className="seller-preview-grid">

                    {previewUrls.map(
                      (
                        url,
                        index
                      ) => (
                        <div
                          key={`${url}-${index}`}
                          className="seller-preview-item"
                        >
                          <img
                            src={url}
                            alt={`Upload preview ${
                              index + 1
                            }`}
                          />

                          <button
                            type="button"
                            className="seller-preview-remove"
                            onClick={() =>
                              handleRemoveImage(
                                index
                              )
                            }
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

              {initialProduct &&
                selectedFiles.length ===
                  0 &&
                previewUrls.length >
                  0 && (
                  <p
                    style={{
                      marginTop:
                        "8px",
                      fontSize:
                        "12px",
                      color:
                        "#8a7577",
                    }}
                  >
                    To replace the
                    existing images,
                    select new
                    photographs.
                  </p>
                )}

            </div>

            {/* =================================
                VARIANTS
            ================================= */}

            <div className="seller-variants-section">

              <div className="seller-variants-header">

                <div>
                  <h4 className="seller-variants-title">
                    Bouquet Variants
                  </h4>

                  <p className="seller-variants-subtitle">
                    Offer customers
                    palettes, stem
                    counts, or gift
                    packaging.
                  </p>
                </div>

                <button
                  type="button"
                  className="seller-add-variant-btn"
                  onClick={
                    handleAddVariant
                  }
                >
                  + Add Variant
                  Option
                </button>

              </div>

              {variants.length ===
              0 ? (
                <div className="seller-no-variants">
                  No variants
                  configured. Click
                  "+ Add Variant
                  Option" to
                  customize options.
                </div>
              ) : (
                <div className="seller-variants-list">

                  {variants.map(
                    (variant, index) => (
                      <div
                        key={index}
                        className="seller-variant-row"
                      >

                        {/* TYPE */}

                        <div className="seller-variant-field">

                          <label>
                            TYPE
                          </label>

                          <select
                            value={
                              variant.name ||
                              "Palette"
                            }
                            onChange={(
                              event
                            ) =>
                              handleVariantChange(
                                index,
                                "name",
                                event.target
                                  .value
                              )
                            }
                          >
                            <option value="Palette">
                              Palette /
                              Color
                            </option>

                            <option value="Stem Count">
                              Stem Count
                            </option>

                            <option value="Wrapping">
                              Wrapping /
                              Vase
                            </option>
                          </select>

                        </div>

                        {/* OPTION */}

                        <div className="seller-variant-field flex-2">

                          <label>
                            OPTION
                            VALUE
                          </label>

                          <input
                            type="text"
                            placeholder="e.g. Blush Pink / 5 Stems"
                            value={
                              variant.option ||
                              ""
                            }
                            onChange={(
                              event
                            ) =>
                              handleVariantChange(
                                index,
                                "option",
                                event.target
                                  .value
                              )
                            }
                          />

                        </div>

                        {/* PRICE DELTA */}

                        <div className="seller-variant-field">

                          <label>
                            PRICE
                            DELTA
                            (₹)
                          </label>

                          <input
                            type="number"
                            placeholder="+0"
                            value={
                              variant.priceDelta ??
                              0
                            }
                            onChange={(
                              event
                            ) =>
                              handleVariantChange(
                                index,
                                "priceDelta",
                                Number(
                                  event
                                    .target
                                    .value
                                )
                              )
                            }
                          />

                        </div>

                        {/* STOCK */}

                        <div className="seller-variant-field">

                          <label>
                            STOCK
                          </label>

                          <input
                            type="number"
                            placeholder="5"
                            min="0"
                            value={
                              variant.stock ??
                              0
                            }
                            onChange={(
                              event
                            ) =>
                              handleVariantChange(
                                index,
                                "stock",
                                Number(
                                  event
                                    .target
                                    .value
                                )
                              )
                            }
                          />

                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          className="seller-variant-remove"
                          onClick={() =>
                            handleRemoveVariant(
                              index
                            )
                          }
                          title="Delete variant"
                        >
                          🗑️
                        </button>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>

          </div>

          {/* =================================
              FOOTER
          ================================= */}

          <div className="seller-modal-footer">

            <button
              type="button"
              className="seller-btn-secondary"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="seller-btn-primary"
              disabled={submitting}
            >
              {submitting
                ? "Saving Bouquet..."
                : initialProduct
                ? "Save Changes"
                : "+ Create Listing"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default AddProductModal;