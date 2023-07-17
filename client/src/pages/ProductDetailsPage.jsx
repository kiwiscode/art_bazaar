// deploy versiona entegre edilecek denenecek

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function ProductDetailsPage() {
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { username2 } = useContext(UserContext);

  const getProductDetails = () => {
    axios
      .get(`${API_URL}/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  const handleAddToCart = () => {
    if (username2) {
      axios
        .post(`${API_URL}/products/${id}/carts`)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <div>
      <h1>Product Details</h1>

      <div>
        <img src={product.image} alt="product" />
        <h2>{product.title}</h2>
        <p>${product.price}</p>
        <p>{product.description}</p>

        <button onClick={handleAddToCart}>Add to cart</button>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
