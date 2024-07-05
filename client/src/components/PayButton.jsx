import { useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

// when working on local version
<<<<<<< HEAD
// const API_URL = "http://localhost:3000";
//
// when working on deployment version
const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";
=======
const API_URL = import.meta.env.VITE_APP_API_URL;
>>>>>>> c555ca2 (Refactor e-commerce project to new concept)

const PayButton = ({ cartItems }) => {
  const { getToken, userInfo } = useContext(UserContext);

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
        if (response.data.url) {
          window.location.href = response.data.url;
        }
      })
      .catch((err) => err.message);
  };

  return (
    <>
      <button onClick={() => handleCheckout()}>Proceed to check out</button>
    </>
  );
};

export default PayButton;
