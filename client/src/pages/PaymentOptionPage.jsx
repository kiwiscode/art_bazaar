import { useState, useContext } from "react";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";
import { UserContext } from "../components/UserContext";

const API_URL = "http://localhost:3000";

const stripeKey =
  "pk_test_51NX7Y1AProtn5sKlnKh1Xwfjp50MuJwgx7dBTTaTlnYk9TurRZIn2LejRjs5PkKf63nl7VuBcZGkp9RFUIOjYZcj00HwExnjoZ";

function PaymentOptions() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const { getToken, userInfo } = useContext(UserContext);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  console.log(userInfo);
  const handlePaymentSubmit = (token) => {
    const products = userInfo.carts.map((cartItem) => ({
      _id: cartItem._id,
      quantity: cartItem.quantity,
      price: cartItem.price,
    }));

    const dataToSend = {
      fullName: userInfo.address.fullName,
      addressLine1: userInfo.address.addressLine1,
      addressLine2: userInfo.address.addressLine2,
      city: userInfo.address.city,
      zipCode: userInfo.address.zipCode,
      country: userInfo.address.country,
      cardToken: token.id,
      products: products,
    };
    console.log(dataToSend.cardToken);
    console.log(dataToSend.products);
    axios
      .post(`${API_URL}/payment/create-payment`, dataToSend, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        // Ödeme başarılı olduğunda yapılacak işlemleri burada gerçekleştirebilirsiniz
      })
      .catch((error) => {
        console.error("Error creating payment:", error);
      });
  };

  return (
    <div className="payment-options">
      <button onClick={() => setShowPopup(true)}>Pay with Card</button>
      {showPopup && (
        <div className="popup">
          <form>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <StripeCheckout
              stripeKey={stripeKey}
              token={handlePaymentSubmit}
              email={userInfo.email}
              amount={100}
              currency="USD"
            />
          </form>
        </div>
      )}
    </div>
  );
}

export default PaymentOptions;
