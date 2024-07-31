import { useContext, useEffect, useState } from "react";
import { CollectorContext } from "../components/CollectorContext";
import axios from "axios";
import { CollectorProfileHeader } from "../components/CollectorProfileHeader";
import useWindowDimensions from "../../utils/useWindowDimensions";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function CollectorProfile() {
  const { collectorInfo, getToken } = useContext(CollectorContext);
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const [collectedArtworks, setCollectedArtworks] = useState([]);

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
    } catch (error) {
      console.error("error:", error);
    }
  };

  const getCollectedArtworks = async () => {
    try {
      const result = await axios.get(
        `${API_URL}/collectors/${collectorInfo?._id}/collection/artworks`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setCollectedArtworks(result.data);
      console.log("result Collector's collected artworks:", result);
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    getCollectedArtworks();
    refreshCollector();
  }, []);

  // zoom effect
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

  console.log("collectedArtworks:", collectedArtworks);

  return (
    <>
      {width <= 768 ? (
        <div className="box-20-px-m-top"></div>
      ) : (
        <div className="box-60-px-m-top"></div>
      )}

      <div className="collector-profile-main">
        <div className="collector-profile-wrapper">
          <CollectorProfileHeader />
          <div className="box-40-px-m-top"></div>
          {!collectedArtworks?.length ? (
            <>
              <div class="grid-container unica-regular-font">
                {width <= 768 ? (
                  <>
                    <div class="col-6">
                      <div class="img-container">
                        <img
                          src="https://d7hftxdivxxvm.cloudfront.net?height=770&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-get-app-img.jpg&width=910"
                          srcset="https://d7hftxdivxxvm.cloudfront.net?height=770&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-get-app-img.jpg&width=910 1x, https://d7hftxdivxxvm.cloudfront.net?height=1540&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-get-app-img.jpg&width=1820 2x"
                          alt=""
                        />
                      </div>
                    </div>
                    <div class="col-6">
                      <div
                        style={{
                          fontSize: width < 1280 ? "40px" : "60px",
                          lineHeight: width < 1280 ? "48px" : "70px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Know Your Collection Better
                      </div>
                      <div className="box-20-px-m-top"></div>
                      <div
                        style={{
                          fontSize: "16px",
                          lineHeight: "26px",
                        }}
                      >
                        Manage your collection online and get free market
                        insights.
                      </div>
                      {width <= 768 ? (
                        <div className="box-20-px-m-top"></div>
                      ) : (
                        <div className="box-40-px-m-top"></div>
                      )}

                      <div>
                        <button
                          onClick={() =>
                            navigate(
                              "/collector-profile/my-collection/artworks/new"
                            )
                          }
                          style={{
                            border: "1px solid rgb(0,0,0)",
                            backgroundColor: "black",
                            borderRadius: "9999px",
                            padding: "1px 25px",
                            color: "white",
                            maxHeight: "50px",
                            maxWidth: width <= 768 ? "100%" : "321px",
                            height: "100dvh",
                            width: "100%",
                            fontSize: "16px",
                            minWidth: "fit-content",
                          }}
                          className="hover_bg_color_effect_black_text pointer unica-regular-font"
                        >
                          Upload Artwork
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div class="col-6">
                      <div
                        style={{
                          fontSize: width < 1280 ? "40px" : "60px",
                          lineHeight: width < 1280 ? "48px" : "70px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Know Your Collection Better
                      </div>
                      <div className="box-20-px-m-top"></div>
                      <div
                        style={{
                          fontSize: "16px",
                          lineHeight: "26px",
                        }}
                      >
                        Manage your collection online and get free market
                        insights.
                      </div>
                      <div className="box-40-px-m-top"></div>

                      <div>
                        <button
                          onClick={() =>
                            navigate(
                              "/collector-profile/my-collection/artworks/new"
                            )
                          }
                          style={{
                            border: "1px solid rgb(0,0,0)",
                            backgroundColor: "black",
                            borderRadius: "9999px",
                            padding: "1px 25px",
                            color: "white",
                            maxHeight: "50px",
                            maxWidth: "321px",
                            height: "100dvh",
                            width: "100%",
                            fontSize: "16px",
                            minWidth: "fit-content",
                          }}
                          className="hover_bg_color_effect_black_text pointer unica-regular-font"
                        >
                          Upload Artwork
                        </button>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="img-container">
                        <img
                          src="https://d7hftxdivxxvm.cloudfront.net?height=770&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-get-app-img.jpg&width=910"
                          srcset="https://d7hftxdivxxvm.cloudfront.net?height=770&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-get-app-img.jpg&width=910 1x, https://d7hftxdivxxvm.cloudfront.net?height=1540&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-get-app-img.jpg&width=1820 2x"
                          alt=""
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              {width <= 768 ? (
                <div className="box-60-px-m-top"></div>
              ) : (
                <div className="box-120-px-m-top"></div>
              )}
              <div
                style={{
                  alignItems: "flex-start",
                }}
                class="grid-container unica-regular-font"
              >
                {width <= 768 ? (
                  <>
                    {" "}
                    <div class="col-6">
                      <div
                        style={{
                          fontSize: width < 1280 ? "26px" : "40px",
                          lineHeight: width < 1280 ? "32px" : "48px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Create a private record of your artworks
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          lineHeight: "26px",
                        }}
                      >
                        View your collection online easily and securely in one
                        place.
                      </div>
                      <div className="box-40-px-m-top"></div>{" "}
                      <div
                        style={{
                          fontSize: width < 1280 ? "26px" : "40px",
                          lineHeight: width < 1280 ? "32px" : "48px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Get insights on your collection
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          lineHeight: "26px",
                        }}
                      >
                        Track market demand and get insight into the market
                        value of artworks in your collection.
                      </div>
                      <div className="box-40-px-m-top"></div>{" "}
                      <div
                        style={{
                          fontSize: width < 1280 ? "26px" : "40px",
                          lineHeight: width < 1280 ? "32px" : "48px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Keep track of artists you collect
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          lineHeight: "26px",
                        }}
                      >
                        Discover more about the artists you collect, with latest
                        career news and auction results.
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="img-container">
                        <img
                          src="https://d7hftxdivxxvm.cloudfront.net/?height=652&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-benefits-img.jpg&width=910"
                          srcset="https://d7hftxdivxxvm.cloudfront.net?height=652&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-benefits-img.jpg&width=910 1x, https://d7hftxdivxxvm.cloudfront.net?height=1304&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-benefits-img.jpg&width=1820 2x"
                          alt=""
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div class="col-6">
                      <div
                        style={{
                          aspectRatio: "910 / 652",
                        }}
                        class="img-container"
                      >
                        <img
                          src="https://d7hftxdivxxvm.cloudfront.net/?height=652&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-benefits-img.jpg&width=910"
                          srcset="https://d7hftxdivxxvm.cloudfront.net?height=652&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-benefits-img.jpg&width=910 1x, https://d7hftxdivxxvm.cloudfront.net?height=1304&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-benefits-img.jpg&width=1820 2x"
                          alt=""
                        />
                      </div>
                    </div>
                    <div class="col-6">
                      <div
                        style={{
                          fontSize: width < 1280 ? "40px" : "40px",
                          lineHeight: width < 1280 ? "48px" : "48px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Create a private record of your artworks
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          lineHeight: "26px",
                        }}
                      >
                        View your collection online easily and securely in one
                        place.
                      </div>
                      <div className="box-40-px-m-top"></div>{" "}
                      <div
                        style={{
                          fontSize: width < 1280 ? "40px" : "40px",
                          lineHeight: width < 1280 ? "48px" : "48px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Get insights on your collection
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          lineHeight: "26px",
                        }}
                      >
                        Track market demand and get insight into the market
                        value of artworks in your collection.
                      </div>
                      <div className="box-40-px-m-top"></div>{" "}
                      <div
                        style={{
                          fontSize: width < 1280 ? "40px" : "40px",
                          lineHeight: width < 1280 ? "48px" : "48px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Keep track of artists you collect
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          lineHeight: "26px",
                        }}
                      >
                        Discover more about the artists you collect, with latest
                        career news and auction results.
                      </div>
                    </div>
                  </>
                )}
              </div>
              {width <= 768 ? (
                <div
                  className="box-60-px-m-top unica-regular-font"
                  style={{
                    fontSize: "26px",
                    lineHeight: "32px",
                    letterSpacing: "-0.01em",
                    padding: width <= 768 && "0px 20px",
                  }}
                >
                  How It Works
                </div>
              ) : (
                <div
                  className="box-120-px-m-top unica-regular-font"
                  style={{
                    fontSize: "26px",
                    lineHeight: "32px",
                    letterSpacing: "-0.01em",
                    padding: width <= 768 && "0px 20px",
                  }}
                >
                  How It Works
                </div>
              )}
              <div className="box-40-px-m-top"></div>
              <div className="grid-container-3-column unica-regular-font">
                <div className="col-4">
                  <div className="box-20-px-m-top"></div>
                  <div>
                    <div
                      style={{
                        aspectRatio: "420/320",
                        maxWidth: "100%",
                        marginBottom: width <= 768 ? "10px" : "20px",
                        overflow: "hidden",
                        position: "relative",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      <img
                        width={"100%"}
                        height={"100%"}
                        style={{
                          boxSizing: "border-box",
                        }}
                        src="https://d7hftxdivxxvm.cloudfront.net?height=320&quality=100&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-how-it-works-step-2.jpg&width=450"
                        srcSet="https://d7hftxdivxxvm.cloudfront.net?height=320&quality=100&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-how-it-works-step-2.jpg&width=450 1x, https://d7hftxdivxxvm.cloudfront.net?height=640&quality=100&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-how-it-works-step-2.jpg&width=900 2x"
                        alt=""
                      />
                    </div>

                    <div
                      className="pointer-default"
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "rgb(16, 35, 215)",
                      }}
                    >
                      01
                    </div>
                    <div
                      className="pointer-default"
                      style={{
                        fontSize: width < 1280 ? "26px" : "40px",
                        lineHeight: width < 1280 ? "32px" : "48px",
                        letterSpacing: "-0.01em",
                        marginTop: "5px",
                      }}
                    >
                      Add your artworks
                    </div>
                    <div
                      className="pointer-default"
                      style={{
                        fontSize: "16px",
                        lineHeight: "26px",
                      }}
                    >
                      Upload images and details about your artworks to My
                      Collection.
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="box-20-px-m-top"></div>
                  <div>
                    <div
                      style={{
                        aspectRatio: "420/320",
                        maxWidth: "100%",
                        marginBottom: width <= 768 ? "10px" : "20px",
                        overflow: "hidden",
                        position: "relative",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      <img
                        width={"100%"}
                        height={"100%"}
                        style={{
                          boxSizing: "border-box",
                        }}
                        src="https://d7hftxdivxxvm.cloudfront.net?height=320&quality=100&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-how-it-works-step-1.jpg&width=450"
                        srcSet="https://d7hftxdivxxvm.cloudfront.net?height=320&quality=100&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-how-it-works-step-1.jpg&width=450 1x, https://d7hftxdivxxvm.cloudfront.net?height=640&quality=100&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-how-it-works-step-1.jpg&width=900 2x"
                        alt=""
                      />
                    </div>

                    <div
                      className="pointer-default"
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "rgb(16, 35, 215)",
                      }}
                    >
                      02
                    </div>
                    <div
                      className="pointer-default"
                      style={{
                        fontSize: width < 1280 ? "26px" : "40px",
                        lineHeight: width < 1280 ? "32px" : "48px",
                        letterSpacing: "-0.01em",
                        marginTop: "5px",
                      }}
                    >
                      Check for insights
                    </div>
                    <div
                      className="pointer-default"
                      style={{
                        fontSize: "16px",
                        lineHeight: "26px",
                      }}
                    >
                      Get free insights into the markets and careers of the
                      artists in your collection.
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="box-20-px-m-top"></div>
                  <div>
                    <div
                      style={{
                        aspectRatio: "420/320",
                        maxWidth: "100%",
                        marginBottom: width <= 768 ? "10px" : "20px",
                        overflow: "hidden",
                        position: "relative",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      <img
                        width={"100%"}
                        height={"100%"}
                        style={{
                          boxSizing: "border-box",
                        }}
                        src="https://d7hftxdivxxvm.cloudfront.net?height=320&quality=100&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-how-it-works-step-3.jpg&width=450"
                        srcSet="https://d7hftxdivxxvm.cloudfront.net?height=320&quality=100&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-how-it-works-step-3.jpg&width=450 1x, https://d7hftxdivxxvm.cloudfront.net?height=640&quality=100&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2Fmy-coll-how-it-works-step-3.jpg&width=900 2x"
                        alt=""
                      />
                    </div>
                    <div
                      className="pointer-default"
                      style={{
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: "rgb(16, 35, 215)",
                      }}
                    >
                      03
                    </div>
                    <div
                      className="pointer-default"
                      style={{
                        fontSize: width < 1280 ? "26px" : "40px",
                        lineHeight: width < 1280 ? "32px" : "48px",
                        letterSpacing: "-0.01em",
                        marginTop: "5px",
                      }}
                    >
                      Sell with Ease
                    </div>
                    <div
                      className="pointer-default"
                      style={{
                        fontSize: "16px",
                        lineHeight: "26px",
                      }}
                    >
                      Our team of experts will give you a free price estimate on
                      eligible artworks and find you the right buyer.
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  maxHeight: "50px",
                  width: "100%",
                  marginRight: width > 768 && "20px",
                  textAlign: "right",
                  position: "relative",
                  right: width <= 768 && "40px",
                }}
              >
                <Button
                  className={
                    "unica-regular-font hover_color_effect_t-d hover_bg_color_effect_black_text"
                  }
                  backgroundColor={"black"}
                  height="100dvh"
                  width={width <= 768 ? "100px" : "170px"}
                  textColor={"white"}
                  fontSize={width <= 768 ? "13px" : "16px"}
                  maxHeight={width <= 768 ? "30px" : "50px"}
                  maxWidth="100%"
                  padding="0px 25px"
                  borderRadius="25px"
                  cursor="pointer"
                  text={"Upload Artwork"}
                  border="1px solid rgb(0,0,0)"
                  lineHeight="26px"
                  opacity={"1"}
                  pointerEvents={"auto"}
                  onClick={() =>
                    navigate("/collector-profile/my-collection/artworks/new")
                  }
                />
              </div>

              <div className="box-20-px-m-top"></div>
              <div
                style={{
                  padding: width <= 768 && "0px 20px",
                }}
                className="container-for-artworks-render"
              >
                {collectedArtworks?.map((eachWork) => {
                  return (
                    <div key={eachWork._id}>
                      <>
                        {eachWork?.artworksUploaded.map((artworks, index) => {
                          return (
                            <div key={artworks._id}>
                              {artworks.uploadedPhotos.length ? (
                                <div
                                  onClick={() => {
                                    navigate(
                                      `/collector-profile/my-collection/artwork/${artworks._id}`
                                    );
                                  }}
                                  className="zoom-container"
                                >
                                  <img
                                    onMouseMove={handleMouseMove}
                                    onMouseEnter={() => {
                                      handleScaling(artworks._id, 1.75);
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
                                        hoveredIndex === artworks._id &&
                                        transformOrigin,
                                      transform:
                                        hoveredIndex === artworks._id &&
                                        `scale(${scaleNumber})`,
                                      transition:
                                        "transform 0.15s,transform-origin 100ms,opacity 0.25s",
                                      objectFit: "cover",
                                      opacity: 1,
                                    }}
                                    src={artworks.uploadedPhotos[0]}
                                    alt=""
                                  />
                                </div>
                              ) : (
                                <div
                                  onClick={() => {
                                    navigate(
                                      `/collector-profile/my-collection/artwork/${artworks._id}`
                                    );
                                  }}
                                  style={{
                                    position: "relative",
                                    width: "100%",
                                    backgroundColor: "rgb(231, 231, 231)",
                                    cursor: "pointer",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "block",
                                      width: "100%",
                                      height: "100%",
                                    }}
                                  >
                                    <div
                                      style={{
                                        maxWidth: "100%",
                                        aspectRatio: "4/3",
                                        position: "relative",
                                        width: "100%",
                                        overflow: "hidden",
                                        boxSizing: "border-box",
                                      }}
                                    >
                                      <div
                                        style={{
                                          position: "absolute",
                                          top: "0px",
                                          left: "0px",
                                          width: "100%",
                                          height: "100%",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "28px",
                                            height: "28px",
                                            position: "relative",
                                            color: "rgb(112,112,112)",
                                            boxSizing: "border-box",
                                          }}
                                        >
                                          <svg
                                            style={{
                                              position: "absolute",
                                              inset: "0px",
                                              width: "100%",
                                              height: "100%",
                                            }}
                                            viewBox="0 0 18 18"
                                            fill="currentColor"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M6.31496 12.1957L5.62264 13.1957H4V5.1957H11.1611L10.4688 6.19568H4.99995V12.1957H6.31496ZM7.53122 12.1957L6.8389 13.1957H14V5.1957H12.3774L11.6851 6.19568H13V12.1957H7.53122ZM10.9928 7.19568H12V11.1957H8.22353L10.9928 7.19568ZM9.7765 7.19568L7.00727 11.1957H5.99995V7.19568H9.7765ZM13.3735 2L11.8534 4.1957H3V14.1957H4.93033L3.8043 15.8222L4.62649 16.3914L6.14659 14.1957H15V4.1957H13.0697L14.1957 2.56921L13.3735 2Z"
                                            ></path>
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(
                                    `/collector-profile/my-collection/artwork/${artworks._id}`
                                  );
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
                                    {artworks?.artistName}
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
                                  {artworks?.title}
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
                      </>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
        {/* footer */}
        <Footer />
      </div>
    </>
  );
}

export default CollectorProfile;
