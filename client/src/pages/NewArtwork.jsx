import { useContext, useEffect, useRef, useState } from "react";
import useWindowDimensions from "../../utils/useWindowDimensions";
import Input from "../components/Input";
import axios from "axios";
import { CollectorContext } from "../components/CollectorContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import NewArtworkForm from "../components/NewArtworkForm";
import SearchArtistInput from "../components/SearchArtistInput";
import { Modal } from "@mui/material";
import ArtistProfileImage from "../components/ArtistProfileImage";
// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function NewArtwork() {
  const { collectorInfo, getToken, updateCollector } =
    useContext(CollectorContext);
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const [artists, setArtists] = useState([]);

  const handleArtistsUpdate = (newArtists) => {
    setArtists(newArtists);
  };
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [tabIndex, setTabIndex] = useState(1);

  // after select artist
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedArtistArtworks, setSelectedArtistArtworks] = useState(null);

  const getArtist = async () => {
    try {
      const result = await axios.get(
        `${API_URL}/artist/${selectedArtist?.name}`
      );

      if (result.status === 200) {
        const { artworks } = result.data;
        setSelectedArtistArtworks(artworks);
      } else {
        console.error("Error fetching artist. Status:", result.status);
      }
    } catch (error) {
      console.error("Error fetching artist:", error);
    }
  };

  useEffect(() => {
    if (selectedArtist?.name) {
      getArtist();
    }
  }, [selectedArtist?.name]);

  // select artwork
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const [scaleNumber, setScaleNumber] = useState(1);
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

  // leave modal
  const [leaveModal, setLeaveModal] = useState(null);
  const openLeaveModal = () => {
    setLeaveModal(true);
  };
  const closeLeaveModal = () => {
    setLeaveModal(false);
  };

  // upload artwork
  const [formData, setFormData] = useState(null);
  const [uploadedImages, setUploadedImages] = useState(null);
  const handleArtistSelect = (selectedArtist) => {
    setSelectedArtist(selectedArtist);
  };
  const handleFormData = (formData) => {
    setFormData(formData);
  };
  const handleUploadImages = (uploadedImages) => {
    setUploadedImages(uploadedImages);
  };

  // selected artwork
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  useEffect(() => {
    if (tabIndex === 1) {
      setSelectedArtist(null);
      setSelectedArtwork(null);
    }
  }, [tabIndex]);

  console.log("selected artist:", selectedArtist);
  // upload artwork
  const [uploadOn, setUploadOn] = useState(false);
  const artworkUpload = async () => {
    setUploadOn(true);
    try {
      const result = await axios.post(
        `${API_URL}/collectors/${collectorInfo?._id}/collection/add-artwork`,
        {
          uploadedImages,
          formData,
          selectedArtist,
          selectedArtwork,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      updateCollector(result.data.collector);
      if (result.status === 200) {
        navigate("/collector-profile/my-collection");
        setTimeout(() => {
          setUploadOn(false);
        }, 300);
      }
      console.log("result upload artwork:", result);
    } catch (error) {
      console.error("error:", error);
    }
  };

  console.log("form data from new art work parent:", formData);

  const handleSearchArtistInputQueryData = (searchQuery) => {
    console.log("artist query parent gets the value:", searchQuery);
  };

  console.log("collector collection:", collectorInfo?.collection);

  const handleArtistClick = (artistName) => {
    const formattedName = artistName.toLowerCase().replace(/ /g, "-");
    navigate(`/artist/${formattedName}`);
  };

  return (
    <>
      {/* absolute position save changes btn */}
      <>
        {width <= 768 && tabIndex === 3 && (
          <div
            style={{
              position: "fixed",
              bottom: 0,
              width: "100%",
              zIndex: 2,
              backgroundColor: "rgb(255, 255, 255)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 10px 0px",
              padding: "10px 0px",
            }}
          >
            <Button
              onClick={artworkUpload}
              className={
                "unica-regular-font hover_color_effect_t-d hover_bg_color_effect_black_text"
              }
              backgroundColor={"black"}
              height="100dvh"
              width={"95%"}
              textColor={"white"}
              fontSize={"15px"}
              maxHeight={"50px"}
              maxWidth="100%"
              padding="1px 25px"
              borderRadius="25px"
              cursor="pointer"
              text={"Upload Artwork"}
              border="1px solid rgb(0,0,0)"
              lineHeight="26px"
              opacity={
                !formData?.title ||
                !formData?.medium ||
                uploadOn ||
                (!selectedArtist && !formData?.artistName)
                  ? "0.3"
                  : "1"
              }
              pointerEvents={
                !formData?.title ||
                !formData?.medium ||
                (!selectedArtist && !formData?.artistName) ||
                uploadOn
                  ? "none"
                  : "auto"
              }
              loadingScenario={uploadOn}
              strokeColorLoadingSpinner={!uploadOn}
            />
          </div>
        )}
      </>
      {/* <div className="box-40-px-m-top"></div> */}
      <>
        {/* leave modal */}
        <Modal
          open={leaveModal}
          onClose={closeLeaveModal}
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
              width: width <= 768 ? "85%" : 560,
              backgroundColor: "white",
              outlineStyle: "none",
              overflowY: "auto",
              boxShadow:
                "0 0 15px rgba(101, 119, 134, 0.2),0 0 5px 3px rgba(101, 119, 134, 0.15)",
              padding: width <= 768 && "0px 20px",
            }}
          >
            <div className="box-10-px-m-top"></div>
            {/* header */}
            <div
              className="unica-regular-font"
              style={{
                position: "relative",
                width: "100%",
                display: "flex",
                alignItems: "center",
                height: "58px",
                marginBottom: "20px",
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
                Leave without saving?
              </div>
              <button
                onClick={() => {
                  closeLeaveModal();
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
              Your artwork will not be added to My Collection.
            </div>
            <div
              style={{
                padding: width > 768 && "0px 20px",
              }}
            >
              <div className="box-40-px-m-top"></div>
              <Button
                onClick={() => {
                  closeLeaveModal();
                  setTabIndex(1);
                  setSelectedArtistArtworks(null);
                  setSelectedArtist(null);
                }}
                className="unica-regular-font hover_bg_color_effect_white_text"
                backgroundColor="rgb(0,0,0)"
                height="100dvh"
                width="100vw"
                maxHeight="50px"
                maxWidth="100%"
                padding="1px 25px"
                borderRadius="25px"
                cursor="pointer"
                text="Leave Without Saving"
                border="none"
                textColor="white"
                fontSize="16px"
                lineHeight="26px"
                strokeColorLoadingSpinner={false}
              />
              <div className="box-10-px-m-top"></div>
              <Button
                onClick={closeLeaveModal}
                className="unica-regular-font hover_bg_color_effect_white_text"
                backgroundColor="white"
                height="100dvh"
                width="100vw"
                maxHeight="50px"
                maxWidth="100%"
                padding="1px 25px"
                borderRadius="25px"
                cursor="pointer"
                text="Continue Uploading Artwork"
                border="1px solid rgb(0,0,0)"
                textColor="black"
                fontSize="16px"
                lineHeight="26px"
              />
              <div className="box-20-px-m-top"></div>
            </div>
          </div>
        </Modal>
      </>
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 2,
        }}
      >
        <div
          className="unica-regular-font"
          style={{
            padding: width <= 768 ? "10px 20px" : "10px 40px",
          }}
        >
          {width > 768 && (
            <div>
              {" "}
              <div
                className="dflex"
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div>Art</div>
                <div>Bazaar</div>
              </div>
            </div>
          )}
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              display: "flex",
              gap: "5px",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
            }}
            className=""
          >
            <div
              onClick={() => {
                if (tabIndex === 1) {
                  navigate("/collector-profile/my-collection");
                } else if (tabIndex === 3 && selectedArtist) {
                  openLeaveModal();
                } else if (tabIndex === 3 && !selectedArtist) {
                  setTabIndex(1);
                } else if (tabIndex === 3) {
                  selectedArtwork(null);
                } else {
                  setSelectedArtistArtworks([]);
                  setSelectedArtist(null);
                  setSelectedArtwork(null);
                  setTabIndex(tabIndex - 1);
                }
              }}
              className="hover_color_effect_t-d hover_color_effect pointer"
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "20px 0px",
                }}
              >
                <svg
                  width={18}
                  height={14}
                  viewBox="0 0 18 18"
                  color="rgb(0,0,0)"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.0601 15.94L5.12012 9L12.0601 2.06L12.9401 2.94L6.88012 9L12.9401 15.06L12.0601 15.94Z"
                  ></path>
                </svg>
              </div>
              <div
                className=""
                style={{
                  textDecoration: "underline",
                  fontSize: "16px",
                  lineHeight: "26px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Back
              </div>
            </div>
            {tabIndex !== 1 && tabIndex !== 3 && (
              <div
                style={{
                  maxWidth: "300px",
                  maxHeight: "50px",
                  width: width > 768 && "100%",
                  marginRight: "20px",
                }}
              >
                <Button
                  onClick={(e) => {
                    if (tabIndex === 2) {
                      setTabIndex(tabIndex + 1);
                    }
                  }}
                  className={
                    "unica-regular-font hover_bg_color_effect_white_text_black hover_color_effect_t-d"
                  }
                  backgroundColor={"transparent"}
                  height="100dvh"
                  width={width <= 768 ? "100px" : "100vw"}
                  textColor={"black"}
                  fontSize={width <= 768 ? "13px" : "16px"}
                  maxHeight={width <= 768 ? "30px" : "50px"}
                  maxWidth="100%"
                  padding="1px 25px"
                  borderRadius="25px"
                  cursor="pointer"
                  text={"Skip"}
                  border="1px solid rgb(0,0,0)"
                  lineHeight="26px"
                  opacity={"1"}
                  pointerEvents={"auto"}
                  loadingScenario={uploadOn ? true : false}
                  strokeColorLoadingSpinner={false}
                />
              </div>
            )}
            {tabIndex === 3 && width > 768 && (
              <div
                style={{
                  maxWidth: "300px",
                  maxHeight: "50px",
                  width: width > 768 && "100%",
                  marginRight: "20px",
                }}
              >
                <Button
                  onClick={() => {
                    artworkUpload();
                  }}
                  className={
                    "unica-regular-font hover_color_effect_t-d hover_bg_color_effect_black_text"
                  }
                  backgroundColor={"black"}
                  height="100dvh"
                  width={"100vw"}
                  textColor={"white"}
                  fontSize={"16px"}
                  maxHeight={"50px"}
                  maxWidth="100%"
                  padding="1px 25px"
                  borderRadius="25px"
                  cursor="pointer"
                  text={"Upload Artwork"}
                  border="1px solid rgb(0,0,0)"
                  lineHeight="26px"
                  opacity={
                    !formData?.title ||
                    !formData?.medium ||
                    uploadOn ||
                    (!selectedArtist && !formData?.artistName)
                      ? "0.3"
                      : "1"
                  }
                  pointerEvents={
                    !formData?.title ||
                    !formData?.medium ||
                    (!selectedArtist && !formData?.artistName) ||
                    uploadOn
                      ? "none"
                      : "auto"
                  }
                  loadingScenario={uploadOn}
                  strokeColorLoadingSpinner={!uploadOn}
                />
              </div>
            )}
          </div>
        </div>
        <div className="box-20-px-m-top"></div>
        <div
          style={{
            borderBottom: "1px solid rgb(231,231,231)",
          }}
        ></div>
      </div>
      {tabIndex === 1 ? (
        <div
          className="unica-regular-font"
          style={{
            padding: width <= 768 ? "0px 20px" : "0px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <div className="box-40-px-m-top"></div>
          <div
            style={{
              fontSize: width <= 768 ? "20px" : "26px",
              lineHeight: "32px",
              letterSpacing: "-0.01em",
            }}
          >
            Select an Artist
          </div>
          <div className="box-10-px-m-top"></div>
          <div
            style={{
              width: "100%",
              position: "relative",
            }}
          >
            <SearchArtistInput
              onArtistsUpdate={handleArtistsUpdate}
              searchArtistInputPlaceHolder={"Artist"}
            />
            <div className="box-20-px-m-top"></div>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                backgroundColor: "white",
                maxHeight: "308px",
                overflowY: "auto",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 10px 0px",
                zIndex: 1,
              }}
            >
              {artists?.length > 0 && (
                <>
                  {artists.map((eachArtist, index) => {
                    return (
                      <>
                        <div
                          onClick={() => {
                            setSelectedArtist(eachArtist);
                            setTabIndex(tabIndex + 1);
                          }}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          key={eachArtist._id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px",
                            cursor: "pointer",
                            backgroundColor:
                              hoveredIndex === index && "#f7f7f7",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                            }}
                          >
                            <div>
                              <img
                                style={{
                                  objectFit: "cover",
                                }}
                                width={50}
                                height={50}
                                src={eachArtist?.profilePic}
                                alt=""
                              />
                            </div>
                            <div>
                              <div>{eachArtist?.name}</div>
                              <div
                                style={{
                                  color: "rgb(112,112,112)",
                                }}
                              >
                                {eachArtist?.nationality}, {eachArtist?.born}-
                                {eachArtist?.died}
                              </div>
                            </div>
                          </div>
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
                                d="M5.94006 15.94L5.06006 15.06L11.1201 8.99999L5.06006 2.93999L5.94006 2.05999L12.8801 8.99999L5.94006 15.94Z"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </>
              )}
            </div>
            <div
              style={{
                fontSize: width <= 768 ? "13px" : "16px",
                lineHeight: "20px",
                opacity: !artists.length ? 1 : 0,
              }}
            >
              <span>Can't find the artist?</span>{" "}
              <span
                className="pointer"
                onClick={() => {
                  setTabIndex(3);
                }}
                style={{
                  textDecoration: "underline",
                }}
              >
                Add their name.
              </span>
            </div>

            {collectorInfo?.collection?.some(
              (collection) =>
                collection.artworksUploaded &&
                collection.artworksUploaded.length > 0
            ) && (
              <div>
                <div className="box-40-px-m-top"></div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "16px",
                    lineHeight: "20px",
                  }}
                >
                  <span>Artists in My Collection</span>
                </div>
                <div className="box-10-px-m-top"></div>
                <div
                  style={{
                    padding: width <= 768 && "0px 0px 40px 0px",
                  }}
                  className="collection-wrapper-grid-container"
                >
                  {collectorInfo?.collection
                    ?.filter(
                      (collection) =>
                        collection.artworksUploaded &&
                        collection.artworksUploaded.length > 0
                    )
                    .map((eachCollection) => {
                      return (
                        <div
                          key={eachCollection.id}
                          className="collection-detail-container-in"
                        >
                          <div
                            onClick={() => {
                              handleArtistClick(eachCollection?.artist?.name);
                            }}
                            style={{
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
                            <div
                              className="dflex"
                              style={{
                                flexDirection: "column",
                              }}
                            >
                              <div>{eachCollection?.artist?.name}</div>
                              {eachCollection?.artist?.nationality &&
                                eachCollection?.artist?.born &&
                                eachCollection?.artist?.died && (
                                  <div
                                    style={{
                                      color: "rgb(112,112,112)",
                                      fontSize: "13px",
                                      lineHeight: "20px",
                                    }}
                                  >
                                    {eachCollection?.artist?.nationality},{" "}
                                    {eachCollection?.artist?.born}-
                                    {eachCollection?.artist?.died}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : tabIndex === 2 ? (
        <div
          className="unica-regular-font"
          style={{
            padding: width <= 768 ? "0px 20px" : "0px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <div className="box-40-px-m-top"></div>
          <div
            style={{
              fontSize: width <= 768 ? "20px" : "26px",
              lineHeight: "32px",
              letterSpacing: "-0.01em",
            }}
          >
            Select an Artwork
          </div>
          <div className="box-10-px-m-top"></div>
          {selectedArtist && (
            <div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <div>
                  <img
                    width={45}
                    height={45}
                    style={{
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                    src={selectedArtist?.profilePic}
                    alt=""
                  />
                </div>

                <div>
                  <div>{selectedArtist?.name}</div>
                  <div
                    style={{
                      color: "rgb(112,112,112)",
                      fontSize: "13px",
                      lineHeight: "20px",
                    }}
                  >
                    {selectedArtist?.nationality}, {selectedArtist?.born}-
                    {selectedArtist?.died}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="box-10-px-m-top"></div>

          <div
            style={{
              width: "100%",
              position: "relative",
            }}
          >
            <Input
              placeholder={"Search for artworks"}
              width={"inherit"}
              wrapperWidth={"100%"}
              maxWidth={"100%"}
              minWidth={"fit-content"}
              maxHeight={"40px"}
              wrapperHeight={"100%"}
              wrapperMaxHeight={"50px"}
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
            <div className="box-20-px-m-top"></div>
            <div
              style={{
                fontSize: width <= 768 ? "13px" : "16px",
                lineHeight: "20px",
              }}
            >
              <span>Or skip ahead to</span>{" "}
              <span
                className="pointer"
                onClick={() => {
                  setTabIndex(tabIndex + 1);
                }}
                style={{
                  textDecoration: "underline",
                }}
              >
                add artwork details.
              </span>
            </div>
            <div className="box-40-px-m-top"></div>
            {/* render artworks from selected artist start to check*/}
            <div className="container-for-artworks-render">
              {selectedArtistArtworks?.map((eachWork, index) => {
                return (
                  <div key={eachWork.id}>
                    <div
                      onClick={() => {
                        setSelectedArtwork(eachWork);
                        setTabIndex(tabIndex + 1);
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
                          maxWidth: "441.25px",
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
                        setSelectedArtwork(eachWork);
                        setTabIndex(tabIndex + 1);
                      }}
                      className="pointer"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          boxSizing: "border-box",
                          width: "100%",
                          maxWidth: "441.25px",
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
                          {eachWork?.creator}
                        </div>
                      </div>
                      <div
                        className="unica-italic-font"
                        style={{
                          fontSize: "16px",
                          lineHeight: "20px",
                          maxWidth: "441.25px",
                          marginTop: "4px",
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
            {/* render artworks from selected artist finish to check*/}
          </div>
        </div>
      ) : tabIndex === 3 ? (
        <>
          {" "}
          <div
            className="unica-regular-font"
            style={{
              padding: width <= 768 ? "0px 20px" : "0px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "20px",
            }}
          >
            <div className="box-40-px-m-top"></div>
            <div
              style={{
                fontSize: width <= 768 ? "20px" : "26px",
                lineHeight: "32px",
                letterSpacing: "-0.01em",
              }}
            >
              Add Artwork Details
            </div>
            <div className="box-10-px-m-top"></div>
            {selectedArtist && (
              <>
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          maxWidth: "45px",
                          maxHeight: "45px",
                          borderRadius: "50%",
                        }}
                      >
                        <ArtistProfileImage
                          borderRadius={"50%"}
                          artistInfo={selectedArtist}
                          width={"45px"}
                          height={"45px"}
                        />
                      </div>
                    </div>
                    <div>
                      <div>{selectedArtist?.name}</div>
                      <div
                        style={{
                          color: "rgb(112,112,112)",
                          fontSize: "13px",
                          lineHeight: "20px",
                        }}
                      >
                        {selectedArtist?.nationality}, {selectedArtist?.born}-
                        {selectedArtist?.died}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="box-20-px-m-top"></div>
          </div>
          {/* artwork form */}
          <NewArtworkForm
            artworkSelected={selectedArtwork}
            artistSelected={selectedArtist}
            handleArtistSelect={handleArtistSelect}
            handleFormData={handleFormData}
            handleUploadImages={handleUploadImages}
            padding={width <= 768 ? "0px 20px" : "0px 40px"}
            uploadPhotoSection={true}
            sendArtistQueryToParent={handleSearchArtistInputQueryData}
          />
        </>
      ) : null}
    </>
  );
}

export default NewArtwork;
