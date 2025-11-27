import { Route, Routes } from "react-router-dom";
import ChatWidget from "./components/ChatWidget";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MenuBar from "./components/MenuBar";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import PaymentResultPage from "./pages/PaymentResultPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import BestSellersPage from "./pages/BestSellersPage";
import DealsPage from "./pages/DealsPage";
import ProductsPage from "./pages/ProductsPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <div className="App">
          <div style={{ backgroundColor: "#131921" }}>
            <Header />
            <MenuBar />
          </div>
          <main className="main">
            <div className="container">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment/result" element={<PaymentResultPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/best-sellers" element={<BestSellersPage />} />
                <Route path="/deals" element={<DealsPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
              </Routes>
            </div>
          </main>
          <Footer />
          <ChatWidget roomId="global" user={{ name: "Khách" }} />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
