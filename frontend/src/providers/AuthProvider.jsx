import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/auth.service";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Check authentication state on app mount by calling get-me.
   */
  const refreshUser = useCallback(async () => {
    try {
      const data = await getMe();
      if (data?.user) {
        setUser(data.user);
        return data.user;
      }
      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const data = await getMe();
        if (isMounted && data?.user) {
          setUser(data.user);
        } else if (isMounted) {
          setUser(null);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Log in user with credentials and store user in state.
   */
  const login = useCallback(async ({ email, password }) => {
    const data = await loginUser({ email, password });
    if (data?.user) {
      setUser(data.user);
    }
    return data;
  }, []);

  /**
   * Register user and update user state since backend sets session cookie.
   */
  const register = useCallback(
    async ({ name, email, password, isSeller = false }) => {
      const data = await registerUser({
        name,
        email,
        password,
        isSeller,
      });

      if (data?.user) {
        setUser(data.user);
      }
      return data;
    },
    []
  );

  /**
   * Logout user by clearing backend session and local state.
   */
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Even if network or server fails, clear client state
    } finally {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
