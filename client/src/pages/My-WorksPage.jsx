import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../components/UserContext";

// when working on local version
// const API_URL = "http://localhost:3000";

// when working on deployment version
const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

const MyWorksPage = () => {
  const { userInfo } = useContext(UserContext);
  const [works, setWorks] = useState([]);
  console.log(works);
  useEffect(() => {
    if (userInfo) {
      const token = localStorage.getItem("token");
      axios
        .get(`${API_URL}/profile/my-works`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          // İstek başarılı olduysa çalışmaları alıp state'e kaydedelim
          setWorks(response.data);
        })
        .catch((error) => {
          console.error("Error fetching works:", error);
        });
    }
  }, [userInfo]);

  return (
    <div className="works-container">
      <h1>My works</h1>
      {works.map((work) => (
        <div key={work._id} className="work-item">
          {/* Çalışma bilgilerini burada göster */}
          <h2>{work.title}</h2>
          <p>{work.description}</p>
          <img src={work.image} alt={work.title} />
        </div>
      ))}
    </div>
  );
};

export default MyWorksPage;
