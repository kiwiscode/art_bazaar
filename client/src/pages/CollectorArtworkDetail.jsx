import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CollectorContext } from "../components/CollectorContext";
import Footer from "../components/Footer";
import Button from "../components/Button";
import useWindowDimensions from "../../utils/useWindowDimensions";
import Presentation from "../components/Presentation";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function CollectorArtworkDetail() {
  const { collectedArtworkId } = useParams();
  const { collectorInfo } = useContext(CollectorContext);
  const [collection, setCollection] = useState(null);
  const [collectedArtwork, setCollectedArtwork] = useState(null);
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const [imageHovered, setImageHovered] = useState(null);
  const [svgHoveredRight, setSvgHoveredRight] = useState(null);
  const [svgHoveredLeft, setSvgHoveredLeft] = useState(null);

  const [showIndexImage, setShowIndexImage] = useState(0);
  const collectedArtworkUploadedPhotosTotalIndex =
    collectedArtwork?.uploadedPhotos.length - 1;

  console.log("length:", collectedArtworkUploadedPhotosTotalIndex);

  const getClickedIndexFromPresentation = (data) => {
    console.log("clicked index from presentation:", data);
    setShowIndexImage(data);
  };
  const [alertCreated, setAlertCreated] = useState(null);

  const goLeft = () => {
    if (showIndexImage === 0) {
      setShowIndexImage(collectedArtworkUploadedPhotosTotalIndex);
    } else {
      setShowIndexImage(showIndexImage - 1);
    }
  };
  const goRight = () => {
    if (showIndexImage === collectedArtworkUploadedPhotosTotalIndex) {
      setShowIndexImage(0);
    } else {
      setShowIndexImage(showIndexImage + 1);
    }
  };

  console.log("image index:", showIndexImage);
  console.log(
    "total index means last index:",
    collectedArtworkUploadedPhotosTotalIndex
  );

  const getCollectedArtwork = async () => {
    try {
      const result = await axios.get(
        `${API_URL}/collectors/${collectorInfo?._id}/my-collection/artwork/${collectedArtworkId}`
      );

      if (result.status === 200) {
        setCollection(result.data.collection);
        setCollectedArtwork(result.data.artwork);
      }

      console.log("result:", result);
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    if (collectedArtworkId) {
      getCollectedArtwork();
    }
  }, [collectedArtworkId]);

  console.log("collected artwork:", collectedArtwork);

  return (
    <>
      <div className="collector-artwork-detail-wrapper unica-regular-font">
        <div className="box-20-px-m-top"></div>
        <div className="collector-artwork-detail-header">
          <div
            onClick={() => {
              navigate("/collector-profile/my-collection");
            }}
            className="pointer dflex"
            style={{
              fontSize: "13px",
              lineHeight: "20px",
              alignItems: "center",
            }}
          >
            <svg width={14} height={14} viewBox="0 0 18 18" fill="currentColor">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.0601 15.94L5.12012 9L12.0601 2.06L12.9401 2.94L6.88012 9L12.9401 15.06L12.0601 15.94Z"
              ></path>
            </svg>
            {width > 768 && (
              <span
                style={{
                  paddingLeft: "10px",
                }}
              >
                Back to My Collection
              </span>
            )}
          </div>
          <div>
            <Button
              className="hover_bg_color_effect_white_text_black pointer hover_color_effect_t-d"
              backgroundColor="transparent"
              height="100dvh"
              width="100%"
              maxHeight="30px"
              maxWidth="170px"
              padding="1px 25px"
              margin="0"
              borderRadius="9999px"
              border="1px solid rgb(0,0,0)"
              text={width <= 768 ? "Edit" : "Edit Artwork Details"}
              fontSize="13px"
              lineHeight="20px"
              textColor="black"
              onClick={() => {
                navigate(
                  `/collector-profile/my-collection/artworks/${collectedArtworkId}/edit`
                );
              }}
            />
          </div>
        </div>
        <div className="box-10-px-m-top"></div>
        <div className="collector-artwork-detail-grid-container">
          <div
            onMouseEnter={() => setImageHovered(true)}
            onMouseLeave={() => setImageHovered(false)}
            style={{
              justifyContent:
                collectedArtwork?.uploadedPhotos.length > 0
                  ? "space-around"
                  : "center",
            }}
            className="collector-artwork-detail-grid-container first-section"
          >
            {collectedArtwork?.uploadedPhotos.length > 1 && width > 768 && (
              <div
                onClick={goLeft}
                onMouseEnter={() => setSvgHoveredLeft(true)}
                onMouseLeave={() => setSvgHoveredLeft(false)}
                style={{
                  maxWidth: "30px",
                  maxHeight: "30px",
                  width: "100%",
                  height: "100%",
                  opacity: imageHovered ? 1 : 0,
                  transition: "opacity 250ms ease 0s",
                }}
                className="go-left pointer"
              >
                {imageHovered && (
                  <>
                    <svg
                      style={{
                        width: "100%",
                        height: "100%",
                        transition: "fill 250ms ease 0s",
                      }}
                      viewBox="0 0 18 18"
                      fill={svgHoveredLeft ? "black" : "rgb(112, 112, 112)"}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.0601 15.94L5.12012 9L12.0601 2.06L12.9401 2.94L6.88012 9L12.9401 15.06L12.0601 15.94Z"
                      ></path>
                    </svg>
                  </>
                )}
              </div>
            )}
            <div
              style={{
                maxWidth: "600px",
                position: "relative",
                width: "100%",
                overflow: "hidden",
              }}
            >
              {collectedArtwork?.uploadedPhotos.length ? (
                <div>
                  <img
                    style={{
                      maxHeight: "800px",
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    src={collectedArtwork?.uploadedPhotos[showIndexImage]}
                    alt=""
                  />
                  <div className="box-20-px-m-top"></div>
                  {width <= 768 && (
                    <div className="presentation">
                      <div className="presentation-content">
                        <Presentation
                          show={collectedArtwork?.uploadedPhotos.length > 1}
                          sendClickedIndexToParent={
                            getClickedIndexFromPresentation
                          }
                          totalIndex={
                            collectedArtworkUploadedPhotosTotalIndex + 1
                          }
                          activeIndex={
                            showIndexImage === 0
                              ? showIndexImage
                              : showIndexImage
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    aspectRatio: "1/1",
                    maxWidth: "520px",
                    maxHeight: "520px",
                    backgroundColor: "rgb(231,231,231)",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={() => {
                      navigate(
                        `/collector-profile/my-collection/artworks/${collectedArtworkId}/edit`
                      );
                    }}
                    className="hover_bg_color_effect_white_text_black pointer hover_color_effect_t-d"
                    backgroundColor="transparent"
                    height="100dvh"
                    width="100%"
                    maxHeight="50px"
                    maxWidth="177px"
                    padding="1px 25px"
                    margin="0"
                    borderRadius="9999px"
                    border="1px solid rgb(0,0,0)"
                    text={width <= 768 ? "Upload" : "Upload Photos"}
                    fontSize="15px"
                    lineHeight="20px"
                    textColor="black"
                    svgIcon={
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        fill="currentColor"
                      >
                        <g clipPath="url(#a)">
                          <path d="M9.00022 0.111084C6.64274 0.111084 4.38181 1.04759 2.71482 2.71458C1.04783 4.38157 0.111328 6.64249 0.111328 8.99997C0.111328 11.3575 1.04783 13.6184 2.71482 15.2854C4.38181 16.9524 6.64274 17.8889 9.00022 17.8889C11.3577 17.8889 13.6186 16.9524 15.2856 15.2854C16.9526 13.6184 17.8891 11.3575 17.8891 8.99997C17.8891 6.64249 16.9526 4.38157 15.2856 2.71458C13.6186 1.04759 11.3577 0.111084 9.00022 0.111084ZM9.00022 16.9011C7.95482 16.9135 6.91735 16.7183 5.94794 16.3268C4.97853 15.9353 4.09645 15.3554 3.35282 14.6205C2.60919 13.8856 2.01879 13.0105 1.61584 12.0458C1.2129 11.0811 1.00541 10.046 1.00541 9.00053C1.00541 7.95505 1.2129 6.91998 1.61584 5.95528C2.01879 4.99058 2.60919 4.11544 3.35282 3.38057C4.09645 2.64571 4.97853 2.06573 5.94794 1.67425C6.91735 1.28277 7.95482 1.08758 9.00022 1.09997C11.0725 1.13473 13.0481 1.98233 14.5013 3.46009C15.9545 4.93784 16.7688 6.92742 16.7688 8.99997C16.7688 11.0725 15.9545 13.0621 14.5013 14.5399C13.0481 16.0176 11.0725 16.8663 9.00022 16.9011ZM9.61244 8.38775H13.4447V9.61108H9.61244V13.4444H8.3891V9.61219H4.55577V8.38886H8.38799V4.55553H9.61133L9.61244 8.38775Z"></path>
                        </g>
                        <defs>
                          <clipPath id="a">
                            <rect width="18" height="18"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                    }
                    svgDisplay={"flex"}
                  />
                </div>
              )}
            </div>
            {collectedArtwork?.uploadedPhotos.length > 1 && width > 768 && (
              <div
                onClick={goRight}
                onMouseEnter={() => setSvgHoveredRight(true)}
                onMouseLeave={() => setSvgHoveredRight(false)}
                style={{
                  maxWidth: "30px",
                  maxHeight: "30px",
                  width: "100%",
                  height: "100%",
                  opacity: imageHovered ? 1 : 0,
                  transition: "opacity 250ms ease 0s",
                }}
                className="go-right pointer"
              >
                {imageHovered && (
                  <>
                    <svg
                      style={{
                        width: "100%",
                        height: "100%",
                        transition: "fill 250ms ease 0s",
                      }}
                      viewBox="0 0 18 18"
                      fill={svgHoveredRight ? "black" : "rgb(112, 112, 112)"}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.94006 15.94L5.06006 15.06L11.1201 8.99999L5.06006 2.93999L5.94006 2.05999L12.8801 8.99999L5.94006 15.94Z"
                      ></path>
                    </svg>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="collector-artwork-detail-grid-container second-section">
            <div
              className="flex-box-wrapper-collector-artwork-detail"
              style={{
                gridColumn: "span 12",
              }}
            >
              <div
                style={{
                  fontSize: "26px",
                  lineHeight: "32px",
                  letterSpacing: "-0.01em",
                }}
              >
                {collectedArtwork?.artistName}
              </div>
              <div
                className="unica-italic-font"
                style={{
                  fontSize: "26px",
                  lineHeight: "32px",
                  color: "rgb(112,112,112)",
                }}
              >
                {collectedArtwork?.title}
              </div>
              <div className="box-20-px-m-top"></div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      flexBasis: "50%",
                      color: "rgb(112,112,112)",
                    }}
                  >
                    Medium
                  </div>
                  <div
                    style={{
                      flexBasis: "50%",
                      overflow: "hidden",
                      wordBreak: "break-word",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {collectedArtwork?.medium ? (
                      <span>{collectedArtwork?.medium}</span>
                    ) : (
                      <span
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        ----
                      </span>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      flexBasis: "50%",
                      color: "rgb(112,112,112)",
                    }}
                  >
                    Materials
                  </div>
                  <div
                    style={{
                      flexBasis: "50%",
                      overflow: "hidden",
                      wordBreak: "break-word",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {collectedArtwork?.materials ? (
                      <span>{collectedArtwork?.materials}</span>
                    ) : (
                      <span
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        ----
                      </span>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      flexBasis: "50%",
                      color: "rgb(112,112,112)",
                    }}
                  >
                    Rarity
                  </div>
                  <div
                    style={{
                      flexBasis: "50%",
                      overflow: "hidden",
                      wordBreak: "break-word",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {collectedArtwork?.rarity ? (
                      <span>{collectedArtwork?.rarity}</span>
                    ) : (
                      <span
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        ----
                      </span>
                    )}
                  </div>
                </div>{" "}
                <div
                  style={{
                    display: "flex",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      flexBasis: "50%",
                      color: "rgb(112,112,112)",
                    }}
                  >
                    Dimensions
                  </div>
                  <div
                    style={{
                      flexBasis: "50%",
                      overflow: "hidden",
                      wordBreak: "break-word",
                      display: "flex",
                      // flexDirection: "column",
                    }}
                  >
                    {collectedArtwork?.dimensions?.height &&
                    collectedArtwork?.dimensions?.width &&
                    collectedArtwork?.dimensions?.depth ? (
                      <>
                        <span
                          style={{
                            marginRight: "5px",
                          }}
                        >
                          {collectedArtwork?.dimensions.height}
                        </span>
                        <span
                          style={{
                            marginRight: "5px",
                          }}
                        >
                          x
                        </span>
                        <span
                          style={{
                            marginRight: "5px",
                          }}
                        >
                          {collectedArtwork?.dimensions.width}
                        </span>
                        <span
                          style={{
                            marginRight: "5px",
                          }}
                        >
                          x
                        </span>
                        <span
                          style={{
                            marginRight: "5px",
                          }}
                        >
                          {collectedArtwork?.dimensions.depth}{" "}
                        </span>
                        <span>
                          {collectedArtwork?.dimensions.cm ? "cm" : "in"}
                        </span>
                      </>
                    ) : (
                      <span
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        ----
                      </span>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      flexBasis: "50%",
                      color: "rgb(112,112,112)",
                    }}
                  >
                    Location
                  </div>
                  <div
                    style={{
                      flexBasis: "50%",
                      overflow: "hidden",
                      wordBreak: "break-word",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {collectedArtwork?.city ? (
                      <span>{collectedArtwork?.city}</span>
                    ) : (
                      <span
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        ----
                      </span>
                    )}
                  </div>
                </div>{" "}
                <div
                  style={{
                    display: "flex",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      flexBasis: "50%",
                      color: "rgb(112,112,112)",
                    }}
                  >
                    Provenance
                  </div>
                  <div
                    style={{
                      flexBasis: "50%",
                      overflow: "hidden",
                      wordBreak: "break-word",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {collectedArtwork?.provenance ? (
                      <span>{collectedArtwork?.provenance}</span>
                    ) : (
                      <span
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        ----
                      </span>
                    )}
                  </div>
                </div>{" "}
                <div
                  style={{
                    display: "flex",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      flexBasis: "50%",
                      color: "rgb(112,112,112)",
                    }}
                  >
                    Price Paid
                  </div>
                  <div
                    style={{
                      flexBasis: "50%",
                      overflow: "hidden",
                      wordBreak: "break-word",
                      display: "flex",
                    }}
                  >
                    {collectedArtwork?.pricePaid?.amount &&
                    collectedArtwork?.pricePaid?.currency ? (
                      <>
                        <span>
                          {collectedArtwork?.pricePaid?.currency === "USD"
                            ? "$"
                            : collectedArtwork?.pricePaid?.currency === "EUR"
                            ? "€"
                            : collectedArtwork?.pricePaid?.currency === "GBP"
                            ? "£"
                            : ""}
                        </span>
                        <span>{collectedArtwork?.pricePaid?.amount}</span>
                      </>
                    ) : (
                      <span
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        ----
                      </span>
                    )}
                  </div>
                </div>{" "}
                <div
                  style={{
                    display: "flex",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      flexBasis: "50%",
                      color: "rgb(112,112,112)",
                    }}
                  >
                    Notes
                  </div>
                  <div
                    style={{
                      flexBasis: "50%",
                      overflow: "hidden",
                      wordBreak: "break-word",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {collectedArtwork?.pricePaid?.amount ? (
                      <>
                        <span>{collectedArtwork?.notes}</span>
                      </>
                    ) : (
                      <span
                        style={{
                          color: "rgb(112,112,112)",
                        }}
                      >
                        ----
                      </span>
                    )}
                  </div>
                </div>{" "}
              </div>
              <div
                style={{
                  borderBottom: "1px solid rgb(231, 231, 231)",
                  margin: "20px 0px",
                }}
              ></div>
            </div>
          </div>
        </div>
        {width > 768 && (
          <div className="presentation">
            <div className="presentation-content">
              <Presentation
                show={collectedArtwork?.uploadedPhotos.length > 1}
                sendClickedIndexToParent={getClickedIndexFromPresentation}
                totalIndex={collectedArtworkUploadedPhotosTotalIndex + 1}
                activeIndex={
                  showIndexImage === 0 ? showIndexImage : showIndexImage
                }
              />
            </div>
          </div>
        )}
        <div className="box-40-px-m-top"></div>
      </div>
      {/* this section is abstract and may change in the future. Comparable works can be render in here with the same style. */}
      <div
        style={{
          padding: width > 768 && "0px 40px",
        }}
        className="insight-detailed-wrapper-from-artworks unica-regular-font"
      >
        <div
          style={{
            fontSize: width > 768 && "20px",
          }}
        >
          Comparable Works
        </div>
        <div className="box-20-px-m-top"></div>
        <div className="insight-detailed-wrapper-from-artworks-grid-container">
          {/* abstract 1 */}
          <div className="parent-detailed-wrapper">
            <div className="artwork-pic-sec">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  aspectRatio: "1/1",
                  maxWidth: "130px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgb(231,231,231)",
                  }}
                >
                  <img
                    width={"100%"}
                    height={"100%"}
                    src="https://d7hftxdivxxvm.cloudfront.net?height=130&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FBZkjmGJGTgfhiERrPdEgaw%2Fthumbnail.jpg&width=130"
                    srcSet="https://d7hftxdivxxvm.cloudfront.net?height=130&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FBZkjmGJGTgfhiERrPdEgaw%2Fthumbnail.jpg&width=130 1x, https://d7hftxdivxxvm.cloudfront.net?height=260&quality=50&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FBZkjmGJGTgfhiERrPdEgaw%2Fthumbnail.jpg&width=260 2x"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="artwork-detail-sec">
              <div>
                <div
                  className="unica-italic-font"
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                    overflow: width <= 768 && "hidden",
                    textOverflow: width <= 768 && "ellipsis",
                    whiteSpace: width <= 768 && "nowrap",
                  }}
                >
                  Group From The Last Judgment, Angels Carrying The Column Of
                  The Flagellation And The Sponge And Ladder Of The Crucifixion,
                  1545
                </div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  Engraving
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  19.3 x 35 cm
                </div>
              </div>{" "}
              <div>
                {width <= 768 && (
                  <div
                    style={{
                      marginTop: "5px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: width <= 768 ? "13px" : "",
                        color: width <= 768 && "rgb(112,112,112)",
                      }}
                    >
                      {" "}
                      2 May 2019 •
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "rgb(112,112,112)",
                      }}
                    >
                      {" "}
                      Swann
                    </span>
                  </div>
                )}
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                    display: width > 768 && "none",
                  }}
                >
                  <div>American Art</div>
                  <div>Lot 47</div>
                </div>
              </div>{" "}
              <div
                style={{
                  display: width > 768 && "none",
                }}
                className="dflex unica-italic-font"
              >
                <div>
                  <span
                    style={{
                      fontSize: width <= 768 ? "13px" : "",
                    }}
                  >
                    Bought In
                  </span>
                </div>
              </div>
            </div>
            <div className="artwork-auction-detail-sec display-none-bp-768px">
              <div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                    color: width <= 768 && "rgb(112,112,112)",
                  }}
                >
                  2 May 2019
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  Swann • New York
                </div>
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  <div>Old Master Through Modern Prints Featuring Latin</div>
                  <div>American Art</div>
                  <div>Lot 47</div>
                </div>
              </div>
            </div>
            <div className="artwork-auction-result-sec display-none-bp-768px">
              <div>
                <div
                  className="unica-italic-font"
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                  }}
                >
                  Bought In
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  US$1,200–US$1,800 (est)
                </div>
              </div>
            </div>
          </div>
          {/* abstract 2 */}
          <div className="parent-detailed-wrapper">
            <div className="artwork-pic-sec">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  aspectRatio: "1/1",
                  maxWidth: "130px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgb(231,231,231)",
                  }}
                >
                  <img
                    width={"100%"}
                    height={"100%"}
                    src="https://d7hftxdivxxvm.cloudfront.net?height=130&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FwQhIokMqgOSWO1IyMGGEAg%2Fthumbnail.jpg&width=130"
                    srcSet="https://d7hftxdivxxvm.cloudfront.net?height=130&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FwQhIokMqgOSWO1IyMGGEAg%2Fthumbnail.jpg&width=130 1x, https://d7hftxdivxxvm.cloudfront.net?height=260&quality=50&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FwQhIokMqgOSWO1IyMGGEAg%2Fthumbnail.jpg&width=260 2x"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="artwork-detail-sec">
              <div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                  }}
                  className="unica-italic-font"
                >
                  Aurora (Dawn)
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  <div>Sculpture</div>
                  <div>33.02 cm</div>
                </div>
              </div>{" "}
              <div>
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                    color: width <= 768 && "rgb(112,112,112)",
                    display: width > 768 && "none",
                  }}
                >
                  26 Jan 2007
                </div>
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                    display: width > 768 && "none",
                  }}
                >
                  <div>Sotheby's • New York</div>
                  <div>Old Master Paintings</div>
                </div>
                {width <= 768 && (
                  <div
                    style={{
                      marginTop: "5px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: width <= 768 ? "13px" : "",
                        color: width <= 768 && "rgb(112,112,112)",
                      }}
                    >
                      {" "}
                      26 Jan 2007 •
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "rgb(112,112,112)",
                      }}
                    >
                      {" "}
                      Sotheby's
                    </span>
                  </div>
                )}
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                    display: width > 768 && "none",
                  }}
                >
                  <div>Dessins anciens et du XIXe siècle</div>
                  <div>Lot 242</div>
                </div>
              </div>{" "}
              <div
                style={{
                  display: width > 768 && "none",
                }}
                className="dflex"
              >
                <div>
                  <span
                    style={{
                      fontSize: width <= 768 ? "13px" : "",
                    }}
                  >
                    US$10,000
                  </span>{" "}
                  <span
                    style={{
                      fontSize: width <= 768 ? "13px" : "16px",
                      lineHeight: "20px",
                      color: "rgb(200, 36, 0)",
                      fontWeight: "bolder",
                    }}
                  >
                    (-20% est)
                  </span>
                </div>
              </div>
            </div>
            <div className="artwork-auction-detail-sec display-none-bp-768px">
              <div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                    color: width <= 768 && "rgb(112,112,112)",
                  }}
                >
                  26 Jan 2007
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  Sotheby's • New York
                </div>
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  <div>Old Master Paintings</div>
                  <div>Lot 242</div>
                </div>
              </div>
            </div>
            <div className="artwork-auction-result-sec display-none-bp-768px">
              <div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                  }}
                >
                  {" "}
                  US$10,000
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  US$10,000–US$15,000 (est)
                </div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "16px",
                    lineHeight: "20px",
                    color: "rgb(200, 36, 0)",
                    fontWeight: "bolder",
                  }}
                >
                  -20% est
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {width <= 768 ? (
        <div className="box-20-px-m-top"></div>
      ) : (
        <div className="box-40-px-m-top"></div>
      )}

      {/* this section is abstract and may change in the future. If the uploaded artworks belong to a specific artist, their latest auctions can be rendered here in the same style. */}
      <div
        style={{
          padding: width > 768 && "0px 40px",
        }}
        className="insight-detailed-wrapper-from-artworks unica-regular-font"
      >
        <div
          style={{
            fontSize: width > 768 && "20px",
          }}
        >
          Auction Results
        </div>
        <div className="box-20-px-m-top"></div>
        <div className="insight-detailed-wrapper-from-artworks-grid-container">
          {/* abstract 1 */}
          <div className="parent-detailed-wrapper">
            <div className="artwork-pic-sec">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  aspectRatio: "1/1",
                  maxWidth: "130px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgb(231,231,231)",
                  }}
                >
                  <img
                    width={"100%"}
                    height={"100%"}
                    src="https://d7hftxdivxxvm.cloudfront.net?height=130&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FJ9rQO54uCj3yhZwZq2MFrQ%2Fthumbnail.jpg&width=130"
                    srcSet="https://d7hftxdivxxvm.cloudfront.net?height=130&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FJ9rQO54uCj3yhZwZq2MFrQ%2Fthumbnail.jpg&width=130 1x, https://d7hftxdivxxvm.cloudfront.net?height=260&quality=50&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FJ9rQO54uCj3yhZwZq2MFrQ%2Fthumbnail.jpg&width=260 2x"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="artwork-detail-sec">
              <div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                  }}
                >
                  Michelangelo Buonarroti
                </div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                  }}
                  className="unica-italic-font"
                >
                  Tête de jeune homme de profil vers la gauche
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  19.3 x 7.3 cm
                </div>
              </div>{" "}
              <div>
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                    color: width <= 768 && "rgb(112,112,112)",
                    display: width > 768 && "none",
                  }}
                >
                  22 Mar 2023 •
                </div>
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                    display: width > 768 && "none",
                  }}
                >
                  Christie's
                </div>
                {width <= 768 && (
                  <div
                    style={{
                      marginTop: "5px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: width <= 768 ? "13px" : "",
                        color: width <= 768 && "rgb(112,112,112)",
                      }}
                    >
                      {" "}
                      22 Mar 2023 •
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "rgb(112,112,112)",
                      }}
                    >
                      {" "}
                      Christie's
                    </span>
                  </div>
                )}
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                    display: width > 768 && "none",
                  }}
                >
                  <div>Dessins anciens et du XIXe siècle</div>
                  <div>Lot 9</div>
                </div>
              </div>{" "}
              <div
                style={{
                  display: width > 768 && "none",
                }}
                className="dflex"
              >
                <div>
                  <span
                    style={{
                      fontSize: width <= 768 ? "13px" : "",
                    }}
                  >
                    €11,592 • US$12,599
                  </span>
                  <span
                    className="display-none-bp-768px"
                    style={{
                      fontSize: "13px",
                      lineHeight: "20px",
                      color: "rgb(112,112,112)",
                    }}
                  >
                    €4,000–€6,000 (est)
                  </span>{" "}
                  <span
                    style={{
                      fontSize: width <= 768 ? "13px" : "16px",
                      lineHeight: "20px",
                      color: "rgb(0, 103, 74)",
                      fontWeight: "bolder",
                    }}
                  >
                    (+132% est)
                  </span>
                </div>
              </div>
            </div>
            <div className="artwork-auction-detail-sec display-none-bp-768px">
              <div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                    color: width <= 768 && "rgb(112,112,112)",
                  }}
                >
                  22 Mar 2023
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  Christie's
                </div>
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  <div>Dessins anciens et du XIXe siècle</div>
                  <div>Lot 9</div>
                </div>
              </div>
            </div>
            <div className="artwork-auction-result-sec display-none-bp-768px">
              <div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                  }}
                >
                  €11,592 • US$12,599
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  €4,000–€6,000 (est)
                </div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "16px",
                    lineHeight: "20px",
                    color: "rgb(0, 103, 74)",
                    fontWeight: "bolder",
                  }}
                >
                  +132% est
                </div>
              </div>
            </div>
          </div>
          {/* abstract 2 */}
          <div className="parent-detailed-wrapper">
            <div className="artwork-pic-sec">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  aspectRatio: "1/1",
                  maxWidth: "130px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgb(231,231,231)",
                  }}
                >
                  <img
                    width={"100%"}
                    height={"100%"}
                    src="https://d7hftxdivxxvm.cloudfront.net?height=130&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FkQUwJ9mUtM7duyI2ycVUnA%2Fthumbnail.jpg&width=130"
                    srcSet="https://d7hftxdivxxvm.cloudfront.net?height=130&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FkQUwJ9mUtM7duyI2ycVUnA%2Fthumbnail.jpg&width=130 1x, https://d7hftxdivxxvm.cloudfront.net?height=260&quality=50&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FkQUwJ9mUtM7duyI2ycVUnA%2Fthumbnail.jpg&width=260 2x"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="artwork-detail-sec">
              <div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                  }}
                >
                  Michelangelo Buonarroti
                </div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                  }}
                  className="unica-italic-font"
                >
                  Aurora (Dawn)
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  <div>bronze, on an ebonised wood base</div>
                  <div>14.5 x 34 cm</div>
                </div>
              </div>{" "}
              <div>
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                    color: width <= 768 && "rgb(112,112,112)",
                    display: width > 768 && "none",
                  }}
                >
                  6 Dec 2022 •
                </div>
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                    display: width > 768 && "none",
                  }}
                >
                  <div>Sotheby's • London</div>
                  <div>Old Master Sculpture & Works of Art</div>
                </div>
                {width <= 768 && (
                  <div
                    style={{
                      marginTop: "5px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: width <= 768 ? "13px" : "",
                        color: width <= 768 && "rgb(112,112,112)",
                      }}
                    >
                      {" "}
                      6 Dec 2022 •
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "rgb(112,112,112)",
                      }}
                    >
                      {" "}
                      Sotheby's
                    </span>
                  </div>
                )}
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                    display: width > 768 && "none",
                  }}
                >
                  <div>Dessins anciens et du XIXe siècle</div>
                  <div>Lot 28</div>
                </div>
              </div>{" "}
              <div
                style={{
                  display: width > 768 && "none",
                }}
                className="dflex"
              >
                <div>
                  <span
                    style={{
                      fontSize: width <= 768 ? "13px" : "",
                    }}
                  >
                    £16,380 • US$19,873
                  </span>
                  <span
                    className="display-none-bp-768px"
                    style={{
                      fontSize: "13px",
                      lineHeight: "20px",
                      color: "rgb(112,112,112)",
                    }}
                  >
                    £15,000–£20,000 (est)
                  </span>
                  {"  "}
                  <span
                    style={{
                      fontSize: width <= 768 ? "13px" : "16px",
                      lineHeight: "20px",
                      color: "rgb(200, 36, 0)",
                      fontWeight: "bolder",
                    }}
                  >
                    (-6% est)
                  </span>
                </div>
              </div>
            </div>
            <div className="artwork-auction-detail-sec display-none-bp-768px">
              <div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                    color: width <= 768 && "rgb(112,112,112)",
                  }}
                >
                  6 Dec 2022
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  Sotheby's • London
                </div>
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  <div>Old Master Sculpture & Works of Art</div>
                  <div>Lot 28</div>
                </div>
              </div>
            </div>
            <div className="artwork-auction-result-sec display-none-bp-768px">
              <div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                  }}
                >
                  {" "}
                  £16,380 • US$19,873
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  £15,000–£20,000 (est)
                </div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "16px",
                    lineHeight: "20px",
                    color: "rgb(200, 36, 0)",
                    fontWeight: "bolder",
                  }}
                >
                  -6% est
                </div>
              </div>
            </div>
          </div>
          {/* abstract 3 */}
          <div className="parent-detailed-wrapper">
            <div className="artwork-pic-sec">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  aspectRatio: "1/1",
                  maxWidth: "130px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgb(231,231,231)",
                  }}
                >
                  <img
                    width={"100%"}
                    height={"100%"}
                    src="https://d7hftxdivxxvm.cloudfront.net?height=130&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F8BGpsoJb1ZJQLneyucsKGQ%2Fthumbnail.jpg&width=130"
                    srcSet="https://d7hftxdivxxvm.cloudfront.net?height=130&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F8BGpsoJb1ZJQLneyucsKGQ%2Fthumbnail.jpg&width=130 1x, https://d7hftxdivxxvm.cloudfront.net?height=260&quality=50&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F8BGpsoJb1ZJQLneyucsKGQ%2Fthumbnail.jpg&width=260 2x"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="artwork-detail-sec">
              <div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                  }}
                >
                  Michelangelo Buonarroti
                </div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                  }}
                  className="unica-italic-font"
                >
                  A nude man (after Masaccio) and two figures behind him
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  <div>pen and two shades of brown ink, brown wash</div>
                  <div>33 x 20 cm</div>
                </div>
              </div>{" "}
              <div>
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                    color: width <= 768 && "rgb(112,112,112)",
                    display: width > 768 && "none",
                  }}
                >
                  18 May 2022 •
                </div>
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                    display: width > 768 && "none",
                  }}
                >
                  <div>Christie's</div>
                  <div>Michelangelo's First Nude: A Drawing Rediscovered</div>
                </div>
                {width <= 768 && (
                  <div
                    style={{
                      marginTop: "5px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: width <= 768 ? "13px" : "",
                        color: width <= 768 && "rgb(112,112,112)",
                      }}
                    >
                      {" "}
                      18 May 2022 •
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "rgb(112,112,112)",
                      }}
                    >
                      {" "}
                      Christie's
                    </span>
                  </div>
                )}
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                    display: width > 768 && "none",
                  }}
                >
                  <div> Michelangelo's First Nude: A Drawing Rediscovered</div>
                  <div>Lot 1</div>
                </div>
              </div>{" "}
              <div
                style={{
                  display: width > 768 && "none",
                }}
                className="dflex"
              >
                <div>
                  <span
                    style={{
                      fontSize: width <= 768 ? "13px" : "",
                    }}
                  >
                    €23,162,000 • US$24,433,469
                  </span>
                </div>
              </div>
            </div>
            <div className="artwork-auction-detail-sec display-none-bp-768px">
              <div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                    color: width <= 768 && "rgb(112,112,112)",
                  }}
                >
                  18 May 2022
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  Christie's
                </div>
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  <div> Michelangelo's First Nude: A Drawing Rediscovered</div>
                  <div>Lot 1</div>
                </div>
              </div>
            </div>
            <div className="artwork-auction-result-sec display-none-bp-768px">
              <div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                  }}
                >
                  {" "}
                  €23,162,000 • US$24,433,469{" "}
                </div>
              </div>
            </div>
          </div>
          {/* abstract 4 */}
          <div className="parent-detailed-wrapper">
            <div className="artwork-pic-sec">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  aspectRatio: "1/1",
                  maxWidth: "130px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgb(231,231,231)",
                  }}
                >
                  <img
                    width={"100%"}
                    height={"100%"}
                    src="https://d7hftxdivxxvm.cloudfront.net?height=130&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FHoEji9cKxThyoLlbr_NSvw%2Fthumbnail.jpg&width=130"
                    srcSet="https://d7hftxdivxxvm.cloudfront.net?height=130&quality=80&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FHoEji9cKxThyoLlbr_NSvw%2Fthumbnail.jpg&width=130 1x, https://d7hftxdivxxvm.cloudfront.net?height=260&quality=50&resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FHoEji9cKxThyoLlbr_NSvw%2Fthumbnail.jpg&width=260 2x"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="artwork-detail-sec">
              <div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                  }}
                >
                  Michelangelo Buonarroti
                </div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                  }}
                  className="unica-italic-font"
                >
                  The Doni Tondo
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  <div>oil on canvas laid down on board</div>
                  <div>119.4 x 119.4cm (47 x 47in)</div>
                </div>
              </div>{" "}
              <div>
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                    color: width <= 768 && "rgb(112,112,112)",
                    display: width > 768 && "none",
                  }}
                >
                  26 Oct 2021 •
                </div>
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                    display: width > 768 && "none",
                  }}
                >
                  <div>Bonhams • London, Knightsbridge</div>
                  <div>Old Master Paintings</div>
                  <div>Lot 195</div>
                </div>
                {width <= 768 && (
                  <div
                    style={{
                      marginTop: "5px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: width <= 768 ? "13px" : "",
                        color: width <= 768 && "rgb(112,112,112)",
                      }}
                    >
                      {" "}
                      26 Oct 2021 •
                    </span>{" "}
                    <span
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "rgb(112,112,112)",
                      }}
                    >
                      Bonhams
                    </span>
                  </div>
                )}
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                    display: width > 768 && "none",
                  }}
                >
                  <div> Michelangelo's First Nude: A Drawing Rediscovered</div>
                  <div>Lot 1</div>
                </div>
              </div>{" "}
              <div
                style={{
                  display: width > 768 && "none",
                }}
                className="dflex"
              >
                <div>
                  <span
                    style={{
                      fontSize: width <= 768 ? "13px" : "",
                    }}
                  >
                    £6,630 • US$9,129
                  </span>
                </div>
              </div>
            </div>
            <div className="artwork-auction-detail-sec display-none-bp-768px">
              <div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                    color: width <= 768 && "rgb(112,112,112)",
                  }}
                >
                  26 Oct 2021
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  Bonhams • London, Knightsbridge
                </div>
                <div
                  className="display-none-bp-768px"
                  style={{
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgb(112,112,112)",
                  }}
                >
                  <div> Old Master Paintings</div>
                  <div>Lot 195</div>
                </div>
              </div>
            </div>
            <div className="artwork-auction-result-sec display-none-bp-768px">
              <div>
                <div
                  style={{
                    fontSize: width <= 768 ? "13px" : "",
                  }}
                >
                  {" "}
                  £6,630 • US$9,129
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* This section is abstract and may change in the future. If the uploaded artworks belong to a specific artist, there can be some articles about this artist that will be rendered here. */}
      <div className="box-40-px-m-top"></div>
      <div
        style={{
          padding: width > 768 && "0px 40px",
        }}
        className="artist-articles-wrapper unica-regular-font"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="artist-articles-header"
        >
          <div
            style={{
              fontSize: "26px",
              lineHeight: "32px",
              letterSpacing: "-0.01em",
              textAlign: "left",
              flexBasis: width <= 768 && "75%",
            }}
          >
            Articles Featuring {collectedArtwork?.artistName}
          </div>
          <div
            className="pointer"
            style={{
              textDecoration: "underline",
              fontSize: width <= 768 && "13px",
              lineHeight: width <= 768 && "20px",
            }}
          >
            View All Articles
          </div>
        </div>
        <div className="box-40-px-m-top"></div>
        <div className="artist-articles-details">
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
              <div>Get notified when new articles are available</div>
              <div
                style={{
                  color: "rgb(112,112,112)",
                }}
              >
                There are currently no articles for this artist. Create an
                alert, and we’ll let you know when new articles are added.
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
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CollectorArtworkDetail;
