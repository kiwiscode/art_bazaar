import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ZoomableImageCanvas from "../components/ZoomableImageCanvas";
import { Modal } from "@mui/material";
import ShareButton from "../components/ShareButton";
import FollowButton from "../components/FollowButton";
import ReadMoreLess from "../components/ReadMoreLess";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../utils/favoritesUtils";
import { useAntdMessageHandler } from "../../utils/useAntdMessageHandler";
import { CollectorContext } from "../components/CollectorContext";
import { extractIds } from "../../utils/extractIds";
import Footer from "../components/Footer";
import useWindowDimensions from "../../utils/useWindowDimensions";
import Button from "../components/Button";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function Artwork({ sendDataToParent }) {
  const { artworkName } = useParams();
  const navigate = useNavigate();
  const { collectorInfo, updateCollector, getToken } =
    useContext(CollectorContext);
  const { width } = useWindowDimensions();
  const [artwork, setArtwork] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [viewInRoomModal, setViewInRoomModal] = useState(false);
  const [viewedWork, setViewedWork] = useState(null);
  const {
    showCustomMessageArtworkSave,
    showCustomMessageDarkBg,
    contextHolder,
  } = useAntdMessageHandler();
  const favoriteArtworkIds = extractIds(collectorInfo?.favoriteArtworks, "_id");

  const refreshCollector = async () => {
    try {
      const result = await axios.get(
        `${API_URL}/collectors/${collectorInfo?._id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      console.log("collector:", result.data);
      updateCollector(
        { favoriteArtworks: result.data.favoriteArtworks },
        { followedArtists: result.data.followedArtists },
        { collection: result.data.collection }
      );
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    if (collectorInfo?.active) {
      refreshCollector();
    }
  }, []);

  const getArtwork = async () => {
    try {
      const result = await axios.get(`${API_URL}/artwork/${artworkName}`);

      if (result.status === 200) {
        const { artwork } = result.data;
        setArtwork(artwork);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };
  useEffect(() => {
    if (artworkName) {
      getArtwork();
    }
  }, [artworkName]);

  const handleZoomIn = () => {
    console.log("works together with handlezoomableimagecanvasdata !!!");
    setIsZoomed(true);
  };

  function handleZoomableImageCanvasData(data) {
    setIsZoomed(!data);
  }

  // view in room
  const handleOpenViewInRoom = (viewedWork) => {
    setViewInRoomModal(true);
    setViewedWork(viewedWork);
  };

  const handleCloseViewInRoom = (e) => {
    setViewInRoomModal(false);
  };

  // purchase or offer process
  const [purchaseOnProcess, setPurchaseOnProcess] = useState(false);
  const [offerOnProcess, setOfferOnProcess] = useState(false);
  const [hoveredOfferBtn, setHoveredOfferBtn] = useState(false);

  const offerToAnArtwork = async () => {
    setOfferOnProcess(true);
    try {
    } catch (error) {
      console.error("error:", error);
    }
  };

  function navigateToShipping(artworkToOrder) {
    setPurchaseOnProcess(true);
    setTimeout(() => {
      navigate(`/orders/${artworkToOrder}/shipping`);
    }, 1000);
  }

  const handleArtistClick = (artistName) => {
    const formattedName = artistName.toLowerCase().replace(/ /g, "-");
    navigate(`/artist/${formattedName}`);
  };

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
          style={{
            padding: width <= 768 ? "0px 20px" : "0px 40px",
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
          {artwork && (
            <>
              {/* header */}
              <div className="artwork-display">
                <div
                  onClick={handleZoomIn}
                  className={!isZoomed ? `item-1 zoom-in-pointer` : `item-1`}
                >
                  {!isZoomed && (
                    <div>
                      <img
                        style={{
                          objectFit: "cover",
                          height: "100%",
                          width: "100%",
                          boxSizing: "border-box",
                          maxWidth: "462px",
                        }}
                        src={artwork.imageUrl}
                        alt=""
                      />
                    </div>
                  )}
                  <div
                    style={{
                      height: "20px",
                      width: "100%",
                    }}
                  ></div>
                  <div
                    className="unica-regular-font"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      maxWidth: "462px",
                      width: "100%",
                      fontSize: "13px",
                      lineHeight: "1px",
                      color: "rgb(0,0,0)",
                    }}
                  >
                    {favoriteArtworkIds?.includes(artwork._id) ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCollector({
                            favoriteArtworks: (
                              collectorInfo?.favoriteArtworks || []
                            ).filter(
                              (eachArtWork) => eachArtWork?._id !== artwork._id
                            ),
                          });
                          showCustomMessageDarkBg(
                            "Removed from Saved Artworks",
                            6
                          );
                          removeFromFavorites(collectorInfo, artwork, getToken);
                        }}
                        className="pointer hover_color_effect hover_color_effect_t-d-kind-of-blue"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "8px",
                        }}
                      >
                        <div>
                          <svg
                            height={18}
                            width={18}
                            viewBox="0 0 18 18"
                            fill="rgb(16, 35, 215)"
                            color="currentColor"
                          >
                            <path d="M12.0022 3.00222C11.4768 3.00181 10.9564 3.10493 10.4708 3.30568C9.98524 3.50643 9.54397 3.80089 9.17222 4.17222L9.00222 4.34222L8.83222 4.17222C8.08166 3.42166 7.06368 3 6.00222 3C4.94077 3 3.92279 3.42166 3.17222 4.17222C2.42166 4.92279 2 5.94077 2 7.00222C2 8.06368 2.42166 9.08166 3.17222 9.83223L8.65222 15.3022C8.69711 15.3501 8.75133 15.3882 8.81153 15.4142C8.87173 15.4403 8.93663 15.4537 9.00222 15.4537C9.06782 15.4537 9.13272 15.4403 9.19292 15.4142C9.25312 15.3882 9.30733 15.3501 9.35222 15.3022L14.8322 9.83223C15.3923 9.2728 15.7737 8.55979 15.9283 7.78345C16.0829 7.00711 16.0037 6.20236 15.7007 5.47106C15.3977 4.73977 14.8845 4.11483 14.2262 3.67534C13.5678 3.23586 12.7938 3.0016 12.0022 3.00222Z"></path>
                          </svg>
                        </div>
                        <div
                          style={{
                            padding: "6px",
                          }}
                        >
                          Saved
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (collectorInfo.active) {
                            updateCollector({
                              favoriteArtworks: [
                                artwork,
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
                            artwork,
                            getToken,
                            sendDataToParent
                          );
                        }}
                        className="pointer hover_color_effect hover_color_effect_t-d-kind-of-blue"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "8px",
                        }}
                      >
                        <div>
                          <svg
                            height={18}
                            width={18}
                            viewBox="0 0 18 18"
                            fill="currentColor"
                          >
                            <path d="M11.9998 3.00002C11.4743 2.9996 10.954 3.10272 10.4684 3.30347C9.9828 3.50422 9.54153 3.79868 9.16978 4.17002L8.99978 4.34002L8.82978 4.17002C8.07922 3.41945 7.06124 2.99779 5.99978 2.99779C4.93833 2.99779 3.92035 3.41945 3.16978 4.17002C2.41922 4.92058 1.99756 5.93856 1.99756 7.00002C1.99756 8.06147 2.41922 9.07945 3.16978 9.83002L8.64978 15.3C8.69467 15.3478 8.74889 15.386 8.80909 15.412C8.86929 15.4381 8.93419 15.4515 8.99978 15.4515C9.06538 15.4515 9.13028 15.4381 9.19048 15.412C9.25068 15.386 9.30489 15.3478 9.34978 15.3L14.8298 9.83002C15.3898 9.27059 15.7713 8.55758 15.9259 7.78124C16.0805 7.0049 16.0013 6.20015 15.6983 5.46886C15.3953 4.73756 14.8821 4.11262 14.2237 3.67313C13.5653 3.23365 12.7914 2.99939 11.9998 3.00002ZM14.1198 9.12002L8.99978 14.24L3.87978 9.12002C3.58504 8.84537 3.34863 8.51417 3.18466 8.14617C3.02069 7.77817 2.93252 7.38092 2.92542 6.97811C2.91831 6.57529 2.99241 6.17518 3.14329 5.80163C3.29418 5.42807 3.51875 5.08874 3.80363 4.80386C4.0885 4.51899 4.42784 4.29441 4.80139 4.14353C5.17495 3.99264 5.57506 3.91854 5.97787 3.92565C6.38068 3.93276 6.77794 4.02092 7.14594 4.18489C7.51393 4.34886 7.84513 4.58527 8.11978 4.88002L8.64978 5.40002L8.99978 5.76002L9.34978 5.40002L9.87978 4.88002C10.4485 4.3501 11.2007 4.0616 11.9779 4.07532C12.7551 4.08903 13.4966 4.40388 14.0463 4.95353C14.5959 5.50318 14.9108 6.24472 14.9245 7.02193C14.9382 7.79913 14.6497 8.55132 14.1198 9.12002Z"></path>
                          </svg>
                        </div>
                        <div
                          style={{
                            padding: "6px",
                          }}
                        >
                          Save
                        </div>
                      </div>
                    )}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenViewInRoom(artwork.imageUrl);
                      }}
                      className="pointer hover_color_effect hover_color_effect_t-d-kind-of-blue"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "12px",
                      }}
                    >
                      <div>
                        <svg
                          height={18}
                          width={18}
                          viewBox="0 0 18 18"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M16.8 8.2c-2-3.3-4.6-4.9-7.8-4.9S3.2 5 1.2 8.2c-.3.5-.3 1.2.1 1.8C3.4 13.1 6 14.7 9 14.7s5.6-1.6 7.7-4.7c.4-.6.4-1.3.1-1.8zm-1 .5c.1.2.1.4 0 .6-1.9 2.8-4.1 4.2-6.7 4.2-2.6 0-4.8-1.4-6.7-4.2-.1-.2-.1-.4 0-.6C4 5.8 6.2 4.4 9 4.4s5 1.4 6.8 4.3zM9 11.9c1.6 0 2.9-1.3 2.9-2.9 0-1.6-1.3-2.9-2.9-2.9-1.6 0-2.9 1.3-2.9 2.9 0 1.6 1.3 2.9 2.9 2.9zm0-1.2c-.9 0-1.7-.8-1.7-1.7 0-.9.8-1.7 1.7-1.7.9 0 1.7.8 1.7 1.7 0 .9-.8 1.7-1.7 1.7z"
                          ></path>
                        </svg>
                      </div>
                      <div
                        style={{
                          padding: "6px",
                        }}
                      >
                        View in room
                      </div>
                    </div>

                    {/* share */}

                    <ShareButton artwork={artwork} text={"Share"} />

                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="pointer hover_color_effect hover_color_effect_t-d-kind-of-blue"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "8px",
                      }}
                    >
                      <div>
                        <svg
                          width={18}
                          height={18}
                          viewBox="0 0 18 18"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3 3H9.006L10.979 5.002H15V14.996H3V3ZM3.99 4V13.996H14.01V6.002H10.545L8.601 4H3.99ZM9.566 11.279L11.046 9.81L11.706 10.61L9 13.257L6.261 10.382L6.972 9.65L8.516 11.318L8.47 11.25V6.56L9.566 6.578V11.278V11.279Z"
                          ></path>
                        </svg>
                      </div>
                      <div
                        style={{
                          padding: "6px",
                        }}
                      >
                        Download
                      </div>
                    </div>
                  </div>
                  {isZoomed && (
                    <ZoomableImageCanvas
                      image={artwork.imageUrl}
                      sendDataToParent={handleZoomableImageCanvasData}
                    />
                  )}
                </div>

                <div
                  className="item-2"
                  style={{
                    padding: width <= 768 && "0px",
                  }}
                >
                  <div>
                    <span
                      onClick={() => {
                        handleArtistClick(artwork.artist.name);
                      }}
                      className="hover_color_effect_t-d hover_color_effect artwork-creator-name unica-regular-font pointer"
                    >
                      {artwork.artist.name}
                    </span>
                  </div>
                  <div className="artwork-info unica-italic-font">
                    <div>{artwork.title}</div>
                    <div className="box-20-px-m-top"></div>
                    <div className="unica-regular-font">
                      {artwork.aboutTheWork.materials}
                    </div>
                    <div className="unica-regular-font">
                      {artwork.aboutTheWork.size}
                    </div>
                    <div className="box-20-px-m-top"></div>
                  </div>
                  <div className="unica-regular-font artwork-location-info">
                    <div>{artwork.aboutTheWork.currentLocation}</div>
                    <div>{artwork.aboutTheWork.currentCountry}</div>
                  </div>
                  {/* inside this you can add more detail about the work before purchase or offer btn */}
                  {/* <div></div> */}
                  {!artwork.is_sold &&
                  artwork.is_sold === false &&
                  !artwork.unsellable_artwork ? (
                    <div className="artwork-btns-wrapper">
                      <div className="purchase-btn">
                        <Button
                          className="hover_bg_color_effect_white_text"
                          backgroundColor="black"
                          height="100dvh"
                          maxHeight="50px"
                          width="100%"
                          maxWidth="100%"
                          padding="1px 25px"
                          borderRadius="999px"
                          pointerEvents={purchaseOnProcess ? "none" : "auto"}
                          cursor={purchaseOnProcess ? "default" : "pointer"}
                          opacity={purchaseOnProcess ? "0.3" : "1"}
                          text="Purchase"
                          textColor="white"
                          fontSize="16px"
                          lineHeight="20px"
                          loadingScenario={purchaseOnProcess}
                          strokeColorLoadingSpinner={!purchaseOnProcess}
                          onClick={() => {
                            navigateToShipping(artwork._id);
                          }}
                        />
                      </div>
                      <div className="box-10-px-m-top"></div>
                      {artwork.an_offer_can_be_made && (
                        <div
                          onMouseEnter={() => setHoveredOfferBtn(true)}
                          onMouseLeave={() => setHoveredOfferBtn(false)}
                          className="make-an-offer-btn"
                        >
                          <Button
                            className="hover_bg_color_effect_white_text"
                            backgroundColor="white"
                            height="100dvh"
                            maxHeight="50px"
                            width="100%"
                            maxWidth="100%"
                            padding="1px 25px"
                            borderRadius="999px"
                            pointerEvents={offerOnProcess ? "none" : "auto"}
                            cursor={offerOnProcess ? "default" : "pointer"}
                            opacity={offerOnProcess ? "0.3" : "1"}
                            text="Make an Offer"
                            textColor="black"
                            fontSize="16px"
                            lineHeight="20px"
                            border="1px solid rgb(0,0,0)"
                            onClick={offerToAnArtwork}
                            loadingScenario={offerOnProcess}
                            colorCustom={hoveredOfferBtn ? "white" : "black"}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        fontWeight: "900",
                      }}
                      className="unica-italic-font"
                    >
                      Sold
                    </div>
                  )}
                  <div className="box-40-px-m-top"></div>
                  <div className="footer-artwork-second-grid unica-regular-font">
                    <span>Want to sell a work by this artist?</span>{" "}
                    <span>Sell with Art Bazaar</span>
                  </div>
                </div>
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
                    padding: "0px 20px",
                    height: "40px",
                    borderBottom: "1px solid black",
                  }}
                >
                  About the artwork
                </div>
              </div>
              {/* divider */}
              <div
                style={{
                  marginTop: "40px",
                }}
              ></div>
              <div className="wrapper-artwork-page">
                <div className="unica-regular-font about-work-wrapper">
                  {artwork.headerDescription && (
                    <div className="about-work-header">
                      <ReadMoreLess
                        artworkPage={true}
                        text={artwork.headerDescription}
                        maxLength={311}
                      />
                    </div>
                  )}
                  <div className="about-work-body">
                    <div className="about-work-body-title">
                      {artwork?.aboutTheWork?.materials &&
                        artwork.aboutTheWork.materials.trim() && (
                          <span>Materials</span>
                        )}
                      {artwork?.aboutTheWork?.size &&
                        artwork.aboutTheWork.size.trim() && <span>Size</span>}
                      {artwork?.aboutTheWork?.rarity &&
                        artwork.aboutTheWork.rarity.trim() && (
                          <span>Rarity</span>
                        )}
                      {artwork?.aboutTheWork?.medium &&
                        artwork.aboutTheWork.medium.trim() && (
                          <span>Medium</span>
                        )}
                      {artwork?.aboutTheWork?.condition &&
                        artwork.aboutTheWork.condition.trim() && (
                          <span>Condition</span>
                        )}
                      {artwork?.aboutTheWork?.signature &&
                        artwork.aboutTheWork.signature.trim() && (
                          <span>Signature</span>
                        )}
                      {artwork?.aboutTheWork?.certificateOfAuthenticity &&
                        artwork.aboutTheWork.certificateOfAuthenticity.trim() && (
                          <span>Certificate Of Authenticity</span>
                        )}
                      {artwork?.aboutTheWork?.frame &&
                        artwork.aboutTheWork.frame.trim() && <span>Frame</span>}
                      {artwork?.aboutTheWork?.series &&
                        artwork.aboutTheWork.series.trim() && (
                          <span>Series</span>
                        )}
                      {artwork?.aboutTheWork?.publisher &&
                        artwork.aboutTheWork.publisher.trim() && (
                          <span>Publisher</span>
                        )}
                      {artwork?.aboutTheWork?.imageRights &&
                        artwork.aboutTheWork.imageRights.trim() && (
                          <span>Image Rights</span>
                        )}
                    </div>
                    <div className="about-work-body-title-descriptions">
                      {artwork?.aboutTheWork?.materials &&
                        artwork.aboutTheWork.materials.trim() && (
                          <span>{artwork.aboutTheWork.materials}</span>
                        )}
                      {artwork?.aboutTheWork?.size &&
                        artwork.aboutTheWork.size.trim() && (
                          <span>{artwork.aboutTheWork.size}</span>
                        )}
                      {artwork?.aboutTheWork?.rarity &&
                        artwork.aboutTheWork.rarity.trim() && (
                          <span>{artwork.aboutTheWork.rarity}</span>
                        )}
                      {artwork?.aboutTheWork?.medium &&
                        artwork.aboutTheWork.medium.trim() && (
                          <span>{artwork.aboutTheWork.medium}</span>
                        )}
                      {artwork?.aboutTheWork?.condition &&
                        artwork.aboutTheWork.condition.trim() && (
                          <span>{artwork.aboutTheWork.condition}</span>
                        )}
                      {artwork?.aboutTheWork?.signature &&
                        artwork.aboutTheWork.signature.trim() && (
                          <span>{artwork.aboutTheWork.signature}</span>
                        )}
                      {artwork?.aboutTheWork?.certificateOfAuthenticity &&
                        artwork.aboutTheWork.certificateOfAuthenticity.trim() && (
                          <span>
                            {artwork.aboutTheWork.certificateOfAuthenticity}
                          </span>
                        )}
                      {artwork?.aboutTheWork?.frame &&
                        artwork.aboutTheWork.frame.trim() && (
                          <span>{artwork.aboutTheWork.frame}</span>
                        )}
                      {artwork?.aboutTheWork?.series &&
                        artwork.aboutTheWork.series.trim() && (
                          <span>{artwork.aboutTheWork.series}</span>
                        )}
                      {artwork?.aboutTheWork?.publisher &&
                        artwork.aboutTheWork.publisher.trim() && (
                          <span>{artwork.aboutTheWork.publisher}</span>
                        )}
                      {artwork?.aboutTheWork?.imageRights &&
                        artwork.aboutTheWork.imageRights.trim() && (
                          <span>{artwork.aboutTheWork.imageRights}</span>
                        )}
                    </div>
                  </div>
                </div>
                {/* divider */}
                <div className="box-20-px-m-top"></div>
                <div className="unica-regular-font artist-info-wrapper">
                  <div className="artist-info-header">
                    <div
                      className="pointer"
                      onClick={() => {
                        handleArtistClick(artwork.artist.name);
                      }}
                    >
                      <div className="artist-profile-pic-wrapper">
                        <img
                          src={artwork?.artist?.profilePic}
                          width={"100%"}
                          height={"100%"}
                          style={{
                            borderRadius: "50%",
                          }}
                          alt=""
                        />
                      </div>
                      <div>
                        <div>{artwork?.artist?.name}</div>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "rgb(112, 112, 112)",
                          }}
                        >
                          <span>{artwork?.artist?.nationality},</span>{" "}
                          <span>
                            {artwork?.artist?.born}-{artwork?.artist?.born}
                          </span>
                        </div>
                      </div>
                    </div>
                    <FollowButton
                      sendDataToParent={sendDataToParent}
                      artist={artwork?.artist}
                    />
                  </div>
                  <div className="box-20-px-m-top"></div>
                  <div className="artist-cv-wrapper ">
                    <p
                      style={{
                        fontSize: "16px",
                        lineHeight: "26px",
                        color: "rgb(0,0,0)",
                      }}
                      className="unica-regular-font"
                    >
                      {artwork?.artist?.description}
                    </p>
                  </div>
                </div>
                <div className="unica-regular-font artist-info-second-wrapper">
                  <div className="about-work-body-title">
                    {artwork?.artist?.highAuctionRecord && (
                      <>High auction record</>
                    )}
                  </div>
                  <div
                    style={{
                      marginLeft: "50px",
                      color: "rgb(112,112,112)",
                    }}
                  >
                    {artwork?.artist?.highAuctionRecord && (
                      <>
                        <span>
                          {artwork.artist.highAuctionRecord.salePrice},{" "}
                        </span>
                        <span>
                          {artwork.artist.highAuctionRecord.auctionHouse},{" "}
                        </span>
                        <span>{artwork.artist.highAuctionRecord.year}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* view in room modal */}
      {viewInRoomModal && (
        <>
          <Modal
            open={true}
            onClose={handleCloseViewInRoom}
            sx={{
              "& > .MuiBackdrop-root": {
                opacity: "0.5 !important",
                backgroundColor: "rgb(202, 205, 236)",
                filter: "brightness(2.5)",
                padding: 0,
                margin: 0,
              },
            }}
          >
            <div
              className=""
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                maxHeight: "100dvh",
                height: "100dvh",
                backgroundColor: "white",
                outlineStyle: "none",
                overflowY: "auto",
                boxShadow:
                  "0 0 15px rgba(101, 119, 134, 0.2),0 0 5px 3px rgba(101, 119, 134, 0.15)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  maxHeight: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  overflow: "hidden",
                  boxSizing: "border-box",
                  backgroundColor: "rgb(223,219,217)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      position: "relative",
                      top: "80px",
                      backgroundColor: "transparent",
                      height: "5px",
                      width: "292px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "1px solid black",
                      borderLeft: "1px solid black",
                    }}
                  >
                    <div
                      className="unica-regular-font"
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        fontSize: "8px",
                        lineHeight: "1px",
                      }}
                    >
                      8 ft
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "1px",
                        backgroundColor: "black",
                      }}
                    ></div>
                  </div>
                </div>
                <img
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.25) 1px 5px 5px",
                    //   marginTop: "-120px",
                    marginTop: "-200px",
                    maxWidth: "200px",
                    height: "200px",
                    position: "absolute",
                  }}
                  src={viewedWork}
                  alt=""
                />
              </div>
              <div>
                <img
                  width={"100%"}
                  height={"100%"}
                  style={{
                    maxHeight: "100dvh",
                    objectFit: "cover",
                    transform: "scale(0.415351)",
                    position: "absolute",
                    width: "6578px",
                    height: "1368px",
                    top: " 50%",
                    left: "50%",
                    marginTop: "-120px",
                    marginLeft: "-3289px",
                  }}
                  src="https://res.cloudinary.com/ddqbb9yqj/image/upload/v1720648930/museum_room/view_room_nkmzzm.jpg"
                  alt=""
                />
              </div>

              <button
                onClick={handleCloseViewInRoom}
                style={{
                  position: "absolute",
                  width: "80px",
                  height: "80px",
                  top: "0",
                  right: "0",
                  border: "none",
                  cursor: "pointer",
                  zIndex: 1001,
                  background: "transparent",
                  padding: "0px",
                }}
              >
                <svg
                  width={40}
                  height={40}
                  viewBox="0 0 18 18"
                  fill="rgb(112,112,112)"
                >
                  <path d="M9.88006 9.00001L14.4401 13.56L13.5601 14.44L9.00006 9.88001L4.44006 14.44L3.56006 13.56L8.12006 9.00001L3.56006 4.44001L4.44006 3.56001L9.00006 8.12001L13.5601 3.56001L14.4401 4.44001L9.88006 9.00001Z"></path>
                </svg>
              </button>
            </div>
          </Modal>
        </>
      )}
      <Footer />
    </>
  );
}

export default Artwork;
