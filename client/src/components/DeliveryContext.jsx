import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const DeliveryContext = createContext();

const DeliveryProvider = ({ children }) => {
  const [chosenArtworkToPurchase, setChosenArtworkToPurchase] = useState(
    JSON.parse(localStorage.getItem("shippingData"))?.artworkToPurchase || null
  );
  const [chosenAddress, setChosenAddress] = useState(
    JSON.parse(localStorage.getItem("shippingData"))?.shippingAddress || null
  );
  const [chosenPaymentInfo, setChosenPaymentInfo] = useState(
    JSON.parse(localStorage.getItem("shippingData"))?.paymentInfo || null
  );

  const [allDeliveryData, setAllDeliveryData] = useState(
    JSON.parse(localStorage.getItem("shippingData")) || {
      shippingAddress: "",
      paymentInfo: "",
      artworkToPurchase: "",
    }
  );

  const cleanAllDeliveryData = () => {
    setChosenArtworkToPurchase(null);
    setChosenAddress(null);
    setChosenPaymentInfo(null);
    setAllDeliveryData({
      shippingAddress: "",
      paymentInfo: "",
      artworkToPurchase: "",
    });
    localStorage.removeItem("shippingData");
  };

  useEffect(() => {
    const shippingData = {
      shippingAddress: chosenAddress,
      paymentInfo: chosenPaymentInfo,
      artworkToPurchase: chosenArtworkToPurchase,
    };
    localStorage.setItem("shippingData", JSON.stringify(shippingData));
  }, [
    chosenArtworkToPurchase,
    chosenAddress,
    chosenPaymentInfo,
    allDeliveryData,
  ]);

  return (
    <DeliveryContext.Provider
      value={{
        allDeliveryData,
        setAllDeliveryData,
        chosenArtworkToPurchase,
        setChosenArtworkToPurchase,
        chosenAddress,
        setChosenAddress,
        chosenPaymentInfo,
        setChosenPaymentInfo,
        cleanAllDeliveryData,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};

DeliveryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { DeliveryContext, DeliveryProvider };
