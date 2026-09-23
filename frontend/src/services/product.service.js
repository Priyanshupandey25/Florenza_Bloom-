/**
 * Product Service
 * Layer 1: Pure API communication for Products & Seller Inventory.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : "";

/**
 * Helper to process fetch responses and handle errors gracefully.
 */
async function handleResponse(response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      data?.message ||
      data?.err ||
      (Array.isArray(data?.errors) ? data.errors.join(", ") : null) ||
      `Request failed with status ${response.status}`;

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Normalize product object to ensure complete compatibility across all components.
 * Handles _id vs id, title vs name, and object vs string image arrays.
 * Extracts variants if serialized into description.
 *
 * @param {Object} product
 * @returns {Object} Normalized product
 */
export function normalizeProduct(product) {
  if (!product) return null;

  const id = product._id || product.id || "";
  const title = product.title || product.name || "Handcrafted Bouquet";
  const price = Number(product.price) || 0;
  const stock = Number(product.stock) || 0;

  // Normalize images into flat array of URL strings
  let images = [];
  if (Array.isArray(product.images)) {
    images = product.images
      .map((img) => (typeof img === "string" ? img : img?.url))
      .filter(Boolean);
  }
  if (images.length === 0) {
    images = ["/products/bouquet-blue/bouquet-blue-1.png"];
  }

  // Parse variants if embedded in description (format: "\n\n--- VARIANTS ---\n[JSON]")
  let variants = Array.isArray(product.variants) ? product.variants : [];
  let cleanDescription = product.description || "";

  if (cleanDescription.includes("--- VARIANTS ---")) {
    const parts = cleanDescription.split("--- VARIANTS ---");
    cleanDescription = parts[0].trim();
    try {
      const parsedVariants = JSON.parse(parts[1].trim());
      if (Array.isArray(parsedVariants)) {
        variants = parsedVariants;
      }
    } catch {
      // Ignore parsing errors
    }
  }

  return {
    ...product,
    id,
    _id: id,
    name: title,
    title,
    price,
    stock,
    images,
    description: cleanDescription,
    rawDescription: product.description || "",
    variants,
    tag: product.tag || "HANDCRAFTED BOUQUET",
    category: product.category || product.tag || "HANDCRAFTED BOUQUET",
  };
}

/**
 * Fetch all products belonging to the logged-in seller.
 * @returns {Promise<{ message: string, success: boolean, products: Array }>}
 */
export async function getSellerProducts() {
  const response = await fetch(`${API_BASE_URL}/api/products/seller`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await handleResponse(response);
  if (Array.isArray(data?.products)) {
    data.products = data.products.map(normalizeProduct);
  }
  return data;
}

/**
 * Fetch all publicly listed products.
 * @returns {Promise<{ message: string, success: boolean, products: Array }>}
 */
export async function getAllProducts() {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await handleResponse(response);
  if (Array.isArray(data?.products)) {
    data.products = data.products.map(normalizeProduct);
  }
  return data;
}

/**
 * Fetch single product details by ID.
 * @param {string} id - Product ID
 * @returns {Promise<{ message: string, success: boolean, product: Object }>}
 */
export async function getProductDetails(id) {
  const response = await fetch(`${API_BASE_URL}/api/products/detail/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await handleResponse(response);
  if (data?.product) {
    data.product = normalizeProduct(data.product);
  }
  return data;
}

/**
 * Create a new product listing (multipart/form-data for image uploads).
 * @param {FormData} formData - Contains title, description, price, stock, images
 * @returns {Promise<{ message: string, success: boolean, product: Object }>}
 */
export async function createProduct(formData) {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: "POST",
    // Note: Do not set Content-Type header so browser sets multipart boundary automatically
    credentials: "include",
    body: formData,
  });

  const data = await handleResponse(response);
  if (data?.product) {
    data.product = normalizeProduct(data.product);
  }
  return data;
}

/**
 * Update an existing product listing.
 * @param {string} id - Product ID
 * @param {FormData} formData - Updated fields & optional replacement images
 * @returns {Promise<{ message: string, success: boolean, product: Object }>}
 */
export async function updateProduct(id, formData) {
  const response = await fetch(`${API_BASE_URL}/api/products/update/${id}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  const data = await handleResponse(response);
  if (data?.product) {
    data.product = normalizeProduct(data.product);
  }
  return data;
}

/**
 * Delete a product listing.
 * @param {string} id - Product ID
 * @returns {Promise<{ message: string, success: boolean }>}
 */
export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE_URL}/api/products/delete/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return handleResponse(response);
}

export default {
  normalizeProduct,
  getSellerProducts,
  getAllProducts,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProduct,
};
