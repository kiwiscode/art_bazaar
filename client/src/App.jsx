import { Routes, Route, useLocation } from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import Cart from "./pages/CartPage";
import CheckoutSuccess from "./pages/CheckoutSuccessPage";
import Orders from "./pages/OrderPage";
import ProductCreatePage from "./pages/ProductCreatePage";
import MyWorks from "./pages/My-WorksPage";
import GetArtistWorks from "./pages/ArtistWorksPage";
import Main from "./pages/MainPage";
import ResetPassword from "./pages/ResetPassword";
import ArtistProfile from "./pages/ArtistProfile";
function App() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <UserProvider>
      <div className="App">
        <div
          style={{
            position: "sticky",
            top: "0px",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            zIndex: 1,
            width: "100%",
            borderBottom: "1px solid rgb(194, 194, 194)",
          }}
        >
          {path !== "/reset_password" && <Navbar />}
        </div>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />;
          <Route path="/carts" element={<Cart />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />}></Route>
          <Route path="/reset_password" element={<ResetPassword />}></Route>
          <Route path="/orders" element={<Orders />}></Route>
          <Route
            path="/artist/:artist_name"
            element={<ArtistProfile />}
          ></Route>
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
