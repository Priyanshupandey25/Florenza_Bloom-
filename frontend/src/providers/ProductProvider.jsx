import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  getSellerProducts,
  updateProduct,
} from "../services/product.service";

import useAuth from "../hooks/useAuth";
import defaultProducts from "../data/products";

export const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  // =========================================
  // PUBLIC CATALOG
  // =========================================

  const [catalogProducts, setCatalogProducts] = useState(defaultProducts);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(null);

  // =========================================
  // SELLER INVENTORY
  // =========================================

  const [sellerProducts, setSellerProducts] = useState([]);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [sellerError, setSellerError] = useState(null);

  // =========================================
  // FILTER / SEARCH
  // =========================================

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // =========================================
  // FETCH PUBLIC PRODUCTS
  // =========================================

  const fetchProducts = useCallback(async () => {
    try {
      setCatalogLoading(true);
      setCatalogError(null);

      const data = await getAllProducts();

      if (
        Array.isArray(data?.products) &&
        data.products.length > 0
      ) {
        setCatalogProducts(data.products);
      } else {
        setCatalogProducts(defaultProducts);
      }
    } catch (error) {
      console.warn(
        "Using fallback products:",
        error.message
      );

      setCatalogProducts(defaultProducts);
      setCatalogError(error.message);
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // =========================================
  // FETCH SELLER PRODUCTS
  // =========================================

  const fetchSellerProducts = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "seller") {
      setSellerProducts([]);
      return;
    }

    try {
      setSellerLoading(true);
      setSellerError(null);

      const data = await getSellerProducts();

      setSellerProducts(
        Array.isArray(data?.products)
          ? data.products
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load seller products:",
        error
      );

      setSellerError(
        error.message ||
          "Failed to load seller products."
      );
    } finally {
      setSellerLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchSellerProducts();
  }, [fetchSellerProducts]);

  // =========================================
  // ADD PRODUCT
  // =========================================

  const addProduct = useCallback(
    async (formData) => {
      const data = await createProduct(formData);

      if (data?.product) {
        const newProduct = data.product;

        setSellerProducts((previous) => [
          newProduct,
          ...previous,
        ]);

        setCatalogProducts((previous) => [
          newProduct,
          ...previous,
        ]);
      } else {
        await fetchSellerProducts();
        await fetchProducts();
      }

      return data;
    },
    [fetchSellerProducts, fetchProducts]
  );

  // =========================================
  // EDIT PRODUCT
  // =========================================

  const editProduct = useCallback(
    async (id, formData) => {
      if (!id) {
        throw new Error(
          "Product ID is missing."
        );
      }

      const data = await updateProduct(
        id,
        formData
      );

      if (data?.product) {
        const updatedProduct = data.product;

        // IMPORTANT:
        // Update seller inventory using both id formats
        setSellerProducts((previous) =>
          previous.map((product) => {
            const productId =
              product._id || product.id;

            return String(productId) === String(id)
              ? updatedProduct
              : product;
          })
        );

        // Update public catalog too
        setCatalogProducts((previous) =>
          previous.map((product) => {
            const productId =
              product._id || product.id;

            return String(productId) === String(id)
              ? updatedProduct
              : product;
          })
        );
      } else {
        // If API does not return updated product,
        // reload both lists.
        await fetchSellerProducts();
        await fetchProducts();
      }

      return data;
    },
    [fetchSellerProducts, fetchProducts]
  );

  // =========================================
  // DELETE PRODUCT
  // =========================================

  const removeProduct = useCallback(
    async (id) => {
      if (!id) {
        throw new Error(
          "Product ID is missing."
        );
      }

      await deleteProduct(id);

      // Remove from seller inventory
      setSellerProducts((previous) =>
        previous.filter((product) => {
          const productId =
            product._id || product.id;

          return (
            String(productId) !== String(id)
          );
        })
      );

      // Remove from public catalog
      setCatalogProducts((previous) =>
        previous.filter((product) => {
          const productId =
            product._id || product.id;

          return (
            String(productId) !== String(id)
          );
        })
      );
    },
    []
  );

  // =========================================
  // GET SINGLE PRODUCT
  // =========================================

  const getProductById = useCallback(
    async (id) => {
      if (!id) return null;

      const found =
        catalogProducts.find(
          (product) =>
            String(product._id || product.id) ===
            String(id)
        ) ||
        sellerProducts.find(
          (product) =>
            String(product._id || product.id) ===
            String(id)
        );

      if (found) {
        return found;
      }

      try {
        const data =
          await getProductDetails(id);

        return data?.product || null;
      } catch (error) {
        console.error(
          "Failed to get product:",
          error
        );

        return null;
      }
    },
    [catalogProducts, sellerProducts]
  );

  // =========================================
  // INVENTORY METRICS
  // =========================================

  const metrics = useMemo(() => {
    const total =
      sellerProducts.length;

    const active =
      sellerProducts.filter(
        (product) =>
          Number(product.stock) > 0
      ).length;

    const lowStock =
      sellerProducts.filter(
        (product) =>
          Number(product.stock) > 0 &&
          Number(product.stock) <= 5
      ).length;

    const drafts =
      sellerProducts.filter(
        (product) =>
          Number(product.stock) === 0
      ).length;

    return {
      total,
      active,
      lowStock,
      drafts,
      activePercentage:
        total > 0
          ? Math.round(
              (active / total) * 100
            )
          : 0,
    };
  }, [sellerProducts]);

  // =========================================
  // FILTERED PRODUCTS
  // =========================================

  const filteredProducts = useMemo(() => {
    let result = [...sellerProducts];

    if (activeFilter === "active") {
      result = result.filter(
        (product) =>
          Number(product.stock) > 0
      );
    }

    if (activeFilter === "low_stock") {
      result = result.filter(
        (product) =>
          Number(product.stock) > 0 &&
          Number(product.stock) <= 5
      );
    }

    if (activeFilter === "drafts") {
      result = result.filter(
        (product) =>
          Number(product.stock) === 0
      );
    }

    if (searchQuery.trim()) {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      result = result.filter(
        (product) =>
          product.title
            ?.toLowerCase()
            .includes(query) ||
          product.name
            ?.toLowerCase()
            .includes(query) ||
          product.description
            ?.toLowerCase()
            .includes(query)
      );
    }

    return result;
  }, [
    sellerProducts,
    activeFilter,
    searchQuery,
  ]);

  // =========================================
  // CONTEXT
  // =========================================

  const value = {
    // Public
    products: catalogProducts,
    loading: catalogLoading,
    error: catalogError,
    fetchProducts,
    getProductById,

    // Seller
    sellerProducts,
    sellerLoading,
    sellerError,

    // Filtering
    filteredProducts,
    metrics,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,

    // Actions
    fetchSellerProducts,
    addProduct,
    editProduct,
    removeProduct,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export default ProductProvider;