import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

// when working on local version
<<<<<<< HEAD
// const API_URL = "http://localhost:3000";

// when working on deployment version
const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";
=======
const API_URL = import.meta.env.VITE_APP_API_URL;
>>>>>>> c555ca2 (Refactor e-commerce project to new concept)

function GetArtistWorks() {
  const { id } = useParams();
  const [works, setWorks] = useState([]);

  const getArtistWorks = () => {
    axios
      .get(`${API_URL}/auth/artists/${id}/works`)
      .then((response) => {
        setWorks(response.data);
      })
      .catch((error) => {
        error;
      });
  };

  useEffect(() => {
    getArtistWorks();
  }, []);

  return (
    <div>
      <h1>Artist Works</h1>
      <div>
        {works.length === 0 ? (
          <p>There are no works available for this artist.</p>
        ) : (
          works.map((work) => (
            <div key={work._id}>
              <img src={work.image} alt="" />
              <p>Work Title: {work.title}</p>
              <p>Artist: {work.artist}</p>
              <p>Work Description: {work.description}</p>
              <p>Price: {work.price}</p>
              <p>Period: {work.period}</p>
              <p>{work.signature}</p>
              <p>Technique: {work.technique}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GetArtistWorks;
