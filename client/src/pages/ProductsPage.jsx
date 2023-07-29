import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../components/UserContext";

// when working on local version
// const API_URL = "http://localhost:3000";

// when working on deployment version
const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function ProductsPage() {
  const [sortBy, setSortBy] = useState("asc"); // asc: ucuzdan pahalıya, desc: pahalıdan ucuza
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { userInfo } = useContext(UserContext);
  const getAllProducts = () => {
    axios
      .get(`${API_URL}/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => error);
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);

    if (e.target.value === "asc") {
      const sortedProducts = [...products].sort((a, b) => a.price - b.price);
      setProducts(sortedProducts);
    } else if (e.target.value === "desc") {
      const sortedProducts = [...products].sort((a, b) => b.price - a.price);
      setProducts(sortedProducts);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);

    if (selectedCategory === "") {
      // Eğer "All Categories" seçildiyse, tüm ürünleri göster
      getAllProducts();
    } else {
      // Seçilen kategoriye ait ürünleri filtrele ve güncelle

      const filteredProducts = products.filter(
        (products) => products.category === selectedCategory
      );
      const newArr = filteredProducts;

      setProducts(newArr);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div>
      <div>
        <select
          className="sort-select"
          value={sortBy}
          onChange={handleSortByChange}
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>

        <select
          className="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          <option value="Classical Artworks">Classical Art</option>
          <option value="Modern & Contemporary Art">
            Modern & Contemporary Art
          </option>
        </select>
      </div>
      <ul className="products">
        {products.map((product) => (
          <li key={product._id} className="product">
            {!product.rating && <span className="artist-badge">Artist</span>}

            <img src={product.image} alt="product" />
            <p>{product.title}</p>
            <p>{product.artist}</p>
            <p>${product.price}</p>
            <p>{product.category}</p>
            <p>{[product.description]}</p>

            <Link to={`/products/${product._id}`}>
              <button>BUY NOW</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ProductsPage;
