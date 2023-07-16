// deploy versiona entegre edilecek denenecek

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// const API_URL = "http://localhost:3000";
const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function ProductDetailsPage() {
  const [product, setProduct] = useState({});
  const { id } = useParams();

  const getProductDetails = () => {
    axios
      .get(`${API_URL}/products/${id}`)
      .then((response) => {
        console.log(response.data);
        setProduct(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  return (
    <div>
      <h1>Product Details</h1>

      <div>
        <img src={product.image} alt="product" />
        <h2>{product.title}</h2>
        <p>${product.price}</p>
        <p>{product.description}</p>

        {/* <button onClick={addToCart}>Add to Cart</button> */}
        <button>Add to cart</button>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
