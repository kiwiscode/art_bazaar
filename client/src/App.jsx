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
import ArtistPage from "./pages/ArtistPage";
import ArtistProfilePage from "./pages/ArtistProfilePage";
import ProductCreatePage from "./pages/ProductCreatePage";
import MyWorks from "./pages/My-WorksPage";
import GetArtistWorks from "./pages/ArtistWorksPage";
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
          <Route path="/auth/artists" element={<ArtistPage />}></Route>
          <Route path="/profile" element={<ArtistProfilePage />}></Route>
          <Route path="/create" element={<ProductCreatePage />}></Route>
          <Route path="/my-works" element={<MyWorks />}></Route>
          <Route
            path="/auth/artists/:id/works"
            element={<GetArtistWorks />}
          ></Route>
        </Routes>
      </div>
    </UserProvider>
  );
}
export default App;
