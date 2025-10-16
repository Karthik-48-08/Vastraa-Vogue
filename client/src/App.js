import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import Mens from "./pages/Mens";
import Womens from "./pages/Womens";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Shirts from "./pages/Shirts";
import Trousers from "./pages/Trousers";
import Suits from "./pages/Suits";
import Kurtas from "./pages/Kurtas";
import Kurtis from "./pages/Kurtis";
import SalwarSuits from "./pages/SalwarSuits";
import Lehengas from "./pages/Lehengas";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { OrdersProvider } from "./context/OrdersContext"; // Import OrdersProvider

function App() {
  return (
    <AuthProvider>
      <OrdersProvider> {/* Wrap your app with OrdersProvider */}
        <CartProvider>
          <Router>
            <Navbar />
            <AuthModal />
            <main style={{ paddingTop: "65px" }}>
              <Routes>
                {/* All your existing routes */}
                <Route path="/" element={<Home />} />
                <Route path="/mens" element={<Mens />} />
                <Route path="/womens" element={<Womens />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/account" element={<Account />} />
                <Route path="/mens/shirts" element={<Shirts />} />
                <Route path="/mens/trousers" element={<Trousers />} />
                <Route path="/mens/suits" element={<Suits />} />
                <Route path="/mens/kurtas" element={<Kurtas />} />
                <Route path="/womens/kurtis" element={<Kurtis />} />
                <Route path="/womens/salwarsuits" element={<SalwarSuits />} />
                <Route path="/womens/lehengas" element={<Lehengas />} />
              </Routes>
            </main>
          </Router>
        </CartProvider>
      </OrdersProvider>
    </AuthProvider>
  );
}

export default App;