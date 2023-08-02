import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { UserContext } from "../components/UserContext";

// when working on local version
// const API_URL = "http://localhost:3000";

// when working on deployment version
const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function ProductDetailsPage() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const { userInfo, updateUser } = useContext(UserContext);
  const { active, username } = userInfo;

  const getProductDetails = () => {
    axios
      .get(`${API_URL}/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => error);
  };

  const addToCart = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(`${API_URL}/products/${id}/carts`, null, config)
      .then(() => {
        const updatedUserInfo = {
          ...userInfo,
          carts: [...userInfo.carts, product],
        };
        updateUser(updatedUserInfo);

        localStorage.setItem(
          "cartItems",
          JSON.stringify(updatedUserInfo.carts)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  return (
    <>
      <div>
        <h1 className="product-details-title">Product Details</h1>

        <div className="product-details-container">
          <img src={product.image} alt="product" />
          <h2>{product.title}</h2>
          <p>${product.price}</p>
          <p>{product.description}</p>
          {!active && (
            <div>
              <NavLink to="/auth/login">
                <button className="bottom-left">Add to cart</button>
              </NavLink>
            </div>
          )}
          {active && (
            <button onClick={addToCart}>
              {" "}
              <i className="add-cart">🛒</i> Add to Cart
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductDetailsPage;
