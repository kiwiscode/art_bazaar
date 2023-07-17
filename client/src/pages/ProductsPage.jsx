import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// const API_URL = "http://localhost:3000";
const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";
function ProductsPage() {
  const [products, setProducts] = useState([]);

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

  console.log(setProducts);

  return (
    <div>
      <h1>All Products</h1>

      <ul className="products">
        {products.map((product) => (
          <li
            key={product._id}
            style={{ listStyleType: "none" }}
            className="product"
          >
            <img src={product.image} alt="product" />
            <p>{product.title}</p>
            <p>${product.price}</p>
            <p>{[product.description]}</p>
            <Link to={`/products/${product._id}`}>
              <button>BUY NOW</button>
            </Link>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductsPage;
