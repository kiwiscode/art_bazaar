import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush } from "@fortawesome/free-solid-svg-icons";

// when working on local version
// const API_URL = "http://localhost:3000";

// when working on deployment version
const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function Navbar() {
  const navigate = useNavigate();
  const { userInfo, logout } = useContext(UserContext);
  const { active, name, isArtist } = userInfo;
  const [cartItems, setCartItems] = useState([]);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    setCartItems(storedCartItems);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    // Eğer sayfanın yatay scroll pozisyonu 275 pikselden büyükse oku göster
    setShowScrollToTop(window.scrollY > 275);
  };

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    axios
      .post(`${API_URL}/auth/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        userInfo.active = false;
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("order");
        logout();
        navigate("/");
      })
      .catch((error) => {
        error;
      });
  };

  return (
    <div className="navbar-container">
      <div>
        <div className="container">
          {active && (
            <div>
              <p>
                Welcome, {name} {isArtist ? "(Artist)" : ""}
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

            {userInfo.isArtist && ( // Kullanıcı artist olarak giriş yapmışsa "Profile" menüsünü gösterelim
              <NavLink to="/profile">
                <button className="bottom-left">Profile</button>
              </NavLink>
            )}
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
            {/* Add the "Artists" section for both artists and non-artists */}

            {active && (
              <NavLink to="/auth/artists">
                <button>{isArtist ? "Other Artists" : "Artists"}</button>
              </NavLink>
            )}
            {/* Add the Orders section */}
            {active && (
              <NavLink to="/orders">
                <button>Orders</button>
              </NavLink>
            )}
          </div>
        </nav>
        {/* Scroll to top okunu göster */}
        {showScrollToTop && (
          <div
            className="scroll-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {" "}
            <FontAwesomeIcon icon={faPaintBrush} />
            <i className="fa fa-chevron-up"></i>
          </div>
        )}
      </div>{" "}
    </div>
  );
}

export default Navbar;
