import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../components/UserContext";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function AdressPage({ onSaveAddress }) {
  const { updateUser, userInfo } = useContext(UserContext);

  const [address, setAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    zipCode: "",
    country: "",
  });
  console.log(userInfo);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleAdressSubmit = (e) => {
    e.preventDefault();
    // Adres bilgilerini kaydetmek için API çağrısı yapabilirsiniz
    console.log("Adres bilgileri kaydedildi:", address);
    localStorage.setItem("address", JSON.stringify(address));
    saveAddress();

    if (typeof onSaveAddress === "function") {
      onSaveAddress();
    }
  };

  const saveAddress = () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const dataToSend = {
      fullName: address.fullName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      zipCode: address.zipCode,
      country: address.country,
    };
    console.log(dataToSend);

    axios
      .post(`${API_URL}/payment/save-address`, dataToSend, config)
      .then((response) => {
        const updatedUserInfo = {
          ...userInfo,
          address: {
            fullName: address.fullName,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            zipCode: address.zipCode,
            country: address.country,
          },
        };
        console.log(userInfo);

        updateUser(updatedUserInfo);
        console.log(response.data);
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        console.log(userInfo);
      })
      .catch((error) => {
        console.error("Error saving address:", error);
      });
  };
  console.log(userInfo);

  return (
    <div className="address-form">
      <div>
        <label>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={address.fullName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Address Line 1:</label>
        <input
          type="text"
          name="addressLine1"
          value={address.addressLine1}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Address Line 2:</label>
        <input
          type="text"
          name="addressLine2"
          value={address.addressLine2}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>City:</label>
        <input
          type="text"
          name="city"
          value={address.city}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Zip Code:</label>
        <input
          type="text"
          name="zipCode"
          value={address.zipCode}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Country:</label>
        <input
          type="text"
          name="country"
          value={address.country}
          onChange={handleChange}
        />
      </div>

      <button type="submit" onClick={handleAdressSubmit}>
        Save Address
      </button>
    </div>
  );
}

export default AdressPage;
