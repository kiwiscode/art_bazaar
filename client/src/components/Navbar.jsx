import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

// when working on local version

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function Navbar() {
  const { username2, logout } = useContext(UserContext);

  return (
    <div>
      {username2 ? <p>Logged in as: {username2}</p> : <p></p>}

      <nav>
        <NavLink to="/">
          <button>Home</button>
        </NavLink>
        <NavLink to="/products">
          <button>Products</button>
        </NavLink>
        {username2 ? (
          <button onClick={logout} to="/">
            Logout
          </button>
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
