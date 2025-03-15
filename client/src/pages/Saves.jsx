import { useLocation, useNavigate } from "react-router-dom";
import useWindowDimensions from "../../utils/useWindowDimensions";
import Footer from "../components/Footer";
import HeaderNavBar from "../components/HeaderNavBar";
import { useContext, useEffect, useRef, useState } from "react";
import { CollectorContext } from "../components/CollectorContext";
import axios from "axios";
import { extractIds } from "../../utils/extractIds";
import { useAntdMessageHandler } from "../../utils/useAntdMessageHandler";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../utils/favoritesUtils";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function Saves() {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { collectorInfo, getToken, updateCollector } =
    useContext(CollectorContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate, collectorInfo]);

  const {
    contextHolder,
    showCustomMessageArtworkSave,
    showCustomMessageDarkBg,
  } = useAntdMessageHandler();
  const [collectorSaves, setCollectorSaves] = useState([]);
  const [sortedSaves, setSortedSaves] = useState([]);
  const [collectorSaves4Piece, setCollectorSaves4Piece] = useState([]);
  const location = useLocation();
  const navItems = [
    { label: "Saves", path: "/favorites/saves" },
    { label: "Follows", path: "/favorites/follows" },
    { label: "Alerts", path: "/favorites/alerts" },
  ];

  const getSaves = async () => {
    try {
      const result = await axios.get(
        `${API_URL}/collectors/${collectorInfo?._id}/saves`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      setCollectorSaves(result.data.favoriteArtworks);
      setCollectorSaves4Piece(result.data.favoriteArtworks.slice(0, 4));
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    if (collectorInfo?._id) {
      getSaves();
    }
  }, [collectorInfo?._id, collectorInfo]);

  const favoriteArtworkIds = extractIds(collectorInfo?.favoriteArtworks, "_id");
  const [hoveredFavSvg, setHoveredFavSvg] = useState(null);

  // mouse zoom hover effect
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const [scaleNumber, setScaleNumber] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const handleScaling = (index, scaleNum) => {
    setHoveredIndex(index);
    setScaleNumber(scaleNum);
  };

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTransformOrigin(
      `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`
    );
  };

  // sort select component option
  const [selectedOption, setSelectedOption] = useState("Recently Added");
  const [selectMediumBorder, setSelectMediumBorder] = useState(
    "1px solid rgb(194, 194, 194)"
  );
  const [selectOnClick, setSelectOnClick] = useState(false);
  const selectRef = useRef(null);
  const handleSelectOnClick = (event) => {
    if (selectRef.current && selectRef.current.contains(event.target)) {
      setSelectOnClick(true);
    } else {
      setSelectOnClick(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleSelectOnClick);
    return () => {
      document.removeEventListener("mousedown", handleSelectOnClick);
    };
  }, []);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    if (selectedOption === "Recently Added") {
      setSortedSaves(
        [...collectorSaves].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } else if (selectedOption === "First Added") {
      setSortedSaves(
        [...collectorSaves].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )
      );
    }
  }, [selectedOption, collectorSaves]);

  return (
    <>
      {contextHolder}
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
          Favorites
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
      <div className="favorites-detail-wrapper unica-regular-font">
        <div
          style={{
            fontSize: width <= 768 ? "20px" : "26px",
            lineHeight: width <= 768 ? "32px" : "32px",
            letterSpacing: "-0.01em",
          }}
        >
          Saves
        </div>
        {width <= 768 ? (
          <div className="box-20-px-m-top"></div>
        ) : (
          <div className="box-40-px-m-top"></div>
        )}
        <div
          style={{
            maxWidth: "222px",
            width: "100%",
            maxHeight: "272px",
            height: "100dvh",
          }}
          className="favorited-items-box"
        >
          <ul
            style={{
              listStyle: "none",
              whiteSpace: "nowrap",
              marginBottom: width <= 768 ? "20px" : "60px",
              marginTop: "0",
              marginLeft: "0",
              marginRight: "0",
              padding: "0",
              height: "100%",
              width: "100%",
            }}
          >
            <li>
              <a
                onClick={(e) => e.preventDefault()}
                href=""
                style={{
                  borderRadius: "10px",
                  display: "block",
                  border: "1px solid rgb(0,0,0)",
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 10px 0px",
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "initial",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {/* render first 4 saves from collector */}
                  <div
                    style={{
                      display: "flex",
                      padding: "10px 10px 0px 10px",
                      gap: "2px",
                    }}
                  >
                    <div
                      style={{
                        width: "100px",
                        height: "100px",

                        border: "1px solid rgb(216, 216, 216)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgb(247, 247, 247)",
                      }}
                    >
                      {collectorSaves4Piece?.length > 0 &&
                      collectorSaves4Piece[0] ? (
                        <img
                          width={"100%"}
                          height={"100%"}
                          style={{
                            objectFit: "cover",
                            overflow: "clip",
                            overflowClipMargin: "content-box",
                          }}
                          src={
                            collectorSaves4Piece[0]?.favoritedArtwork?.imageUrl
                          }
                        />
                      ) : (
                        <>
                          <svg
                            viewBox="0 0 18 18"
                            fill="rgb(112, 112, 112)"
                            width={18}
                            height={18}
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.31496 12.1957L5.62264 13.1957H4V5.1957H11.1611L10.4688 6.19568H4.99995V12.1957H6.31496ZM7.53122 12.1957L6.8389 13.1957H14V5.1957H12.3774L11.6851 6.19568H13V12.1957H7.53122ZM10.9928 7.19568H12V11.1957H8.22353L10.9928 7.19568ZM9.7765 7.19568L7.00727 11.1957H5.99995V7.19568H9.7765ZM13.3735 2L11.8534 4.1957H3V14.1957H4.93033L3.8043 15.8222L4.62649 16.3914L6.14659 14.1957H15V4.1957H13.0697L14.1957 2.56921L13.3735 2Z"
                            ></path>
                          </svg>
                        </>
                      )}
                    </div>
                    <div
                      style={{
                        width: "100px",
                        height: "100px",

                        border: "1px solid rgb(216, 216, 216)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgb(247, 247, 247)",
                      }}
                    >
                      {collectorSaves4Piece?.length > 0 &&
                      collectorSaves4Piece[1] ? (
                        <img
                          width={"100%"}
                          height={"100%"}
                          style={{
                            objectFit: "cover",
                            overflow: "clip",
                            overflowClipMargin: "content-box",
                          }}
                          src={
                            collectorSaves4Piece[1]?.favoritedArtwork?.imageUrl
                          }
                        />
                      ) : (
                        <>
                          <svg
                            viewBox="0 0 18 18"
                            fill="rgb(112, 112, 112)"
                            width={18}
                            height={18}
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.31496 12.1957L5.62264 13.1957H4V5.1957H11.1611L10.4688 6.19568H4.99995V12.1957H6.31496ZM7.53122 12.1957L6.8389 13.1957H14V5.1957H12.3774L11.6851 6.19568H13V12.1957H7.53122ZM10.9928 7.19568H12V11.1957H8.22353L10.9928 7.19568ZM9.7765 7.19568L7.00727 11.1957H5.99995V7.19568H9.7765ZM13.3735 2L11.8534 4.1957H3V14.1957H4.93033L3.8043 15.8222L4.62649 16.3914L6.14659 14.1957H15V4.1957H13.0697L14.1957 2.56921L13.3735 2Z"
                            ></path>
                          </svg>
                        </>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      padding: "2px 10px 0px 10px",
                      gap: "2px",
                    }}
                  >
                    <div
                      style={{
                        width: "100px",
                        height: "100px",

                        border: "1px solid rgb(216, 216, 216)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgb(247, 247, 247)",
                      }}
                    >
                      {collectorSaves4Piece?.length > 0 &&
                      collectorSaves4Piece[2] ? (
                        <img
                          width={"100%"}
                          height={"100%"}
                          style={{
                            objectFit: "cover",
                            overflow: "clip",
                            overflowClipMargin: "content-box",
                          }}
                          src={
                            collectorSaves4Piece[2]?.favoritedArtwork?.imageUrl
                          }
                        />
                      ) : (
                        <>
                          <svg
                            viewBox="0 0 18 18"
                            fill="rgb(112, 112, 112)"
                            width={18}
                            height={18}
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.31496 12.1957L5.62264 13.1957H4V5.1957H11.1611L10.4688 6.19568H4.99995V12.1957H6.31496ZM7.53122 12.1957L6.8389 13.1957H14V5.1957H12.3774L11.6851 6.19568H13V12.1957H7.53122ZM10.9928 7.19568H12V11.1957H8.22353L10.9928 7.19568ZM9.7765 7.19568L7.00727 11.1957H5.99995V7.19568H9.7765ZM13.3735 2L11.8534 4.1957H3V14.1957H4.93033L3.8043 15.8222L4.62649 16.3914L6.14659 14.1957H15V4.1957H13.0697L14.1957 2.56921L13.3735 2Z"
                            ></path>
                          </svg>
                        </>
                      )}
                    </div>
                    <div
                      style={{
                        width: "100px",
                        height: "100px",

                        border: "1px solid rgb(216, 216, 216)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgb(247, 247, 247)",
                      }}
                    >
                      {collectorSaves4Piece?.length > 0 &&
                      collectorSaves4Piece[3] ? (
                        <img
                          width={"100%"}
                          height={"100%"}
                          style={{
                            objectFit: "cover",
                            overflow: "clip",
                            overflowClipMargin: "content-box",
                          }}
                          src={
                            collectorSaves4Piece[3]?.favoritedArtwork?.imageUrl
                          }
                        />
                      ) : (
                        <>
                          <svg
                            viewBox="0 0 18 18"
                            fill="rgb(112, 112, 112)"
                            width={18}
                            height={18}
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.31496 12.1957L5.62264 13.1957H4V5.1957H11.1611L10.4688 6.19568H4.99995V12.1957H6.31496ZM7.53122 12.1957L6.8389 13.1957H14V5.1957H12.3774L11.6851 6.19568H13V12.1957H7.53122ZM10.9928 7.19568H12V11.1957H8.22353L10.9928 7.19568ZM9.7765 7.19568L7.00727 11.1957H5.99995V7.19568H9.7765ZM13.3735 2L11.8534 4.1957H3V14.1957H4.93033L3.8043 15.8222L4.62649 16.3914L6.14659 14.1957H15V4.1957H13.0697L14.1957 2.56921L13.3735 2Z"
                            ></path>
                          </svg>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    padding: "10px",
                  }}
                  className="info-box"
                >
                  <div>Saved Artworks</div>
                  <div
                    style={{
                      color: "rgb(112,112,112)",
                    }}
                  >
                    {collectorSaves?.length} Artworks
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
        {width <= 768 ? (
          <div className="box-20-px-m-top"></div>
        ) : (
          <div className="box-60-px-m-top"></div>
        )}

        {collectorSaves?.length ? (
          <>
            <div
              style={{
                fontSize: width <= 768 ? "20px" : "26px",
                lineHeight: width <= 768 ? "32px" : "32px",
                letterSpacing: "-0.01em",
              }}
            >
              Saved Artworks
            </div>
            {width <= 768 ? (
              <div className="box-40-px-m-top"></div>
            ) : (
              <div className="box-60-px-m-top"></div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: width <= 768 ? "column" : "row",
                gap: "20px",
                justifyContent: "space-between",
                alignItems: width <= 768 ? "flex-start" : "center",
              }}
              className="sort-component"
            >
              {width <= 768 ? (
                <>
                  <div>
                    {/* select option */}
                    <div
                      style={{
                        maxHeight: "50px",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      <label
                        htmlFor="Sort"
                        className={
                          selectOnClick
                            ? "select-label-on-focus styled-input-label unica-regular-font text-decoration-underline"
                            : selectedOption
                            ? "selected-active-select-input styled-input-label unica-regular-font"
                            : "styled-input-label unica-regular-font hover_color_effect hover_color_effect_t-d pointer"
                        }
                      >
                        Sort
                      </label>
                      <select
                        className="pointer select-input-new-artwork-form"
                        ref={selectRef}
                        value={selectedOption}
                        onChange={handleSelectChange}
                        style={{
                          width: "100%",
                          maxWidth: "100%",
                          border: selectMediumBorder,
                          transition: "border 0.25s ease",
                          height: "100dvh",
                          maxHeight: "50px",
                          fontSize: "16px",
                          lineHeight: "26px",
                          borderRadius: "3px",
                          outline: "none",
                          padding: "0px 5px",
                        }}
                        onFocus={() =>
                          setSelectMediumBorder("1px solid rgb(16, 35, 215)")
                        }
                        onBlur={() =>
                          setSelectMediumBorder("1px solid rgb(194, 194, 194)")
                        }
                      >
                        <option value="" disabled hidden>
                          Select an option
                        </option>
                        <option value="Recently Added">Recently Added</option>
                        <option value="First Added">First Added</option>
                      </select>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: width <= 768 ? "20px" : "16px",
                      lineHeight: width <= 768 ? "32px" : "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {collectorSaves?.length} Artworks
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      fontSize: width <= 768 ? "20px" : "16px",
                      lineHeight: width <= 768 ? "32px" : "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {collectorSaves?.length} Artworks
                  </div>
                  <div>
                    {/* select option */}
                    <div
                      style={{
                        maxHeight: "50px",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      <label
                        htmlFor="Sort"
                        className={
                          selectOnClick
                            ? "select-label-on-focus styled-input-label unica-regular-font text-decoration-underline"
                            : selectedOption
                            ? "selected-active-select-input styled-input-label unica-regular-font"
                            : "styled-input-label unica-regular-font hover_color_effect hover_color_effect_t-d pointer"
                        }
                      >
                        Sort
                      </label>
                      <select
                        className="pointer select-input-new-artwork-form"
                        ref={selectRef}
                        value={selectedOption}
                        onChange={handleSelectChange}
                        style={{
                          width: "100%",
                          maxWidth: "100%",
                          border: selectMediumBorder,
                          transition: "border 0.25s ease",
                          height: "100dvh",
                          maxHeight: "50px",
                          fontSize: "16px",
                          lineHeight: "26px",
                          borderRadius: "3px",
                          outline: "none",
                          padding: "0px 5px",
                        }}
                        onFocus={() =>
                          setSelectMediumBorder("1px solid rgb(16, 35, 215)")
                        }
                        onBlur={() =>
                          setSelectMediumBorder("1px solid rgb(194, 194, 194)")
                        }
                      >
                        <option value="" disabled hidden>
                          Select an option
                        </option>
                        <option value="Recently Added">Recently Added</option>
                        <option value="First Added">First Added</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
            {width <= 768 ? (
              <div className="box-20-px-m-top"></div>
            ) : (
              <div className="box-60-px-m-top"></div>
            )}

            {/* saves */}
            <div className="container-for-artworks-render-saves">
              {sortedSaves?.map((eachWork, index) => {
                return (
                  <div key={eachWork.favoritedArtwork?._id}>
                    <div
                      onClick={() => {
                        navigate(
                          `/artwork/${eachWork.favoritedArtwork?.urlName}`
                        );
                      }}
                      className="zoom-container"
                    >
                      <img
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => {
                          handleScaling(index, 1.75);
                        }}
                        onMouseLeave={() => {
                          setHoveredIndex(null);
                          setScaleNumber(1);
                        }}
                        className="zoom"
                        style={{
                          width: "100%",
                          height: "100%",
                          transformOrigin:
                            hoveredIndex === index && transformOrigin,
                          transform:
                            hoveredIndex === index && `scale(${scaleNumber})`,
                          objectFit: "cover",
                          opacity: 1,
                        }}
                        src={eachWork.favoritedArtwork?.imageUrl}
                        alt=""
                      />
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/artwork/${eachWork.favoritedArtwork?.urlName}`
                        );
                      }}
                      className="pointer"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          boxSizing: "border-box",
                          marginTop: "4px",
                        }}
                      >
                        <div
                          className="unica-regular-font"
                          style={{
                            fontSize: "16px",
                            lineHeight: "20px",
                          }}
                        >
                          {eachWork?.favoritedArtwork?.artist?.name}
                        </div>
                        <div>
                          {favoriteArtworkIds?.includes(
                            eachWork.favoritedArtwork?._id
                          ) && hoveredFavSvg !== index ? (
                            <svg
                              onClick={(e) => {
                                e.stopPropagation();
                                updateCollector({
                                  favoriteArtworks: (
                                    collectorInfo?.favoriteArtworks || []
                                  ).filter(
                                    (eachArtwork) =>
                                      eachArtwork?._id !==
                                      eachWork.favoritedArtwork?._id
                                  ),
                                });

                                showCustomMessageDarkBg(
                                  "Removed from Saved Artworks",
                                  6
                                );
                                removeFromFavorites(
                                  collectorInfo,
                                  eachWork.favoritedArtwork,
                                  getToken
                                );
                                getSaves();
                              }}
                              width={20}
                              height={20}
                              viewBox="0 0 18 18"
                              fill="rgb(16, 35, 215)"
                            >
                              <path d="M12.0022 3.00222C11.4768 3.00181 10.9564 3.10493 10.4708 3.30568C9.98524 3.50643 9.54397 3.80089 9.17222 4.17222L9.00222 4.34222L8.83222 4.17222C8.08166 3.42166 7.06368 3 6.00222 3C4.94077 3 3.92279 3.42166 3.17222 4.17222C2.42166 4.92279 2 5.94077 2 7.00222C2 8.06368 2.42166 9.08166 3.17222 9.83223L8.65222 15.3022C8.69711 15.3501 8.75133 15.3882 8.81153 15.4142C8.87173 15.4403 8.93663 15.4537 9.00222 15.4537C9.06782 15.4537 9.13272 15.4403 9.19292 15.4142C9.25312 15.3882 9.30733 15.3501 9.35222 15.3022L14.8322 9.83223C15.3923 9.2728 15.7737 8.55979 15.9283 7.78345C16.0829 7.00711 16.0037 6.20236 15.7007 5.47106C15.3977 4.73977 14.8845 4.11483 14.2262 3.67534C13.5678 3.23586 12.7938 3.0016 12.0022 3.00222Z"></path>
                            </svg>
                          ) : hoveredFavSvg === index &&
                            !favoriteArtworkIds?.includes(
                              eachWork?.favoritedArtwork?._id
                            ) ? (
                            <svg
                              onClick={(e) => {
                                e.stopPropagation();
                                setHoveredFavSvg(null);
                                if (collectorInfo.active) {
                                  updateCollector({
                                    favoriteArtworks: [
                                      eachWork.favoritedArtwork,
                                      ...(collectorInfo?.favoriteArtworks ||
                                        []),
                                    ],
                                  });
                                  showCustomMessageArtworkSave(
                                    "Artwork saved",
                                    "Saving an artwork signals interest to galleries.",
                                    "Add to a List",
                                    6
                                  );
                                }
                                addToFavorites(
                                  collectorInfo,
                                  eachWork.favoritedArtwork,
                                  getToken
                                );
                              }}
                              onMouseEnter={() => {
                                setHoveredFavSvg(index);
                              }}
                              onMouseLeave={() => setHoveredFavSvg(null)}
                              width={20}
                              height={20}
                              viewBox="0 0 18 18"
                              fill="rgb(16, 35, 215)"
                            >
                              <path d="M12.0022 3.00222C11.4768 3.00181 10.9564 3.10493 10.4708 3.30568C9.98524 3.50643 9.54397 3.80089 9.17222 4.17222L9.00222 4.34222L8.83222 4.17222C8.08166 3.42166 7.06368 3 6.00222 3C4.94077 3 3.92279 3.42166 3.17222 4.17222C2.42166 4.92279 2 5.94077 2 7.00222C2 8.06368 2.42166 9.08166 3.17222 9.83223L8.65222 15.3022C8.69711 15.3501 8.75133 15.3882 8.81153 15.4142C8.87173 15.4403 8.93663 15.4537 9.00222 15.4537C9.06782 15.4537 9.13272 15.4403 9.19292 15.4142C9.25312 15.3882 9.30733 15.3501 9.35222 15.3022L14.8322 9.83223C15.3923 9.2728 15.7737 8.55979 15.9283 7.78345C16.0829 7.00711 16.0037 6.20236 15.7007 5.47106C15.3977 4.73977 14.8845 4.11483 14.2262 3.67534C13.5678 3.23586 12.7938 3.0016 12.0022 3.00222Z"></path>
                            </svg>
                          ) : (
                            <svg
                              onClick={(e) => {
                                e.stopPropagation();
                                if (
                                  collectorInfo.active &&
                                  !favoriteArtworkIds?.includes(
                                    eachWork.favoritedArtwork?._id
                                  )
                                ) {
                                  updateCollector({
                                    favoriteArtworks: [
                                      eachWork.favoritedArtwork,
                                      ...(collectorInfo?.favoriteArtworks ||
                                        []),
                                    ],
                                  });

                                  showCustomMessageArtworkSave(
                                    "Artwork saved",
                                    "Saving an artwork signals interest to galleries.",
                                    "Add to a List",
                                    6
                                  );
                                }
                                addToFavorites(
                                  collectorInfo,
                                  eachWork.favoritedArtwork,
                                  getToken
                                );
                              }}
                              onMouseEnter={() => {
                                setHoveredFavSvg(index);
                              }}
                              width={20}
                              height={20}
                              viewBox="0 0 18 18"
                              fill={"rgb(0, 0, 0)"}
                            >
                              <path d="M11.9998 3.00002C11.4743 2.9996 10.954 3.10272 10.4684 3.30347C9.9828 3.50422 9.54153 3.79868 9.16978 4.17002L8.99978 4.34002L8.82978 4.17002C8.07922 3.41945 7.06124 2.99779 5.99978 2.99779C4.93833 2.99779 3.92035 3.41945 3.16978 4.17002C2.41922 4.92058 1.99756 5.93856 1.99756 7.00002C1.99756 8.06147 2.41922 9.07945 3.16978 9.83002L8.64978 15.3C8.69467 15.3478 8.74889 15.386 8.80909 15.412C8.86929 15.4381 8.93419 15.4515 8.99978 15.4515C9.06538 15.4515 9.13028 15.4381 9.19048 15.412C9.25068 15.386 9.30489 15.3478 9.34978 15.3L14.8298 9.83002C15.3898 9.27059 15.7713 8.55758 15.9259 7.78124C16.0805 7.0049 16.0013 6.20015 15.6983 5.46886C15.3953 4.73756 14.8821 4.11262 14.2237 3.67313C13.5653 3.23365 12.7914 2.99939 11.9998 3.00002ZM14.1198 9.12002L8.99978 14.24L3.87978 9.12002C3.58504 8.84537 3.34863 8.51417 3.18466 8.14617C3.02069 7.77817 2.93252 7.38092 2.92542 6.97811C2.91831 6.57529 2.99241 6.17518 3.14329 5.80163C3.29418 5.42807 3.51875 5.08874 3.80363 4.80386C4.0885 4.51899 4.42784 4.29441 4.80139 4.14353C5.17495 3.99264 5.57506 3.91854 5.97787 3.92565C6.38068 3.93276 6.77794 4.02092 7.14594 4.18489C7.51393 4.34886 7.84513 4.58527 8.11978 4.88002L8.64978 5.40002L8.99978 5.76002L9.34978 5.40002L9.87978 4.88002C10.4485 4.3501 11.2007 4.0616 11.9779 4.07532C12.7551 4.08903 13.4966 4.40388 14.0463 4.95353C14.5959 5.50318 14.9108 6.24472 14.9245 7.02193C14.9382 7.79913 14.6497 8.55132 14.1198 9.12002Z"></path>
                            </svg>
                          )}
                        </div>
                      </div>
                      <div
                        className="unica-italic-font"
                        style={{
                          fontSize: "16px",
                          lineHeight: "20px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "rgb(112, 112, 112)",
                        }}
                      >
                        {eachWork?.favoritedArtwork?.title}
                      </div>
                    </div>
                    <div
                      style={{
                        height: "40px",
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
      <Footer />
    </>
  );
}

export default Saves;
