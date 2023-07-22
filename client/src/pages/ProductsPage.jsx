import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";
function ProductsPage() {
  const [products, setProducts] = useState([]);
  const buttonStyle = {
    fontSize: "20px",
    borderRadius: "40px",
    color: "black",
    background: "white",
  };
  const getAllProduts = () => {
    axios
      .get(`${API_URL}/products`)
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllProduts();
  }, []);

  return (
    <div>
      <h1 className="product-title">All Products</h1>

      <ul className="products">
        {products.map((product) => (
          <li key={product._id} className="product">
            <img src={product.image} alt="product" />
            <p>{product.title}</p>
            <p>${product.price}</p>
            <p>{[product.description]}</p>
            <Link to={`/products/${product._id}`}>
              <button style={buttonStyle}>BUY NOW</button>
            </Link>
            <hr className="hr-product" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductsPage;
