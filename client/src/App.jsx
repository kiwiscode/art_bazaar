// src/App.jsx

import "./App.css";

import { Routes, Route } from "react-router-dom"; // <== IMPORT

import Navbar from "./components/Navbar"; // <== IMPORT
import HomePage from "./pages/HomePage"; // <== IMPORT
import ProductsPage from "./pages/ProductsPage";
import SignupPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Signed from "./pages/EmailVerifiedPage";

function App() {
  return (
    <div className="App">
      {/* <Navbar /> */}
      <Navbar />{" "}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/signed" element={<Signed />}></Route>
      </Routes>
    </div>
  );
}

export default App;
