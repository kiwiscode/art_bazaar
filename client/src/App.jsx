// src/App.jsx

import "./App.css";

import { Routes, Route, Link } from "react-router-dom"; // <== IMPORT
import Navbar from "./components/Navbar"; // <== IMPORT
import HomePage from "./pages/HomePage"; // <== IMPORT
import ProductsPage from "./pages/ProductsPage";
import SignupPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Signed from "./pages/EmailVerifiedPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { UserProvider } from "./components/UserContext";
import Cart from "./pages/CartPage";
import LogoutPage from "./pages/LogoutPage";
import Checkout from "./pages/CheckoutPage";
function App() {
  return (
    <UserProvider>
      <div className="App">
        <div>
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/logout" element={<LogoutPage />} />
          <Route path="/signed" element={<Signed />}></Route>
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/carts" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </UserProvider>
  );
}
export default App;
