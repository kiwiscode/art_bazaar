import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { Modal } from "@mui/material";
import axios from "axios";
import useWindowDimensions from "../../utils/useWindowDimensions";
import { CollectorContext } from "../components/CollectorContext";
import Footer from "../components/Footer";
const API_URL = import.meta.env.VITE_APP_API_URL;

function Main() {
  const { collectorInfo, getToken, updateCollector } =
    useContext(CollectorContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const { width } = useWindowDimensions();
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [slideIndex, setSlideIndex] = useState(1);
  const [rightArrowHovered, setRightArrowHovered] = useState(false);
  const [leftArrowHovered, setLeftArrowHovered] = useState(false);
  const [leftArrowOnBlured, setLeftArrowOnBlured] = useState(false);
  const [rightArrowOnBlured, setRightArrowOnBlured] = useState(false);
  const leftButtonRef = useRef(null);
  const rightButtonRef = useRef(null);
  const [scaleNumber, setScaleNumber] = useState(1);
  const [welcomeModalTabIndex, setWelcomeModalTabIndex] = useState(1);
  const [loveCollectingArt, setLoveCollectingArt] = useState(false);
  const [justStartingOut, setJustStartingOut] = useState(false);

  const [answersTab2, setAnswersTab2] = useState({
    developingMyArtTastes: false,
    keepingTrackOfArtIamInterestedIn: false,
    findingMyNextGreatInvestment: false,
    collectingArtThatMovesMe: false,
  });
  const [answersTab3, setAnswersTab3] = useState({
    takeTheArtTasteQuiz: false,
    exploreTopAuctionLots: false,
    artistsOnTheRise: false,
    browseAcuratedCollection: false,
  });

  const [
    opacityAnimationActivForFirstTab,
    setOpacityAnimationActiveForFirstTab,
  ] = useState(false);
  const [
    opacityAnimationActivForSecondTab,
    setOpacityAnimationActiveForSecondTab,
  ] = useState(false);
  const [
    opacityAnimationActivForThirdTab,
    setOpacityAnimationActivForThirdTab,
  ] = useState(false);
  const [
    opacityAnimationActivForFourthTab,
    setOpacityAnimationActivForFourthTab,
  ] = useState(false);
  const [tabNextTrue, setTabNextTrue] = useState(false);

  const closeWelcomeModal = async () => {
    try {
      setShowWelcomeModal(false);
      const result = await axios.patch(
        `${API_URL}/collectors/${collectorInfo?._id}/welcome-modal-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const { status } = result;
      if (status === 200) {
        updateCollector({ isWelcomeModalShowed: true });
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const collector = JSON.parse(params.get("collector"));

    if (token && collector) {
      setLoading(true);
      localStorage.setItem("token", token);
      localStorage.setItem("collectorInfo", JSON.stringify(collector));
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
    collectorInfo,
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
      {!collectorInfo?.isWelcomeModalShowed && collectorInfo.active && (
        <>
          <>
            <Modal
              open={showWelcomeModal}
              onClose={closeWelcomeModal}
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
                  boxShadow:
                    "0 0 15px rgba(101, 119, 134, 0.2),0 0 5px 3px rgba(101, 119, 134, 0.15)",
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
                {/* progress bar welcome modal  */}
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
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.88006 9.00001L14.4401 13.56L13.5601 14.44L9.00006 9.88001L4.44006 14.44L3.56006 13.56L8.12006 9.00001L3.56006 4.44001L4.44006 3.56001L9.00006 8.12001L13.5601 3.56001L14.4401 4.44001L9.88006 9.00001Z"
                    ></path>
                  </svg>
                </button>
                {/* progressive bar welcome modal tab */}
                {welcomeModalTabIndex > 1 && width > 900 && (
                  <div
                    onClick={() => {
                      setWelcomeModalTabIndex(welcomeModalTabIndex - 1);
                    }}
                    className="unica-regular-font pointer"
                    style={{
                      position: "absolute",
                      right: "1%",
                      top: "5%",
                      width: "400px",
                      padding: "0px 16px",
                      opacity: opacityAnimationActivForFirstTab ? 0 : 1,
                      transition:
                        opacityAnimationActivForFirstTab &&
                        "opacity 0ms ease 0s",
                      zIndex: 1,
                    }}
                  >
                    <div
                      className="dflex algncenter"
                      style={{
                        gap: "6px",
                      }}
                    >
                      <span>
                        <svg
                          style={{
                            display: "flex",
                          }}
                          width={18}
                          height={14}
                          viewBox="0 0 18 18"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12.0601 15.94L5.12012 9L12.0601 2.06L12.9401 2.94L6.88012 9L12.9401 15.06L12.0601 15.94Z"
                          ></path>
                        </svg>
                      </span>
                      <span className="hover_color_effect">Back</span>
                      {/* bar */}
                    </div>
                    <div
                      style={{
                        width: "100%",
                        position: "relative",
                        overflow: "hidden",
                        boxSizing: "border-box",
                        backgroundColor: "rgb(194, 194, 194)",
                        display: "flex",
                        justifyContent: "flex-start",
                        margin: "20px 0px",
                      }}
                    >
                      <div
                        style={{
                          height: "2px",
                          opacity: opacityAnimationActivForFirstTab ? 0 : 1,
                          transition:
                            "opacity 400ms ease 0s, width 400ms ease 0s",
                          width:
                            welcomeModalTabIndex === 2
                              ? "25%"
                              : welcomeModalTabIndex === 3
                              ? "50%"
                              : welcomeModalTabIndex === 4
                              ? "75%"
                              : welcomeModalTabIndex === 5
                              ? "100%"
                              : "0%",
                          backgroundColor: "rgb(16, 35, 215)",
                        }}
                      ></div>
                    </div>
                  </div>
                )}
                {/* first tab */}
                {welcomeModalTabIndex === 1 ? (
                  <>
                    <>
                      <div
                        style={{
                          display: "flex",
                          height: "100%",
                          flexDirection: width > 900 ? "row" : "column",
                          zIndex: 1,
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
                              opacity: opacityAnimationActivForFirstTab ? 0 : 1,
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
                                transform:
                                  "rotate(33.33deg) translate(10px, -25%)",
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
                                  className="box-20-px-m-top"
                                  style={{
                                    aspectRatio: "300/400",
                                    maxWidth: "100%",
                                    position: "relative",
                                    width: "100%",
                                    overflow: "hidden",

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
                                  className="box-20-px-m-top"
                                  style={{
                                    aspectRatio: "300/400",
                                    maxWidth: "100%",
                                    position: "relative",
                                    width: "100%",
                                    overflow: "hidden",
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
                                  className="box-20-px-m-top"
                                  style={{
                                    aspectRatio: "300/400",
                                    maxWidth: "100%",
                                    position: "relative",
                                    width: "100%",
                                    overflow: "hidden",
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
                                  className="box-20-px-m-top"
                                  style={{
                                    aspectRatio: "300/400",
                                    maxWidth: "100%",
                                    position: "relative",
                                    width: "100%",
                                    overflow: "hidden",
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
                                  className="box-20-px-m-top"
                                  style={{
                                    aspectRatio: "300/400",
                                    maxWidth: "100%",
                                    position: "relative",
                                    width: "100%",
                                    overflow: "hidden",
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
                                  className="box-20-px-m-top"
                                  style={{
                                    aspectRatio: "300/400",
                                    maxWidth: "100%",
                                    position: "relative",
                                    width: "100%",
                                    overflow: "hidden",
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
                                  className="box-20-px-m-top"
                                  style={{
                                    aspectRatio: "300/400",
                                    maxWidth: "100%",
                                    position: "relative",
                                    width: "100%",
                                    overflow: "hidden",
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
                                  className="box-20-px-m-top"
                                  style={{
                                    aspectRatio: "300/400",
                                    maxWidth: "100%",
                                    position: "relative",
                                    width: "100%",
                                    overflow: "hidden",
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
                                  className="box-20-px-m-top"
                                  style={{
                                    aspectRatio: "300/400",
                                    maxWidth: "100%",
                                    position: "relative",
                                    width: "100%",
                                    overflow: "hidden",
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
                                  className="box-20-px-m-top"
                                  style={{
                                    aspectRatio: "300/400",
                                    maxWidth: "100%",
                                    position: "relative",
                                    width: "100%",
                                    overflow: "hidden",
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
                                  className="box-20-px-m-top"
                                  style={{
                                    aspectRatio: "300/400",
                                    maxWidth: "100%",
                                    position: "relative",
                                    width: "100%",
                                    overflow: "hidden",
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
                                  className="box-20-px-m-top"
                                  style={{
                                    aspectRatio: "300/400",
                                    maxWidth: "100%",
                                    position: "relative",
                                    width: "100%",
                                    overflow: "hidden",
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
                                opacity: opacityAnimationActivForFirstTab
                                  ? 0
                                  : 1,
                                transition: "opacity 750ms ease 0s",
                              }}
                            >
                              <div
                                className="unica-regular-font"
                                style={{
                                  fontSize: "60px",
                                  lineHeight: "70px",
                                  letterSpacing: "-0.01em",
                                  maxWidth: "0px",
                                  minWidth: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <span>Welcome to Art Bazaar,</span>
                                <span
                                  style={{
                                    maxWidth: "100%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    width: "100%",
                                  }}
                                >
                                  {collectorInfo.name}.
                                </span>
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
                              onClick={() => {
                                setOpacityAnimationActiveForFirstTab(true);
                                setTabNextTrue(true);

                                setTimeout(() => {
                                  setTabNextTrue(false);
                                  setWelcomeModalTabIndex(
                                    welcomeModalTabIndex + 1
                                  );
                                }, 500);

                                setTimeout(() => {
                                  setOpacityAnimationActiveForFirstTab(false);
                                }, 750);
                              }}
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
                                opacity: tabNextTrue ? "0.3" : "1",
                                pointerEvents: tabNextTrue && "none",
                              }}
                            >
                              {tabNextTrue ? (
                                <LoadingSpinner></LoadingSpinner>
                              ) : (
                                <>Get Started</>
                              )}
                            </button>
                            <button
                              onClick={closeWelcomeModal}
                              className={
                                "pointer hover_effect_transparent_btn unica-regular-font "
                              }
                              style={{
                                minHeight: "50px",
                                border: "none",
                                color: "black",
                                borderRadius: "9999px",
                                width: "100%",
                                fontSize: "16px",
                                opacity: tabNextTrue ? "0.3" : "1",
                                pointerEvents: tabNextTrue && "none",
                                marginTop: "12px",
                                transition:
                                  "color 0.25s ease 0s, border-color 0.25s ease 0s, background-color 0.25s ease 0s, box-shadow 0.25s ease 0s",
                                backgroundColor: "transparent",
                              }}
                            >
                              Skip
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  </>
                ) : welcomeModalTabIndex === 2 ? (
                  <>
                    <>
                      <div
                        style={{
                          display: "flex",
                          height: "100%",
                          flexDirection: width > 900 ? "row" : "column",
                          zIndex: 1,
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
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              backgroundColor: "rgb(0,0,0)",
                              justifyContent: "flex-end",
                              alignItems: "flex-start",
                              boxSizing: "border-box",
                              opacity: opacityAnimationActivForSecondTab
                                ? 0
                                : 1,
                              transition: "opacity 500ms ease 0s",
                            }}
                          >
                            <div
                              style={{
                                aspectRatio: "1600 / 2764",
                                maxWidth: "400px",
                                position: "relative",
                                width: "100%",
                                overflow: "hidden",
                                boxSizing: "border-box",
                              }}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  boxSizing: "border-box",
                                  display: "block",
                                }}
                              >
                                <img
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    boxSizing: "border-box",
                                    overflowClipMargin: "content-box",
                                    overflow: "clip",
                                  }}
                                  src="https://d7hftxdivxxvm.cloudfront.net?quality=80&resize_to=width&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fquestion-one-img.jpg&width=400"
                                  srcSet="https://d7hftxdivxxvm.cloudfront.net?quality=80&resize_to=width&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fquestion-one-img.jpg&width=400 1x, https://d7hftxdivxxvm.cloudfront.net?quality=80&resize_to=width&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fquestion-one-img.jpg&width=800 2x"
                                  alt=""
                                />
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
                                  fontSize: "26px",
                                  lineHeight: "32px",
                                  letterSpacing: "-0.01em",
                                  maxWidth: "0px",
                                  minWidth: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  marginTop: "120px",
                                  marginBottom: "40px",
                                  opacity: opacityAnimationActivForSecondTab
                                    ? 0
                                    : 1,
                                  transition: "opacity 750ms ease 0s",
                                }}
                              >
                                <span>Have you purchased art before?</span>
                              </div>
                              <div
                                style={{
                                  marginTop: "40px",
                                }}
                              ></div>
                              <div
                                className="unica-regular-font"
                                style={{
                                  fontSize: "13px",
                                  opacity: opacityAnimationActivForSecondTab
                                    ? 0
                                    : 1,
                                  transition: "opacity 500ms ease 0s",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setJustStartingOut(false);
                                    setLoveCollectingArt(true);
                                  }}
                                  className="hover_effect_transparent_btn_variant_more_soft clear_border_on_hover_variant_more_soft"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    border: "1px solid rgb(216,216,216)",
                                    borderRadius: "15px",
                                    height: "30px",
                                    padding: "0px 20px",
                                    transition:
                                      "color 0.25s ease 0s, border-color 0.25s ease 0s, background-color 0.25s ease 0s, box-shadow 0.25s ease 0s",
                                    backgroundColor: loveCollectingArt
                                      ? "rgb(16, 35, 215)"
                                      : "transparent",
                                    color: loveCollectingArt
                                      ? "white"
                                      : "rgb(0,0,0)",
                                  }}
                                >
                                  <span>Yes, I love collecting art</span>
                                </button>
                                <div className="box-20-px-m-top"></div>
                                <button
                                  onClick={() => {
                                    setLoveCollectingArt(false);
                                    setJustStartingOut(true);
                                  }}
                                  className="hover_effect_transparent_btn_variant_more_soft clear_border_on_hover_variant_more_soft"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    border: "1px solid rgb(216,216,216)",
                                    borderRadius: "15px",
                                    height: "30px",
                                    padding: "0px 20px",
                                    transition:
                                      "color 0.25s ease 0s, border-color 0.25s ease 0s, background-color 0.25s ease 0s, box-shadow 0.25s ease 0s",
                                    backgroundColor: justStartingOut
                                      ? "rgb(16, 35, 215)"
                                      : "transparent",
                                    color: justStartingOut
                                      ? "white"
                                      : "rgb(0,0,0)",
                                  }}
                                >
                                  {" "}
                                  <span>No, I'm just starting out</span>
                                </button>
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
                              onClick={() => {
                                setOpacityAnimationActiveForSecondTab(true);
                                setTabNextTrue(true);

                                setTimeout(() => {
                                  setTabNextTrue(false);
                                  setWelcomeModalTabIndex(
                                    welcomeModalTabIndex + 1
                                  );
                                }, 750);

                                setTimeout(() => {
                                  setOpacityAnimationActiveForSecondTab(false);
                                }, 1000);
                              }}
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
                                opacity:
                                  (loveCollectingArt || justStartingOut) &&
                                  !tabNextTrue
                                    ? 1
                                    : (opacityAnimationActivForSecondTab ||
                                        opacityAnimationActivForFirstTab) &&
                                      !tabNextTrue
                                    ? 0
                                    : 0.3,
                                pointerEvents:
                                  (!loveCollectingArt && !justStartingOut) ||
                                  tabNextTrue
                                    ? "none"
                                    : "",
                              }}
                            >
                              {tabNextTrue ? (
                                <LoadingSpinner></LoadingSpinner>
                              ) : (
                                <>Next</>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  </>
                ) : welcomeModalTabIndex === 3 ? (
                  <>
                    <>
                      <div
                        style={{
                          display: "flex",
                          height: "100%",
                          flexDirection: width > 900 ? "row" : "column",
                          zIndex: 1,
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
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              backgroundColor: "rgb(0,0,0)",
                              justifyContent: "flex-end",
                              alignItems: "flex-start",
                              boxSizing: "border-box",
                              opacity: opacityAnimationActivForThirdTab ? 0 : 1,
                              transition: "opacity 500ms ease 0s",
                            }}
                          >
                            <div
                              style={{
                                aspectRatio: "1600 / 2764",
                                maxWidth: "400px",
                                position: "relative",
                                width: "100%",
                                overflow: "hidden",
                                boxSizing: "border-box",
                              }}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  boxSizing: "border-box",
                                  display: "block",
                                }}
                              >
                                <img
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    boxSizing: "border-box",
                                    overflowClipMargin: "content-box",
                                    overflow: "clip",
                                  }}
                                  src="https://d7hftxdivxxvm.cloudfront.net?quality=80&resize_to=width&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fquestion-two-img.jpg&width=400"
                                  srcSet="https://d7hftxdivxxvm.cloudfront.net?quality=80&resize_to=width&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fquestion-two-img.jpg&width=400 1x, https://d7hftxdivxxvm.cloudfront.net?quality=80&resize_to=width&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fquestion-two-img.jpg&width=800 2x"
                                  alt=""
                                />
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
                                  opacity: opacityAnimationActivForThirdTab
                                    ? 0
                                    : 1,
                                  transition: "opacity 750ms ease 0s",
                                  fontSize: "26px",
                                  lineHeight: "32px",
                                  letterSpacing: "-0.01em",
                                  maxWidth: "0px",
                                  minWidth: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  marginTop: "120px",
                                  marginBottom: "40px",
                                }}
                              >
                                <span>What do you love most about art?</span>
                                <div
                                  style={{
                                    fontSize: "16px",
                                  }}
                                  className="unica-regular-font"
                                >
                                  Choose as many as you like.
                                </div>
                              </div>
                              <div
                                style={{
                                  marginTop: "40px",
                                }}
                              ></div>
                              <div
                                className="unica-regular-font"
                                style={{
                                  fontSize: "13px",
                                  opacity: opacityAnimationActivForThirdTab
                                    ? 0
                                    : 1,
                                  transition: "opacity 500ms ease 0s",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setAnswersTab2((prevItems) => ({
                                      ...prevItems,
                                      developingMyArtTastes:
                                        !answersTab2.developingMyArtTastes,
                                    }));
                                  }}
                                  className="hover_effect_transparent_btn_variant_more_soft clear_border_on_hover_variant_more_soft"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    border: "1px solid rgb(216,216,216)",
                                    borderRadius: "15px",
                                    height: "30px",
                                    padding: "0px 20px",
                                    transition:
                                      "color 0.25s ease 0s, border-color 0.25s ease 0s, background-color 0.25s ease 0s, box-shadow 0.25s ease 0s",
                                    backgroundColor:
                                      answersTab2.developingMyArtTastes
                                        ? "rgb(16, 35, 215)"
                                        : "transparent",
                                    color: answersTab2.developingMyArtTastes
                                      ? "white"
                                      : "rgb(0,0,0)",
                                  }}
                                >
                                  <span>Developing my art tastes</span>
                                </button>
                                <div className="box-20-px-m-top"></div>
                                <button
                                  onClick={() => {
                                    setAnswersTab2((prevItems) => ({
                                      ...prevItems,
                                      keepingTrackOfArtIamInterestedIn:
                                        !answersTab2.keepingTrackOfArtIamInterestedIn,
                                    }));
                                  }}
                                  className="hover_effect_transparent_btn_variant_more_soft clear_border_on_hover_variant_more_soft"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    border: "1px solid rgb(216,216,216)",
                                    borderRadius: "15px",
                                    height: "30px",
                                    padding: "0px 20px",
                                    transition:
                                      "color 0.25s ease 0s, border-color 0.25s ease 0s, background-color 0.25s ease 0s, box-shadow 0.25s ease 0s",
                                    backgroundColor:
                                      answersTab2.keepingTrackOfArtIamInterestedIn
                                        ? "rgb(16, 35, 215)"
                                        : "transparent",
                                    color:
                                      answersTab2.keepingTrackOfArtIamInterestedIn
                                        ? "white"
                                        : "rgb(0,0,0)",
                                  }}
                                >
                                  {" "}
                                  <span>
                                    Keeping track of art I’m interested in
                                  </span>
                                </button>
                                <div className="box-20-px-m-top"></div>
                                <button
                                  onClick={() => {
                                    setAnswersTab2((prevItems) => ({
                                      ...prevItems,
                                      findingMyNextGreatInvestment:
                                        !answersTab2.findingMyNextGreatInvestment,
                                    }));
                                  }}
                                  className="hover_effect_transparent_btn_variant_more_soft clear_border_on_hover_variant_more_soft"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    border: "1px solid rgb(216,216,216)",
                                    borderRadius: "15px",
                                    height: "30px",
                                    padding: "0px 20px",
                                    transition:
                                      "color 0.25s ease 0s, border-color 0.25s ease 0s, background-color 0.25s ease 0s, box-shadow 0.25s ease 0s",
                                    backgroundColor:
                                      answersTab2.findingMyNextGreatInvestment
                                        ? "rgb(16, 35, 215)"
                                        : "transparent",
                                    color:
                                      answersTab2.findingMyNextGreatInvestment
                                        ? "white"
                                        : "rgb(0,0,0)",
                                  }}
                                >
                                  {" "}
                                  <span>Finding my next great investment</span>
                                </button>{" "}
                                <div className="box-20-px-m-top"></div>
                                <button
                                  onClick={() => {
                                    setAnswersTab2((prevItems) => ({
                                      ...prevItems,
                                      collectingArtThatMovesMe:
                                        !answersTab2.collectingArtThatMovesMe,
                                    }));
                                  }}
                                  className="hover_effect_transparent_btn_variant_more_soft clear_border_on_hover_variant_more_soft"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    border: "1px solid rgb(216,216,216)",
                                    borderRadius: "15px",
                                    height: "30px",
                                    padding: "0px 20px",
                                    transition:
                                      "color 0.25s ease 0s, border-color 0.25s ease 0s, background-color 0.25s ease 0s, box-shadow 0.25s ease 0s",
                                    backgroundColor:
                                      answersTab2.collectingArtThatMovesMe
                                        ? "rgb(16, 35, 215)"
                                        : "transparent",
                                    color: answersTab2.collectingArtThatMovesMe
                                      ? "white"
                                      : "rgb(0,0,0)",
                                  }}
                                >
                                  {" "}
                                  <span>Collecting art that moves me</span>
                                </button>
                              </div>
                            </div>
                            {width > 900 && (
                              <div
                                style={{
                                  marginTop: "20px",
                                  marginBottom: "20px",
                                }}
                              ></div>
                            )}
                            <button
                              onClick={() => {
                                setOpacityAnimationActivForThirdTab(true);
                                setTabNextTrue(true);

                                setTimeout(() => {
                                  setTabNextTrue(false);
                                  setWelcomeModalTabIndex(
                                    welcomeModalTabIndex + 1
                                  );
                                }, 750);

                                setTimeout(() => {
                                  setOpacityAnimationActivForThirdTab(false);
                                }, 1000);
                              }}
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
                                opacity:
                                  (answersTab2.collectingArtThatMovesMe ||
                                    answersTab2.developingMyArtTastes ||
                                    answersTab2.findingMyNextGreatInvestment ||
                                    answersTab2.keepingTrackOfArtIamInterestedIn) &&
                                  !tabNextTrue
                                    ? 1
                                    : (opacityAnimationActivForThirdTab ||
                                        opacityAnimationActivForSecondTab) &&
                                      !tabNextTrue
                                    ? 0
                                    : 0.3,
                                pointerEvents:
                                  (!answersTab2.collectingArtThatMovesMe &&
                                    !answersTab2.developingMyArtTastes &&
                                    !answersTab2.findingMyNextGreatInvestment &&
                                    !answersTab2.keepingTrackOfArtIamInterestedIn) ||
                                  tabNextTrue
                                    ? "none"
                                    : "",
                              }}
                            >
                              {tabNextTrue ? (
                                <LoadingSpinner></LoadingSpinner>
                              ) : (
                                <>Next</>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  </>
                ) : welcomeModalTabIndex === 4 ? (
                  <>
                    <>
                      <div
                        style={{
                          display: "flex",
                          height: "100%",
                          flexDirection: width > 900 ? "row" : "column",
                          zIndex: 1,
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
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              backgroundColor: "rgb(0,0,0)",
                              justifyContent: "flex-end",
                              alignItems: "flex-start",
                              boxSizing: "border-box",
                              opacity: opacityAnimationActivForFourthTab
                                ? 0
                                : 1,
                              transition: "opacity 500ms ease 0s",
                            }}
                          >
                            <div
                              style={{
                                aspectRatio: "1600 / 2764",
                                maxWidth: "400px",
                                position: "relative",
                                width: "100%",
                                overflow: "hidden",
                                boxSizing: "border-box",
                              }}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  boxSizing: "border-box",
                                  display: "block",
                                }}
                              >
                                <img
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    boxSizing: "border-box",
                                    overflowClipMargin: "content-box",
                                    overflow: "clip",
                                  }}
                                  src="https://d7hftxdivxxvm.cloudfront.net?quality=80&resize_to=width&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fquestion-three-img.jpg&width=400"
                                  srcSet="https://d7hftxdivxxvm.cloudfront.net?quality=80&resize_to=width&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fquestion-three-img.jpg&width=400 1x, https://d7hftxdivxxvm.cloudfront.net?quality=80&resize_to=width&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fquestion-three-img.jpg&width=800 2x"
                                  alt=""
                                />
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
                                  opacity: opacityAnimationActivForFourthTab
                                    ? 0
                                    : 1,
                                  transition: "opacity 750ms ease 0s",
                                  fontSize: "26px",
                                  lineHeight: "32px",
                                  letterSpacing: "-0.01em",
                                  maxWidth: "0px",
                                  minWidth: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  marginTop: "120px",
                                  marginBottom: "40px",
                                }}
                              >
                                <span>
                                  Almost done! Now select some artworks and
                                  artists to tailor Artsy to your tastes.
                                </span>
                                <div
                                  style={{
                                    fontSize: "16px",
                                  }}
                                  className="unica-regular-font"
                                >
                                  Choose a way to start exploring
                                </div>
                              </div>
                              <div
                                style={{
                                  marginTop: "40px",
                                }}
                              ></div>
                              <div
                                className="unica-regular-font"
                                style={{
                                  fontSize: "13px",
                                  opacity: opacityAnimationActivForFourthTab
                                    ? 0
                                    : 1,
                                  transition: "opacity 500ms ease 0s",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setAnswersTab3((prevItems) => ({
                                      ...prevItems,
                                      takeTheArtTasteQuiz:
                                        !answersTab3.takeTheArtTasteQuiz,
                                    }));
                                  }}
                                  className="hover_effect_transparent_btn_variant_more_soft clear_border_on_hover_variant_more_soft"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    border: "1px solid rgb(216,216,216)",
                                    borderRadius: "15px",
                                    height: "30px",
                                    padding: "0px 20px",
                                    transition:
                                      "color 0.25s ease 0s, border-color 0.25s ease 0s, background-color 0.25s ease 0s, box-shadow 0.25s ease 0s",
                                    backgroundColor:
                                      answersTab3.takeTheArtTasteQuiz
                                        ? "rgb(16, 35, 215)"
                                        : "transparent",
                                    color: answersTab3.takeTheArtTasteQuiz
                                      ? "white"
                                      : "rgb(0,0,0)",
                                  }}
                                >
                                  <span>Take the art taste quiz</span>
                                </button>
                                <div className="box-20-px-m-top"></div>
                                <button
                                  onClick={() => {
                                    setAnswersTab3((prevItems) => ({
                                      ...prevItems,
                                      exploreTopAuctionLots:
                                        !answersTab3.exploreTopAuctionLots,
                                    }));
                                  }}
                                  className="hover_effect_transparent_btn_variant_more_soft clear_border_on_hover_variant_more_soft"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    border: "1px solid rgb(216,216,216)",
                                    borderRadius: "15px",
                                    height: "30px",
                                    padding: "0px 20px",
                                    transition:
                                      "color 0.25s ease 0s, border-color 0.25s ease 0s, background-color 0.25s ease 0s, box-shadow 0.25s ease 0s",
                                    backgroundColor:
                                      answersTab3.exploreTopAuctionLots
                                        ? "rgb(16, 35, 215)"
                                        : "transparent",
                                    color: answersTab3.exploreTopAuctionLots
                                      ? "white"
                                      : "rgb(0,0,0)",
                                  }}
                                >
                                  {" "}
                                  <span>Explore top auction lots</span>
                                </button>
                                <div className="box-20-px-m-top"></div>
                                <button
                                  onClick={() => {
                                    setAnswersTab3((prevItems) => ({
                                      ...prevItems,
                                      artistsOnTheRise:
                                        !answersTab3.artistsOnTheRise,
                                    }));
                                  }}
                                  className="hover_effect_transparent_btn_variant_more_soft clear_border_on_hover_variant_more_soft"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    border: "1px solid rgb(216,216,216)",
                                    borderRadius: "15px",
                                    height: "30px",
                                    padding: "0px 20px",
                                    transition:
                                      "color 0.25s ease 0s, border-color 0.25s ease 0s, background-color 0.25s ease 0s, box-shadow 0.25s ease 0s",
                                    backgroundColor:
                                      answersTab3.artistsOnTheRise
                                        ? "rgb(16, 35, 215)"
                                        : "transparent",
                                    color: answersTab3.artistsOnTheRise
                                      ? "white"
                                      : "rgb(0,0,0)",
                                  }}
                                >
                                  {" "}
                                  <span>Artists on the rise</span>
                                </button>{" "}
                                <div className="box-20-px-m-top"></div>
                                <button
                                  onClick={() => {
                                    setAnswersTab3((prevItems) => ({
                                      ...prevItems,
                                      browseAcuratedCollection:
                                        !answersTab3.browseAcuratedCollection,
                                    }));
                                  }}
                                  className="hover_effect_transparent_btn_variant_more_soft clear_border_on_hover_variant_more_soft"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    border: "1px solid rgb(216,216,216)",
                                    borderRadius: "15px",
                                    height: "30px",
                                    padding: "0px 20px",
                                    transition:
                                      "color 0.25s ease 0s, border-color 0.25s ease 0s, background-color 0.25s ease 0s, box-shadow 0.25s ease 0s",
                                    backgroundColor:
                                      answersTab3.browseAcuratedCollection
                                        ? "rgb(16, 35, 215)"
                                        : "transparent",
                                    color: answersTab3.browseAcuratedCollection
                                      ? "white"
                                      : "rgb(0,0,0)",
                                  }}
                                >
                                  {" "}
                                  <span>Browse a curated collection</span>
                                </button>
                              </div>
                            </div>
                            {width > 900 && (
                              <div
                                style={{
                                  marginTop: "10px",
                                  marginBottom: "10px",
                                }}
                              ></div>
                            )}
                            <button
                              onClick={() => {
                                // setOpacityAnimationActivForFourthTab(true);
                                // setTabNextTrue(true);
                                // setTimeout(() => {
                                //   setTabNextTrue(false);
                                //   setWelcomeModalTabIndex(
                                //     welcomeModalTabIndex + 1
                                //   );
                                // }, 750);
                                // setTimeout(() => {
                                //   setOpacityAnimationActivForFourthTab(false);
                                // }, 1250);
                              }}
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
                                opacity: !tabNextTrue ? 1 : 0.3,
                                pointerEvents: tabNextTrue ? "none" : "",
                              }}
                            >
                              {tabNextTrue ? (
                                <LoadingSpinner></LoadingSpinner>
                              ) : (
                                <>Next</>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  </>
                ) : null}
                {/* second tab */}
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
                flexDirection: width <= 768 ? "column" : "row",
                width: "100%",
                maxHeight: "425px",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  transform:
                    slideIndex === 2 ? "translateX(-200%)" : "translateX(0%)",
                  transition: "transform 500ms ease 0s",
                  minWidth: "50%",
                  padding: width <= 768 && "20px 20px 0px 20px",
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
                  src="https://d7hftxdivxxvm.cloudfront.net?height=500&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F7vZlyWUDdnDWfvQ97TCLcQ%2Fmain.jpg&width=1270"
                  alt=""
                />
                {/* image right */}
                <div
                  className="unica-regular-font"
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: width <= 768 ? "36px" : "12px",
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(255,255,255,0.7)",
                    textShadow: "rgb(0,0,0,0.25) 0px 0px 15px",
                    overflow: "hidden",
                  }}
                >
                  Christina Holdgaard, Flower of Passion (Home ||), 2021
                </div>
              </div>
              <div
                style={{
                  minHeight: width <= 768 ? "auto" : "500px",

                  backgroundColor: "#F7F7F7",
                  transform:
                    slideIndex === 2 ? "translateX(-200%)" : "translateX(0%)",
                  transition: "transform 500ms ease 0s",
                  minWidth: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: width <= 768 ? "flex-start" : "center",
                  flexDirection: "column",
                  padding: width <= 768 && "20px 20px 20px 20px",
                  margin: width <= 768 && "0px 20px",
                }}
              >
                <div
                  className="unica-regular-font"
                  style={{
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "40px",
                      lineHeight: "48px",
                      color: "rgb(0,0,0)",
                    }}
                  >
                    Title
                  </div>
                  <div
                    style={{
                      fontSize: "26px",
                      lineHeight: "32px",
                      color: "rgb(112,112,112)",
                    }}
                  >
                    Description
                  </div>
                  <div
                    style={{
                      width: "296.66px",
                      maxHeight: "50px",
                      height: "100%",
                    }}
                  >
                    <button
                      className="pointer hover_bg_color_effect_white_text unica-regular-font"
                      style={{
                        border: "none",
                        backgroundColor: "transparent",
                        border: "1px solid rgb(0,0,0)",
                        borderRadius: "9999px",
                        padding: "1px 25px",
                        height: "50px",
                        boxSizing: "border-box",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        maxWidth: "100%",
                        width: "100%",
                        fontSize: "16px",
                      }}
                    >
                      Button
                    </button>
                  </div>
                </div>
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
                <img
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    overflowClipMargin: "content-box",
                    overflow: "clip",
                    boxSizing: "border-box",
                  }}
                  src="https://d7hftxdivxxvm.cloudfront.net/?height=500&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2Fs91Mh8S5Ml8MVmq13cIiNw%2Fmain.jpg&width=1270"
                  alt=""
                />
                <div
                  className="unica-regular-font"
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "16px",
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(255,255,255,0.7)",
                    textShadow: "rgb(0,0,0,0.25) 0px 0px 15px",
                    overflow: "hidden",
                  }}
                >
                  Artem Proot, Tennis courts. Orange/Yellow, 2024.
                </div>
              </div>
              <div
                style={{
                  minHeight: "500px",
                  backgroundColor: "#F7F7F7",
                  transform:
                    slideIndex === 2 ? "translateX(-200%)" : "translateX(0%)",
                  transition: "transform 500ms ease 0s",
                  minWidth: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <div
                  className="unica-regular-font"
                  style={{
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "40px",
                      lineHeight: "48px",
                      color: "rgb(0,0,0)",
                    }}
                  >
                    Title
                  </div>
                  <div
                    style={{
                      fontSize: "26px",
                      lineHeight: "32px",
                      color: "rgb(112,112,112)",
                    }}
                  >
                    Description
                  </div>
                  <div
                    style={{
                      width: "296.66px",
                      maxHeight: "50px",
                      height: "100%",
                    }}
                  >
                    <button
                      className="pointer hover_bg_color_effect_white_text unica-regular-font"
                      style={{
                        border: "none",
                        backgroundColor: "transparent",
                        border: "1px solid rgb(0,0,0)",
                        borderRadius: "9999px",
                        padding: "1px 25px",
                        height: "50px",
                        boxSizing: "border-box",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        maxWidth: "100%",
                        width: "100%",
                        fontSize: "16px",
                      }}
                    >
                      Button
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* slider station */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "12px 0px",
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
                          fillRule="evenodd"
                          clipRule="evenodd"
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
                      position: "relative",
                      right: "36px",
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
                          fillRule="evenodd"
                          clipRule="evenodd"
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
      {/* <div
        className={`unica-regular-font`}
        style={{
          left: "15px",
          bottom: "15px",
          padding: "16px",
          position: "fixed",
          zIndex: 1,
          color: "rgb(0,0,0)",
          fontSize: "15px",
          lineHeight: "20px",
          borderRadius: "4px",
          pointerEvents: "none",
        }}
      >
        © Aykut Kav 2024
      </div> */}
      <Footer />
    </>
  );
}

export default Main;
