import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";
import axios from "axios";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

const CheckoutSuccess = () => {
  const { getToken, userInfo } = useContext(UserContext);
  const [orderInfo, setOrderInfo] = useState([]);

  const clearCart = () => {
    localStorage.setItem("cartItems", JSON.stringify([]));
  };

  const clearOrder = () => {
    localStorage.setItem("order", JSON.stringify([]));
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

  console.log(userInfo);

  useEffect(() => {
    userInfo.carts = [];
    // Make a GET request to the backend to fetch the user's order information
    axios
      .get(`${API_URL}/stripe/checkout-success`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        localStorage.setItem("order", JSON.stringify(response.data.order));

        clearCart();
        axios
          .get(`${API_URL}/stripe/orders`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          })
          .then((response) => {
            setOrderInfo(response.data.order);
            localStorage.setItem("order", JSON.stringify(response.data.order));

            clearCart();
            clearOrder();
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .then((response) => {
        // Sadece o anki orderı `localStorage`'a kaydet
        localStorage.setItem("order", JSON.stringify(response.data.order));

        // Orderları al ve sadece o anki orderı alacak şekilde filtrele
        const filteredOrders = response.data.order.filter(
          (order) => order._id === response.data.order._id
        );

        setOrderInfo(filteredOrders);
        clearCart(); // Sepeti sıfırla (boş bir dizi olarak depola)
      })
      .catch((error) => {
        console.error("Error fetching user order:", error);
      });
  }, [getToken, userInfo]);

  const mergedOrderItems = mergeOrderItems(orderInfo);

  return (
    <>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
          Order Information
        </h1>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {mergedOrderItems.length === 0 ? (
            <p>No items found in the order.</p>
          ) : (
            mergedOrderItems.map((item, index) => (
              <div
                key={index}
                style={{
                  margin: "20px",
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  maxWidth: "300px",
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    marginBottom: "10px",
                  }}
                />
                <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Price: ${item.price}
                </p>
                <p style={{ fontSize: "1.2rem", marginBottom: "15px" }}>
                  Quantity: {item.quantity}
                </p>
              </div>
            ))
          )}
        </div>
        <div style={{ marginTop: "30px", fontSize: "1.2rem" }}>
          Thank you for your purchase! Your payment was successful.
        </div>

        <p style={{ fontSize: "1.1rem", marginTop: "20px" }}>
          Your order will be processed and shipped as soon as possible. We'll
          send you an email with the shipping details once your items are on the
          way.
        </p>
      </div>
    </>
  );
};

export default CheckoutSuccess;
