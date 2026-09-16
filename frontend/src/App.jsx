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

import MouseTrail from "./components/MouseTrail";
import PageTransition from "./components/PageTransition";


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


function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((currentCart) => [
      ...currentCart,
      product,
    ]);
  };


  const updateCartQuantity = (
    productId,
    change
  ) => {
    setCart((currentCart) => {
      const productIndex =
        currentCart.findIndex(
          (product) =>
            product.id === productId
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


  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (product) =>
          product.id !== productId
      )
    );
  };


  const cartCount = cart.length;


  return (
    <>
      <MouseTrail />

      <ScrollToTop />

      <PageTransition>
        <Routes>

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
    </>
  );
}


export default App;