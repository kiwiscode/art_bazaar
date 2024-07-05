import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { Modal } from "@mui/material";
import axios from "axios";
import useWindowDimensions from "../../utils/useWindowDimensions";
const API_URL = import.meta.env.VITE_APP_API_URL;

function Main() {
  const { userInfo, getToken, updateUser } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const { width } = useWindowDimensions();
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [apiToken, setApiToken] = useState(null);
  const [slideIndex, setSlideIndex] = useState(1);
  const [rightArrowHovered, setRightArrowHovered] = useState(false);
  const [leftArrowHovered, setLeftArrowHovered] = useState(false);
  const [leftArrowOnBlured, setLeftArrowOnBlured] = useState(false);
  const [rightArrowOnBlured, setRightArrowOnBlured] = useState(false);
  const leftButtonRef = useRef(null);
  const rightButtonRef = useRef(null);
  const [scaleNumber, setScaleNumber] = useState(1);

  const retrieveApiToken = async () => {
    try {
      const result = await axios.get(`${API_URL}/api/token`);

      const { apiToken } = result.data;
      setApiToken(apiToken);
      console.log("result api token:", apiToken);
    } catch (error) {
      console.error("error:", error);
    }
  };
  useEffect(() => {
    retrieveApiToken();
  }, []);

  // api calls
  const getArtWorks = async (apiToken) => {
    try {
      const result = await axios.get(`https://api.artsy.net/api/artworks`, {
        headers: {
          "X-Xapp-Token": apiToken,
        },
      });
      console.log("result art works:", result.data);
    } catch (error) {
      console.error("error:", error.response.data);
    }
  };
  const getArtists = async (apiToken) => {
    try {
      const result = await axios.get(`https://api.artsy.net/api/artists`, {
        headers: {
          "X-Xapp-Token": apiToken,
        },
      });
      console.log("result artists:", result.data);
    } catch (error) {
      console.error("error:", error.response.data);
    }
  };

  const test = async (apiToken) => {
    try {
      const result = await axios.get(
        "https://api.artsy.net/api/artworks?artist_id=5723c839139b2113a8000619",
        {
          headers: {
            "X-Xapp-Token": apiToken,
          },
        }
      );
      console.log("result test:", result.data);
    } catch (error) {
      console.error("error:", error.response.data);
    }
  };

  useEffect(() => {
    if (apiToken) {
      getArtWorks(apiToken);
      getArtists(apiToken);
      test(apiToken);
    }
  }, [apiToken]);

  const closeWelcomeModal = async () => {
    try {
      setShowWelcomeModal(false);
      const result = await axios.patch(
        `${API_URL}/profile/${userInfo?._id}/welcome-modal-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const { status } = result;
      if (status === 200) {
        updateUser({ isWelcomeModalShowed: true });
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const user = JSON.parse(params.get("user"));

    if (token && user) {
      setLoading(true);
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(user));
      setTimeout(() => {
        navigate("/");
      }, 1000);
      setTimeout(() => {
        setLoading(false);
      }, 1250);
    }
  }, [
    location.search,
    navigate,
    token,
    location,
    userInfo,
    loading,
    location.pathname,
  ]);

  const handleClickOutside = (event) => {
    if (
      leftButtonRef.current &&
      !leftButtonRef.current.contains(event.target)
    ) {
      setLeftArrowOnBlured(true);
    }
    if (
      rightButtonRef.current &&
      !rightButtonRef.current.contains(event.target)
    ) {
      setRightArrowOnBlured(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // mouse zoom hover effect
  const [transformOrigin, setTransformOrigin] = useState("center center");

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTransformOrigin(
      `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`
    );
  };

  return (
    <>
      {/* welcome modal */}
      {!userInfo?.isWelcomeModalShowed && userInfo.active && (
        <>
          <>
            <Modal
              className="z-9999 p-0 m-0"
              open={showWelcomeModal}
              onClose={closeWelcomeModal}
              sx={{
                "& > .MuiBackdrop-root": {
                  opacity: "0.2 !important",
                },
              }}
            >
              <div
                className=""
                style={{
                  position: width > 900 ? "absolute" : "",
                  top: width > 900 ? "50%" : "",
                  left: width > 900 ? "50%" : "",
                  transform: width > 900 ? "translate(-50%, -50%)" : "",
                  minWidth: width > 900 ? "768px" : "",
                  maxHeight: width > 900 ? "800px" : "",
                  width: width <= 900 ? "100%" : 900,
                  maxHeight: width > 900 ? "90%" : "",
                  backgroundColor: "white",
                  outlineStyle: "none",
                  overflowY: "auto",
                  height: width > 900 ? "100dvh" : "100%",
                }}
              >
                {" "}
                <div
                  style={{
                    backgroundColor: "transparent",
                    position: "absolute",
                    color: "white",
                    left: "20px",
                    top: "20px",
                    zIndex: 1,
                  }}
                >
                  Logo
                </div>
                <button
                  onClick={closeWelcomeModal}
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                    width: "58px",
                    height: "58px",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "20px",
                  }}
                >
                  <svg
                    width={18}
                    height={18}
                    style={{
                      inset: "0px",
                      width: "100%",
                      height: "100%",
                      fontSize: "16px",
                    }}
                    viewBox="0 0 18 18"
                    fill="rgb(0,0,0)"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.88006 9.00001L14.4401 13.56L13.5601 14.44L9.00006 9.88001L4.44006 14.44L3.56006 13.56L8.12006 9.00001L3.56006 4.44001L4.44006 3.56001L9.00006 8.12001L13.5601 3.56001L14.4401 4.44001L9.88006 9.00001Z"
                    ></path>
                  </svg>
                </button>{" "}
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    flexDirection: width > 900 ? "row" : "column",
                  }}
                >
                  <div
                    style={{
                      flexBasis: "50%",
                      backgroundColor: "rgb(0,0,0)",
                    }}
                  >
                    <div
                      style={{
                        transform: "translateZ(0px)",
                        opacity: 1,
                        transition: "opacity 500ms ease 0s",
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        overflow: "hidden",
                        boxSizing: "border-box",
                        display: "block",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "0px",
                          left: "0px",
                          transform: "rotate(33.33deg) translate(10px, -25%)",
                          transformOrigin: "left top",
                          display: "flex",
                          boxSizing: "border-box",
                        }}
                      >
                        {/* first row */}
                        <div
                          className="parallel_row_effect"
                          style={{
                            animation:
                              "300s linear 0s infinite normal none running dkTFXd",
                            width: "250px",
                            marginLeft: "0px",
                            boxSizing: "border-box",
                            display: "block",
                            backgroundColor: "rgb(0,0,0)",
                          }}
                        >
                          {/* first repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                            />
                          </div>
                          {/* second repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                            />
                          </div>
                          {/* third repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                            />
                          </div>
                          {/* fourth repeat */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                            />
                          </div>
                          {/* fifth repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                            />
                          </div>
                          {/* sixth repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                            />
                          </div>
                          {/* seventh repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                            />
                          </div>
                          {/* eighth repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                            />
                          </div>
                          {/* ninth repeat */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                            />
                          </div>
                          {/* tenth repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                            />
                          </div>
                          {/* eleventh repeat */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                            />
                          </div>
                          {/* twelveth repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwarhol-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fwang-grid.jpg&width=500"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkatz-grid.jpg&width=500"
                            />
                          </div>
                          {/* done  */}
                        </div>
                        {/* second row  */}
                        <div
                          className="parallel_row_effect"
                          style={{
                            animation:
                              "300s linear 0s infinite normal none running btfwbI",
                            width: "250px",
                            marginLeft: "20px",
                            boxSizing: "border-box",
                            display: "block",
                            backgroundColor: "rgb(0,0,0)",
                          }}
                        >
                          {/* first repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=500 2x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=500 2x"
                            />
                          </div>
                          {/* second repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=500 2x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=500 2x"
                            />
                          </div>
                          {/* third repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=500 2x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=500 2x"
                            />
                          </div>
                          {/* fourth repeat */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=500 2x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=500 2x"
                            />
                          </div>
                          {/* fifth repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=500 2x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=500 2x"
                            />
                          </div>
                          {/* sixth repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=500 2x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=500 2x"
                            />
                          </div>
                          {/* seventh repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=500 2x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=500 2x"
                            />
                          </div>
                          {/* eighth repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=500 2x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=500 2x"
                            />
                          </div>
                          {/* ninth repeat */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=500 2x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=500 2x"
                            />
                          </div>
                          {/* tenth repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=500 2x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=500 2x"
                            />
                          </div>
                          {/* eleventh repeat */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=500 2x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=500 2x"
                            />
                          </div>
                          {/* twelveth repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fkahlo-grid.jpg&width=500 2x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fhirst-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=250 1x, https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Ffuture-kid-grid.jpg&width=500 2x"
                            />
                          </div>
                          {/* done  */}
                        </div>
                        {/* third row  */}
                        <div
                          className="parallel_row_effect"
                          style={{
                            animation:
                              "300s  linear 0s infinite normal none running dkTFXd",
                            width: "250px",
                            marginLeft: "20px",
                            boxSizing: "border-box",
                            display: "block",
                            backgroundColor: "rgb(0,0,0)",
                          }}
                        >
                          {/* first repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=500%202x"
                            />
                          </div>
                          {/* second repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=500%202x"
                            />
                          </div>
                          {/* third repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=500%202x"
                            />
                          </div>
                          {/* fourth repeat */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=500%202x"
                            />
                          </div>
                          {/* fifth repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=500%202x"
                            />
                          </div>
                          {/* sixth repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=500%202x"
                            />
                          </div>
                          {/* seventh repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=500%202x"
                            />
                          </div>
                          {/* eighth repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=500%202x"
                            />
                          </div>
                          {/* ninth repeat */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=500%202x"
                            />
                          </div>
                          {/* tenth repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=500%202x"
                            />
                          </div>
                          {/* eleventh repeat */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=500%202x"
                            />
                          </div>
                          {/* twelveth repeat  */}
                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fcohn-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fadesina-grid.jpg&width=500%202x"
                            />
                          </div>

                          <div
                            style={{
                              aspectRatio: "300/400",
                              maxWidth: "100%",
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "20px",
                              backgroundColor: "rgb(112,112,112)",
                              boxSizing: "border-box",
                              display: "block",
                            }}
                          >
                            <img
                              width={"100%"}
                              height={"100%"}
                              style={{
                                boxSizing: "border-box",
                                overflowClipMargin: "content-box",
                                overflow: "clip",
                              }}
                              src="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250"
                              alt=""
                              srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=333&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=250%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=666&quality=80&resize_to=fill&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fboafo-grid.jpg&width=500%202x"
                            />
                          </div>
                          {/* done  */}
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div
                    style={{
                      flexBasis: "50%",
                      marginTop: width > 900 ? "35px" : "",
                    }}
                  >
                    <div
                      style={{
                        padding: "40px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxSizing: "border-box",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                        }}
                      >
                        <div
                          className="unica-regular-font"
                          style={{
                            fontSize: "60px",
                            lineHeight: "70px",
                            letterSpacing: "-0.01em",
                            maxWidth: "100%",
                            whiteSpace: "break-spaces",
                          }}
                        >
                          Welcome to Art Bazaar, {userInfo.name}.
                        </div>
                        <div
                          style={{
                            marginTop: "40px",
                          }}
                        ></div>
                        <div
                          className="unica-regular-font"
                          style={{
                            fontSize: "26px",
                            lineHeight: "32px",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          Ready to find art you love? Start building your
                          profile and tailor Artsy to your tastes.{" "}
                        </div>
                      </div>
                      {width > 900 && (
                        <div
                          style={{
                            marginTop: "40px",
                            marginBottom: "40px",
                          }}
                        ></div>
                      )}
                      <button
                        className={
                          "pointer hover_bg_color_effect_white_text unica-regular-font "
                        }
                        style={{
                          minHeight: "50px",
                          border: "none",
                          backgroundColor: "black",
                          color: "white",
                          borderRadius: "9999px",
                          width: "100%",
                          marginTop: "12px",
                          fontSize: "16px",
                          opacity: "1",
                        }}
                      >
                        Get Started
                      </button>
                      <button
                        onClick={closeWelcomeModal}
                        className={
                          "pointer hover_effect_transparent_btn unica-regular-font "
                        }
                        style={{
                          minHeight: "50px",
                          border: "none",
                          backgroundColor: "transparent",
                          color: "black",
                          borderRadius: "9999px",
                          width: "100%",
                          fontSize: "16px",
                          opacity: "1",
                          marginTop: "12px",
                        }}
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </>
        </>
      )}
      <div
        style={{
          height: "100dvh",
          width: "100%",
        }}
      >
        {loading ? (
          <div
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              top: "50%",
            }}
          >
            <LoadingSpinner outsidebtnloading></LoadingSpinner>
          </div>
        ) : (
          // main page
          <div
            style={{
              height: "100dvh",
              width: "100%",
              overflowX: "hidden",
            }}
          >
            {/* slider  */}
            <div
              style={{
                display: "flex",
                width: "100%",
              }}
            >
              <div
                style={{
                  minHeight: "500px",
                  transform:
                    slideIndex === 2 ? "translateX(-200%)" : "translateX(0%)",
                  transition: "transform 500ms ease 0s",
                  minWidth: "50%",
                }}
              >
                <img
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    overflowClipMargin: "content-box",
                    overflow: "clip",
                    boxSizing: "border-box",
                  }}
                  src="https://d7hftxdivxxvm.cloudfront.net/?height=1000&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2Fy6jedHuxQ_9wZyII3K-QAw%2Fmain.jpg&width=2540"
                  srcset="https://d7hftxdivxxvm.cloudfront.net?height=500&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2Fy6jedHuxQ_9wZyII3K-QAw%2Fmain.jpg&width=1270 1x, https://d7hftxdivxxvm.cloudfront.net?height=1000&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2Fy6jedHuxQ_9wZyII3K-QAw%2Fmain.jpg&width=2540 2x"
                  alt=""
                />
              </div>
              <div
                style={{
                  minHeight: "500px",
                  backgroundColor: "#F7F7F7",
                  transform:
                    slideIndex === 2 ? "translateX(-200%)" : "translateX(0%)",
                  transition: "transform 500ms ease 0s",
                  minWidth: "50%",
                }}
              >
                b
              </div>

              <div
                style={{
                  minHeight: "500px",
                  transform:
                    slideIndex === 1 ? "translateX(200%)" : "translateX(-200%)",
                  transition: "transform 500ms ease 0s",
                  minWidth: "50%",
                }}
              >
                c
              </div>
              <div
                style={{
                  minHeight: "500px",
                  backgroundColor: "#F7F7F7",
                  transform:
                    slideIndex === 1 ? "translateX(200%)" : "translateX(-200%)",
                  transition: "transform 500ms ease 0s",
                  minWidth: "50%",
                }}
              >
                d
              </div>
            </div>

            {/* slider station */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                gap: "12px",
                margin: "12px 36px",
                alignItems: "center",
              }}
            >
              <div
                onClick={() => {
                  setLeftArrowOnBlured(false);
                  if (slideIndex === 2 && slideIndex !== 1) {
                    setSlideIndex(1);
                  } else {
                    setSlideIndex(2);
                  }
                }}
                style={{
                  flexBasis: "40%",
                  cursor: "pointer",
                  height: "100%",
                  height: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      slideIndex === 2 ? "rgb(202, 205, 236)" : "rgb(0,0,0)",
                    height: "1px",
                    transition: "background-color 250ms ease 0s",
                    width: "100%",
                  }}
                ></div>
              </div>
              <div
                onClick={() => {
                  setRightArrowOnBlured(false);
                  if (slideIndex === 2 && slideIndex !== 1) {
                    setSlideIndex(1);
                  } else {
                    setSlideIndex(2);
                  }
                }}
                style={{
                  flexBasis: "40%",
                  cursor: "pointer",
                  height: "100%",
                  height: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    height: "1px",
                    backgroundColor:
                      slideIndex === 1 ? "rgb(202, 205, 236)" : "rgb(0,0,0)",
                    transition: "background-color 250ms ease 0s",
                    width: "100%",
                  }}
                ></div>
              </div>
              {width > 900 && (
                <>
                  <button
                    ref={leftButtonRef}
                    onMouseEnter={() => setLeftArrowHovered(true)}
                    onMouseLeave={() => setLeftArrowHovered(false)}
                    onClick={() => {
                      setLeftArrowOnBlured(false);
                      if (slideIndex === 2 && slideIndex !== 1) {
                        setSlideIndex(1);
                      } else {
                        setSlideIndex(2);
                      }
                    }}
                    style={{
                      backgroundColor: "#FFFFFF",
                      width: "50px",
                      height: "50px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                      transition:
                        "opacity 250ms ease 0s, color 250ms ease 0s, border-color 250ms ease 0s, box-shadow 0.25s ease 0s",
                      border:
                        slideIndex === 1 && !leftArrowOnBlured
                          ? "1px solid  rgb(3, 108, 219)"
                          : "1px solid rgb(247, 247, 247)",
                      boxShadow:
                        leftArrowHovered &&
                        "rgba(0, 0, 0, 0.1) 0px 2px 10px 0px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <svg
                        width={15}
                        height={15}
                        viewBox="0 0 18 18"
                        fill="rgb(112,112,112)"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12.0601 15.94L5.12012 9L12.0601 2.06L12.9401 2.94L6.88012 9L12.9401 15.06L12.0601 15.94Z"
                        ></path>
                      </svg>
                    </div>
                  </button>
                  <button
                    ref={rightButtonRef}
                    onMouseEnter={() => setRightArrowHovered(true)}
                    onMouseLeave={() => setRightArrowHovered(false)}
                    onClick={() => {
                      setRightArrowOnBlured(false);
                      if (slideIndex === 2 && slideIndex !== 1) {
                        setSlideIndex(1);
                      } else {
                        setSlideIndex(2);
                      }
                    }}
                    style={{
                      backgroundColor: "#FFFFFF",
                      width: "50px",
                      height: "50px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                      transition:
                        "opacity 250ms ease 0s, color 250ms ease 0s, border-color 250ms ease 0s, box-shadow 0.25s ease 0s",
                      border:
                        slideIndex === 2 && !rightArrowOnBlured
                          ? "1px solid  rgb(3, 108, 219)"
                          : "1px solid rgb(247, 247, 247)",
                      boxShadow:
                        rightArrowHovered &&
                        "rgba(0, 0, 0, 0.1) 0px 2px 10px 0px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <svg
                        width={15}
                        height={15}
                        viewBox="0 0 18 18"
                        fill="rgb(112,112,112)"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M5.94006 15.94L5.06006 15.06L11.1201 8.99999L5.06006 2.93999L5.94006 2.05999L12.8801 8.99999L5.94006 15.94Z"
                        ></path>
                      </svg>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div className="zoom-container">
          <img
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setScaleNumber(1.75)}
            onMouseLeave={() => setScaleNumber(1)}
            className="zoom"
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: transformOrigin,
              transform: `scale(${scaleNumber})`,
              transition:
                "transform 0.15s,transform-origin 100ms,opacity 0.25s",
              objectFit: "cover",
              opacity: 1,
            }}
            src="https://d7hftxdivxxvm.cloudfront.net/?height=767&quality=80&resize_to=fit&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FKkbQ2mMimaPBAKtFBL_ctQ%2Flarger.jpg&width=445"
            alt=""
          />
        </div>
      </div>
    </>
  );
}

export default Main;
