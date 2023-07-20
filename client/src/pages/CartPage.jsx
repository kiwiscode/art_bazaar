import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../components/UserContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

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
        console.log(error);
      });
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    } else {
      console.log("USER ACTIVE WITH A TOKEN");
    }

    // İlk yükleme sırasında ve her post/delete işleminden sonra güncel verileri alma
    fetchCartData();
  }, [getToken]);

  const handleIncreaseQuantity = (itemId) => {
    const updatedCartItems = [...cartItems];
    const itemIndex = updatedCartItems.findIndex((item) => item._id === itemId);
    const product = updatedCartItems.find((item) => item._id === itemId);

    console.log(itemIndex);
    console.log(product);
    if (itemIndex !== -1) {
      const newItem = cartItems.find((item) => item._id === itemId);
      updatedCartItems[itemIndex].quantity += 1;
      updatedCartItems.push(newItem);
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
    console.log(cartItems);
    axios
      .post(`${API_URL}/products/${itemId}/carts`, null, config)
      .then(() => {
        const updatedUserInfo = {
          ...userInfo,
          carts: [...userInfo.carts, product],
        };
        updateUser(updatedUserInfo);
        console.log(updatedUserInfo);
        console.log(updatedUserInfo.carts);
        console.log(updatedCartItems);

        localStorage.setItem(
          "cartItems",
          JSON.stringify(updatedUserInfo.carts)
        );

        // fetchCartData();
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
    const product = updatedCartItems.find((item) => item._id === itemId);

    console.log(itemIndex);
    console.log(product);
    if (itemIndex !== -1) {
      console.log("function called");
      if (updatedCartItems[itemIndex].quantity > 1) {
        console.log("function is called: ");
        updatedCartItems[itemIndex].quantity -= 1;
      } else {
        console.log("hello world 1");
        const userInfoItemIndex = userInfo.carts.findIndex(
          (item) => item._id === itemId
        );
        console.log("hello world 2");

        if (userInfoItemIndex !== -1) {
          const updatedUserInfoCarts = [...userInfo.carts];
          updatedUserInfoCarts.splice(userInfoItemIndex, 1);
          updateUser({ ...userInfo, carts: updatedUserInfoCarts });
          console.log("hello world 3");
        }

        updatedCartItems.splice(itemIndex, 1);
        console.log("hello world 4");
      }
    }
    setCartItems(updatedCartItems);
    calculateTotalPrice(updatedCartItems);
    console.log(updatedCartItems);

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
        console.log("hello world 3");
        // const updatedUserInfo = {
        //   ...userInfo,
        //   // carts: [...userInfo.carts, product],

        // };
        // updateUser(updatedUserInfo);

        // localStorage.setItem(
        //   "cartItems",
        //   JSON.stringify(updatedUserInfo.carts)
        // );

        fetchCartData();
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(updatedCartItems);

    console.log(userInfo.carts);
    console.log(userInfo);
    console.log("NAVBAR CARTS LENGTH : ", userInfo.carts.length);
    console.log("CART PAGE CARTS LENGTH: ", cartItems.length);
    console.log(cartItems);
  };

  // Diğer fonksiyonlar burada...

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
                {/* <button onClick={() => handleDelete(item._id)}>Delete</button>{" "} */}
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
