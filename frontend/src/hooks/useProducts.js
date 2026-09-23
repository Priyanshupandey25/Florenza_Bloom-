import { useContext } from "react";
import { ProductContext } from "../providers/ProductProvider";

/**
 * Custom hook to consume the Product Context.
 * Layer 3: Provides clean access to seller inventory and product actions.
 */
export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }

  return context;
}

export default useProducts;
