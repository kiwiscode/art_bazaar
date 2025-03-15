import { useContext, useEffect, useRef, useState } from "react";
import { CollectorContext } from "../components/CollectorContext";
import axios from "axios";
import { CollectorProfileHeader } from "../components/CollectorProfileHeader";
import useWindowDimensions from "../../utils/useWindowDimensions";
import Footer from "../components/Footer";
import Input from "../components/Input";
import Button from "../components/Button";
import { Modal, Popover } from "@mui/material";
import FollowButton from "../components/FollowButton";
import Paginator from "../components/Paginator";
import { useAntdMessageHandler } from "../../utils/useAntdMessageHandler";
import Checkbox from "../components/Checkbox";
import SearchArtistInput from "../components/SearchArtistInput";
import { useNavigate } from "react-router-dom";
import ArtistProfileImage from "../components/ArtistProfileImage";
// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function CollectorProfileArtists() {
  const { collectorInfo, getToken, updateCollector } =
    useContext(CollectorContext);
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate, collectorInfo]);

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
      updateCollector({ favoriteArtworks: result.data.favoriteArtworks });
      updateCollector({ followedArtists: result.data.followedArtists });
      updateCollector({ collection: result.data.collection });
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    refreshCollector();
  }, []);

  // select an artist modal

  // search artist with query
  const [selectedArtistIds, setSelectedArtistIds] = useState([]);
  const selectAnArtistModalRef = useRef(null);
  const [selectAnArtistOn, setSelectAnArtistOn] = useState(false);
  const { contextHolder, showCustomMessage } = useAntdMessageHandler();

  const openSelectAnArtistModal = () => {
    setSelectAnArtistOn(true);
  };

  const closeSelectAnArtistModal = () => {
    if (selectedArtistIds?.length) {
      setTimeout(() => {
        if (selectedArtistIds.length > 1) {
          showCustomMessage("Added artists to your collection.", 6);
        } else {
          showCustomMessage("Added artist to your collection.", 6);
        }
      }, 100);
    }

    setTimeout(() => {
      setSelectedArtistIds([]);
    }, 300);

    setSelectAnArtistOn(false);
  };

  const addIdAfterSelect = (newId) => {
    setSelectedArtistIds((prevIds) => {
      return [...prevIds, newId];
    });
  };

  const undoSelectedId = (id) => {
    setSelectedArtistIds((prevIds) => {
      return prevIds.filter((artistId) => artistId !== id);
    });
  };

  const [addingArtistToCollection, setAddingArtistToCollection] =
    useState(false);

  const addArtistToCollection = async () => {
    setAddingArtistToCollection(true);
    try {
      const result = await axios.post(
        `${API_URL}/collectors/${collectorInfo?._id}/collection`,
        {
          selectedArtistIds,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (result.status === 200) {
        setTimeout(() => {
          setAddingArtistToCollection(false);
        }, 750);
        setTimeout(() => {
          refreshCollector();
        }, 850);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  // pagination settings
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalItems = collectorInfo?.collection?.length || 0;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems =
    collectorInfo?.collection?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const allArtistsDeleted = currentItems.every(
    (item) => item.artistDeletedFromCollection === true
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // collection settings

  const [gallerySharedCollectionIds, setGallerySharedCollectionIds] = useState(
    []
  );

  const shareWithGalleries = async (collectionId, share) => {
    try {
      const result = await axios.patch(
        `${API_URL}/collectors/${collectorInfo?._id}/collection/share_gallery_status`,
        {
          collectionId,
          share,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      showCustomMessage("Updated artist", 6);

      if (share) {
        setGallerySharedCollectionIds((prevCollections) => [
          ...prevCollections,
          collectionId,
        ]);
      } else {
        setGallerySharedCollectionIds((prevCollections) =>
          prevCollections.filter((id) => id !== collectionId)
        );
      }
    } catch (error) {
      console.error("Error sharing collection:", error);
    }
  };

  // remove artist popover settings
  const [removeArtistPopover, setRemoveArtistPopover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [artistToRemove, setArtistToRemove] = useState(null);
  const [collectionIdToUpdate, setCollectionIdToUpdate] = useState(null);

  const handleOpenRemovePopover = (event, artist, collectionId) => {
    setRemoveArtistPopover(!removeArtistPopover);
    setAnchorEl(event.currentTarget);
    setArtistToRemove(artist);
    setCollectionIdToUpdate(collectionId);
  };

  const handleCloseRemovePopover = () => {
    setRemoveArtistPopover(!removeArtistPopover);
    setAnchorEl(null);
    setArtistToRemove(null);
    setCollectionIdToUpdate(null);
  };

  // remove artist modal settings
  const [
    removeArtistFromCollectionModalOn,
    setRemoveArtistFromCollectionModalOn,
  ] = useState(false);
  const openRemoveArtistFromCollectionOn = () => {
    setRemoveArtistFromCollectionModalOn(true);
  };
  const closeRemoveArtistFromCollectionOn = () => {
    setRemoveArtistFromCollectionModalOn(false);
    handleCloseRemovePopover();
    setArtistToRemove(null);
    setAnchorEl(null);
    setLoading(false);
  };

  const removeArtistFromCollection = async () => {
    setLoading(true);
    try {
      const result = await axios.patch(
        `${API_URL}/collectors/${collectorInfo?._id}/collection/${collectionIdToUpdate}/remove_artist`,
        {
          artistId: artistToRemove._id,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (result.status === 200) {
        setTimeout(() => {
          setArtistToRemove(null);
          setAnchorEl(null);
          setCollectionIdToUpdate(null);
          closeRemoveArtistFromCollectionOn();
          setTimeout(() => {
            refreshCollector();
            setLoading(false);
          }, 250);
        }, 750);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  const [artists, setArtists] = useState([]);

  const handleArtistsUpdate = (newArtists) => {
    setArtists(newArtists);
  };

  const handleArtistClick = (artistName) => {
    const formattedName = artistName.toLowerCase().replace(/ /g, "-");
    navigate(`/artist/${formattedName}`);
  };

  const [artistLoading, setArtistLoading] = useState(false);
  const [closeSearchedResults, setCloseSearchedResults] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const getQueryFromInput = (data) => {
    if (data.length) {
      setCloseSearchedResults(false);
    }
  };

  return (
    <>
      {contextHolder}
      {/* remove artist from collection */}
      <Modal
        open={removeArtistFromCollectionModalOn}
        onClose={closeRemoveArtistFromCollectionOn}
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
          className="unica-regular-font"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: width <= 768 ? "85%" : 440,
            backgroundColor: "white",
            outlineStyle: "none",
            overflowY: "auto",
            boxShadow:
              "0 0 15px rgba(101, 119, 134, 0.2),0 0 5px 3px rgba(101, 119, 134, 0.15)",
            padding: width <= 768 && "0px 20px",
            // maxHeight: "95vh",
            // height: selectAnArtistOn && width <= 768 ? "100%" : "100%",
          }}
        >
          {" "}
          {/* header */}
          <div
            className="unica-regular-font"
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              alignItems: "center",
              height: "58px",
            }}
          >
            <div
              style={{
                fontSize: "26px",
                lineHeight: "32px",
                letterSpacing: "-0.01em",
                padding: width > 768 && "0px 20px",
              }}
            >
              Remove artist
            </div>
            <button
              onClick={() => {
                closeRemoveArtistFromCollectionOn();
              }}
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
          </div>
          <div
            style={{
              padding: width > 768 && "0px 20px",
            }}
          >
            {" "}
            {artistToRemove?.name} will be removed from My Collection.
          </div>
          <div
            style={{
              padding: width > 768 && "0px 20px",
            }}
          >
            <div className="box-40-px-m-top"></div>
            <Button
              onClick={removeArtistFromCollection}
              className="unica-regular-font hover_bg_color_effect_white_text"
              backgroundColor="rgb(0,0,0)"
              height="100dvh"
              width="100vw"
              maxHeight="50px"
              maxWidth="100%"
              padding="1px 25px"
              borderRadius="25px"
              cursor="pointer"
              text="Remove artist"
              border="none"
              textColor="white"
              fontSize="16px"
              lineHeight="26px"
              loadingScenario={loading}
              strokeColorLoadingSpinner={false}
            />
            <div className="box-10-px-m-top"></div>
            <Button
              onClick={closeRemoveArtistFromCollectionOn}
              className="unica-regular-font hover_bg_color_effect_white_text"
              backgroundColor="white"
              height="100dvh"
              width="100vw"
              maxHeight="50px"
              maxWidth="100%"
              padding="1px 25px"
              borderRadius="25px"
              cursor="pointer"
              text="Keep artist"
              border="1px solid rgb(0,0,0)"
              textColor="black"
              fontSize="16px"
              lineHeight="26px"
            />
            <div className="box-20-px-m-top"></div>
          </div>
        </div>
      </Modal>
      {/* select an artist modal */}
      <>
        <Modal
          open={selectAnArtistOn}
          onClose={closeSelectAnArtistModal}
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
            ref={selectAnArtistModalRef}
            className="unica-regular-font"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: width <= 768 ? "85%" : 610,
              maxHeight: "95vh",
              height: selectAnArtistOn && width <= 768 ? "100%" : "100%",
              backgroundColor: "white",
              outlineStyle: "none",
              overflowY: "auto",
              boxShadow:
                "0 0 15px rgba(101, 119, 134, 0.2),0 0 5px 3px rgba(101, 119, 134, 0.15)",
              padding: width <= 768 && "0px 20px",
            }}
          >
            <div className="box-20-px-m-top"></div>
            {/* header */}
            <div
              className="unica-regular-font"
              style={{
                position: "relative",
                width: "100%",
                display: "flex",
                alignItems: "center",
                height: "58px",
              }}
            >
              <div
                style={{
                  fontSize: "26px",
                  lineHeight: "32px",
                  letterSpacing: "-0.01em",
                  padding: width > 768 && "0px 20px",
                }}
              >
                Select an Artist
              </div>
              <button
                onClick={() => {
                  closeSelectAnArtistModal();
                }}
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
            </div>
            <div className="box-20-px-m-top"></div>
            <SearchArtistInput
              onArtistsUpdate={handleArtistsUpdate}
              searchArtistInputPlaceHolder={"Artist"}
              searchArtistInputPadding={width > 768 && "0px 20px"}
            />
            <div className="box-20-px-m-top"></div>
            <div
              style={{
                fontSize: "13px",
                lineHeight: "20px",
                padding: width > 768 && "0px 20px",
              }}
            >
              0 artists selected
            </div>
            <div className="box-20-px-m-top"></div>
            {artists?.length < 1 ? (
              <div
                style={{
                  padding: width > 768 ? "0px 20px" : 0,
                }}
                className="nothing-yet-info unica-regular-font"
              >
                <div>
                  <span>
                    Results will appear here as you search. Select an artist to
                    add them to your collection.
                  </span>
                </div>
              </div>
            ) : (
              artists.length < 1 &&
              query.length && (
                <div
                  style={{
                    padding: width > 768 ? "0px 20px" : 0,
                  }}
                  className="nothing-yet-info unica-regular-font"
                >
                  <div>
                    <span>No results found for {query}</span>
                  </div>
                </div>
              )
            )}
            <div className="box-20-px-m-top"></div>
            <div
              style={{
                maxHeight: "50%",
                overflowY: "auto",
                margin: width > 768 && "0px 20px",
                padding: "0px 5px",
              }}
            >
              {artists?.length > 0 && (
                <div style={{}}>
                  {artists?.map((eachArtist) => {
                    return (
                      <div
                        style={{
                          cursor: "default",
                        }}
                        key={eachArtist._id}
                        className="unica-regular-font"
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                            }}
                          >
                            <div
                              style={{
                                borderRadius: "50%",
                                maxWidth: "45px",
                                maxHeight: "45px",
                              }}
                            >
                              <ArtistProfileImage
                                borderRadius={"50%"}
                                artistInfo={eachArtist}
                                width={"45px"}
                                height={"45px"}
                              />
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  lineHeight: "26px",
                                }}
                              >
                                {eachArtist?.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  lineHeight: "20px",
                                  color: "rgb(112,112,112)",
                                }}
                              >
                                {/* test start to check */}
                                {eachArtist?.nationality &&
                                eachArtist?.born &&
                                eachArtist?.died ? (
                                  <div className="artist-info">
                                    <span>{eachArtist?.nationality}, </span>
                                    <span>{eachArtist?.born}-</span>
                                    <span>{eachArtist?.died}</span>
                                  </div>
                                ) : eachArtist?.nationality &&
                                  eachArtist?.born &&
                                  !eachArtist?.died ? (
                                  <div className="artist-info">
                                    <span>{eachArtist?.nationality}, </span>
                                    <span>b. {eachArtist?.born}</span>
                                  </div>
                                ) : null}
                                {/* test finish to check */}
                              </div>
                            </div>
                          </div>
                          <div>
                            <Button
                              onClick={() => {
                                if (
                                  !selectedArtistIds.includes(eachArtist?._id)
                                ) {
                                  addIdAfterSelect(eachArtist?._id);
                                } else {
                                  undoSelectedId(eachArtist?._id);
                                }
                              }}
                              className={
                                selectedArtistIds.includes(eachArtist?._id)
                                  ? "unica-regular-font hover_bg_color_effect_white_text blue_bg_color_effect_hover"
                                  : "unica-regular-font hover_bg_color_effect_white_text "
                              }
                              backgroundColor={
                                selectedArtistIds.includes(eachArtist?._id)
                                  ? "rgb(16, 35, 215)"
                                  : "transparent"
                              }
                              textColor={
                                selectedArtistIds.includes(eachArtist?._id)
                                  ? "white"
                                  : "black"
                              }
                              height="100dvh"
                              width="100%"
                              maxHeight="30px"
                              maxWidth="100%"
                              padding="1px 25px"
                              borderRadius="25px"
                              cursor="pointer"
                              text={
                                selectedArtistIds.includes(eachArtist?._id)
                                  ? `Selected`
                                  : "Select"
                              }
                              border="1px solid rgb(0,0,0)"
                              fontSize="13px"
                              lineHeight="1px"
                              svgIcon={
                                selectedArtistIds.includes(eachArtist?._id) ? (
                                  <svg
                                    width={18}
                                    height={18}
                                    viewBox="0 0 18 18"
                                    fill="white"
                                  >
                                    <path d="M6.93608 12.206L14.5761 4.576L15.4241 5.425L6.93208 13.905L2.68408 9.623L3.53608 8.777L6.93608 12.206Z"></path>
                                  </svg>
                                ) : null
                              }
                            />
                          </div>
                        </div>
                        <div className="box-20-px-m-top"></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="box-20-px-m-top"></div>
            <div
              style={{
                width: "100%",
                position: "absolute",
                bottom: 15,
              }}
            >
              <div
                style={{
                  padding: width > 768 && "0px 20px",
                }}
              >
                <Button
                  onClick={addArtistToCollection}
                  className="unica-regular-font hover_bg_color_effect_white_text"
                  backgroundColor="rgb(0,0,0)"
                  height="100dvh"
                  width="100%"
                  maxHeight="50px"
                  maxWidth="100%"
                  padding="1px 25px"
                  borderRadius="25px"
                  cursor="pointer"
                  text={
                    selectedArtistIds?.length === 1
                      ? `Add selected artist · ${selectedArtistIds.length}`
                      : selectedArtistIds?.length > 1
                      ? `Add selected artists · ${selectedArtistIds.length}`
                      : "Add selected artists"
                  }
                  border="none"
                  textColor="white"
                  fontSize="16px"
                  lineHeight="26px"
                  opacity={
                    selectedArtistIds.length > 0 && !addingArtistToCollection
                      ? "1"
                      : "0.3"
                  }
                  pointerEvents={
                    selectedArtistIds?.length < 1 || addingArtistToCollection
                      ? "none"
                      : "auto"
                  }
                />
              </div>
            </div>
          </div>
        </Modal>
      </>
      {width <= 768 ? (
        <div className="box-20-px-m-top"></div>
      ) : (
        <div className="box-60-px-m-top"></div>
      )}
      <div className="collector-profile-main">
        <div className="collector-profile-wrapper">
          <CollectorProfileHeader />
          {width <= 768 ? (
            <div className="box-20-px-m-top"></div>
          ) : (
            <div className="box-40-px-m-top"></div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: width <= 768 ? "10px" : "20px",
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: width <= 768 && "0px 20px",
                flexDirection: width <= 768 && "column",
              }}
            >
              <Input
                placeholder={"Search artists in My Collection"}
                width={"inherit"}
                wrapperWidth={"100%"}
                maxWidth={"100%"}
                minWidth={"fit-content"}
                maxHeight={"40px"}
                wrapperHeight={"100%"}
                wrapperMaxHeight={"50px"}
                height={"100dvh"}
                borderRadius={"3px"}
                icon={
                  <svg
                    className="dflex"
                    width={18}
                    height={18}
                    viewBox="0 0 18 18"
                    fill="rgb(112, 112, 112)"
                  >
                    <path d="M11.5001 3.00003C11.9597 3.00003 12.4148 3.09056 12.8395 3.26645C13.2641 3.44234 13.6499 3.70015 13.9749 4.02515C14.2999 4.35016 14.5577 4.736 14.7336 5.16063C14.9095 5.58527 15.0001 6.0404 15.0001 6.50003C15.0001 6.95965 14.9095 7.41478 14.7336 7.83942C14.5577 8.26406 14.2999 8.6499 13.9749 8.9749C13.6499 9.29991 13.2641 9.55771 12.8395 9.73361C12.4148 9.9095 11.9597 10 11.5001 10C10.5718 10 9.68156 9.63128 9.02519 8.9749C8.36881 8.31852 8.00006 7.42828 8.00006 6.50003C8.00006 5.57177 8.36881 4.68153 9.02519 4.02515C9.68156 3.36878 10.5718 3.00003 11.5001 3.00003ZM11.5001 2.00003C10.61 2.00003 9.74002 2.26395 8.99999 2.75841C8.25997 3.25288 7.6832 3.95568 7.3426 4.77795C7.00201 5.60022 6.91289 6.50502 7.08653 7.37793C7.26016 8.25085 7.68874 9.05267 8.31808 9.68201C8.94742 10.3113 9.74924 10.7399 10.6222 10.9136C11.4951 11.0872 12.3999 10.9981 13.2221 10.6575C14.0444 10.3169 14.7472 9.74011 15.2417 9.00009C15.7361 8.26007 16.0001 7.39004 16.0001 6.50003C16.0014 5.90871 15.8859 5.32295 15.6602 4.77639C15.4345 4.22983 15.1031 3.73323 14.685 3.31511C14.2669 2.89698 13.7703 2.56556 13.2237 2.33988C12.6771 2.1142 12.0914 1.99871 11.5001 2.00003ZM9.44206 9.52503L8.56206 8.64503L2.06006 15.06L2.94006 15.94L9.44206 9.52503Z"></path>
                  </svg>
                }
                iconPositionRight={true}
              />
              <div
                style={{
                  marginTop: width <= 768 && "10px",
                }}
              >
                <Button
                  onClick={openSelectAnArtistModal}
                  className="unica-regular-font hover_bg_color_effect_white_text"
                  backgroundColor="rgb(0,0,0)"
                  height="100dvh"
                  width="100vw"
                  maxHeight="50px"
                  maxWidth="143.35px"
                  padding="1px 25px"
                  borderRadius="25px"
                  cursor="pointer"
                  text="+ Add Artist"
                  border="none"
                  textColor="white"
                  fontSize="16px"
                  lineHeight="26px"
                />
              </div>
            </div>{" "}
            {width > 768 ? (
              <div className="box-60-px-m-top"></div>
            ) : (
              <div className="box-30-px-m-top"></div>
            )}
            <div className="collector-profile-artists-wrapper-after-input-List unica-regular-font display-none-bp-768px">
              <div>Artist</div>
              <div
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Artworks uploaded
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Share with the galleries during inquiries
                  </span>
                  <svg
                    style={{
                      position: "relative",
                      top: "2px",
                      overflow: "hidden",
                    }}
                    width={18}
                    height={18}
                    viewBox="0 0 18 18"
                    fill="rgb(112, 112, 112)"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 6.87827 16.1571 4.84344 14.6569 3.34315C13.1566 1.84285 11.1217 1 9 1ZM8.99978 1.88892C12.9271 1.88892 16.1109 5.07267 16.1109 9.00003C16.1109 12.9274 12.9271 16.1111 8.99978 16.1111C5.07242 16.1111 1.88867 12.9274 1.88867 9.00003C1.88867 5.07267 5.07242 1.88892 8.99978 1.88892ZM8.51123 5.1333H9.48901V6.19997H8.51123V5.1333ZM9.48901 7.37329V12.8666H8.51123V7.37329H9.48901Z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div>Follow artist</div>
              <div>More</div>
            </div>
            {width > 768 && <div className="box-20-px-m-top"></div>}
            {allArtistsDeleted ? (
              <div className="nothing-yet-info unica-regular-font">
                <div>
                  <span>Nothing yet.</span>
                </div>
              </div>
            ) : (
              <div>
                {currentItems?.map((eachCollection, index) => {
                  return (
                    <div key={index}>
                      {eachCollection.artist &&
                        !eachCollection.artistDeletedFromCollection &&
                        !allArtistsDeleted && (
                          <div
                            style={{
                              padding: width <= 768 ? "24px 0px" : "32px 0px",
                              margin: width <= 768 && "0px 20px",
                            }}
                            key={eachCollection?.artist?._id}
                            className="collection-artist-detail-wrapper unica-regular-font"
                          >
                            <div>
                              <a
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleArtistClick(
                                    eachCollection?.artist?.name
                                  );
                                }}
                                href={`/artist/${eachCollection?.artist?.name
                                  .toLowerCase()
                                  .replace(/ /g, "-")}`}
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  cursor: "pointer",
                                  textDecoration: "none",
                                  color: "inherit",
                                }}
                              >
                                <div
                                  onClick={() => {
                                    handleArtistClick(
                                      eachCollection?.artist?.name
                                    );
                                  }}
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <div
                                    style={{
                                      borderRadius: "50%",
                                      maxWidth: "45px",
                                      maxHeight: "45px",
                                    }}
                                  >
                                    <ArtistProfileImage
                                      borderRadius={"50%"}
                                      artistInfo={eachCollection?.artist}
                                      width={"45px"}
                                      height={"45px"}
                                    />
                                  </div>
                                  <div>
                                    <div
                                      style={{
                                        fontSize: "16px",
                                        lineHeight: "26px",
                                      }}
                                    >
                                      {eachCollection?.artist?.name}
                                    </div>
                                    {eachCollection?.artist?.nationality &&
                                    eachCollection?.artist?.born &&
                                    eachCollection?.artist?.died ? (
                                      <div className="artist-info">
                                        <span>
                                          {eachCollection?.artist?.nationality},{" "}
                                        </span>
                                        <span>
                                          {eachCollection?.artist?.born}-
                                        </span>
                                        <span>
                                          {eachCollection?.artist?.died}
                                        </span>
                                      </div>
                                    ) : eachCollection?.artist?.nationality &&
                                      eachCollection?.artist?.born &&
                                      !eachCollection?.artist?.died ? (
                                      <div className="artist-info">
                                        <span>
                                          {eachCollection?.artist?.nationality},{" "}
                                        </span>
                                        <span>
                                          b. {eachCollection?.artist?.born}
                                        </span>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </a>
                            </div>
                            <div className="display-none-bp-768px">
                              {eachCollection?.artworksUploaded?.length}{" "}
                              artworks
                            </div>
                            <div
                              style={{
                                cursor: "pointer",
                              }}
                              className="display-none-bp-768px"
                            >
                              <Checkbox
                                width={"20px"}
                                height={"20px"}
                                text={"Share with galleries"}
                                flexBoxWrapperClassName={
                                  "unica-regular-font dflex hover_color_effect_t-d hover_color_effect"
                                }
                                hoverEffect={true}
                                svgIcon={
                                  <svg viewBox="0 0 18 18" fill="white">
                                    <path d="M6.93608 12.206L14.5761 4.576L15.4241 5.425L6.93208 13.905L2.68408 9.623L3.53608 8.777L6.93608 12.206Z"></path>
                                  </svg>
                                }
                                onClick={() => {
                                  ("clicked checkbox !");
                                  shareWithGalleries(
                                    eachCollection?._id,
                                    gallerySharedCollectionIds?.includes(
                                      eachCollection?._id
                                    )
                                      ? false
                                      : true
                                  );
                                }}
                                backgroundColor={
                                  gallerySharedCollectionIds?.includes(
                                    eachCollection?._id
                                  )
                                    ? "black"
                                    : "transparent"
                                }
                                border={
                                  gallerySharedCollectionIds?.includes(
                                    eachCollection?._id
                                  )
                                    ? "none"
                                    : "1px solid rgb(194, 194, 194)"
                                }
                                conditionalArray={gallerySharedCollectionIds}
                                id={eachCollection._id}
                              />
                            </div>

                            <div className="display-none-bp-768px">
                              {" "}
                              <FollowButton artist={eachCollection?.artist} />
                            </div>
                            <div className="display-none-bp-768px">
                              <div
                                onClick={(e) =>
                                  handleOpenRemovePopover(
                                    e,
                                    eachCollection?.artist,
                                    eachCollection?._id
                                  )
                                }
                                style={{
                                  display: "inline-flex",
                                  borderRadius: "15px",
                                  height: "30px",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                                className="pointer hover-sky-blue-effect hover_color_effect_t-d-kind-of-blue"
                              >
                                <svg
                                  style={{
                                    padding: "1px 25px",
                                  }}
                                  width={18}
                                  height={18}
                                  viewBox="0 0 18 18"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M4 7.5C3.17157 7.5 2.5 8.17157 2.5 9C2.5 9.82843 3.17157 10.5 4 10.5C4.82843 10.5 5.5 9.82843 5.5 9C5.5 8.17157 4.82843 7.5 4 7.5ZM7.5 9C7.5 8.17157 8.17157 7.5 9 7.5C9.82843 7.5 10.5 8.17157 10.5 9C10.5 9.82843 9.82843 10.5 9 10.5C8.17157 10.5 7.5 9.82843 7.5 9ZM12.5 9C12.5 8.17157 13.1716 7.5 14 7.5C14.8284 7.5 15.5 8.17157 15.5 9C15.5 9.82843 14.8284 10.5 14 10.5C13.1716 10.5 12.5 9.82843 12.5 9Z"
                                  ></path>
                                </svg>
                              </div>
                              <Popover
                                onClick={() =>
                                  openRemoveArtistFromCollectionOn()
                                }
                                className="unica-regular-font display-none-bp-768px"
                                open={removeArtistPopover}
                                anchorEl={anchorEl}
                                onClose={handleCloseRemovePopover}
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "right",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "right",
                                }}
                                sx={{
                                  "& .MuiPaper-root:hover": {
                                    backgroundColor: "#f7f7f7",
                                    transition:
                                      "background-color 0.25s ease 0s !important",
                                  },
                                }}
                              >
                                <span
                                  style={{
                                    padding: "1px 25px",
                                  }}
                                >
                                  Remove artist
                                </span>
                              </Popover>
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })}

                {totalItems > 10 && (
                  <Paginator
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        {/* footer */}
        <Footer />
      </div>
    </>
  );
}

export default CollectorProfileArtists;
