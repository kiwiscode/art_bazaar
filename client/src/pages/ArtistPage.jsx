// All artist profiles
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function ArtistPage() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    // Backend'den artist kullanıcıları çekmek için API endpoint'ini çağırıyoruz
    axios
      .get(`${API_URL}/auth/artists`)
      .then((response) => {
        setArtists(response.data); // Çekilen artist kullanıcılarını state'e kaydediyoruz
      })
      .catch((error) => {
        error;
      });
  }, []);

  return (
    <div className="artists-container">
      <h1>Artists</h1>
      <div className="artist-list">
        {artists.map((artist) => (
          <div key={artist._id} className="artist-profile">
            <div className="artist-image">
              {/* Burada artist resmi için gerekli URL'yi artist nesnesinden alabiliriz */}
              {/* Örnek olarak: <img src={artist.image} alt={artist.name} /> */}
              <img src="https://via.placeholder.com/150" alt={artist.name} />
            </div>
            <div className="artist-details">
              <p>Name: {artist.name}</p>
              <p>Email: {artist.email}</p>
              <p>Username: {artist.username}</p>
              {/* LinkedIn ve Instagram için linkleri kontrol ediyoruz */}
              {artist.contact && artist.contact.length > 0 && (
                <div>
                  {artist.contact.map((contact) => (
                    <a
                      key={contact.platform}
                      href={contact.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {contact.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="artist-button">
              <Link to={`/auth/artists/${artist._id}/works`}>
                <button>View Products</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ArtistPage;
