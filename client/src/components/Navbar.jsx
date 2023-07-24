import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function Navbar() {
  const navigate = useNavigate();
  const { userInfo, logout } = useContext(UserContext);
  const { active, username } = userInfo;
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  }, []);

  console.log(userInfo);

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    axios
      .post(`${API_URL}/auth/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        userInfo.active = false;
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        localStorage.removeItem("cartItems");
        // localStorage.removeItem("address");
        logout();
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="navbar-container">
      <div>
        <div className="container">
          {active && (
            <div>
              <p>
                Welcome, {username}
                <span className="online-status" />{" "}
                <span className="online-text">Online</span>
              </p>

              <NavLink to="/carts" className="cart-icon">
                <span className="cart-item-count">{userInfo.carts.length}</span>
                🛒
              </NavLink>

              <NavLink to="/auth/login">
                <button className="bottom-right" onClick={handleLogout}>
                  Logout
                </button>
              </NavLink>
            </div>
          )}
          <div className="hover-container">
            <h1 id="title">CANVAS</h1>
          </div>
        </div>
        <nav>
          <div className="nav-links">
            <NavLink to="/">
              <button className="top-left">Home</button>
            </NavLink>

            <NavLink to="/products">
              <button className="top-right">Products</button>
            </NavLink>

            {!active && (
              <div>
                <NavLink to="/auth/signup">
                  <button className="bottom-left">Signup</button>
                </NavLink>
                <NavLink to="/auth/login">
                  <button className="bottom-right">Login</button>
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>{" "}
    </div>
  );
}

export default Navbar;
