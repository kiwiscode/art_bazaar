import { useLocation, useNavigate, useParams } from "react-router-dom";
import HeaderNavBar from "../components/HeaderNavBar";
import useWindowDimensions from "../../utils/useWindowDimensions";
import { useContext, useEffect, useState } from "react";
import { DeliveryContext } from "../components/DeliveryContext";
import Button from "../components/Button";
import { CollectorContext } from "../components/CollectorContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

function OrderReview() {
  const { artworkToOrder } = useParams();
  const { getToken, collectorInfo } = useContext(CollectorContext);
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate, collectorInfo]);

  const navItems = [
    { label: "Shipping", path: `/orders/${artworkToOrder}/shipping/done` },
    { label: "Payment", path: `/orders/${artworkToOrder}/payment/done` },
    { label: "Review", path: `/orders/${artworkToOrder}/review` },
  ];

  // delivery context infos
  const {
    allDeliveryData,
    setAllDeliveryData,
    chosenArtworkToPurchase,
    setChosenArtworkToPurchase,
    chosenAddress,
    setChosenAddress,
    chosenPaymentInfo,
    setChosenPaymentInfo,
    cleanAllDeliveryData,
  } = useContext(DeliveryContext);

  // redirect to stripe
  const [purchaseProcessing, setPurchaseProcessing] = useState(false);
  // before reload the site or closing the tab
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (purchaseProcessing) {
        return;
      }
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [purchaseProcessing]);

  const buyNow = async () => {
    setPurchaseProcessing(true);
    try {
      const result = await axios.post(
        `${API_URL}/purchase/artworks/${artworkToOrder}/collectors/${collectorInfo?._id}/purchase`,
        {
          allDeliveryData,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      "result:", result;
      setTimeout(() => {
        if (result.data.url) {
          window.location.href = result.data.url;
        }
      }, 1000);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return (
    <>
      <div className="box-40-px-m-top"></div>
      <div className="shipping-header-wrapper unica-regular-font">
        <svg
          width="60"
          height="60"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Arka Plan  */}
          <rect width="100" height="100" fill="#f5f5f5" />
          {/* Sanat Figürü */}
          <circle cx="50" cy="50" r="30" fill="#FF6347" />
          {/* Çizgi  */}
          <line x1="20" y1="20" x2="80" y2="80" stroke="#333" strokeWidth="3" />
          {/* Yazı  */}
          <text
            x="50"
            y="95"
            fontSize="16"
            textAnchor="middle"
            fill="#333"
            className="unica-regular-font"
          >
            Art Bazaar
          </text>{" "}
        </svg>
        <div className="box-40-px-m-top"></div>
        <div className="shipping-navigation">
          <HeaderNavBar
            wrapperMargin={width <= 768 ? "0px" : "0px 0px"}
            responsivePadding={width > 768 && "0px 20px"}
            items={navItems}
            currentPath={location.pathname}
            width={width}
            isPurchaseRelated={true}
          />
        </div>
        <div
          className="box-40-px-m-top"
          style={{
            fontSize: "26px",
            lineHeight: "32px",
          }}
        >
          Review your purchase
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12,1fr)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gridColumn: width <= 769 ? "span 12" : "span 7",
            }}
          >
            <div
              style={{
                border: "1px solid rgb(231,231,231)",
                padding: "10px",
              }}
              className="box-40-px-m-top"
            >
              <span
                style={{
                  fontSize: "16px",
                  lineHeight: "20px",
                }}
              >
                Delivery address
              </span>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className="hover_td_kinda_blue">
                    <div>Name: {chosenAddress?.fullName}</div>
                    <div
                      style={{
                        color: "rgb(112,112,112)",
                      }}
                    >
                      Address Line 1: {chosenAddress?.addressLine1}
                    </div>
                    <div
                      style={{
                        color: "rgb(112,112,112)",
                      }}
                    >
                      Address Line 2:
                      {chosenAddress?.addressLine2
                        ? chosenAddress.addressLine2
                        : null}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        color: "rgb(112,112,112)",
                        gap: "5px",
                      }}
                    >
                      <div>City: {chosenAddress?.city},</div>
                      <div>
                        State, provinence or region:{" "}
                        {chosenAddress?.state_provinence_or_region},
                      </div>
                      <div>Country: {chosenAddress?.country}</div>
                      <div>Postal Code: {chosenAddress?.postalCode}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "24px",
                flexDirection: width <= 768 && "column",
              }}
            >
              <div
                className="box-40-px-m-top"
                style={{
                  flexBasis: "50%",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    lineHeight: "20px",
                  }}
                >
                  Payment method
                </span>
                <div
                  style={{
                    marginTop: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  Credit Card
                </div>
              </div>
              <div
                className="box-40-px-m-top"
                style={{
                  flexBasis: "50%",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    lineHeight: "20px",
                  }}
                >
                  Payment details
                </span>
                <div
                  style={{
                    marginTop: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  [...paymentDetails]
                </div>
              </div>
            </div>
            {width > 768 && (
              <div
                style={{
                  marginTop: "40px",
                }}
              >
                <Button
                  className="hover_bg_color_effect_black_text"
                  backgroundColor="black"
                  height="100dvh"
                  maxHeight="50px"
                  maxWidth="100%"
                  width="100%"
                  padding="1px 25px"
                  borderRadius="9999px"
                  pointerEvents={purchaseProcessing ? "none" : "auto"}
                  opacity={purchaseProcessing ? "0.3" : "1"}
                  cursor={purchaseProcessing ? "default" : "pointer"}
                  text="Buy now"
                  textColor="white"
                  fontSize="16px"
                  lineHeight="20px"
                  onClick={() => {
                    buyNow();
                  }}
                  loadingScenario={purchaseProcessing}
                />
              </div>
            )}
          </div>
          <div
            style={{
              gridColumn: "span 1",
            }}
          ></div>
          <div
            className="box-40-px-m-top"
            style={{
              gridColumn: width <= 768 ? "span 12" : "span 4",
            }}
          >
            <div className="wrapper-delivery-shipping-right-side">
              <div className="paddingle-delivery-right-side">
                {chosenArtworkToPurchase?.creator}
              </div>
              <div
                style={{
                  color: "rgb(112,112,112)",
                }}
                className="paddingle-delivery-right-side"
              >
                {chosenArtworkToPurchase?.title}
              </div>
              <div
                style={{
                  color: "rgb(112,112,112)",
                }}
                className="paddingle-delivery-right-side"
              >
                {chosenArtworkToPurchase?.category}
              </div>
              <div
                className="dflex"
                style={{
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    color: "rgb(112,112,112)",
                  }}
                  className="paddingle-delivery-right-side"
                >
                  {chosenArtworkToPurchase?.aboutTheWork?.medium}
                </div>
                <div
                  style={{
                    color: "rgb(112,112,112)",
                  }}
                  className="paddingle-delivery-right-side"
                >
                  {chosenArtworkToPurchase?.aboutTheWork?.size}
                </div>
              </div>
              <div className="paddingle-delivery-right-side">Price $?€?£?</div>
              <div className="paddingle-delivery-right-side">
                {chosenArtworkToPurchase?.aboutTheWork?.imageRights}
              </div>
              <div
                style={{
                  marginTop: "20px",
                }}
              ></div>
              <div
                style={{
                  borderBottom: "1px solid rgb(231,231,231)",
                }}
              ></div>
              <div
                style={{
                  justifyContent: "space-between",
                  color: "rgb(112,112,112)",
                }}
                className="paddingle-delivery-right-side dflex"
              >
                <div>Price</div>
                <div>$?€?£?</div>
              </div>
              <div
                style={{
                  justifyContent: "space-between",
                  color: "rgb(112,112,112)",
                }}
                className="paddingle-delivery-right-side dflex"
              >
                <div>Shipping</div>
                <div>Calculated in next steps</div>
              </div>
              <div
                style={{
                  justifyContent: "space-between",
                  color: "rgb(112,112,112)",
                }}
                className="paddingle-delivery-right-side dflex"
              >
                <div>Tax*</div>
                <div>Calculated in next steps</div>
              </div>
              <div
                style={{
                  justifyContent: "space-between",
                }}
                className="paddingle-delivery-right-side dflex"
              >
                <div>Total</div>
                {/* <div>Waiting for final costs</div> */}
                <div>$?€?£?</div>
              </div>
              <div
                style={{
                  color: "rgb(112,112,112)",
                }}
                className="paddingle-delivery-right-side"
              >
                *Additional duties and taxes{" "}
                <span
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  may apply at import.
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  marginTop: "20px",
                }}
              >
                <img
                  style={{
                    width: width <= 768 ? "100%" : "100%",
                    height: width <= 768 ? "300px" : "100%",
                    objectFit: "contain",
                  }}
                  src={chosenArtworkToPurchase.imageUrl}
                  alt=""
                />
              </div>
            </div>
            {width <= 768 && (
              <div
                style={{
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              >
                <Button
                  className="hover_bg_color_effect_black_text"
                  backgroundColor="black"
                  height="100dvh"
                  maxHeight="50px"
                  maxWidth="100%"
                  width="100%"
                  padding="1px 25px"
                  borderRadius="9999px"
                  pointerEvents={purchaseProcessing ? "none" : "auto"}
                  opacity={purchaseProcessing ? "0.3" : "1"}
                  cursor={purchaseProcessing ? "default" : "pointer"}
                  text="Buy now"
                  textColor="white"
                  fontSize="16px"
                  lineHeight="20px"
                  onClick={() => {
                    buyNow();
                  }}
                  loadingScenario={purchaseProcessing}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderReview;
