// Active artist profile

import { useState, useContext } from "react";
import { UserContext } from "../components/UserContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function ArtistProfilePage() {
  const { userInfo } = useContext(UserContext);
  const [instagramLink, setInstagramLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [editing, setEditing] = useState(true); // Default olarak input alanlarını gösterelim

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const handleSave = () => {
    // Create a data object with the LinkedIn and Instagram links
    const data = {
      linkedin: linkedinLink,
      instagram: instagramLink,
    };

    const token = localStorage.getItem("token");
    // Send a POST request to save the links to the database
    axios
      .post(`${API_URL}/auth/update/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        console.log("Profile links saved successfully!");
        setEditing(false);
      })
      .catch((error) => {
        console.error("Error saving profile links:", error);
      });
  };
  return (
    <div className="profie-first-container">
      <div className="profile-container">
        <div className="profile-image-container">
          {/* Burada resim için gerekli URL'yi artistInfo'dan alabiliriz */}

          <img
            className="profile-image"
            // src={userInfo.image}
            // alt={artistInfo.name}
          />
        </div>
        <h1>Artist Profile</h1>
        <p>Name: {userInfo.name}</p>
        <p>Username: {userInfo.username}</p>
        <p>Email: {userInfo.email}</p>

        <Link to="/create">
          <button className="create">Create Product</button>
        </Link>
        <Link to="/my-works">
          <button className="my-works-button">My Works</button>
        </Link>
      </div>
      <div className="contact-container">
        <label className="profile-label">
          <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
        </label>
        {editing ? (
          <input
            className="profile-input"
            type="text"
            placeholder="Enter your LinkedIn link"
            value={linkedinLink}
            onChange={(e) => setLinkedinLink(e.target.value)}
          />
        ) : (
          <p>{linkedinLink}</p>
        )}

        <label className="profile-label">
          <FontAwesomeIcon icon={faInstagram} /> Instagram
        </label>
        {editing ? (
          <input
            className="profile-input"
            type="text"
            placeholder="Enter your Instagram link"
            value={instagramLink}
            onChange={(e) => setInstagramLink(e.target.value)}
          />
        ) : (
          <p>{instagramLink}</p>
        )}

        {editing ? (
          <button className="profile-button" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button className="profile-button" onClick={() => setEditing(true)}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default ArtistProfilePage;
