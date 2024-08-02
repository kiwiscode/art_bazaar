import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { Modal } from "@mui/material";
import axios from "axios";
import useWindowDimensions from "../../utils/useWindowDimensions";
import { CollectorContext } from "../components/CollectorContext";
import Footer from "../components/Footer";
import Input from "../components/Input";
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

  const closeWelcomeModalLastTab = () => {
    setWelcomeModalTabIndex(5);

    setTimeout(() => {
      closeWelcomeModal();
    }, 3000);
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

  // show filters opener custom modal
  const showFiltersRef = useRef(null);
  const [showFiltersDetail, setShowFiltersDetail] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (showFiltersDetail) {
      setIsTransitioning(true);
    }
  }, [showFiltersDetail]);

  const handleOnOutsideFiltersDetailClick = (event) => {
    if (
      showFiltersRef.current &&
      !showFiltersRef.current.contains(event.target)
    ) {
      handleClose();
    }
    // else {
    //   setShowFiltersDetail(true);
    // }
  };

  const handleClose = () => {
    setIsTransitioning(false);
    setTimeout(() => {
      setShowFiltersDetail(false);
    }, 600);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOnOutsideFiltersDetailClick);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleOnOutsideFiltersDetailClick
      );
    };
  }, []);

  // filter option settings
  const [hideRarity, setHideRarity] = useState(false);
  const [hideMedium, setHideMedium] = useState(false);
  const [hidePrice, setHidePrice] = useState(false);

  const [rarityFilteredOptions, setRarityFilteredOptions] = useState([]);
  const [mediumFilteredOptions, setMediumFilteredOptions] = useState([]);
  const [showMoreMediumOptions, setShowMoreMediumOptions] = useState(false);

  console.log("rarity filtered options:", rarityFilteredOptions);
  console.log("medium filtered options:", mediumFilteredOptions);

  const [uniqeOptionHovered, setUniqeOptionHovered] = useState(false);
  const [limitedEditionHovered, setLimitedEditionHovered] = useState(false);
  const [openEditionHovered, setOpenEditionHovered] = useState(false);
  const [unknowEditionHovered, setUnknowEditionHovered] = useState(false);

  const [paintingOptionHovered, setpaintingOptionHovered] = useState(false);
  const [photographyOptionHovered, setphotographyOptionHovered] =
    useState(false);
  const [sculptureOptionHovered, setsculptureOptionHovered] = useState(false);
  const [printsOptionHovered, setprintsOptionHovered] = useState(false);
  const [workOnPaperOptionHovered, setworkOnPaperOptionHovered] =
    useState(false);
  const [NFTOptionHovered, setNFTOptionHovered] = useState(false);
  // secont part medium options filter
  const [designOptionHovered, setdesignOptionHovered] = useState(false);
  const [drawingOptionHovered, setdrawingOptionHovered] = useState(false);
  const [installationOptionHovered, setinstallationOptionHovered] =
    useState(false);
  const [filmdVideoOptionHovered, setfilmdVideoOptionHovered] = useState(false);
  const [jewelryOptionHovered, setjewelryOptionHovered] = useState(false);
  const [performanceArtOptionHovered, setperformanceArtOptionHovered] =
    useState(false);
  const [reproductionOptionHovered, setreproductionOptionHovered] =
    useState(false);
  const [
    ephemeraOrMerchandiseOptionHovered,
    setephemeraOrMerchandiseOptionHovered,
  ] = useState(false);

  // price filter
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(50000);

  const [priceFilter, setPriceFilter] = useState({
    minValue: minValue,
    maxValue: maxValue,
  });

  console.log("price filter:", priceFilter);

  const handleMinChange = (event) => {
    console.log("event target value:", event.target.value);
    const value = Math.min(Number(event.target.value), maxValue - 100);
    setMinValue(value);
    setPriceFilter((prevPriceFilter) => ({
      ...prevPriceFilter,
      minValue: value,
    }));
  };

  const handleMaxChange = (event) => {
    const value = Math.max(Number(event.target.value), minValue + 100);
    setMaxValue(value);
    setPriceFilter((prevPriceFilter) => ({
      ...prevPriceFilter,
      maxValue: value,
    }));
  };

  const sliderWidth = 410;

  // Clip değerlerini hesapla
  const clipStart = minValue;
  const clipEnd = maxValue;
  const trackWidth = sliderWidth;

  const clipStyle = {
    clipPath: `inset(0px ${trackWidth - (clipEnd / 50000) * trackWidth}px 0px ${
      (clipStart / 50000) * trackWidth
    }px)`,
  };

  useEffect(() => {
    if (showFiltersDetail) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showFiltersDetail]);

  // popover rarity
  const [showRarityPopover, setShowRarityPopover] = useState(false);
  const rarityPopoverRef = useRef(null);

  const handleOnOutsideRarityPopoverClick = (event) => {
    if (
      rarityPopoverRef.current &&
      !rarityPopoverRef.current.contains(event.target)
    ) {
      setShowRarityPopover(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOnOutsideRarityPopoverClick);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleOnOutsideRarityPopoverClick
      );
    };
  }, []);
  // medium rarity
  const [showMediumPopover, setShowMediumPopover] = useState(false);
  const mediumPopoverRef = useRef(null);

  const handleOnOutsideMediumPopoverClick = (event) => {
    if (
      mediumPopoverRef.current &&
      !mediumPopoverRef.current.contains(event.target)
    ) {
      setShowMediumPopover(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOnOutsideMediumPopoverClick);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleOnOutsideMediumPopoverClick
      );
    };
  }, []);

  return (
    <>
      {/* filter modal left side opening */}
      <>
        {showFiltersDetail && (
          <div
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
              zIndex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              className="unica-regular-font"
              ref={showFiltersRef}
              style={{
                transform: isTransitioning
                  ? "translateX(0%)"
                  : "translateX(-100%)",
                maxWidth: "475px",
                width: "100%",
                height: "100dvh",
                backgroundColor: "white",
                overflowY: "auto",
                position: "relative",
                boxShadow:
                  "0 0 15px rgba(101, 119, 134, 0.2), 0 0 5px 3px rgba(101, 119, 134, 0.15)",
                transitionDuration: "0.6s",
                transitionTimingFunction: "cubic-bezier(0.19,1,0.22,1)",
                transitionDelay: "0",
                transitionProperty: "transform",
              }}
            >
              <div className="filters-wrapper">
                <div className="box-40-px-m-top"></div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      lineHeight: "16px",
                    }}
                  >
                    Filters
                  </div>
                  <div>
                    <button
                      onClick={handleClose}
                      style={{
                        width: "58px",
                        height: "58px",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        fill="currentColor"
                      >
                        <path d="M9.88006 9.00001L14.4401 13.56L13.5601 14.44L9.00006 9.88001L4.44006 14.44L3.56006 13.56L8.12006 9.00001L3.56006 4.44001L4.44006 3.56001L9.00006 8.12001L13.5601 3.56001L14.4401 4.44001L9.88006 9.00001Z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div
                  className="box-40-px-m-top"
                  style={{
                    borderBottom: "1px solid rgb(0,0,0)",
                  }}
                ></div>
                <div className="box-40-px-m-top"></div>
                <div
                  onClick={() => {
                    setHideRarity(!hideRarity);
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <div>Rarity</div>
                  <div className="pointer">
                    {hideRarity ? (
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 18 18"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M9.00006 12.88L2.06006 5.94001L2.94006 5.06001L9.00006 11.12L15.0601 5.06001L15.9401 5.94001L9.00006 12.88Z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 18 18"
                        fill="currentColor"
                      >
                        <path d="M15.0601 12.94L9.00006 6.88001L2.94006 12.94L2.06006 12.06L9.00006 5.12001L15.9401 12.06L15.0601 12.94Z"></path>
                      </svg>
                    )}
                  </div>
                </div>
                <div className="box-20-px-m-top"></div>
                {!hideRarity && (
                  <div className="rarity-filter-options">
                    <div
                      onClick={() => {
                        setRarityFilteredOptions((prevRarityOptions) => {
                          if (prevRarityOptions.includes("Unique")) {
                            return prevRarityOptions.filter(
                              (option) => option !== "Unique"
                            );
                          } else {
                            return [...prevRarityOptions, "Unique"];
                          }
                        });
                      }}
                      onMouseEnter={() => setUniqeOptionHovered(true)}
                      onMouseLeave={() => setUniqeOptionHovered(false)}
                      className="parent-rarity-filter-options pointer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          border: uniqeOptionHovered
                            ? "1px solid rgb(16,35,215)"
                            : "1px solid rgb(231,231,231)",
                          transition: "border 0.3s ease-in-out",
                        }}
                      ></div>
                      <div
                        className="hover_color_effect hover_color_effect_t-d pointer"
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        Unique
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setRarityFilteredOptions((prevRarityOptions) => {
                          if (prevRarityOptions.includes("Limited Edition")) {
                            return prevRarityOptions.filter(
                              (option) => option !== "Limited Edition"
                            );
                          } else {
                            return [...prevRarityOptions, "Limited Edition"];
                          }
                        });
                      }}
                      onMouseEnter={() => setLimitedEditionHovered(true)}
                      onMouseLeave={() => setLimitedEditionHovered(false)}
                      className="parent-rarity-filter-options pointer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          border: limitedEditionHovered
                            ? "1px solid rgb(16,35,215)"
                            : "1px solid rgb(231,231,231)",
                          transition: "border 0.3s ease-in-out",
                        }}
                      ></div>
                      <div
                        className="hover_color_effect hover_color_effect_t-d pointer"
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        Limited Edition
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setRarityFilteredOptions((prevRarityOptions) => {
                          if (prevRarityOptions.includes("Open Edition")) {
                            return prevRarityOptions.filter(
                              (option) => option !== "Open Edition"
                            );
                          } else {
                            return [...prevRarityOptions, "Open Edition"];
                          }
                        });
                      }}
                      onMouseEnter={() => setOpenEditionHovered(true)}
                      onMouseLeave={() => setOpenEditionHovered(false)}
                      className="parent-rarity-filter-options pointer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          border: openEditionHovered
                            ? "1px solid rgb(16,35,215)"
                            : "1px solid rgb(231,231,231)",
                          transition: "border 0.3s ease-in-out",
                        }}
                      ></div>
                      <div
                        className="hover_color_effect hover_color_effect_t-d pointer"
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        Open Edition
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setRarityFilteredOptions((prevRarityOptions) => {
                          if (prevRarityOptions.includes("Unknown Edition")) {
                            return prevRarityOptions.filter(
                              (option) => option !== "Unknown Edition"
                            );
                          } else {
                            return [...prevRarityOptions, "Unknown Edition"];
                          }
                        });
                      }}
                      onMouseEnter={() => setUnknowEditionHovered(true)}
                      onMouseLeave={() => setUnknowEditionHovered(false)}
                      className="parent-rarity-filter-options  pointer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          border: unknowEditionHovered
                            ? "1px solid rgb(16,35,215)"
                            : "1px solid rgb(231,231,231)",
                          transition: "border 0.3s ease-in-out",
                        }}
                      ></div>
                      <div
                        className="hover_color_effect hover_color_effect_t-d pointer"
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        Unknown Edition
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className="box-40-px-m-top"
                  style={{
                    borderBottom: "1px solid rgb(0,0,0)",
                  }}
                ></div>
                <div className="box-40-px-m-top"></div>
                <div
                  onClick={() => {
                    setHideMedium(!hideMedium);
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <div>Medium</div>
                  <div className="pointer">
                    {hideMedium ? (
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 18 18"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M9.00006 12.88L2.06006 5.94001L2.94006 5.06001L9.00006 11.12L15.0601 5.06001L15.9401 5.94001L9.00006 12.88Z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 18 18"
                        fill="currentColor"
                      >
                        <path d="M15.0601 12.94L9.00006 6.88001L2.94006 12.94L2.06006 12.06L9.00006 5.12001L15.9401 12.06L15.0601 12.94Z"></path>
                      </svg>
                    )}
                  </div>
                </div>
                <div className="box-20-px-m-top"></div>
                {!hideMedium && (
                  <div className="medium-filter-options">
                    <div
                      onClick={() => {
                        setMediumFilteredOptions((prevMediumOptions) => {
                          if (prevMediumOptions.includes("Painting")) {
                            return prevMediumOptions.filter(
                              (option) => option !== "Painting"
                            );
                          } else {
                            return [...prevMediumOptions, "Painting"];
                          }
                        });
                      }}
                      onMouseEnter={() => setpaintingOptionHovered(true)}
                      onMouseLeave={() => setpaintingOptionHovered(false)}
                      className="parent-medium-filter-options pointer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          border: paintingOptionHovered
                            ? "1px solid rgb(16,35,215)"
                            : "1px solid rgb(231,231,231)",
                          transition: "border 0.3s ease-in-out",
                        }}
                      ></div>
                      <div
                        className="hover_color_effect hover_color_effect_t-d pointer"
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        Painting
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setMediumFilteredOptions((prevMediumOptions) => {
                          if (prevMediumOptions.includes("Photography")) {
                            return prevMediumOptions.filter(
                              (option) => option !== "Photography"
                            );
                          } else {
                            return [...prevMediumOptions, "Photography"];
                          }
                        });
                      }}
                      onMouseEnter={() => setphotographyOptionHovered(true)}
                      onMouseLeave={() => setphotographyOptionHovered(false)}
                      className="parent-medium-filter-options pointer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          border: photographyOptionHovered
                            ? "1px solid rgb(16,35,215)"
                            : "1px solid rgb(231,231,231)",
                          transition: "border 0.3s ease-in-out",
                        }}
                      ></div>
                      <div
                        className="hover_color_effect hover_color_effect_t-d pointer"
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        Photography
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setMediumFilteredOptions((prevMediumOptions) => {
                          if (prevMediumOptions.includes("Sculpture")) {
                            return prevMediumOptions.filter(
                              (option) => option !== "Sculpture"
                            );
                          } else {
                            return [...prevMediumOptions, "Sculpture"];
                          }
                        });
                      }}
                      onMouseEnter={() => setsculptureOptionHovered(true)}
                      onMouseLeave={() => setsculptureOptionHovered(false)}
                      className="parent-medium-filter-options pointer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          border: sculptureOptionHovered
                            ? "1px solid rgb(16,35,215)"
                            : "1px solid rgb(231,231,231)",
                          transition: "border 0.3s ease-in-out",
                        }}
                      ></div>
                      <div
                        className="hover_color_effect hover_color_effect_t-d pointer"
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        Sculpture
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setMediumFilteredOptions((prevMediumOptions) => {
                          if (prevMediumOptions.includes("Prints")) {
                            return prevMediumOptions.filter(
                              (option) => option !== "Prints"
                            );
                          } else {
                            return [...prevMediumOptions, "Prints"];
                          }
                        });
                      }}
                      onMouseEnter={() => setprintsOptionHovered(true)}
                      onMouseLeave={() => setprintsOptionHovered(false)}
                      className="parent-medium-filter-options  pointer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          border: printsOptionHovered
                            ? "1px solid rgb(16,35,215)"
                            : "1px solid rgb(231,231,231)",
                          transition: "border 0.3s ease-in-out",
                        }}
                      ></div>
                      <div
                        className="hover_color_effect hover_color_effect_t-d pointer"
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        Prints
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setMediumFilteredOptions((prevMediumOptions) => {
                          if (prevMediumOptions.includes("Work on Paper")) {
                            return prevMediumOptions.filter(
                              (option) => option !== "Work on Paper"
                            );
                          } else {
                            return [...prevMediumOptions, "Work on Paper"];
                          }
                        });
                      }}
                      onMouseEnter={() => setworkOnPaperOptionHovered(true)}
                      onMouseLeave={() => setworkOnPaperOptionHovered(false)}
                      className="parent-medium-filter-options  pointer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          border: workOnPaperOptionHovered
                            ? "1px solid rgb(16,35,215)"
                            : "1px solid rgb(231,231,231)",
                          transition: "border 0.3s ease-in-out",
                        }}
                      ></div>
                      <div
                        className="hover_color_effect hover_color_effect_t-d pointer"
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        Work on Paper
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setMediumFilteredOptions((prevMediumOptions) => {
                          if (prevMediumOptions.includes("NFT")) {
                            return prevMediumOptions.filter(
                              (option) => option !== "NFT"
                            );
                          } else {
                            return [...prevMediumOptions, "NFT"];
                          }
                        });
                      }}
                      onMouseEnter={() => setNFTOptionHovered(true)}
                      onMouseLeave={() => setNFTOptionHovered(false)}
                      className="parent-medium-filter-options  pointer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          border: NFTOptionHovered
                            ? "1px solid rgb(16,35,215)"
                            : "1px solid rgb(231,231,231)",
                          transition: "border 0.3s ease-in-out",
                        }}
                      ></div>
                      <div
                        className="hover_color_effect hover_color_effect_t-d pointer"
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        NFT
                      </div>
                    </div>
                    {!showMoreMediumOptions && (
                      <>
                        <div className="box-20-px-m-top"></div>
                        <div
                          onClick={() => setShowMoreMediumOptions(true)}
                          style={{
                            fontSize: "13px",
                            lineHeight: "16px",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          Show more
                        </div>
                      </>
                    )}

                    {showMoreMediumOptions && (
                      <>
                        <div
                          onClick={() => {
                            setMediumFilteredOptions((prevMediumOptions) => {
                              if (prevMediumOptions.includes("Design")) {
                                return prevMediumOptions.filter(
                                  (option) => option !== "Design"
                                );
                              } else {
                                return [...prevMediumOptions, "Design"];
                              }
                            });
                          }}
                          onMouseEnter={() => setdesignOptionHovered(true)}
                          onMouseLeave={() => setdesignOptionHovered(false)}
                          className="parent-medium-filter-options  pointer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "18px",
                              height: "18px",
                              border: designOptionHovered
                                ? "1px solid rgb(16,35,215)"
                                : "1px solid rgb(231,231,231)",
                              transition: "border 0.3s ease-in-out",
                            }}
                          ></div>
                          <div
                            className="hover_color_effect hover_color_effect_t-d pointer"
                            style={{
                              color: "rgb(112,112,112)",
                            }}
                          >
                            Design
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            setMediumFilteredOptions((prevMediumOptions) => {
                              if (prevMediumOptions.includes("Drawing")) {
                                return prevMediumOptions.filter(
                                  (option) => option !== "Drawing"
                                );
                              } else {
                                return [...prevMediumOptions, "Drawing"];
                              }
                            });
                          }}
                          onMouseEnter={() => setdrawingOptionHovered(true)}
                          onMouseLeave={() => setdrawingOptionHovered(false)}
                          className="parent-medium-filter-options  pointer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "18px",
                              height: "18px",
                              border: drawingOptionHovered
                                ? "1px solid rgb(16,35,215)"
                                : "1px solid rgb(231,231,231)",
                              transition: "border 0.3s ease-in-out",
                            }}
                          ></div>
                          <div
                            className="hover_color_effect hover_color_effect_t-d pointer"
                            style={{
                              color: "rgb(112,112,112)",
                            }}
                          >
                            Drawing
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            setMediumFilteredOptions((prevMediumOptions) => {
                              if (prevMediumOptions.includes("Installation")) {
                                return prevMediumOptions.filter(
                                  (option) => option !== "Installation"
                                );
                              } else {
                                return [...prevMediumOptions, "Installation"];
                              }
                            });
                          }}
                          onMouseEnter={() =>
                            setinstallationOptionHovered(true)
                          }
                          onMouseLeave={() =>
                            setinstallationOptionHovered(false)
                          }
                          className="parent-medium-filter-options  pointer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "18px",
                              height: "18px",
                              border: installationOptionHovered
                                ? "1px solid rgb(16,35,215)"
                                : "1px solid rgb(231,231,231)",
                              transition: "border 0.3s ease-in-out",
                            }}
                          ></div>
                          <div
                            className="hover_color_effect hover_color_effect_t-d pointer"
                            style={{
                              color: "rgb(112,112,112)",
                            }}
                          >
                            Installation
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            setMediumFilteredOptions((prevMediumOptions) => {
                              if (prevMediumOptions.includes("Film/Video")) {
                                return prevMediumOptions.filter(
                                  (option) => option !== "Film/Video"
                                );
                              } else {
                                return [...prevMediumOptions, "Film/Video"];
                              }
                            });
                          }}
                          onMouseEnter={() => setfilmdVideoOptionHovered(true)}
                          onMouseLeave={() => setfilmdVideoOptionHovered(false)}
                          className="parent-medium-filter-options  pointer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "18px",
                              height: "18px",
                              border: filmdVideoOptionHovered
                                ? "1px solid rgb(16,35,215)"
                                : "1px solid rgb(231,231,231)",
                              transition: "border 0.3s ease-in-out",
                            }}
                          ></div>
                          <div
                            className="hover_color_effect hover_color_effect_t-d pointer"
                            style={{
                              color: "rgb(112,112,112)",
                            }}
                          >
                            Film/Video
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            setMediumFilteredOptions((prevMediumOptions) => {
                              if (prevMediumOptions.includes("Jewelry")) {
                                return prevMediumOptions.filter(
                                  (option) => option !== "Jewelry"
                                );
                              } else {
                                return [...prevMediumOptions, "Jewelry"];
                              }
                            });
                          }}
                          onMouseEnter={() => setjewelryOptionHovered(true)}
                          onMouseLeave={() => setjewelryOptionHovered(false)}
                          className="parent-medium-filter-options  pointer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "18px",
                              height: "18px",
                              border: jewelryOptionHovered
                                ? "1px solid rgb(16,35,215)"
                                : "1px solid rgb(231,231,231)",
                              transition: "border 0.3s ease-in-out",
                            }}
                          ></div>
                          <div
                            className="hover_color_effect hover_color_effect_t-d pointer"
                            style={{
                              color: "rgb(112,112,112)",
                            }}
                          >
                            Jewelry
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            setMediumFilteredOptions((prevMediumOptions) => {
                              if (
                                prevMediumOptions.includes("Performance Art")
                              ) {
                                return prevMediumOptions.filter(
                                  (option) => option !== "Performance Art"
                                );
                              } else {
                                return [
                                  ...prevMediumOptions,
                                  "Performance Art",
                                ];
                              }
                            });
                          }}
                          onMouseEnter={() =>
                            setperformanceArtOptionHovered(true)
                          }
                          onMouseLeave={() =>
                            setperformanceArtOptionHovered(false)
                          }
                          className="parent-medium-filter-options  pointer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "18px",
                              height: "18px",
                              border: performanceArtOptionHovered
                                ? "1px solid rgb(16,35,215)"
                                : "1px solid rgb(231,231,231)",
                              transition: "border 0.3s ease-in-out",
                            }}
                          ></div>
                          <div
                            className="hover_color_effect hover_color_effect_t-d pointer"
                            style={{
                              color: "rgb(112,112,112)",
                            }}
                          >
                            Performance Art
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            setMediumFilteredOptions((prevMediumOptions) => {
                              if (prevMediumOptions.includes("Reproduction")) {
                                return prevMediumOptions.filter(
                                  (option) => option !== "Reproduction"
                                );
                              } else {
                                return [...prevMediumOptions, "Reproduction"];
                              }
                            });
                          }}
                          onMouseEnter={() =>
                            setreproductionOptionHovered(true)
                          }
                          onMouseLeave={() =>
                            setreproductionOptionHovered(false)
                          }
                          className="parent-medium-filter-options  pointer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "18px",
                              height: "18px",
                              border: reproductionOptionHovered
                                ? "1px solid rgb(16,35,215)"
                                : "1px solid rgb(231,231,231)",
                              transition: "border 0.3s ease-in-out",
                            }}
                          ></div>
                          <div
                            className="hover_color_effect hover_color_effect_t-d pointer"
                            style={{
                              color: "rgb(112,112,112)",
                            }}
                          >
                            Reproduction
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            setMediumFilteredOptions((prevMediumOptions) => {
                              if (
                                prevMediumOptions.includes(
                                  "Ephemera or Merchandise"
                                )
                              ) {
                                return prevMediumOptions.filter(
                                  (option) =>
                                    option !== "Ephemera or Merchandise"
                                );
                              } else {
                                return [
                                  ...prevMediumOptions,
                                  "Ephemera or Merchandise",
                                ];
                              }
                            });
                          }}
                          onMouseEnter={() =>
                            setephemeraOrMerchandiseOptionHovered(true)
                          }
                          onMouseLeave={() =>
                            setephemeraOrMerchandiseOptionHovered(false)
                          }
                          className="parent-medium-filter-options  pointer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "18px",
                              height: "18px",
                              border: ephemeraOrMerchandiseOptionHovered
                                ? "1px solid rgb(16,35,215)"
                                : "1px solid rgb(231,231,231)",
                              transition: "border 0.3s ease-in-out",
                            }}
                          ></div>
                          <div
                            className="hover_color_effect hover_color_effect_t-d pointer"
                            style={{
                              color: "rgb(112,112,112)",
                            }}
                          >
                            Ephemera or Merchandise
                          </div>
                        </div>
                      </>
                    )}
                    {showMoreMediumOptions && (
                      <>
                        <div className="box-20-px-m-top"></div>
                        <div
                          onClick={() => setShowMoreMediumOptions(false)}
                          style={{
                            fontSize: "13px",
                            lineHeight: "16px",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          Hide
                        </div>
                      </>
                    )}
                  </div>
                )}
                <div
                  className="box-40-px-m-top"
                  style={{
                    borderBottom: "1px solid rgb(0,0,0)",
                  }}
                ></div>
                <div className="box-40-px-m-top"></div>
                <div
                  onClick={() => {
                    setHidePrice(!hidePrice);
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <div>Price</div>
                  <div className="pointer">
                    {hidePrice ? (
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 18 18"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M9.00006 12.88L2.06006 5.94001L2.94006 5.06001L9.00006 11.12L15.0601 5.06001L15.9401 5.94001L9.00006 12.88Z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 18 18"
                        fill="currentColor"
                      >
                        <path d="M15.0601 12.94L9.00006 6.88001L2.94006 12.94L2.06006 12.06L9.00006 5.12001L15.9401 12.06L15.0601 12.94Z"></path>
                      </svg>
                    )}
                  </div>
                </div>
                <div className="box-20-px-m-top"></div>
                {!hidePrice && (
                  <>
                    <div className="price-filter-options">
                      <div className="range-track">
                        <div
                          className="range-track-first-left-ball"
                          style={clipStyle}
                        ></div>

                        <input
                          className="range-slider"
                          type="range"
                          min={0}
                          max={50000}
                          step={100}
                          value={minValue}
                          onChange={handleMinChange}
                          style={{}}
                        />
                        <input
                          className="range-slider"
                          type="range"
                          min={0}
                          max={50000}
                          step={100}
                          value={maxValue}
                          onChange={handleMaxChange}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                        lineHeight: "16px",
                        color: "rgb(112,112,112)",
                      }}
                    >
                      <p>${0}</p>
                      <p>${50000}+</p>
                    </div>
                    <div className="box-40-px-m-top"></div>
                    <div
                      className="input-wrapper-min-max-value"
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        paddingBottom: "40px",
                      }}
                    >
                      {/* min value input */}
                      <div
                        style={{
                          flexBasis: "50%",
                        }}
                      >
                        <Input
                          inputType={"text"}
                          icon={"$USD"}
                          iconPositionRight={true}
                          height={"100dvh"}
                          maxHeight={"50px"}
                          onChange={handleMinChange}
                          labelClassName={
                            priceFilter?.minValue || minValue
                              ? `styled-input-label filled-input-label unica-regular-font`
                              : `styled-input-label unica-regular-font`
                          }
                          labelHtmlFor={"Min"}
                          labelText={"Min"}
                          className={"styled-input-with-label"}
                          borderRadius={"3px"}
                          value={minValue}
                          name={"minValue"}
                          withLabel={true}
                          iconAsText={true}
                        />
                      </div>
                      {/* max value input */}
                      <div
                        style={{
                          flexBasis: "50%",
                        }}
                      >
                        <Input
                          inputType={"text"}
                          icon={"$USD"}
                          iconPositionRight={true}
                          height={"100dvh"}
                          maxHeight={"50px"}
                          onChange={handleMaxChange}
                          labelClassName={
                            priceFilter?.maxValue || maxValue
                              ? `styled-input-label filled-input-label unica-regular-font`
                              : `styled-input-label unica-regular-font`
                          }
                          labelHtmlFor={"Max"}
                          labelText={"Max"}
                          className={"styled-input-with-label"}
                          borderRadius={"3px"}
                          value={maxValue}
                          name={"maxValue"}
                          withLabel={true}
                          iconAsText={true}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </>
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
                <div
                  style={{
                    backgroundColor: "transparent",
                    position: "absolute",
                    color: "white",
                    left: "20px",
                    top: "20px",
                    zIndex: 1,
                    display: welcomeModalTabIndex === 5 && "none",
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
                    display: welcomeModalTabIndex === 5 && "none",
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
                {welcomeModalTabIndex > 1 &&
                  welcomeModalTabIndex !== 5 &&
                  width > 900 && (
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
                              onClick={closeWelcomeModalLastTab}
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
                ) : welcomeModalTabIndex === 5 ? (
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
                            flexBasis: "100%",
                            backgroundColor: "rgb(0,0,0)",
                          }}
                        >
                          <LoadingSpinner
                            isLoadingProfileImage={false}
                            welcomeModalClosing={true}
                          />
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
          <>
            <div
              style={{
                height: "auto",
                width: "100%",
                // overflowX: "hidden",
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
                      slideIndex === 2 && width > 768
                        ? "translateX(-200%)"
                        : width > 768
                        ? "translateX(0%)"
                        : width <= 768 && slideIndex === 2
                        ? "translateY(-200%)"
                        : "translateY(0%)",
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
                    src="https://d7hftxdivxxvm.cloudfront.net?height=500&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FThk1jhNX2Vevzs5DDP25CQ%2Fmain.jpg&width=1270"
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
                    Michael Polakowski, Laundry, 2023
                  </div>
                </div>
                <div
                  style={{
                    minHeight: width <= 768 ? "150px" : "500px",
                    backgroundColor: "#F7F7F7",
                    transform:
                      slideIndex === 2 && width > 768
                        ? "translateX(-200%)"
                        : slideIndex !== 2 && width > 768
                        ? "translateX(0%)"
                        : slideIndex === 2 && width <= 768
                        ? "translateY(-200%)"
                        : slideIndex !== 2 && width <= 768
                        ? "translateY(0%)"
                        : "",
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
                        fontSize: width <= 768 ? "26px" : "40px",
                        lineHeight: width <= 768 ? "32px" : "48px",
                        color: "rgb(0,0,0)",
                      }}
                    >
                      Rising Market Stars
                    </div>
                    <div
                      style={{
                        fontSize: width <= 768 ? "13px" : "26px",
                        lineHeight: width <= 768 ? "20px" : "32px",
                        color: "rgb(112,112,112)",
                      }}
                    >
                      Be the first to discover the leading artists <br />
                      of tomorrow, at Foundations
                    </div>
                    <div
                      style={{
                        width: "296.66px",
                        maxHeight: "50px",
                        height: "100%",
                        display: width <= 768 && "none",
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
                          opacity: "0.3",
                        }}
                      >
                        Explore Collection
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    transform:
                      slideIndex === 2 && width > 768
                        ? "translateX(-200%)"
                        : width > 768
                        ? "translateX(0%)"
                        : width <= 768 && slideIndex === 2
                        ? "translateY(-200%)"
                        : "translateY(10%)",
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
                    src="https://d7hftxdivxxvm.cloudfront.net?height=500&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FIvQy5c5NtcFcNmT2J696JA%2Fmain.jpg&width=1270"
                    alt=""
                  />
                  <div
                    className="unica-regular-font"
                    style={{
                      position: "absolute",
                      bottom: width <= 768 ? "30px" : "12px",
                      left: width <= 768 ? "36px" : "12px",
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
                    minHeight: width <= 768 ? "150px" : "500px",
                    backgroundColor: "#F7F7F7",
                    transform:
                      slideIndex === 2 && width > 768
                        ? "translateX(-200%)"
                        : slideIndex !== 2 && width > 768
                        ? "translateX(0%)"
                        : slideIndex === 2 && width <= 768
                        ? "translateY(-200%)"
                        : slideIndex !== 2 && width <= 768
                        ? "translateY(0%)"
                        : "",
                    transition: "transform 500ms ease 0s",
                    minWidth: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: width <= 768 ? "flex-start" : "center",
                    flexDirection: "column",
                    padding: width <= 768 && "20px 20px 29px 20px",
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
                        fontSize: width <= 768 ? "26px" : "40px",
                        lineHeight: width <= 768 ? "32px" : "48px",
                        color: "rgb(0,0,0)",
                      }}
                    >
                      Foundations Summer 2024
                    </div>
                    <div
                      style={{
                        fontSize: width <= 768 ? "13px" : "26px",
                        lineHeight: width <= 768 ? "20px" : "32px",
                        color: "rgb(112,112,112)",
                      }}
                    >
                      The online fair for emerging art is back. <br />
                      Collect fresh works by rising talents.
                    </div>
                    <div
                      style={{
                        width: "296.66px",
                        maxHeight: "50px",
                        height: "100%",
                        display: width <= 768 && "none",
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
                          opacity: "0.3",
                        }}
                      >
                        Explore Fair
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
            <div className="main-wrapper-sections unica-regular-font">
              <div
                style={{
                  fontSize: "26px",
                  lineHeight: "32px",
                  letterSpacing: "-0.01em",
                }}
              >
                Featured
              </div>
              <div className="box-40-px-m-top"></div>
              <div className="featured-wrapper">
                <div className="parent-featured-wrapper-div">
                  <div>
                    <img
                      src="https://d7hftxdivxxvm.cloudfront.net?height=297&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FSVPVMLGVHDxcW1Upz-C8Nw%2Fmain.jpg&width=445"
                      srcSet="https://d7hftxdivxxvm.cloudfront.net?height=297&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FSVPVMLGVHDxcW1Upz-C8Nw%2Fmain.jpg&width=445 1x, https://d7hftxdivxxvm.cloudfront.net?height=594&quality=50&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FSVPVMLGVHDxcW1Upz-C8Nw%2Fmain.jpg&width=890 2x"
                      alt=""
                      className="LazyImage__InnerLazyImage-sc-1fxlbs3-0 bXymUy"
                      style={{
                        opacity: 1,
                        width: width <= 768 ? "80px" : "325px",
                        height: width <= 768 ? "80px" : "200px",
                        objectFit: width <= 768 && "cover",
                      }}
                    />
                  </div>
                  {width <= 768 ? (
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          lineHeight: "20px",
                        }}
                      >
                        Art Bazaar Curatorial
                      </div>
                      <div
                        style={{
                          fontSize: "26px",
                          lineHeight: "32px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Figuration at Foundations
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: "13px",
                          lineHeight: "20px",
                        }}
                      >
                        Art Bazaar Curatorial
                      </div>
                      <div
                        style={{
                          fontSize: "26px",
                          lineHeight: "32px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Figuration at Foundations
                      </div>
                    </>
                  )}
                </div>
                <div className="parent-featured-wrapper-div">
                  <div>
                    {" "}
                    <img
                      src="https://d7hftxdivxxvm.cloudfront.net?height=297&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FYftpa5LMAFlJ4EkxeyCrxw%2Fmain.jpg&width=445"
                      srcSet="https://d7hftxdivxxvm.cloudfront.net?height=297&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FYftpa5LMAFlJ4EkxeyCrxw%2Fmain.jpg&width=445 1x, https://d7hftxdivxxvm.cloudfront.net?height=594&quality=50&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FYftpa5LMAFlJ4EkxeyCrxw%2Fmain.jpg&width=890 2x"
                      alt=""
                      className="LazyImage__InnerLazyImage-sc-1fxlbs3-0 bXymUy"
                      style={{
                        opacity: 1,
                        width: width <= 768 ? "80px" : "325px",
                        height: width <= 768 ? "80px" : "200px",
                        objectFit: width <= 768 && "cover",
                      }}
                    />
                  </div>
                  {width <= 768 ? (
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          lineHeight: "20px",
                        }}
                      >
                        Art Bazaar Editorial
                      </div>
                      <div
                        style={{
                          fontSize: "26px",
                          lineHeight: "32px",
                          letterSpacing: "-0.01em",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          maxWidth: "275px",
                        }}
                      >
                        10 Emerging Artists to Discover at Foundations Summer
                        2024
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: "13px",
                          lineHeight: "20px",
                        }}
                      >
                        Art Bazaar Editorial
                      </div>
                      <div
                        style={{
                          fontSize: "26px",
                          lineHeight: "32px",
                          letterSpacing: "-0.01em",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          maxWidth: "300px",
                        }}
                      >
                        10 Emerging Artists to <br /> Discover at Foundations{" "}
                        <br /> Summer 2024
                      </div>
                    </>
                  )}
                </div>
                <div className="parent-featured-wrapper-div">
                  <div>
                    <img
                      src="https://d7hftxdivxxvm.cloudfront.net?height=297&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F3TLYRRA6pAgU8PL_1ebKbg%2Fmain.jpg&width=445"
                      srcSet="https://d7hftxdivxxvm.cloudfront.net?height=297&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F3TLYRRA6pAgU8PL_1ebKbg%2Fmain.jpg&width=445 1x, https://d7hftxdivxxvm.cloudfront.net?height=594&quality=50&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F3TLYRRA6pAgU8PL_1ebKbg%2Fmain.jpg&width=890 2x"
                      alt=""
                      className="LazyImage__InnerLazyImage-sc-1fxlbs3-0 bXymUy"
                      style={{
                        opacity: 1,
                        width: width <= 768 ? "80px" : "325px",
                        height: width <= 768 ? "80px" : "200px",
                        objectFit: width <= 768 && "cover",
                      }}
                    />
                  </div>
                  {width <= 768 ? (
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          lineHeight: "20px",
                        }}
                      >
                        Art Bazaar Curatorial
                      </div>
                      <div
                        style={{
                          fontSize: "26px",
                          lineHeight: "32px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Olympic Visions
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: "13px",
                          lineHeight: "20px",
                        }}
                      >
                        Art Bazaar Curatorial
                      </div>
                      <div
                        style={{
                          fontSize: "26px",
                          lineHeight: "32px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Olympic Visions
                      </div>
                    </>
                  )}
                </div>
                <div className="parent-featured-wrapper-div">
                  <div>
                    <img
                      src="https://d7hftxdivxxvm.cloudfront.net?height=297&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FP7a4YjawPgHJFQ893niChg%2Fmain.jpg&width=445"
                      srcSet="https://d7hftxdivxxvm.cloudfront.net?height=297&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FP7a4YjawPgHJFQ893niChg%2Fmain.jpg&width=445 1x, https://d7hftxdivxxvm.cloudfront.net?height=594&quality=50&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FP7a4YjawPgHJFQ893niChg%2Fmain.jpg&width=890 2x"
                      alt=""
                      className="LazyImage__InnerLazyImage-sc-1fxlbs3-0 bXymUy"
                      style={{
                        opacity: 1,
                        width: width <= 768 ? "80px" : "325px",
                        height: width <= 768 ? "80px" : "200px",
                        objectFit: width <= 768 && "cover",
                      }}
                    />
                  </div>
                  {width <= 768 ? (
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          lineHeight: "20px",
                        }}
                      >
                        Art Bazaar Editorial
                      </div>
                      <div
                        style={{
                          fontSize: "26px",
                          lineHeight: "32px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        How to Collect Emerging Art
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: "13px",
                          lineHeight: "20px",
                        }}
                      >
                        Art Bazaar Editorial
                      </div>
                      <div
                        style={{
                          fontSize: "26px",
                          lineHeight: "32px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        How to Collect Emerging <br /> Art
                      </div>
                    </>
                  )}
                </div>
              </div>{" "}
              <div className="box-60-px-m-top"></div>
              <div className="buy-artworks-wrapper">
                <div
                  style={{
                    display: "flex",
                    alignItems: width <= 768 ? "flex-start" : "center",
                    justifyContent: "space-between",
                    flexDirection: width <= 768 && "column",
                  }}
                >
                  <div
                    style={{
                      fontSize: "26px",
                      lineHeight: "32px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Collect art and design online
                  </div>
                  <div
                    style={{
                      textDecoration: "underline",
                    }}
                  >
                    Browse by collection
                  </div>
                </div>
                <div className="box-40-px-m-top"></div>
                <div
                  style={{
                    borderBottom: "1px solid rgb(231, 231, 231)",
                  }}
                ></div>
                <div className="box-40-px-m-top"></div>
                <div className="filter-options-with-pictures-grid-container">
                  <div className="filter-options-div">
                    <div>
                      <img
                        width={"100%"}
                        height={"100%"}
                        style={{
                          objectFit: "cover",
                        }}
                        src="https://d7hftxdivxxvm.cloudfront.net?height=218&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F3NWE5exOx6ni85xifx7aeg%2Fnormalized.jpg&width=387"
                        srcSet="https://d7hftxdivxxvm.cloudfront.net?height=218&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F3NWE5exOx6ni85xifx7aeg%2Fnormalized.jpg&width=387 1x, https://d7hftxdivxxvm.cloudfront.net?height=436&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F3NWE5exOx6ni85xifx7aeg%2Fnormalized.jpg&width=774 2x"
                        alt=""
                      />
                    </div>
                    <div>Contemporary Art</div>
                  </div>
                  <div className="filter-options-div">
                    <div>
                      <img
                        width={"100%"}
                        height={"100%"}
                        style={{
                          objectFit: "cover",
                        }}
                        src="https://d7hftxdivxxvm.cloudfront.net?height=218&quality=80&resize_to=fill&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2Fmarketing_collections%2Fimages%2Fe53f2a60-64a5-4303-8121-08b24f1f665f%3FX-Amz-Expires%3D43200%26X-Amz-Date%3D20240801T211037Z%26X-Amz-Algorithm%3DAWS4-HMAC-SHA256%26X-Amz-Credential%3DAKIAICYI665LIMIGJ6KQ%252F20240801%252Fus-east-1%252Fs3%252Faws4_request%26X-Amz-SignedHeaders%3Dhost%26X-Amz-Signature%3D25694da73cff19e00fbd74ac32930371d0f72b627746ee76b7622b1ade7f86be&width=387"
                        srcSet="https://d7hftxdivxxvm.cloudfront.net?height=218&quality=80&resize_to=fill&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2Fmarketing_collections%2Fimages%2Fe53f2a60-64a5-4303-8121-08b24f1f665f%3FX-Amz-Expires%3D43200%26X-Amz-Date%3D20240801T211037Z%26X-Amz-Algorithm%3DAWS4-HMAC-SHA256%26X-Amz-Credential%3DAKIAICYI665LIMIGJ6KQ%252F20240801%252Fus-east-1%252Fs3%252Faws4_request%26X-Amz-SignedHeaders%3Dhost%26X-Amz-Signature%3D25694da73cff19e00fbd74ac32930371d0f72b627746ee76b7622b1ade7f86be&width=387 1x, https://d7hftxdivxxvm.cloudfront.net?height=436&quality=80&resize_to=fill&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2Fmarketing_collections%2Fimages%2Fe53f2a60-64a5-4303-8121-08b24f1f665f%3FX-Amz-Expires%3D43200%26X-Amz-Date%3D20240801T211037Z%26X-Amz-Algorithm%3DAWS4-HMAC-SHA256%26X-Amz-Credential%3DAKIAICYI665LIMIGJ6KQ%252F20240801%252Fus-east-1%252Fs3%252Faws4_request%26X-Amz-SignedHeaders%3Dhost%26X-Amz-Signature%3D25694da73cff19e00fbd74ac32930371d0f72b627746ee76b7622b1ade7f86be&width=774 2x"
                      />
                    </div>
                    <div>Painting</div>
                  </div>
                  <div className="filter-options-div">
                    <div>
                      <img
                        width={"100%"}
                        height={"100%"}
                        style={{
                          objectFit: "cover",
                        }}
                        src="https://d7hftxdivxxvm.cloudfront.net?height=218&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FKmJZWb8ZAhKGv3mi7jT95w%2Fnormalized.jpg&width=387"
                        srcSet="https://d7hftxdivxxvm.cloudfront.net?height=218&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FKmJZWb8ZAhKGv3mi7jT95w%2Fnormalized.jpg&width=387 1x, https://d7hftxdivxxvm.cloudfront.net?height=436&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FKmJZWb8ZAhKGv3mi7jT95w%2Fnormalized.jpg&width=774 2x"
                        alt=""
                      />
                    </div>
                    <div>Street Art</div>
                  </div>
                  <div className="filter-options-div">
                    <div>
                      <img
                        width={"100%"}
                        height={"100%"}
                        style={{
                          objectFit: "cover",
                        }}
                        src="https://d7hftxdivxxvm.cloudfront.net?height=218&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FaWpQZXv1dzX4k1Kjosfm6w%2Fnormalized.jpg&width=387"
                        srcSet="https://d7hftxdivxxvm.cloudfront.net?height=218&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FaWpQZXv1dzX4k1Kjosfm6w%2Fnormalized.jpg&width=387 1x, https://d7hftxdivxxvm.cloudfront.net?height=436&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FaWpQZXv1dzX4k1Kjosfm6w%2Fnormalized.jpg&width=774 2x"
                        alt=""
                      />
                    </div>
                    <div>Photography</div>
                  </div>
                  <div className="filter-options-div">
                    <div>
                      <img
                        width={"100%"}
                        height={"100%"}
                        style={{
                          objectFit: "cover",
                        }}
                        src="https://d7hftxdivxxvm.cloudfront.net?height=218&quality=80&resize_to=fill&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2Fmarketing_collections%2Fimages%2F3640a99b-4b4c-44ef-a257-a80da50ecdbe%3FX-Amz-Expires%3D43200%26X-Amz-Date%3D20240801T211038Z%26X-Amz-Algorithm%3DAWS4-HMAC-SHA256%26X-Amz-Credential%3DAKIAICYI665LIMIGJ6KQ%252F20240801%252Fus-east-1%252Fs3%252Faws4_request%26X-Amz-SignedHeaders%3Dhost%26X-Amz-Signature%3Dc549e2b4b4deeffd7156ff671abc4a09283b1f393a799e577e9529ef36323179&width=387"
                        srcSet="https://d7hftxdivxxvm.cloudfront.net?height=218&quality=80&resize_to=fill&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2Fmarketing_collections%2Fimages%2F3640a99b-4b4c-44ef-a257-a80da50ecdbe%3FX-Amz-Expires%3D43200%26X-Amz-Date%3D20240801T211038Z%26X-Amz-Algorithm%3DAWS4-HMAC-SHA256%26X-Amz-Credential%3DAKIAICYI665LIMIGJ6KQ%252F20240801%252Fus-east-1%252Fs3%252Faws4_request%26X-Amz-SignedHeaders%3Dhost%26X-Amz-Signature%3Dc549e2b4b4deeffd7156ff671abc4a09283b1f393a799e577e9529ef36323179&width=387 1x, https://d7hftxdivxxvm.cloudfront.net?height=436&quality=80&resize_to=fill&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2Fmarketing_collections%2Fimages%2F3640a99b-4b4c-44ef-a257-a80da50ecdbe%3FX-Amz-Expires%3D43200%26X-Amz-Date%3D20240801T211038Z%26X-Amz-Algorithm%3DAWS4-HMAC-SHA256%26X-Amz-Credential%3DAKIAICYI665LIMIGJ6KQ%252F20240801%252Fus-east-1%252Fs3%252Faws4_request%26X-Amz-SignedHeaders%3Dhost%26X-Amz-Signature%3Dc549e2b4b4deeffd7156ff671abc4a09283b1f393a799e577e9529ef36323179&width=774 2x"
                        alt=""
                      />
                    </div>
                    <div>Emerging Art</div>
                  </div>
                  <div className="filter-options-div">
                    <div>
                      <img
                        width={"100%"}
                        height={"100%"}
                        style={{
                          objectFit: "cover",
                        }}
                        src="https://d7hftxdivxxvm.cloudfront.net?height=218&quality=80&resize_to=fill&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2Fmarketing_collections%2Fimages%2F23aafc87-2498-492c-a87b-5a1568ca86b0%3FX-Amz-Expires%3D43200%26X-Amz-Date%3D20240801T211038Z%26X-Amz-Algorithm%3DAWS4-HMAC-SHA256%26X-Amz-Credential%3DAKIAICYI665LIMIGJ6KQ%252F20240801%252Fus-east-1%252Fs3%252Faws4_request%26X-Amz-SignedHeaders%3Dhost%26X-Amz-Signature%3Df578fbaa15dd6872e742d3d62748f826f509f90de5ed2c9658e266ee7d085ca0&width=387"
                        srcSet="https://d7hftxdivxxvm.cloudfront.net?height=218&quality=80&resize_to=fill&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2Fmarketing_collections%2Fimages%2F23aafc87-2498-492c-a87b-5a1568ca86b0%3FX-Amz-Expires%3D43200%26X-Amz-Date%3D20240801T211038Z%26X-Amz-Algorithm%3DAWS4-HMAC-SHA256%26X-Amz-Credential%3DAKIAICYI665LIMIGJ6KQ%252F20240801%252Fus-east-1%252Fs3%252Faws4_request%26X-Amz-SignedHeaders%3Dhost%26X-Amz-Signature%3Df578fbaa15dd6872e742d3d62748f826f509f90de5ed2c9658e266ee7d085ca0&width=387 1x, https://d7hftxdivxxvm.cloudfront.net?height=436&quality=80&resize_to=fill&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2Fmarketing_collections%2Fimages%2F23aafc87-2498-492c-a87b-5a1568ca86b0%3FX-Amz-Expires%3D43200%26X-Amz-Date%3D20240801T211038Z%26X-Amz-Algorithm%3DAWS4-HMAC-SHA256%26X-Amz-Credential%3DAKIAICYI665LIMIGJ6KQ%252F20240801%252Fus-east-1%252Fs3%252Faws4_request%26X-Amz-SignedHeaders%3Dhost%26X-Amz-Signature%3Df578fbaa15dd6872e742d3d62748f826f509f90de5ed2c9658e266ee7d085ca0&width=774 2x"
                        alt=""
                      />
                    </div>
                    <div>20th-Century Art</div>
                  </div>
                </div>
                <div className="box-40-px-m-top"></div>
                {width > 768 ? (
                  <>
                    <div className="filter-options-with-svgs-container">
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          onClick={() => setShowFiltersDetail(true)}
                          className="wrapper-detailed-filter"
                        >
                          <svg
                            width={18}
                            height={18}
                            viewBox="0 0 18 18"
                            fill="currentColor"
                          >
                            <path d="M10.006 11V9.99997H11.006V13H10.006V12H4V11H10.006ZM7.996 6.99997V7.99997H6.996V4.99997H7.996V5.99997H14V6.99997H7.996ZM6 5.99997V6.99997H4V5.99997H6ZM12 12V11H14V12H12Z"></path>
                          </svg>

                          <span
                            style={{
                              marginLeft: "5px",
                            }}
                          >
                            All filters
                          </span>
                        </div>
                        <div
                          ref={rarityPopoverRef}
                          style={{
                            position: "relative",
                          }}
                        >
                          <div
                            onClick={(e) => {
                              setShowRarityPopover(!showRarityPopover);
                            }}
                            className="wrapper-detailed-filter"
                          >
                            <span
                              style={{
                                marginRight: "5px",
                              }}
                            >
                              Rarity
                            </span>
                            <svg
                              width={18}
                              height={18}
                              viewBox="0 0 18 18"
                              fill="currentColor"
                            >
                              <path d="M15 6.62132L9 12.5L3 6.62132L4.14446 5.5L9 10.2574L13.8555 5.5L15 6.62132Z"></path>
                            </svg>
                          </div>
                          {showRarityPopover && (
                            <div className="popover-options">
                              <div
                                style={{
                                  padding: "10px",
                                  overflowY: "scroll",
                                  maxHeight: "230px",
                                  height: "100dvh",
                                }}
                              >
                                <div className="rarity-filter-options">
                                  <div
                                    onClick={() => {
                                      setRarityFilteredOptions(
                                        (prevRarityOptions) => {
                                          if (
                                            prevRarityOptions.includes("Unique")
                                          ) {
                                            return prevRarityOptions.filter(
                                              (option) => option !== "Unique"
                                            );
                                          } else {
                                            return [
                                              ...prevRarityOptions,
                                              "Unique",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setUniqeOptionHovered(true)
                                    }
                                    onMouseLeave={() =>
                                      setUniqeOptionHovered(false)
                                    }
                                    className="parent-rarity-filter-options pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border: uniqeOptionHovered
                                          ? "1px solid rgb(16,35,215)"
                                          : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      Unique
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setRarityFilteredOptions(
                                        (prevRarityOptions) => {
                                          if (
                                            prevRarityOptions.includes(
                                              "Limited Edition"
                                            )
                                          ) {
                                            return prevRarityOptions.filter(
                                              (option) =>
                                                option !== "Limited Edition"
                                            );
                                          } else {
                                            return [
                                              ...prevRarityOptions,
                                              "Limited Edition",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setLimitedEditionHovered(true)
                                    }
                                    onMouseLeave={() =>
                                      setLimitedEditionHovered(false)
                                    }
                                    className="parent-rarity-filter-options pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border: limitedEditionHovered
                                          ? "1px solid rgb(16,35,215)"
                                          : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      Limited Edition
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setRarityFilteredOptions(
                                        (prevRarityOptions) => {
                                          if (
                                            prevRarityOptions.includes(
                                              "Open Edition"
                                            )
                                          ) {
                                            return prevRarityOptions.filter(
                                              (option) =>
                                                option !== "Open Edition"
                                            );
                                          } else {
                                            return [
                                              ...prevRarityOptions,
                                              "Open Edition",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setOpenEditionHovered(true)
                                    }
                                    onMouseLeave={() =>
                                      setOpenEditionHovered(false)
                                    }
                                    className="parent-rarity-filter-options pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border: openEditionHovered
                                          ? "1px solid rgb(16,35,215)"
                                          : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      Open Edition
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setRarityFilteredOptions(
                                        (prevRarityOptions) => {
                                          if (
                                            prevRarityOptions.includes(
                                              "Unknown Edition"
                                            )
                                          ) {
                                            return prevRarityOptions.filter(
                                              (option) =>
                                                option !== "Unknown Edition"
                                            );
                                          } else {
                                            return [
                                              ...prevRarityOptions,
                                              "Unknown Edition",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setUnknowEditionHovered(true)
                                    }
                                    onMouseLeave={() =>
                                      setUnknowEditionHovered(false)
                                    }
                                    className="parent-rarity-filter-options  pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border: unknowEditionHovered
                                          ? "1px solid rgb(16,35,215)"
                                          : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      Unknown Edition
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="absolute-option"
                                style={{
                                  position: "absolute",
                                  bottom: "0px",
                                  backgroundColor: "white",
                                  width: "100%",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setShowRarityPopover(false);
                                    setRarityFilteredOptions([]);
                                  }}
                                  className="hover_bg_color_effect_white_text"
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "1px solid rgb(0,0,0)",
                                    borderRadius: "9999px",
                                    padding: "6px 25px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Clear
                                </button>
                                <button
                                  onClick={() => {
                                    setShowRarityPopover(false);
                                  }}
                                  className="hover_bg_color_effect_white_text"
                                  style={{
                                    marginRight: "8px",
                                    backgroundColor: "black",
                                    border: "1px solid rgb(0,0,0)",
                                    borderRadius: "9999px",
                                    padding: "6px 25px",
                                    color: "white",
                                    cursor: "pointer",
                                  }}
                                >
                                  Confirm
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div
                          ref={mediumPopoverRef}
                          style={{
                            position: "relative",
                          }}
                        >
                          <div
                            onClick={(e) => {
                              setShowMediumPopover(!showMediumPopover);
                            }}
                            className="wrapper-detailed-filter"
                          >
                            <span
                              style={{
                                marginRight: "5px",
                              }}
                            >
                              Medium
                            </span>{" "}
                            <svg
                              width={18}
                              height={18}
                              viewBox="0 0 18 18"
                              fill="currentColor"
                            >
                              <path d="M15 6.62132L9 12.5L3 6.62132L4.14446 5.5L9 10.2574L13.8555 5.5L15 6.62132Z"></path>
                            </svg>
                          </div>
                          {showMediumPopover && (
                            <div
                              style={{
                                position: "relative",
                              }}
                              className="popover-options"
                            >
                              <div
                                style={{
                                  padding: "10px",
                                  overflowY: "scroll",
                                  maxHeight: "230px",
                                  height: "100dvh",
                                }}
                              >
                                <div className="rarity-filter-options">
                                  <div
                                    onClick={() => {
                                      setMediumFilteredOptions(
                                        (prevMediumOptions) => {
                                          if (
                                            prevMediumOptions.includes(
                                              "Painting"
                                            )
                                          ) {
                                            return prevMediumOptions.filter(
                                              (option) => option !== "Painting"
                                            );
                                          } else {
                                            return [
                                              ...prevMediumOptions,
                                              "Painting",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setpaintingOptionHovered(true)
                                    }
                                    onMouseLeave={() =>
                                      setpaintingOptionHovered(false)
                                    }
                                    className="parent-rarity-filter-options pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border: paintingOptionHovered
                                          ? "1px solid rgb(16,35,215)"
                                          : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      Painting
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setMediumFilteredOptions(
                                        (prevMediumOptions) => {
                                          if (
                                            prevMediumOptions.includes(
                                              "Photography"
                                            )
                                          ) {
                                            return prevMediumOptions.filter(
                                              (option) =>
                                                option !== "Photography"
                                            );
                                          } else {
                                            return [
                                              ...prevMediumOptions,
                                              "Photography",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setphotographyOptionHovered(true)
                                    }
                                    onMouseLeave={() =>
                                      setphotographyOptionHovered(false)
                                    }
                                    className="parent-rarity-filter-options pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border: photographyOptionHovered
                                          ? "1px solid rgb(16,35,215)"
                                          : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      Photography
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setMediumFilteredOptions(
                                        (prevMediumOptions) => {
                                          if (
                                            prevMediumOptions.includes(
                                              "Sculpture"
                                            )
                                          ) {
                                            return prevMediumOptions.filter(
                                              (option) => option !== "Sculpture"
                                            );
                                          } else {
                                            return [
                                              ...prevMediumOptions,
                                              "Sculpture",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setsculptureOptionHovered(true)
                                    }
                                    onMouseLeave={() =>
                                      setsculptureOptionHovered(false)
                                    }
                                    className="parent-rarity-filter-options pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border: sculptureOptionHovered
                                          ? "1px solid rgb(16,35,215)"
                                          : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      Sculpture
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setMediumFilteredOptions(
                                        (prevMediumOptions) => {
                                          if (
                                            prevMediumOptions.includes(
                                              "Sculpture"
                                            )
                                          ) {
                                            return prevMediumOptions.filter(
                                              (option) => option !== "Sculpture"
                                            );
                                          } else {
                                            return [
                                              ...prevMediumOptions,
                                              "Sculpture",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setprintsOptionHovered(true)
                                    }
                                    onMouseLeave={() =>
                                      setprintsOptionHovered(false)
                                    }
                                    className="parent-rarity-filter-options pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border: printsOptionHovered
                                          ? "1px solid rgb(16,35,215)"
                                          : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      Prints
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setMediumFilteredOptions(
                                        (prevMediumOptions) => {
                                          if (
                                            prevMediumOptions.includes(
                                              "Work on Paper"
                                            )
                                          ) {
                                            return prevMediumOptions.filter(
                                              (option) =>
                                                option !== "Work on Paper"
                                            );
                                          } else {
                                            return [
                                              ...prevMediumOptions,
                                              "Work on Paper",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setworkOnPaperOptionHovered(true)
                                    }
                                    onMouseLeave={() =>
                                      setworkOnPaperOptionHovered(false)
                                    }
                                    className="parent-rarity-filter-options pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border: workOnPaperOptionHovered
                                          ? "1px solid rgb(16,35,215)"
                                          : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      Work on Paper
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setMediumFilteredOptions(
                                        (prevMediumOptions) => {
                                          if (
                                            prevMediumOptions.includes("NFT")
                                          ) {
                                            return prevMediumOptions.filter(
                                              (option) => option !== "NFT"
                                            );
                                          } else {
                                            return [
                                              ...prevMediumOptions,
                                              "NFT",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setNFTOptionHovered(true)
                                    }
                                    onMouseLeave={() =>
                                      setNFTOptionHovered(false)
                                    }
                                    className="parent-rarity-filter-options pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border: NFTOptionHovered
                                          ? "1px solid rgb(16,35,215)"
                                          : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      NFT
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setMediumFilteredOptions(
                                        (prevMediumOptions) => {
                                          if (
                                            prevMediumOptions.includes("Design")
                                          ) {
                                            return prevMediumOptions.filter(
                                              (option) => option !== "Design"
                                            );
                                          } else {
                                            return [
                                              ...prevMediumOptions,
                                              "Design",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setdesignOptionHovered(true)
                                    }
                                    onMouseLeave={() =>
                                      setdesignOptionHovered(false)
                                    }
                                    className="parent-rarity-filter-options pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border: designOptionHovered
                                          ? "1px solid rgb(16,35,215)"
                                          : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      Design
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setMediumFilteredOptions(
                                        (prevMediumOptions) => {
                                          if (
                                            prevMediumOptions.includes(
                                              "Installation"
                                            )
                                          ) {
                                            return prevMediumOptions.filter(
                                              (option) =>
                                                option !== "Installation"
                                            );
                                          } else {
                                            return [
                                              ...prevMediumOptions,
                                              "Installation",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setinstallationOptionHovered(true)
                                    }
                                    onMouseLeave={() =>
                                      setinstallationOptionHovered(false)
                                    }
                                    className="parent-rarity-filter-options pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border: installationOptionHovered
                                          ? "1px solid rgb(14, 14, 14)"
                                          : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      Installation
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setMediumFilteredOptions(
                                        (prevMediumOptions) => {
                                          if (
                                            prevMediumOptions.includes(
                                              "Film/Video"
                                            )
                                          ) {
                                            return prevMediumOptions.filter(
                                              (option) =>
                                                option !== "Film/Video"
                                            );
                                          } else {
                                            return [
                                              ...prevMediumOptions,
                                              "Film/Video",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setfilmdVideoOptionHovered(true)
                                    }
                                    onMouseLeave={() =>
                                      setfilmdVideoOptionHovered(false)
                                    }
                                    className="parent-rarity-filter-options pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border: filmdVideoOptionHovered
                                          ? "1px solid rgb(14, 14, 14)"
                                          : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      Film/Video
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setMediumFilteredOptions(
                                        (prevMediumOptions) => {
                                          if (
                                            prevMediumOptions.includes(
                                              "Jewelry"
                                            )
                                          ) {
                                            return prevMediumOptions.filter(
                                              (option) => option !== "Jewelry"
                                            );
                                          } else {
                                            return [
                                              ...prevMediumOptions,
                                              "Jewelry",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setjewelryOptionHovered(true)
                                    }
                                    onMouseLeave={() =>
                                      setjewelryOptionHovered(false)
                                    }
                                    className="parent-rarity-filter-options pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border: jewelryOptionHovered
                                          ? "1px solid rgb(14, 14, 14)"
                                          : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      Jewelry
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setMediumFilteredOptions(
                                        (prevMediumOptions) => {
                                          if (
                                            prevMediumOptions.includes(
                                              "Performance Art"
                                            )
                                          ) {
                                            return prevMediumOptions.filter(
                                              (option) =>
                                                option !== "Performance Art"
                                            );
                                          } else {
                                            return [
                                              ...prevMediumOptions,
                                              "Performance Art",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setperformanceArtOptionHovered(true)
                                    }
                                    onMouseLeave={() =>
                                      setperformanceArtOptionHovered(false)
                                    }
                                    className="parent-rarity-filter-options pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border: performanceArtOptionHovered
                                          ? "1px solid rgb(14, 14, 14)"
                                          : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      Performance Art
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setMediumFilteredOptions(
                                        (prevMediumOptions) => {
                                          if (
                                            prevMediumOptions.includes(
                                              "Reproduction"
                                            )
                                          ) {
                                            return prevMediumOptions.filter(
                                              (option) =>
                                                option !== "Reproduction"
                                            );
                                          } else {
                                            return [
                                              ...prevMediumOptions,
                                              "Reproduction",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setreproductionOptionHovered(true)
                                    }
                                    onMouseLeave={() =>
                                      setreproductionOptionHovered(false)
                                    }
                                    className="parent-rarity-filter-options pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border: reproductionOptionHovered
                                          ? "1px solid rgb(14, 14, 14)"
                                          : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      Reproduction
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setMediumFilteredOptions(
                                        (prevMediumOptions) => {
                                          if (
                                            prevMediumOptions.includes(
                                              "Ephemera or Merchandise"
                                            )
                                          ) {
                                            return prevMediumOptions.filter(
                                              (option) =>
                                                option !==
                                                "Ephemera or Merchandise"
                                            );
                                          } else {
                                            return [
                                              ...prevMediumOptions,
                                              "Ephemera or Merchandise",
                                            ];
                                          }
                                        }
                                      );
                                    }}
                                    onMouseEnter={() =>
                                      setephemeraOrMerchandiseOptionHovered(
                                        true
                                      )
                                    }
                                    onMouseLeave={() =>
                                      setephemeraOrMerchandiseOptionHovered(
                                        false
                                      )
                                    }
                                    className="parent-rarity-filter-options pointer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      marginBottom: "24px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        border:
                                          ephemeraOrMerchandiseOptionHovered
                                            ? "1px solid rgb(14, 14, 14)"
                                            : "1px solid rgb(231,231,231)",
                                        transition: "border 0.3s ease-in-out",
                                      }}
                                    ></div>
                                    <div
                                      className="hover_color_effect hover_color_effect_t-d pointer"
                                      style={{
                                        color: "rgb(112,112,112)",
                                      }}
                                    >
                                      Ephemera or Merchandise
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                style={{
                                  marginTop: "53px",
                                }}
                              ></div>
                              <div
                                className="absolute-option"
                                style={{
                                  position: "absolute",
                                  bottom: "0px",
                                  backgroundColor: "white",
                                  width: "100%",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setShowRarityPopover(false);
                                    setRarityFilteredOptions([]);
                                  }}
                                  className="hover_bg_color_effect_white_text"
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "1px solid rgb(0,0,0)",
                                    borderRadius: "9999px",
                                    padding: "6px 25px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Clear
                                </button>
                                <button
                                  onClick={() => {
                                    setShowRarityPopover(false);
                                  }}
                                  className="hover_bg_color_effect_white_text"
                                  style={{
                                    marginRight: "8px",
                                    backgroundColor: "black",
                                    border: "1px solid rgb(0,0,0)",
                                    borderRadius: "9999px",
                                    padding: "6px 25px",
                                    color: "white",
                                    cursor: "pointer",
                                  }}
                                >
                                  Confirm
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="wrapper-detailed-filter">
                          <span
                            style={{
                              marginRight: "5px",
                            }}
                          >
                            Price Range
                          </span>
                          <svg
                            width={18}
                            height={18}
                            viewBox="0 0 18 18"
                            fill="currentColor"
                          >
                            <path d="M15 6.62132L9 12.5L3 6.62132L4.14446 5.5L9 10.2574L13.8555 5.5L15 6.62132Z"></path>
                          </svg>
                        </div>
                      </div>
                      <div
                        className="hover_color_effect"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "13px",
                          lineHeight: "16px",
                          cursor: "pointer",
                        }}
                      >
                        <svg
                          width={16}
                          height={16}
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M2.76517 4.96465L5.66196 2.06787L8.55552 4.96465L7.97669 5.5236L6.06002 3.60694L6.06002 13.1319L5.26067 13.1319L5.26067 3.60694L3.34401 5.5236L2.76517 4.96465ZM7.44402 11.0384L8.02286 10.4794L9.93952 12.3961L9.93953 2.86787L10.7389 2.86787L10.7389 12.3961L12.6555 10.4794L13.2344 11.0384L10.3408 13.9319L7.44402 11.0384Z"></path>
                        </svg>
                        <span
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Sort: Recommended
                        </span>
                      </div>
                    </div>
                    <div className="box-40-px-m-top"></div>
                    <div className="filter-results">
                      {rarityFilteredOptions?.length > 0 && (
                        <>
                          {rarityFilteredOptions.map(
                            (eachRarityOption, index) => {
                              return (
                                <div
                                  onClick={() => {
                                    setRarityFilteredOptions(
                                      (prevRarityOptions) =>
                                        prevRarityOptions.filter(
                                          (_, i) => i !== index
                                        )
                                    );
                                  }}
                                  className="option-filter-detailed"
                                >
                                  <div>{eachRarityOption}</div>
                                  <svg
                                    width={15}
                                    height={15}
                                    viewBox="0 0 18 18"
                                    fill="currentColor"
                                  >
                                    <path d="M9.88006 9.00001L14.4401 13.56L13.5601 14.44L9.00006 9.88001L4.44006 14.44L3.56006 13.56L8.12006 9.00001L3.56006 4.44001L4.44006 3.56001L9.00006 8.12001L13.5601 3.56001L14.4401 4.44001L9.88006 9.00001Z"></path>
                                  </svg>
                                </div>
                              );
                            }
                          )}
                        </>
                      )}
                      {mediumFilteredOptions?.length > 0 && (
                        <>
                          {mediumFilteredOptions.map(
                            (eachMediumOption, index) => {
                              return (
                                <div
                                  onClick={() => {
                                    setMediumFilteredOptions(
                                      (prevMediumOptions) =>
                                        prevMediumOptions.filter(
                                          (_, i) => i !== index
                                        )
                                    );
                                  }}
                                  className="option-filter-detailed"
                                >
                                  <div>{eachMediumOption}</div>
                                  <svg
                                    width={15}
                                    height={15}
                                    viewBox="0 0 18 18"
                                    fill="currentColor"
                                  >
                                    <path d="M9.88006 9.00001L14.4401 13.56L13.5601 14.44L9.00006 9.88001L4.44006 14.44L3.56006 13.56L8.12006 9.00001L3.56006 4.44001L4.44006 3.56001L9.00006 8.12001L13.5601 3.56001L14.4401 4.44001L9.88006 9.00001Z"></path>
                                  </svg>
                                </div>
                              );
                            }
                          )}
                        </>
                      )}
                      {(priceFilter.maxValue || priceFilter.minValue) &&
                      priceFilter.minValue !== 0 ? (
                        <div
                          onClick={() => {
                            setPriceFilter((prevPriceOptions) => ({
                              ...prevPriceOptions,
                              minValue: "",
                              maxValue: "",
                            }));
                          }}
                          className="option-filter-detailed"
                        >
                          <div>
                            ${priceFilter.minValue}-${priceFilter.maxValue}
                          </div>
                          <svg
                            width={15}
                            height={15}
                            viewBox="0 0 18 18"
                            fill="currentColor"
                          >
                            <path d="M9.88006 9.00001L14.4401 13.56L13.5601 14.44L9.00006 9.88001L4.44006 14.44L3.56006 13.56L8.12006 9.00001L3.56006 4.44001L4.44006 3.56001L9.00006 8.12001L13.5601 3.56001L14.4401 4.44001L9.88006 9.00001Z"></path>
                          </svg>
                        </div>
                      ) : null}

                      {rarityFilteredOptions?.length > 0 ||
                      mediumFilteredOptions?.length > 0 ||
                      (priceFilter.maxValue &&
                        priceFilter.maxValue !== 50000) ||
                      (priceFilter.minValue && priceFilter.minValue !== 0) ? (
                        <div
                          onClick={() => {
                            setPriceFilter((prevOptions) => ({
                              ...prevOptions,
                              minValue: "",
                              maxValue: "",
                            }));
                            setMediumFilteredOptions([]);
                            setRarityFilteredOptions([]);
                          }}
                          className="option-filter-clear-all hover-sky-blue-effect hover_color_effect_t-d-kind-of-blue"
                        >
                          Clear all
                        </div>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <>hhmm</>
                )}
              </div>
            </div>
          </>
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
