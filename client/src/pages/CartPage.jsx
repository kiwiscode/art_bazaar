import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../components/UserContext";
import PayButton from "../components/PayButton";

// when working on local version
<<<<<<< HEAD
// const API_URL = "http://localhost:3000";

// when working on deployment version
const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";
=======
const API_URL = import.meta.env.VITE_APP_API_URL;
>>>>>>> c555ca2 (Refactor e-commerce project to new concept)

function CartPage() {
  const { getToken, userInfo, updateUser } = useContext(UserContext);

  const [cartItems, setCartItems] = useState([]);
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
    const itemIds = [];

    array.forEach((item) => {
      if (!itemIds.includes(item._id)) {
        itemIds.push(item._id);
        uniqueItems.push(item);
      } else {
        const index = uniqueItems.findIndex(
          (uniqueItem) => uniqueItem._id === item._id
        );
        uniqueItems[index].quantity += 1;
      }
    });

    return uniqueItems;
  };

  const fetchCartData = () => {
    const token = getToken();

    axios
      .get(`${API_URL}/carts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const cartItemsArray = Object.values(response.data.carts);
        const uniqueCartItems = getUniqueCartItems(cartItemsArray);
        setCartItems(uniqueCartItems);
        calculateTotalPrice(uniqueCartItems);
      })
      .catch((error) => {
        return error;
      });
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }

    // İlk yükleme sırasında ve her post/delete işleminden sonra güncel verileri alma
    fetchCartData();
  }, [getToken]);

  const handleIncreaseQuantity = (itemId) => {
    const updatedCartItems = [...cartItems];
    const itemIndex = updatedCartItems.findIndex((item) => item._id === itemId);
    const product = updatedCartItems.find((item) => item._id === itemId);

    if (itemIndex !== -1) {
      updatedCartItems[itemIndex].quantity += 1;
    } else {
      return;
    }

    setCartItems(updatedCartItems);
    calculateTotalPrice(updatedCartItems);

    const token = getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(`${API_URL}/products/${itemId}/carts`, null, config)
      .then(() => {
        const updatedUserInfo = {
          ...userInfo,
          carts: [...userInfo.carts, product],
        };
        updateUser(updatedUserInfo);

        localStorage.setItem(
          "cartItems",
          JSON.stringify(updatedUserInfo.carts)
        );

        fetchCartData();
      })
      .catch((error) => {
        error;
      });
  };

  const handleDecreaseQuantity = (itemId) => {
    const updatedCartItems = [...cartItems];
    const itemIndex = updatedCartItems.findIndex((item) => item._id === itemId);
    if (itemIndex !== -1) {
      if (updatedCartItems[itemIndex].quantity > 1) {
        updatedCartItems[itemIndex].quantity -= 1;
      } else {
        const userInfoItemIndex = userInfo.carts.findIndex(
          (item) => item._id === itemId
        );

        if (userInfoItemIndex !== -1) {
          const updatedUserInfoCarts = [...userInfo.carts];
          updatedUserInfoCarts.splice(userInfoItemIndex, 1);
          updateUser({ ...userInfo, carts: updatedUserInfoCarts });
        }

        updatedCartItems.splice(itemIndex, 1);
      }
    }
    setCartItems(updatedCartItems);
    calculateTotalPrice(updatedCartItems);

    axios
      .delete(`${API_URL}/carts/${itemId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then(() => {
        const userInfoItemIndex = userInfo.carts.findIndex(
          (item) => item._id === itemId
        );

        const updatedUserInfoCarts = [...userInfo.carts];
        updatedUserInfoCarts.splice(userInfoItemIndex, 1);
        updateUser({ ...userInfo, carts: updatedUserInfoCarts });

        localStorage.setItem("cartItems", JSON.stringify(updatedUserInfoCarts));

        // fetchCartData();
      })
      .catch((error) => {
        error;
      });
  };

  return (
    <div>
      <h1>Cart</h1>
      {cartItems.length === 0 ? (
        <p>No items in the cart</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <img src={item.image} alt={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>${item.price}</p>
                <p>
                  Quantity : {item.quantity}{" "}
                  <button onClick={() => handleIncreaseQuantity(item._id)}>
                    +
                  </button>
                  <button onClick={() => handleDecreaseQuantity(item._id)}>
                    -
                  </button>{" "}
                </p>
              </div>
            </li>
          ))}
          <p>Total Price: ${totalPrice.toFixed(2)}</p>

          <PayButton cartItems={cartItems} />
        </ul>
      )}
    </div>
  );
}

export default CartPage;
