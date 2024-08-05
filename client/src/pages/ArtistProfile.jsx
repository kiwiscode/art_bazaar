import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import ReadMoreLess from "../components/ReadMoreLess";
import useWindowDimensions from "../../utils/useWindowDimensions";
import axios from "axios";
import FollowButton from "../components/FollowButton";
import { useAntdMessageHandler } from "../../utils/useAntdMessageHandler";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../utils/favoritesUtils";

import { CollectorContext } from "../components/CollectorContext";
import { extractIds } from "../../utils/extractIds";
import Button from "../components/Button";
import Footer from "../components/Footer";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function ArtistProfile({ sendDataToParent }) {
  const { collectorInfo, getToken, updateCollector } =
    useContext(CollectorContext);
  const { artist_name } = useParams();
  const [artistName, setArtistName] = useState("");
  const [artist, setArtist] = useState(null);
  const [artworks, setArtWorks] = useState(null);
  const [showAuctionRecord, setShowAuctionRecord] = useState(null);
  const [showSecondaryMarket, setShowSecondaryMarket] = useState(null);
  const [showCriticallyAcclaimed, setShowCriticallyAcclaimed] = useState(null);
  const [showShows, setShowShows] = useState(null);
  const { width } = useWindowDimensions();
  const [artWorksOn, setArtWorksOn] = useState(true);
  const navigate = useNavigate();
  const {
    showCustomMessageArtworkSave,
    showCustomMessageDarkBg,
    contextHolder,
  } = useAntdMessageHandler();
  const favoriteArtworkIds = extractIds(collectorInfo?.favoriteArtworks, "_id");

  const cleanUrlArtistName = (name) => {
    const formattedName = name.replace(/-/g, " ");
    setArtistName(formattedName);
  };

  const refreshCollector = async () => {
    const { collectorInfo, getToken, updateCollector } =
      useContext(CollectorContext);
    try {
      const result = await axios.get(
        `${API_URL}/collectors/${collectorInfo?._id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      updateCollector({
        favoriteArtworks: result.data.favoriteArtworks,
      });
    } catch (error) {
      console.error("error:", error);
    }
  };

  const getArtist = async () => {
    try {
      const result = await axios.get(`${API_URL}/artist/${artist_name}`);

      console.log("result artist:", result);

      if (result.status === 200) {
        const { artist, artworks } = result.data;
        setArtist(artist);
        setArtWorks(artworks);
      } else {
        console.error("Error fetching artist. Status:", result.status);
      }
    } catch (error) {
      console.error("Error fetching artist:", error);
    }
  };

  const formatSalePrice = (salePrice) => {
    const numericPart = parseFloat(salePrice?.replace(/[$,]/g, ""));
    const suffix = salePrice?.match(/[a-zA-Z]+/g)?.[0]?.toLowerCase();
    if (!suffix) {
      return salePrice;
    }

    if (suffix === "million") {
      return `$${numericPart.toFixed(0)}M`;
    } else if (suffix === "thousand") {
      return `$${numericPart.toFixed(0)}K`;
    } else {
      return salePrice;
    }
  };

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

  // svg hover effect
  const [hoveredFavSvg, setHoveredFavSvg] = useState(null);

  useEffect(() => {
    if (artist_name) {
      cleanUrlArtistName(artist_name);
    }
    getArtist();
    if (collectorInfo?.active) {
      refreshCollector();
    }
  }, [artist_name]);

  const [alertCreated, setAlertCreated] = useState(null);

  return (
    <>
      {contextHolder}
      <div
        style={{
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          flex: "1 1 0%",
        }}
      >
        <div
          className="artist-header-first-parent"
          style={{
            padding: "0px 40px",
            marginLeft: "auto",
            marginRight: "auto",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              marginTop: "40px",
            }}
          ></div>
          {artist && (
            <>
              {/* header */}
              <div className="artist-header">
                {artist.profilePic !== "@imageUrl" && (
                  <div className="item-1">
                    <img
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                        boxSizing: "border-box",
                        overflowClipMargin: "content-box",
                      }}
                      src={artist.profilePic}
                      alt=""
                    />
                  </div>
                )}
                <div className="item-2">
                  <div className="artist-name">{artist.name}</div>
                  {artist.nationality && artist.born && artist.died ? (
                    <div className="artist-info">
                      <span>{artist.nationality}, </span>
                      <span>{artist.born}-</span>
                      <span>{artist.died}</span>
                    </div>
                  ) : artist.nationality && artist.born && !artist.died ? (
                    <div className="artist-info">
                      <span>{artist.nationality}, </span>
                      <span>b. {artist.born}</span>
                    </div>
                  ) : null}
                  <div className="box-20-px-m-top"></div>
                  <FollowButton
                    sendDataToParent={sendDataToParent}
                    artist={artist}
                    showFollowerNum={true}
                    followerCount={artist.followers.length}
                  />
                  <div className="box-20-px-m-top"></div>
                  {artist.description && (
                    <div>
                      <div className="artist-description">
                        <ReadMoreLess
                          text={artist.description}
                          maxLength={248}
                        ></ReadMoreLess>
                      </div>
                    </div>
                  )}
                </div>
                {artist.highAuctionRecord &&
                  artist.criticallyAcclaimed &&
                  artist.recentSoloShows.length && (
                    <div className="item-3">
                      <div
                        onClick={() => {
                          setShowAuctionRecord(!showAuctionRecord);
                        }}
                        className="artist-biography"
                      >
                        <div>
                          High auction record (
                          {formatSalePrice(
                            artist?.highAuctionRecord?.salePrice
                          )}
                          )
                        </div>{" "}
                        <div>
                          <svg
                            width={14}
                            height={14}
                            viewBox="0 0 18 18"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.00006 12.88L2.06006 5.94001L2.94006 5.06001L9.00006 11.12L15.0601 5.06001L15.9401 5.94001L9.00006 12.88Z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      {showAuctionRecord && (
                        <div
                          className="unica-regular-font"
                          style={{
                            textDecoration: "underline",
                            paddingBottom: "12px",
                            fontSize: "16px",
                            lineHeight: "26px",
                            color: "rgb(112,112,112)",
                            paddingLeft: width <= 768 && "20px",
                          }}
                        >
                          <span>{artist.highAuctionRecord.auctionHouse} </span>
                          <span>{artist.highAuctionRecord.year}</span>
                        </div>
                      )}
                      <div className="artist-biography">
                        <div>Active secondary market</div>{" "}
                        <div>
                          <svg
                            width={14}
                            height={14}
                            viewBox="0 0 18 18"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.00006 12.88L2.06006 5.94001L2.94006 5.06001L9.00006 11.12L15.0601 5.06001L15.9401 5.94001L9.00006 12.88Z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      <div
                        onClick={() =>
                          setShowCriticallyAcclaimed(!showCriticallyAcclaimed)
                        }
                        className="artist-biography"
                      >
                        {" "}
                        <div>Critically acclaimed</div>{" "}
                        <div>
                          <svg
                            width={14}
                            height={14}
                            viewBox="0 0 18 18"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.00006 12.88L2.06006 5.94001L2.94006 5.06001L9.00006 11.12L15.0601 5.06001L15.9401 5.94001L9.00006 12.88Z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      {showCriticallyAcclaimed && (
                        <div
                          className="unica-regular-font"
                          style={{
                            paddingBottom: "12px",
                            fontSize: "16px",
                            lineHeight: "26px",
                            color: "rgb(112,112,112)",
                            paddingLeft: width <= 768 && "20px",
                          }}
                        >
                          {artist.criticallyAcclaimed}
                        </div>
                      )}
                      <div
                        onClick={() => setShowShows(!showShows)}
                        className="artist-biography"
                      >
                        {" "}
                        <div>Solo show at 3 major institutions</div>{" "}
                        <div>
                          <svg
                            width={14}
                            height={14}
                            viewBox="0 0 18 18"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.00006 12.88L2.06006 5.94001L2.94006 5.06001L9.00006 11.12L15.0601 5.06001L15.9401 5.94001L9.00006 12.88Z"
                            ></path>
                          </svg>
                        </div>
                      </div>{" "}
                      {showShows && (
                        <>
                          {artist.recentSoloShows.map((eachShow) => {
                            return (
                              <div>
                                <div
                                  className="unica-regular-font"
                                  style={{
                                    paddingBottom: "12px",
                                    fontSize: "16px",
                                    lineHeight: "26px",
                                    color: "rgb(112,112,112)",
                                    paddingLeft: width <= 768 && "20px",
                                  }}
                                >
                                  {eachShow.title}, {eachShow.institution}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  )}
              </div>
              {/* divider */}
              <div
                style={{
                  marginTop: "40px",
                }}
              ></div>
              {/* sections */}
              <div
                style={{
                  borderBottom: "1px solid rgb(231, 231, 231)",
                  display: "flex",
                }}
              >
                <div
                  className="unica-regular-font"
                  style={{
                    display: "inline-flex",
                    textAlign: "center",
                    boxSizing: "border-box",
                    fontSize: "16px",
                    lineHeight: "26px",
                    borderBottom: artWorksOn && "1px solid rgb(0,0,0)",
                    padding: "0px 20px",
                    height: "40px",
                  }}
                >
                  Artworks
                </div>
              </div>
              {/* divider */}
              <div
                style={{
                  marginTop: "40px",
                }}
              ></div>
              {artworks.length ? (
                <div>
                  <div
                    className="unica-regular-font"
                    style={{
                      fontSize: "13px",
                      lineHeight: "20px",
                      boxSizing: "border-box",
                      padding: width <= 768 && "0px 40px",
                    }}
                  >
                    {artworks?.length} Artworks:
                  </div>
                  {/* divider */}
                  <div className="box-20-px-m-top"></div>
                </div>
              ) : (
                <div
                  className="unica-regular-font"
                  style={{
                    textAlign: "center",
                    fontSize: "20px",
                    lineHeight: "32px",
                    display: "grid",
                    gridTemplateColumns: "repeat(12,1fr)",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      gridColumn: "4 / span 6",
                    }}
                  >
                    <div>Get notified when new works are available</div>
                    <div
                      style={{
                        color: "rgb(112,112,112)",
                      }}
                    >
                      There are currently no works for sale for this artist.
                      Create an alert, and we’ll let you know when new works are
                      added.
                    </div>
                    <div className="box-20-px-m-top"></div>
                    <Button
                      className={"hover_bg_color_effect_white_text"}
                      padding="1px 25px"
                      text={alertCreated ? "Alert Created" : "Create Alert"}
                      textColor={alertCreated ? "white" : "black"}
                      borderRadius="15px"
                      backgroundColor={alertCreated ? "black" : "transparent"}
                      maxHeight="30px"
                      height="100dvh"
                      border="1px solid rgb(0,0,0)"
                      cursor="pointer"
                      fontSize="13px"
                      onClick={() => setAlertCreated(!alertCreated)}
                      svgIcon={
                        !alertCreated ? (
                          <svg
                            width={18}
                            height={18}
                            viewBox="0 0 18 18"
                            fill="currentColor"
                          >
                            <path d="M14.5909 12.229C13.5477 10.7754 12.9712 9.03892 12.9379 7.25001V5.93801C12.9379 4.89359 12.523 3.89194 11.7845 3.15342C11.046 2.4149 10.0444 2.00001 8.99993 2.00001C7.95551 2.00001 6.95387 2.4149 6.21535 3.15342C5.47683 3.89194 5.06193 4.89359 5.06193 5.93801V7.25001C5.02871 9.03892 4.4522 10.7754 3.40893 12.229C3.35808 12.2939 3.3262 12.3716 3.31685 12.4535C3.30749 12.5354 3.32102 12.6183 3.35593 12.693C3.42993 12.843 3.58293 12.938 3.74993 12.938H6.69893C6.63286 13.1506 6.5975 13.3715 6.59393 13.594C6.59393 14.2321 6.84742 14.8441 7.29863 15.2953C7.74985 15.7465 8.36182 16 8.99993 16C9.63804 16 10.25 15.7465 10.7012 15.2953C11.1524 14.8441 11.4059 14.2321 11.4059 13.594C11.4024 13.3715 11.367 13.1506 11.3009 12.938H14.2499C14.4169 12.938 14.5699 12.843 14.6439 12.693C14.6788 12.6183 14.6924 12.5354 14.683 12.4535C14.6737 12.3716 14.6418 12.2939 14.5909 12.229ZM10.5309 13.594C10.5309 14.0001 10.3696 14.3895 10.0825 14.6766C9.7954 14.9637 9.40598 15.125 8.99993 15.125C8.59389 15.125 8.20447 14.9637 7.91735 14.6766C7.63023 14.3895 7.46893 14.0001 7.46893 13.594C7.47093 13.366 7.52493 13.142 7.62593 12.938H10.3739C10.4749 13.142 10.5289 13.366 10.5309 13.594ZM4.57193 12.063C5.44321 10.607 5.91412 8.94661 5.93693 7.25001V5.93801C5.93693 5.12565 6.25964 4.34656 6.83407 3.77214C7.40849 3.19772 8.18758 2.87501 8.99993 2.87501C9.81229 2.87501 10.5914 3.19772 11.1658 3.77214C11.7402 4.34656 12.0629 5.12565 12.0629 5.93801V7.25001C12.0854 8.94652 12.556 10.6069 13.4269 12.063H4.57193Z"></path>
                          </svg>
                        ) : (
                          <svg
                            height="18"
                            width="18"
                            viewBox="0 0 18 18"
                            fill="currentColor"
                          >
                            <path d="M6.93608 12.206L14.5761 4.576L15.4241 5.425L6.93208 13.905L2.68408 9.623L3.53608 8.777L6.93608 12.206Z"></path>
                          </svg>
                        )
                      }
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {/* artworks */}
        <div
          style={{
            padding: "0px 40px",
          }}
          className="container-for-artworks-render"
        >
          {artworks?.map((eachWork, index) => {
            return (
              <div key={eachWork.id}>
                <div
                  onClick={() => {
                    navigate(`/artwork/${eachWork.urlName}`);
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
                      transition:
                        "transform 0.15s,transform-origin 100ms,opacity 0.25s",
                      objectFit: "cover",
                      opacity: 1,
                    }}
                    src={eachWork.imageUrl}
                    alt=""
                  />
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/artwork/${eachWork.urlName}`);
                  }}
                  className="pointer"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      boxSizing: "border-box",
                      maxWidth: "321.25px",
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
                      {artist?.name}
                    </div>
                    <div>
                      {favoriteArtworkIds?.includes(eachWork._id) &&
                      hoveredFavSvg !== index ? (
                        <svg
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCollector({
                              favoriteArtworks: (
                                collectorInfo?.favoriteArtworks || []
                              ).filter(
                                (eachArtwork) =>
                                  eachArtwork?._id !== eachWork._id
                              ),
                            });

                            showCustomMessageDarkBg(
                              "Removed from Saved Artworks",
                              6
                            );
                            removeFromFavorites(
                              collectorInfo,
                              eachWork,
                              getToken
                            );
                          }}
                          width={20}
                          height={20}
                          viewBox="0 0 18 18"
                          fill="rgb(16, 35, 215)"
                        >
                          <path d="M12.0022 3.00222C11.4768 3.00181 10.9564 3.10493 10.4708 3.30568C9.98524 3.50643 9.54397 3.80089 9.17222 4.17222L9.00222 4.34222L8.83222 4.17222C8.08166 3.42166 7.06368 3 6.00222 3C4.94077 3 3.92279 3.42166 3.17222 4.17222C2.42166 4.92279 2 5.94077 2 7.00222C2 8.06368 2.42166 9.08166 3.17222 9.83223L8.65222 15.3022C8.69711 15.3501 8.75133 15.3882 8.81153 15.4142C8.87173 15.4403 8.93663 15.4537 9.00222 15.4537C9.06782 15.4537 9.13272 15.4403 9.19292 15.4142C9.25312 15.3882 9.30733 15.3501 9.35222 15.3022L14.8322 9.83223C15.3923 9.2728 15.7737 8.55979 15.9283 7.78345C16.0829 7.00711 16.0037 6.20236 15.7007 5.47106C15.3977 4.73977 14.8845 4.11483 14.2262 3.67534C13.5678 3.23586 12.7938 3.0016 12.0022 3.00222Z"></path>
                        </svg>
                      ) : hoveredFavSvg === index &&
                        !favoriteArtworkIds?.includes(eachWork._id) ? (
                        <svg
                          onClick={(e) => {
                            e.stopPropagation();
                            setHoveredFavSvg(null);
                            if (collectorInfo.active) {
                              updateCollector({
                                favoriteArtworks: [
                                  eachWork,
                                  ...(collectorInfo?.favoriteArtworks || []),
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
                              eachWork,
                              getToken,
                              sendDataToParent
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
                              !favoriteArtworkIds?.includes(eachWork._id)
                            ) {
                              updateCollector({
                                favoriteArtworks: [
                                  eachWork,
                                  ...(collectorInfo?.favoriteArtworks || []),
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
                              eachWork,
                              getToken,
                              sendDataToParent
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
                      maxWidth: "321.25px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "rgb(112, 112, 112)",
                    }}
                  >
                    {eachWork.title}
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
        <Footer />
      </div>
    </>
  );
}

export default ArtistProfile;
