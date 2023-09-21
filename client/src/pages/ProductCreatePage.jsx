import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../components/UserContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function ProductCreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [artist, setArtist] = useState("");
  const [period, setPeriod] = useState("");
  const [signature, setSignature] = useState("");
  const [technique, setTechnique] = useState("");
  const { userInfo } = useContext(UserContext);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      title,
      description,
      price,
      category,
      image,
      quantity,
      artist,
      period,
      signature,
      technique,
      username: userInfo.username,
      userId: userInfo._id,
    };

    const token = localStorage.getItem("token");

    axios
      .post(`${API_URL}/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setSuccess(response.data);
        }
        setError("");
      })
      //
      .catch((error) => {
        console.error("Error creating product:", error);
        const { status } = error.response;
        const { errorMessage } = error.response.data;
        console.log(status, errorMessage);
        if (status === 403) {
          setError(errorMessage);
          setSuccess("");
        }
      });
  };

  return (
    <div className="create-container">
      <h1>Create Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="label-input-container">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="label-input-container">
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="label-input-container">
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="label-input-container">
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Classical Artworks">Classical Artworks</option>
            <option value="Modern & Contemporary Art">
              Modern & Contemporary Art
            </option>
          </select>
        </div>
        <div className="label-input-container">
          <label>Image URL:</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <div className="label-input-container">
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="label-input-container">
          <label>Artist:</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
        </div>
        <div className="label-input-container">
          <label>Period:</label>
          <input
            type="text"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
        </div>
        <div className="label-input-container">
          <label>Signature:</label>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
          />
        </div>
        <div className="label-input-container">
          <label>Technique:</label>
          <input
            type="text"
            value={technique}
            onChange={(e) => setTechnique(e.target.value)}
          />
        </div>
        <button type="submit" onClick={handleSubmit}>
          Create
        </button>
        {error}
        {success}
      </form>
    </div>
  );
}

export default ProductCreatePage;
