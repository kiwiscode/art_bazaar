import { useLocation, useNavigate } from "react-router-dom";
import useWindowDimensions from "../../utils/useWindowDimensions";
import Footer from "../components/Footer";
import HeaderNavBar from "../components/HeaderNavBar";
import { CollectorContext } from "../components/CollectorContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function EditProfilePurchases() {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { collectorInfo } = useContext(CollectorContext);
  const location = useLocation();
  const navItems = [
    { label: "Edit Profile", path: "/settings/edit-profile" },
    { label: "Account Settings", path: "/settings/edit-settings" },
    { label: "Order History", path: "/settings/purchases" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate, collectorInfo]);

  // get orders
  const [orders, setOrders] = useState([]);
  const getOrders = async () => {
    try {
      const result = await axios.get(
        `${API_URL}/collectors/${collectorInfo?._id}/orders`
      );

      setOrders(result.data);
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    if (collectorInfo) {
      getOrders();
    }
  }, [collectorInfo]);
  const handleArtistClick = (artistName) => {
    const formattedName = artistName.toLowerCase().replace(/ /g, "-");
    navigate(`/artist/${formattedName}`);
  };
  return (
    <>
      {/* custom saves page header */}
      <div className="saves-header-wrapper unica-regular-font">
        {/* profile back banner */}
        <div className="profile-back-banner">
          <div className="box-20-px-m-top"></div>
          <div
            onClick={() => navigate("/collector-profile/my-collection")}
            style={{
              gap: "10px",
              fontSize: "13px",
              lineHeight: "1px",
              display: "inline-flex",
              alignItems: "center",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            <svg width={18} height={14} viewBox="0 0 18 18" fill="currentColor">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.0601 15.94L5.12012 9L12.0601 2.06L12.9401 2.94L6.88012 9L12.9401 15.06L12.0601 15.94Z"
              ></path>
            </svg>
            <span>Profile</span>
          </div>
          <div className="box-20-px-m-top"></div>
        </div>
        {width <= 768 ? (
          <div className="box-20-px-m-top"></div>
        ) : (
          <div className="box-40-px-m-top"></div>
        )}
        <div
          className="favorite-text-header"
          style={{
            letterSpacing: "-0.01em",
            fontSize: width <= 768 ? "26px" : "60px",
            lineHeight: width <= 768 ? "32px" : "70px",
          }}
        >
          Settings
        </div>
        {width <= 768 ? (
          <div className="box-20-px-m-top"></div>
        ) : (
          <div className="box-60-px-m-top"></div>
        )}
      </div>
      <HeaderNavBar
        wrapperMargin={width <= 768 ? "0px" : "0px 40px"}
        responsivePadding={"0px 20px"}
        items={navItems}
        currentPath={location.pathname}
        width={width}
      />
      {width <= 768 ? (
        <div className="box-20-px-m-top"></div>
      ) : (
        <div className="box-40-px-m-top"></div>
      )}

      {/* order history */}
      <div className="orders-wrapper-settings-page unica-regular-font">
        {orders.length < 1 ? (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f7f7f7",
              color: "rgb(112,112,112)",
            }}
          >
            No orders
          </div>
        ) : (
          <div className="orders-wrapper-detailed-orders">
            {orders.map((eachOrder, eachOrderIndex) => {
              return (
                <div
                  key={eachOrderIndex}
                  onClick={() =>
                    navigate(`/artwork/${eachOrder?.artworkToPurchase.urlName}`)
                  }
                  className="orders-wrapper-detailed-orders-detail"
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    style={{
                      display: "flex",
                      gap: "12px",
                    }}
                  >
                    <div
                      className="pointer"
                      onClick={() =>
                        navigate(
                          `/artwork/${eachOrder?.artworkToPurchase.urlName}`
                        )
                      }
                    >
                      <div
                        style={{
                          maxWidth: "200px",
                          width: "100%",
                          maxHeight: "200px",
                          height: "100dvh",
                        }}
                      >
                        <img
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          src={eachOrder?.artworkToPurchase.imageUrl}
                          alt=""
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        lineHeight: "16px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            color: "rgb(112,112,112)",
                            cursor: "default",
                          }}
                        >
                          From:
                        </span>{" "}
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArtistClick(
                              eachOrder?.artworkToPurchase.creator
                            );
                          }}
                          className="hover_color_effect pointer hover_color_effect_t-d"
                        >
                          {eachOrder?.artworkToPurchase.creator}
                        </span>
                      </div>
                      <div
                        style={{
                          cursor: "default",
                        }}
                      >
                        <span
                          style={{
                            color: "rgb(112,112,112)",
                          }}
                        >
                          Medium:
                        </span>{" "}
                        <span>
                          {eachOrder?.artworkToPurchase.aboutTheWork.medium}
                        </span>
                      </div>
                      <div
                        style={{
                          cursor: "default",
                        }}
                      >
                        <span
                          style={{
                            color: "rgb(112,112,112)",
                          }}
                        >
                          Title:
                        </span>{" "}
                        <span>{eachOrder?.artworkToPurchase.title}</span>
                      </div>
                      <div
                        style={{
                          cursor: "default",
                        }}
                      >
                        <span
                          style={{
                            color: "rgb(112,112,112)",
                          }}
                        >
                          Size:
                        </span>{" "}
                        <span>
                          {eachOrder?.artworkToPurchase.aboutTheWork.size}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default EditProfilePurchases;
