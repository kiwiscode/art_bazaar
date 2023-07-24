import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

const PayButton = ({ cartItems }) => {
  const { getToken, userInfo } = useContext(UserContext);
  console.log(userInfo);
  const [user, setUser] = useState(null); // Initialize the state with null or the appropriate initial value
  console.log(cartItems);
  console.log(userInfo);

  const handleCheckout = () => {
    axios
      .post(
        `${API_URL}/stripe/create-checkout-session`,
        { cartItems: userInfo.carts, userId: userInfo.userId },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.data.url) {
          window.location.href = response.data.url;
        }
        console.log(cartItems);
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <>
      <button onClick={() => handleCheckout()}>Proceed to check out</button>
    </>
  );
};

export default PayButton;
