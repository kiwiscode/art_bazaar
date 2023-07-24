import PaymentOptionPage from "./PaymentOptionPage";
import AddressPage from "./AddressPage";
import { useState } from "react";

function Payment() {
  const [showAddressInfo, setShowAddressInfo] = useState(true);

  const handleTabClick = (isAddressInfo) => {
    setShowAddressInfo(isAddressInfo);
  };

  return (
    <div className="payment-container">
      <div className="tab-container">
        <div
          className={`tab ${showAddressInfo ? "active" : ""}`}
          onClick={() => handleTabClick(true)}
        >
          Address Information
        </div>
        <div
          className={`tab ${!showAddressInfo ? "active" : ""}`}
          onClick={() => handleTabClick(false)}
        >
          Payment
        </div>
      </div>
      <div className="content-container">
        {showAddressInfo ? <AddressPage /> : <PaymentOptionPage />}
      </div>
    </div>
  );
}

export default Payment;
