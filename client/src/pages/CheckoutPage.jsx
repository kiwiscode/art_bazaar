import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../components/UserContext";
import { NavLink } from "react-router-dom";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function Checkout() {
  const [items, setCartItems] = useState([]);
  const { getToken, userInfo } = useContext(UserContext);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculateTotalPrice = (array) => {
    let total = 0;
    array.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalPrice(total);
  };

  const getUniqueCartItems = (array) => {
    const uniqueItems = [];

    array.forEach((item) => {
      const existingItem = uniqueItems.find(
        (uniqueItem) => uniqueItem._id === item._id
      );
      if (!existingItem) {
        uniqueItems.push({ ...item, quantity: 1 });
      } else {
        existingItem.quantity += 1;
      }
    });

    return uniqueItems;
  };

  const getCheckoutItems = () => {
    const token = getToken();

    axios
      .get(`${API_URL}/carts/checkout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        const cartItemsArray = Object.values(response.data.carts);
        const uniqueCartItems = getUniqueCartItems(cartItemsArray);
        console.log(cartItemsArray);
        console.log(uniqueCartItems);
        setCartItems(uniqueCartItems);
        calculateTotalPrice(uniqueCartItems);
      })
      .catch((error) => console.log(error));
  };

  const handlePayment = () => {
    const token = getToken();
    axios
      .get(`${API_URL}/payment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    } else {
      console.log("USER ACTIVE WITH A TOKEN");
      getCheckoutItems();
    }
  }, [getToken]);

  return (
    <div>
      <h1 className="product-details-title">Cart Items</h1>

      <ul className="items">
        {items.map((item) => (
          <li key={item._id} className="item">
            <img src={item.image} alt="item" />
            <div className="item-details">
              <p className="item-title">{item.title}</p>
              <p className="item-price">${item.price}</p>
              <p className="item-quantity">Quantity: {item.quantity}</p>
            </div>

            <hr />
          </li>
        ))}
      </ul>
      <p className="total-price">Total Price: ${totalPrice.toFixed(2)}</p>
      <NavLink to="/payment">
        <button onClick={handlePayment} className="payment-btn">
          Payment
        </button>
      </NavLink>
    </div>
  );
}

export default Checkout;
