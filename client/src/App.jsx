// src/App.jsx

import "./App.css";

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductsPage";
import SignupPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Signed from "./pages/EmailVerifiedPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { UserProvider } from "./components/UserContext";
import Cart from "./pages/CartPage";
import LogoutPage from "./pages/LogoutPage";
import CheckoutSuccess from "./pages/CheckoutSuccessPage";
import Orders from "./pages/OrderPage";
function App() {
  return (
    <UserProvider>
      <div className="App">
        <div>
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/logout" element={<LogoutPage />} />
          <Route path="/signed" element={<Signed />}></Route>
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/carts" element={<Cart />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />}></Route>
          <Route path="/orders" element={<Orders />}></Route>
        </Routes>
      </div>
    </UserProvider>
  );
}
export default App;
