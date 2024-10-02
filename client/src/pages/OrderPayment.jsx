import { useLocation, useNavigate, useParams } from "react-router-dom";
import HeaderNavBar from "../components/HeaderNavBar";
import useWindowDimensions from "../../utils/useWindowDimensions";
import { useContext, useEffect, useRef, useState } from "react";
import { DeliveryContext } from "../components/DeliveryContext";
import Button from "../components/Button";
import Input from "../components/Input";
import { FaRegCreditCard } from "react-icons/fa";
import { Modal } from "@mui/material";
import { CollectorContext } from "../components/CollectorContext";

function OrderPayment() {
  const { artworkToOrder } = useParams();
  const { width } = useWindowDimensions();
  const { collectorInfo } = useContext(CollectorContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate, collectorInfo]);

  const navItems = [
    { label: "Shipping", path: `/orders/${artworkToOrder}/shipping/done` },
    { label: "Payment", path: `/orders/${artworkToOrder}/payment` },
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

  const [
    billing_and_shipping_addresses_are_the_same,
    setBilling_and_shipping_addresses_are_the_same,
  ] = useState(true);

  const [hoveredSameInfo, setHoveredSameInfo] = useState(false);

  // show test card info

  const testCardInfo = [
    `1. **Successful Payment**
         - Card Number: 4242 4242 4242 4242
         - Expiry Date: Any future date
         - CVV: 123
         - Postal Code: 12345`,

    `2. **Declined Payment**
         - Card Number: 4000 0000 0000 0002
         - Expiry Date: Any future date
         - CVV: 123
         - Postal Code: 12345`,

    `3. **Missing CVV**
         - Card Number: 4000 0000 0000 9995
         - Expiry Date: Any future date
         - CVV: (empty)
         - Postal Code: 12345`,

    `4. **Invalid Card Number**
         - Card Number: 4000 0000 0000 0000
         - Expiry Date: Any future date
         - CVV: 123
         - Postal Code: 12345`,

    `5. **Expired Card**
         - Card Number: 4000 0000 0000 0069
         - Expiry Date: Past date
         - CVV: 123
         - Postal Code: 12345`,

    `6. **Insufficient Funds**
         - Card Number: 4000 0000 0000 0127
         - Expiry Date: Any future date
         - CVV: 123
         - Postal Code: 12345`,

    `7. **3D Secure Required**
         - Card Number: 4000 0025 0000 3155
         - Expiry Date: Any future date
         - CVV: 123
         - Postal Code: 12345`,
  ];

  const [showTestCardInfoModal, setShowTestCardInfoModal] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const testCardInfoModalRef = useRef(null);

  const onCloseTestCardInfoModal = () => {
    setShowTestCardInfoModal(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const modalContent = testCardInfoModalRef.current;
      if (modalContent.scrollTop === 0) {
        setIsScrolling(false);
      } else {
        setIsScrolling(true);
      }
    };

    const modalContent = testCardInfoModalRef.current;
    if (modalContent) {
      modalContent.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (modalContent) {
        modalContent.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // before reload the site or closing the tab
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const changeToReviewTab = () => {
    setPaymentProcessing(true);

    setTimeout(() => {
      navigate(`/orders/${artworkToOrder}/review`);
    }, 500);
    setTimeout(() => {
      setPaymentProcessing(false);
    }, 600);
  };

  return (
    <>
      {/* show test card info modal */}
      <>
        <Modal
          open={showTestCardInfoModal}
          onClose={onCloseTestCardInfoModal}
          sx={{
            "& > .MuiBackdrop-root": {
              opacity: "0.5 !important",
              backgroundColor: "rgb(202, 205, 236)",
              filter: "brightness(2.5)",
              margin: 0,
              padding: 0,
            },
          }}
        >
          <div
            ref={testCardInfoModalRef}
            className=""
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxHeight: "95vh",
              width: width <= 768 ? "95%" : 600,
              backgroundColor: "white",
              outlineStyle: "none",
              overflowY: "auto",
              boxShadow:
                "0 0 15px rgba(101, 119, 134, 0.2),0 0 5px 3px rgba(101, 119, 134, 0.15)",
              overflowX: "hidden",
            }}
          >
            <div>
              <div
                style={{
                  position: "sticky",
                  top: "0",
                  overflow: "hidden",
                  zIndex: 2,
                }}
                className={
                  isScrolling
                    ? `header_modal-shipping-address-card-info scroll_active`
                    : `header_modal-shipping-address-card-info`
                }
              >
                <button
                  onClick={onCloseTestCardInfoModal}
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                    width: "58px",
                    height: "58px",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <svg width={18} height={18} viewBox="0 0 18 18">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.88006 9.00001L14.4401 13.56L13.5601 14.44L9.00006 9.88001L4.44006 14.44L3.56006 13.56L8.12006 9.00001L3.56006 4.44001L4.44006 3.56001L9.00006 8.12001L13.5601 3.56001L14.4401 4.44001L9.88006 9.00001Z"
                    ></path>
                  </svg>
                </button>

                <div
                  style={{
                    margin: "20px",
                    maxWidth: "312px",
                  }}
                >
                  <div
                    className="chirp-regular-font unica-regular-font"
                    style={{
                      fontSize: "26px",
                      lineHeight: "34px",
                    }}
                  >
                    Test card info
                  </div>
                </div>
                <div
                  className="unica-regular-font"
                  style={{
                    marginBottom: "30px",
                    padding: "0px 20px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span>
                    {
                      "Note: The information provided here is for testing purposes only with Stripe's test API. Please use these details for testing in the development environment only."
                    }
                  </span>
                  <a
                    rel="noreferrer"
                    className="hover_color_effect stripe-test-info pointer"
                    style={{
                      fontSize: "13px",
                      marginTop: "5px",
                      color: "black",
                      textDecoration: "none",
                    }}
                    href="https://docs.stripe.com/testing#cards"
                    target="_blank"
                  >
                    {" "}
                    Click here for more information about Stripe test cards and
                    testing environments.
                  </a>
                </div>
              </div>
              <div
                className="unica-regular-font"
                style={{
                  padding: "20px",
                }}
              >
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {testCardInfo.map((eachInfo, index) => {
                    return (
                      <div
                        key={index}
                        style={{
                          margin: "10px",
                        }}
                      >
                        {eachInfo}
                      </div>
                    );
                  })}
                </pre>
              </div>
            </div>
          </div>
        </Modal>
      </>
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
          Payment method
        </div>
        <div className="box-20-px-m-top"></div>
        {/* test */}
        <div className="delivery-address-form-wrapper">
          <div className="delivery-address-form-wrapper first-section-delivery-shipping">
            <>
              <div
                style={{
                  border: "1px solid rgb(231,231,231)",
                  padding: "20px",
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
                  <div
                    style={{
                      borderRadius: "50%",

                      width: "20px",
                      height: "20px",
                      backgroundColor: "black",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid rgb(231,231,231)",
                    }}
                  >
                    <div
                      style={{
                        borderRadius: "50%",
                        width: "12px",
                        height: "12px",
                        backgroundColor: "white",
                      }}
                    ></div>
                  </div>

                  <div className="hover_td_kinda_blue hover_color_effect">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <svg
                        width={18}
                        height={18}
                        x="0px"
                        y="0px"
                        viewBox="0 0 18 18"
                        xmlSpace="preserve"
                        fill="currentColor"
                      >
                        <path d="M17,3H1C0.4,3,0,3.4,0,4v10c0,0.6,0.4,1,1,1h16c0.6,0,1-0.4,1-1V4C18,3.4,17.6,3,17,3z M6.3,10.4H3.9C3.4,10.4,3,10,3,9.5 s0.4-0.9,0.9-0.9h2.4c0.5,0,0.9,0.4,0.9,0.9S6.8,10.4,6.3,10.4z M14.1,7.4H3.9C3.4,7.4,3,7,3,6.5C3,6,3.4,5.6,3.9,5.6h10.2 C14.6,5.6,15,6,15,6.5C15,7,14.6,7.4,14.1,7.4z"></path>
                      </svg>
                      <span>Credit card</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="box-40-px-m-top"
                style={{
                  fontSize: "26px",
                  lineHeight: "32px",
                }}
              >
                Payment details
              </div>
              <div className="box-20-px-m-top"></div>
              <div
                style={{
                  textDecoration: "underline",
                }}
              >
                <span
                  onClick={() => setShowTestCardInfoModal(true)}
                  className="pointer"
                >
                  Why is it disabled?
                </span>
              </div>
              <div className="box-10-px-m-top"></div>
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    flexBasis: "50%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Input
                    placeholder={"1234 1234 1234 1234"}
                    icon={<FaRegCreditCard />}
                    iconOpacity={"0.3"}
                    iconFlexPosition={"flex"}
                    iconPositionLeft={true}
                    width={"100%"}
                    maxWidth={"100%"}
                    height={"100dvh"}
                    maxHeight={"50px"}
                    wrapperWidth={"100%"}
                    wrapperHeight={"50px"}
                    disabledInput={true}
                  />
                </div>
                <div
                  style={{
                    flexBasis: "25%",
                  }}
                >
                  <Input
                    placeholder={"MM / YY"}
                    iconPositionLeft={true}
                    width={"100%"}
                    maxWidth={"100%"}
                    height={"100dvh"}
                    maxHeight={"50px"}
                    wrapperWidth={"100%"}
                    wrapperHeight={"50px"}
                    disabledInput={true}
                  />
                </div>
                <div
                  style={{
                    flexBasis: "25%",
                  }}
                >
                  <Input
                    placeholder={"CVC"}
                    iconPositionLeft={true}
                    width={"100%"}
                    maxWidth={"100%"}
                    height={"100dvh"}
                    maxHeight={"50px"}
                    wrapperWidth={"100%"}
                    wrapperHeight={"50px"}
                    disabledInput={true}
                  />
                </div>
              </div>

              <div className="box-20-px-m-top"></div>
              <div
                onMouseEnter={() => {
                  setHoveredSameInfo(true);
                  setBilling_and_shipping_addresses_are_the_same(true);
                }}
                onMouseLeave={() => {
                  setHoveredSameInfo(false);
                  setBilling_and_shipping_addresses_are_the_same(false);
                }}
                style={{
                  display: "flex",
                  cursor: "default",
                }}
              >
                <div
                  style={{
                    maxWidth: "18px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "18px",
                      backgroundColor: hoveredSameInfo
                        ? "rgb(16,35,215)"
                        : "black",
                      transition: "border 0.3s ease-in-out",
                    }}
                  >
                    <div>
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        fill={"white"}
                      >
                        <path d="M6.93608 12.206L14.5761 4.576L15.4241 5.425L6.93208 13.905L2.68408 9.623L3.53608 8.777L6.93608 12.206Z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  className="hover_color_effect hover_color_effect_t-d"
                  style={{
                    color: "rgb(112,112,112)",
                    marginLeft: "12px",
                  }}
                >
                  Billing and shipping addresses are the same
                </div>
              </div>
              <div>
                {width > 768 && (
                  <>
                    <div className="box-20-px-m-top"></div>
                    <Button
                      className="hover_bg_color_effect_white_text"
                      backgroundColor="black"
                      height="100dvh"
                      maxHeight="50px"
                      width="100%"
                      maxWidth="388px"
                      padding="1px 25px"
                      borderRadius="999px"
                      border="none"
                      pointerEvents={paymentProcessing ? "none" : "auto"}
                      cursor={paymentProcessing ? "default" : "pointer"}
                      opacity={paymentProcessing ? "0.3" : "1"}
                      loadingScenario={paymentProcessing ? true : false}
                      text="Save and Continue"
                      textColor="white"
                      fontSize="16px"
                      lineHeight="20px"
                      onClick={() => {
                        changeToReviewTab();
                      }}
                    />
                  </>
                )}
              </div>
            </>
          </div>

          {width > 768 && (
            <div className="delivery-address-form-wrapper seperator-section"></div>
          )}
          {width <= 768 && <div className="box-40-px-m-top"></div>}
          <div className="delivery-address-form-wrapper second-section-delivery-shipping">
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
                <div>Waiting for final costs</div>
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
            </div>
            <div className="box-20-px-m-top"></div>
            <div
              style={{
                padding: "20px",
                backgroundColor: "#f7f7f7",
                display: "flex",
                gap: "12px",
              }}
            >
              <div>
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="currentColor"
                >
                  <path d="M9 1.00001C11.1217 1.00001 13.1566 1.84286 14.6569 3.34315C16.1571 4.84344 17 6.87828 17 9.00001C17 11.1217 16.1571 13.1566 14.6569 14.6569C13.1566 16.1572 11.1217 17 9 17C6.87827 17 4.84344 16.1572 3.34315 14.6569C1.84285 13.1566 1 11.1217 1 9.00001C1 6.87828 1.84285 4.84344 3.34315 3.34315C4.84344 1.84286 6.87827 1.00001 9 1.00001ZM13.32 6.79601L12.556 6.01301L7.746 10.778L5.444 8.52801L4.662 9.31101L7.747 12.378L13.32 6.79601Z"></path>
                </svg>
              </div>
              <div>
                <div>Your purchase is protected.</div>
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "16px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  Learn more about{" "}
                  <span
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Art Bazaar’s buyer protection.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="third-section"
          style={{
            width: "100%",
            marginTop: "40px",
            marginBottom: "60px",
          }}
        >
          {width <= 768 && (
            <Button
              className="hover_bg_color_effect_white_text"
              backgroundColor="black"
              height="100dvh"
              maxHeight="50px"
              width="100%"
              maxWidth="100%"
              padding="1px 25px"
              borderRadius="999px"
              border="none"
              pointerEvents={paymentProcessing ? "none" : "auto"}
              cursor={paymentProcessing ? "default" : "pointer"}
              opacity={paymentProcessing ? "0.3" : "1"}
              loadingScenario={paymentProcessing ? true : false}
              text="Save and Continue"
              textColor="white"
              fontSize="16px"
              lineHeight="20px"
              onClick={() => {
                changeToReviewTab();
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default OrderPayment;
