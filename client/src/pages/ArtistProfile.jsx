import { useParams } from "react-router-dom";
import data from "../data/data.json";
import { useEffect, useState } from "react";
import ReadMoreLess from "../components/ReadMoreLess";
import useWindowDimensions from "../../utils/useWindowDimensions";
function ArtistProfile() {
  const { artist_name } = useParams();
  const [artistName, setArtistName] = useState("");
  const [showAuctionRecord, setShowAuctionRecord] = useState(null);
  const [showSecondaryMarket, setShowSecondaryMarket] = useState(null);
  const [showCriticallyAcclaimed, setShowCriticallyAcclaimed] = useState(null);
  const [showShows, setShowShows] = useState(null);
  const { width } = useWindowDimensions();
  const cleanUrlArtistName = (name) => {
    const formattedName = name.replace(/-/g, " ");
    setArtistName(formattedName);
  };

  const findedArtist = data.find((eachArtist) => {
    return eachArtist.name.toLowerCase() === artistName;
  });

  useEffect(() => {
    if (artist_name) {
      cleanUrlArtistName(artist_name);
    }
  }, [artist_name]);

  console.log("artist name:", artistName);
  console.log("finded artist:", findedArtist);
  const formatSalePrice = (salePrice) => {
    const numericPart = parseFloat(salePrice.replace(/[$,]/g, ""));
    const suffix = salePrice.match(/[a-zA-Z]+/g)?.[0]?.toLowerCase();
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
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1920px",
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
        {findedArtist && (
          <>
            <div className="artist-header">
              <div className="item-1">
                <img
                  style={{
                    objectFit: "cover",
                    height: "100%",
                    width: "100%",
                    boxSizing: "border-box",
                    overflowClipMargin: "content-box",
                  }}
                  src={findedArtist.profilePic}
                  alt=""
                />
              </div>
              <div className="item-2">
                <div className="artist-name">{findedArtist.name}</div>
                <div className="artist-info">
                  <span>{findedArtist.nationality}, </span>
                  <span>{findedArtist.born}-</span>
                  <span>{findedArtist.died}</span>
                </div>
                <div>
                  <div className="artist-description">
                    <ReadMoreLess
                      text={findedArtist.description}
                      maxLength={248}
                    ></ReadMoreLess>
                  </div>
                </div>
              </div>
              <div className="item-3">
                <div
                  onClick={() => {
                    setShowAuctionRecord(!showAuctionRecord);
                  }}
                  className="artist-biography"
                >
                  <div>
                    High auction record (
                    {formatSalePrice(findedArtist.highAuctionRecord.salePrice)})
                  </div>{" "}
                  <div>
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
                    <span>{findedArtist.highAuctionRecord.auctionHouse} </span>
                    <span>{findedArtist.highAuctionRecord.year}</span>
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
                        fill-rule="evenodd"
                        clip-rule="evenodd"
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
                        fill-rule="evenodd"
                        clip-rule="evenodd"
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
                    {findedArtist.criticallyAcclaimed}
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
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.00006 12.88L2.06006 5.94001L2.94006 5.06001L9.00006 11.12L15.0601 5.06001L15.9401 5.94001L9.00006 12.88Z"
                      ></path>
                    </svg>
                  </div>
                </div>{" "}
                {showShows && (
                  <>
                    {findedArtist.recentSoloShows.map((eachShow) => {
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ArtistProfile;
