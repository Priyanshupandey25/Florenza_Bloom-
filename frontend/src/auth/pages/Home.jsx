import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Intro from "../components/Intro";
import ProductGrid from "../components/ProductGrid";
import WhyUs from "../components/WhyUs";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";

import products from "../data/products";

function Home({ cartCount, onAddToCart }) {
  return (
    <>
      <Navbar cartCount={cartCount} />

      <main>
        <Hero />
        <Intro />
        <ProductGrid
          products={products}
          onAddToCart={onAddToCart}
        />
        <WhyUs />
        <Reviews />
      </main>

      <Footer />
    </>
  );
}

export default Home;