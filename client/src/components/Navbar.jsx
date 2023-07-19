import { NavLink } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        logout();
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <nav>
        <NavLink to="/">
          <button>Home</button>
        </NavLink>
        <NavLink to="/products">
          <button>Products</button>
        </NavLink>

        {active && (
          <div>
            <p>Welcome, {username}</p>
            <p>Status : {active ? "online" : ""}</p>
            <NavLink to="/carts">
              <button>Shopping Cart ({userInfo.carts.length})</button>
            </NavLink>
            <NavLink>
              <button onClick={handleLogout}>Logout</button>
            </NavLink>
          </div>
        )}

        {!active && (
          <div>
            <NavLink to="/auth/signup">
              <button>Signup</button>
            </NavLink>
            <NavLink to="/auth/login">
              <button>Login</button>
            </NavLink>
          </div>
        )}
      </nav>
    </div>
  );
}
//
export default Navbar;
