import {
  useEffect,
  useState,
} from "react";

import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router";

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import CustomBouquets from "./pages/CustomBouquets";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import SellerDashboard from "./pages/SellerDashboard";

import MouseTrail from "./components/MouseTrail";
import PageTransition from "./components/PageTransition";
import AuthProvider from "./providers/AuthProvider";
import ProductProvider from "./providers/ProductProvider";


/* =========================================
   SCROLL TO TOP
========================================= */

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}


/* =========================================
   APP
========================================= */

function App() {
  const [cart, setCart] = useState([]);


  /* =========================================
     ADD TO CART
  ========================================= */

  const addToCart = (product) => {
    setCart((currentCart) => [
      ...currentCart,
      product,
    ]);
  };


  /* =========================================
     UPDATE CART QUANTITY
  ========================================= */

  const updateCartQuantity = (
    productId,
    change
  ) => {
    setCart((currentCart) => {
      const productIndex =
        currentCart.findIndex(
          (product) =>
            product.id === productId ||
            product._id === productId
        );

      if (productIndex === -1) {
        return currentCart;
      }

      const newCart = [...currentCart];

      if (change > 0) {
        const product =
          currentCart[productIndex];

        newCart.push(product);
      } else {
        newCart.splice(productIndex, 1);
      }

      return newCart;
    });
  };


  /* =========================================
     REMOVE FROM CART
  ========================================= */

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (product) =>
          product.id !== productId &&
          product._id !== productId
      )
    );
  };


  const cartCount = cart.length;


  return (
    <AuthProvider>

      <MouseTrail />

      <ScrollToTop />

      <ProductProvider>

        <PageTransition>

          <Routes>

            {/* =================================
                CUSTOMER ROUTES
            ================================= */}

            <Route
              path="/"
              element={
                <Home
                  cartCount={cartCount}
                  onAddToCart={addToCart}
                />
              }
            />


            <Route
              path="/collection"
              element={
                <Collection
                  cartCount={cartCount}
                  onAddToCart={addToCart}
                />
              }
            />


            <Route
              path="/custom-bouquets"
              element={
                <CustomBouquets
                  cartCount={cartCount}
                />
              }
            />


            <Route
              path="/login"
              element={
                <Login
                  cartCount={cartCount}
                />
              }
            />


            <Route
              path="/signup"
              element={
                <Signup
                  cartCount={cartCount}
                />
              }
            />


            <Route
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  onUpdateQuantity={
                    updateCartQuantity
                  }
                  onRemoveItem={
                    removeFromCart
                  }
                />
              }
            />


            {/* =================================
                SELLER DASHBOARD

                SellerDashboard itself checks:
                - authentication
                - seller role
            ================================= */}

            <Route
              path="/seller"
              element={
                <SellerDashboard />
              }
            />


            <Route
              path="/seller/dashboard"
              element={
                <SellerDashboard />
              }
            />


            {/* =================================
                FALLBACK
            ================================= */}

            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

          </Routes>

        </PageTransition>

      </ProductProvider>

    </AuthProvider>
  );
}


export default App;