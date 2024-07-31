import { useContext, useEffect, useState } from "react";
import { CollectorContext } from "../components/CollectorContext";
import axios from "axios";
import { CollectorProfileHeader } from "../components/CollectorProfileHeader";
import useWindowDimensions from "../../utils/useWindowDimensions";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function CollectorProfileInsights() {
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

      console.log("result collector profile:", result);
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
          <div className="collector-profile-insights-wrapper parent-wrapper-collection-insights unica-regular-font">
            {collectedArtworks?.length ? (
              <>
                <div className="insights-detail-collected-artworks">
                  <div className="insights-detail-collected-artworks total-artists">
                    <div>Total Artists</div>
                    <div>{collectedArtworks.length}</div>
                  </div>
                  <div className="insights-detail-collected-artworks total-artworks">
                    <div>Total Artworks</div>
                    <div>{collectedArtworks.length}</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {width <= 768 ? (
                  <>
                    <div className="collector-profile-insights-wrapper second-section">
                      <div
                        style={{
                          width: "100%",
                          overflow: "hidden",
                          maxWidth: "100%",
                          aspectRatio: "1360/800",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgb(231,231,231)",
                            display: "block",
                            boxSizing: "border-box",
                          }}
                        >
                          <img
                            width={"100%"}
                            height={"100%"}
                            src="https://d7hftxdivxxvm.cloudfront.net?height=800&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2FInsightsEmptyStateImage.png&width=1360"
                            srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=800&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2FInsightsEmptyStateImage.png&width=1360%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=1600&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2FInsightsEmptyStateImage.png&width=2720%202x"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                    <div className="collector-profile-insights-wrapper first-section">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            fontSize: width <= 768 ? "40px" : "60px",
                            lineHeightStep: width <= 768 ? "48px" : "70px",
                            letterSpacing: "-0.01em",
                            width: "100%",
                          }}
                        >
                          Gain Deeper Knowledge of Your Collection
                        </div>
                        <div
                          style={{
                            marginTop: "20px",
                            marginBottom: "40px",
                            width: "100%",
                          }}
                        >
                          Get free market insights about the artists you
                          collect.
                        </div>
                        <div
                          style={{
                            maxHeight: "50px",
                            width: "100%",
                          }}
                        >
                          <Button
                            className={
                              "unica-regular-font hover_color_effect_t-d hover_bg_color_effect_black_text"
                            }
                            backgroundColor={"black"}
                            height="100dvh"
                            width={width <= 768 ? "100%" : "170px"}
                            textColor={"white"}
                            fontSize={"16px"}
                            maxHeight={width <= 768 ? "inherit" : "50px"}
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
                              navigate(
                                "/collector-profile/my-collection/artworks/new"
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="collector-profile-insights-wrapper first-section">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            fontSize: width <= 768 ? "40px" : "60px",
                            lineHeightStep: width <= 768 ? "48px" : "70px",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          Gain Deeper Knowledge of Your Collection
                        </div>
                        <div
                          style={{
                            marginTop: "20px",
                            marginBottom: "40px",
                          }}
                        >
                          Get free market insights about the artists you
                          collect.
                        </div>
                        <div>
                          {" "}
                          <div
                            style={{
                              maxHeight: "50px",
                              width: "100%",
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
                                navigate(
                                  "/collector-profile/my-collection/artworks/new"
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="collector-profile-insights-wrapper second-section">
                      <div
                        style={{
                          width: "100%",
                          overflow: "hidden",
                          maxWidth: "100%",
                          aspectRatio: "1360/800",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgb(231,231,231)",
                            display: "block",
                            boxSizing: "border-box",
                          }}
                        >
                          <img
                            width={"100%"}
                            height={"100%"}
                            src="https://d7hftxdivxxvm.cloudfront.net?height=800&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2FInsightsEmptyStateImage.png&width=1360"
                            srcSet="https://d7hftxdivxxvm.cloudfront.net/?height=800&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2FInsightsEmptyStateImage.png&width=1360%201x,%20https://d7hftxdivxxvm.cloudfront.net?height=1600&quality=80&resize_to=fit&src=https%3A%2F%2Ffiles.artsy.net%2Fimages%2FInsightsEmptyStateImage.png&width=2720%202x"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          {/* this section is abstract and may change in the future. If the uploaded artworks belong to a specific artist, their latest auctions can be rendered here in the same style. */}
          {collectedArtworks?.length ? (
            <div className="insight-detailed-wrapper-from-artworks unica-regular-font">
              <div
                style={{
                  fontSize: width > 768 && "20px",
                }}
              >
                Recently Sold at Auction
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
                        <div>
                          Michelangelo's First Nude: A Drawing Rediscovered
                        </div>
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
                        <div>
                          {" "}
                          Michelangelo's First Nude: A Drawing Rediscovered
                        </div>
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
                        <div>
                          {" "}
                          Michelangelo's First Nude: A Drawing Rediscovered
                        </div>
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
                        <div>
                          {" "}
                          Michelangelo's First Nude: A Drawing Rediscovered
                        </div>
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
          ) : null}
        </div>
        {/* footer */}
        <Footer />
      </div>
    </>
  );
}

export default CollectorProfileInsights;
