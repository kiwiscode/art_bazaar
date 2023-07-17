// src/components/Navbar.jsx

import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <NavLink to="/">
        <button>Home</button>
      </NavLink>
      <NavLink to="/products">
        <button>Products</button>
      </NavLink>
      <NavLink to="/auth/signup">
        <button>Signup</button>
      </NavLink>
      <NavLink to="/auth/login">
        <button>Login</button>
      </NavLink>
    </nav>
  );
}

export default Navbar;
