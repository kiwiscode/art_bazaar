import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";
import axios from "axios";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function Orders() {
  const { getToken, userInfo } = useContext(UserContext);
  const [orderInfo, setOrderInfo] = useState([]);

  const clearCart = () => {
    localStorage.setItem("cartItems", JSON.stringify([]));
  };

  const mergeOrderItems = (order) => {
    const mergedOrder = [];

    order.forEach((item) => {
      const existingItem = mergedOrder.find(
        (mergedItem) => mergedItem.title === item.title
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        mergedOrder.push({ ...item });
      }
    });

    return mergedOrder;
  };

  useEffect(() => {
    // Make a GET request to the backend to fetch the user's order information
    axios
      .get(`${API_URL}/stripe/orders`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => {
        setOrderInfo(response.data.order);

        console.log(response);
        localStorage.setItem("order", JSON.stringify(response.data.order));
        clearCart();
      })
      .catch((error) => {
        console.log(error);
      })
      .catch((error) => {
        console.error("Error fetching user order:", error);
      });
  }, []);

  const mergedOrderItems = mergeOrderItems(orderInfo);

  return (
    <div>
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
    </div>
  );
}

export default Orders;
