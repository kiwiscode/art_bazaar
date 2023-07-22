import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../components/UserContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function Checkout() {
  const [items, setCartItems] = useState([]);
  const { getToken, userInfo, updateUser } = useContext(UserContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const buttonStyle = {
    fontSize: "20px",
    borderRadius: "40px",
    color: "black",
    background: "white",
  };

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
      console.log(existingItem);
      if (!existingItem) {
        console.log("if block is working");
        uniqueItems.push({ ...item, quantity: 1 });
        console.log(uniqueItems);
      } else {
        console.log("else block is working");
        console.log(existingItem);
        existingItem.quantity += 1;
        console.log(existingItem);
      }
    });

    return uniqueItems;
  };

  console.log(userInfo);
  const getCheckoutItems = () => {
    const token = getToken();

    axios
      .get(`${API_URL}/checkout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        const cartItemsArray = Object.values(userInfo.carts);
        const uniqueCartItems = getUniqueCartItems(cartItemsArray);
        setCartItems(uniqueCartItems);
        calculateTotalPrice(uniqueCartItems);
      })
      .catch((error) => console.log(error));
  };

  console.log(items);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    } else {
      console.log("USER ACTIVE WITH A TOKEN");
    }
    getCheckoutItems();
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
      <button className="payment-btn">PAYMENT</button>
    </div>
  );
}

export default Checkout;
