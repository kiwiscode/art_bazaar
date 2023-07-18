import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function Navbar() {
  const navigate = useNavigate();

  const { username2, logout } = useContext(UserContext);
  console.log(username2);
  const handleLogout = () => {
    axios
      .post(`${API_URL}/auth/logout`, null, { maxRedirects: 0 })
      .then((res) => {
        console.log(res);
        logout();
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <p>Hello World</p>
      {username2 ? <p>Logged in as: {username2}</p> : <p></p>}

      <nav>
        <NavLink to="/">
          <button>Home</button>
        </NavLink>
        <NavLink to="/products">
          <button>Products</button>
        </NavLink>

        {username2 ? (
          <>
            <button onClick={handleLogout}>Logout</button>

            <NavLink to="/carts">
              <button>Shopping Cart</button>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/auth/signup">
              <button>Signup</button>
            </NavLink>
            <NavLink to="/auth/login">
              <button>Login</button>
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
}
//
export default Navbar;
