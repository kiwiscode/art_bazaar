import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../components/UserContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function CartPage() {
  // const { getToken } = useContext(UserContext);
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

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    } else {
      console.log("USER ACTIVE WITH A TOKEN");
    }

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
        console.log(response);
      })
      .catch((error) => {
        // Hata durumunda uygun işlemi yapabilirsiniz (ör. hata mesajı gösterme).
        console.log(error);
      });
  }, [getToken]);

  const handleIncreaseQuantity = (itemId) => {
    const updatedCartItems = [...cartItems];
    const itemIndex = updatedCartItems.findIndex((item) => item._id === itemId);

    if (itemIndex !== -1) {
      updatedCartItems[itemIndex].quantity += 1;
    } else {
      const newItem = cartItems.find((item) => item._id === itemId);
      updatedCartItems.push(newItem);
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
      .then((response) => {
        console.log(response);
        // yeni eklendi
        updateUser({ ...userInfo, carts: response.data.carts });
      })
      .catch((error) => {
        console.log(
          "An error occurred while adding the product to the cart:",
          error
        );
      });
  };

  const handleDecreaseQuantity = (itemId) => {
    const updatedCartItems = [...cartItems];
    const itemIndex = updatedCartItems.findIndex((item) => item._id === itemId);

    if (itemIndex !== -1) {
      if (updatedCartItems[itemIndex].quantity > 1) {
        updatedCartItems[itemIndex].quantity -= 1;
      } else {
        updatedCartItems.splice(itemIndex, 1);
      }
    }

    setCartItems(updatedCartItems);
    calculateTotalPrice(updatedCartItems);
  };

  const handleDelete = (itemId) => {
    console.log("Deleting item with ID:", itemId);

    const index = cartItems.findIndex((item) => item._id === itemId);

    if (index !== -1) {
      cartItems.splice(index, 1);
    }

    setCartItems([...cartItems]);

    axios
      .delete(`${API_URL}/carts/${itemId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log(response);
        const updatedUserInfo = { ...userInfo };
        const deletedItem = userInfo.carts.find((item) => item._id === itemId);

        if (deletedItem) {
          updatedUserInfo.carts = updatedUserInfo.carts.filter(
            (item) => item._id !== itemId
          );
          // updatedUserInfo.carts.length -= deletedItem.quantity;
          updateUser(updatedUserInfo);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(totalPrice);
  return (
    <div>
      <h1>Cart</h1>
      {cartItems.length === 0 ? (
        <p>No items in the cart</p>
      ) : (
        <ul style={{ listStyle: "none" }}>
          {cartItems.map((item) => (
            <li key={item.id}>
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
              <p>${item.price}</p>
              <p>
                Quantity : {item.quantity}{" "}
                <button onClick={() => handleDelete(item._id)}>Delete</button>{" "}
              </p>

              <button onClick={() => handleIncreaseQuantity(item._id)}>
                +
              </button>
              <button onClick={() => handleDecreaseQuantity(item._id)}>
                -
              </button>
            </li>
          ))}
          <>
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
          </>
          <button>Proceed to checkout</button>
        </ul>
      )}
    </div>
  );
}

export default CartPage;
