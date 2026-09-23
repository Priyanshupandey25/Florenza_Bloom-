import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

/**
 * Custom hook to consume the authentication context.
 * Layer 3: Direct access to AuthProvider.
 *
 * @returns {{
 *   user: Object|null,
 *   loading: boolean,
 *   isAuthenticated: boolean,
 *   login: Function,
 *   register: Function,
 *   logout: Function,
 *   refreshUser: Function
 * }}
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export default useAuth;
