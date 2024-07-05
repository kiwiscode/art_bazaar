import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../components/UserContext";

// when working on local version
<<<<<<< HEAD
// const API_URL = "http://localhost:3000";

// when working on deployment version
const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";
=======
const API_URL = import.meta.env.VITE_APP_API_URL;
>>>>>>> c555ca2 (Refactor e-commerce project to new concept)

const MyWorksPage = () => {
  const { userInfo } = useContext(UserContext);
  const [works, setWorks] = useState([]);

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
          // İstek başarılı olduysa çalışmaları alıp state'e kaydedelim
          setWorks(response.data);
        })
        .catch((error) => {
          console.error("Error fetching works:", error);
        });
    }
  }, [userInfo]);

  return (
    <div>
      <h1>My works</h1>
      {works.length < 1 ? (
        <p>No works found.</p>
      ) : (
        works.map((work) => (
          <div
            key={work._id}
<<<<<<< HEAD
            className="work-item"
=======
>>>>>>> development
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "5px",
            }}
          >
            {/* Çalışma bilgilerini burada göster */}
            <h2>{work.title}</h2>
            <p>{work.description}</p>
            <img
              src={work.image}
              alt={work.title}
              style={{ width: "100%", maxWidth: "150px" }}
            />
          </div>
        ))
      )}
    </div>
  );
};

{
  /* <div>
<h1>Orders</h1>
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  }}
>
  {mergedOrderItems.length === 0 ? (
    <p>No orders found.</p>
  ) : (
    mergedOrderItems.map((item, index) => (
      <div
        key={index}
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <p>{item.title}</p>
        <img
          src={item.image}
          alt={item.title}
          style={{ width: "100%", maxWidth: "150px" }}
        />
        <p>Price: ${item.price}</p>
        <p>Quantity: {item.quantity}</p>
      </div>
    ))
  )}
</div>
</div> */
}

export default MyWorksPage;
