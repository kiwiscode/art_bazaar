import { useLocation, useNavigate } from "react-router-dom";
import useWindowDimensions from "../../utils/useWindowDimensions";
import Footer from "../components/Footer";
import HeaderNavBar from "../components/HeaderNavBar";
import { useContext, useEffect, useState } from "react";
import { CollectorContext } from "../components/CollectorContext";
import axios from "axios";
import ArtistProfileImage from "../components/ArtistProfileImage";
import FollowButton from "../components/FollowButton";
import Button from "../components/Button";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function SavesFollows() {
  const { width } = useWindowDimensions();
  const { collectorInfo, getToken } = useContext(CollectorContext);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [visibleArtistsCount, setVisibleArtistsCount] = useState(4); // New state for visible artists count
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { label: "Saves", path: "/favorites/saves" },
    { label: "Follows", path: "/favorites/follows" },
    { label: "Alerts", path: "/favorites/alerts" },
  ];

  const getFollowedArtists = async () => {
    try {
      const result = await axios.get(
        `${API_URL}/collectors/${collectorInfo?._id}/followed-artists`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      console.log("result collector followed artists :", result);

      setFollowedArtists(result.data.followedArtists);
    } catch (error) {
      console.error("error:", error);
    }
  };

  console.log("collector followed artists:", followedArtists);

  useEffect(() => {
    if (collectorInfo?._id) {
      getFollowedArtists();
    }
  }, [collectorInfo?._id, collectorInfo]);

  const handleArtistClick = (artistName) => {
    const formattedName = artistName.toLowerCase().replace(/ /g, "-");
    navigate(`/artist/${formattedName}`);
  };
  const [artistArtworks, setArtistArtworks] = useState({});

  const getArtistArtworks = async (artist_name) => {
    try {
      const result = await axios.get(`${API_URL}/artist/${artist_name}`);
      console.log("result artist:", result);

      if (result.status === 200) {
        const { artworks } = result.data;
        console.log(`${artist_name} artworks:`, artworks);
        return artworks;
      } else {
        console.error("Error fetching artist. Status:", result.status);
        return [];
      }
    } catch (error) {
      console.error("Error fetching artist:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchArtworks = async () => {
      const newArtistArtworks = {};
      for (const artist of followedArtists) {
        const artworks = await getArtistArtworks(artist.name);
        newArtistArtworks[artist.name] = artworks;
      }
      setArtistArtworks(newArtistArtworks);
    };

    fetchArtworks();
  }, [followedArtists]);

  // Function to show more artists
  const [moreArtistLoading, setMoreArtistLoading] = useState(false);
  const showMoreArtists = () => {
    setMoreArtistLoading(true);
    setTimeout(() => {
      setVisibleArtistsCount(visibleArtistsCount + 4);
      setMoreArtistLoading(false);
    }, 1000);
  };

  return (
    <>
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
      <div className="follows-detail-wrapper unica-regular-font">
        {followedArtists?.length > 0 ? (
          <>
            <div
              style={{
                position: "relative",
                display: "inline-flex",
                gap: "5px",
              }}
            >
              <span
                style={{
                  fontSize: width <= 768 ? "20px" : "26px",
                  lineHeight: width <= 768 ? "32px" : "32px",
                  letterSpacing: "-0.01em",
                }}
              >
                Followed Artists
              </span>
              <span
                style={{
                  letterSpacing: "-0.01em",
                  color: "rgb(16, 35, 215)",
                }}
              >
                {collectorInfo?.followedArtists.length}
              </span>
            </div>
            {width <= 768 ? (
              <div className="box-20-px-m-top"></div>
            ) : (
              <div className="box-40-px-m-top"></div>
            )}
            <div>
              {followedArtists
                .slice(0, visibleArtistsCount)
                .map((eachFollowedArtist) => {
                  const artworks =
                    artistArtworks[eachFollowedArtist.name] || [];

                  return (
                    <div
                      className="each-followed-artist-wrapper"
                      key={eachFollowedArtist._id}
                    >
                      <div
                        className="pointer"
                        onClick={() => {
                          handleArtistClick(eachFollowedArtist.name);
                        }}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                          }}
                        >
                          <ArtistProfileImage
                            artistInfo={eachFollowedArtist}
                            width={45}
                            height={45}
                            borderRadius={50}
                          />
                          <div>
                            <div>{eachFollowedArtist.name}</div>
                            <div
                              style={{
                                fontSize: "13px",
                                lineHeight: "16px",
                                color: "rgb(112,112,112)",
                              }}
                            >
                              {eachFollowedArtist?.nationality},{" "}
                              {eachFollowedArtist?.born}-
                              {eachFollowedArtist?.died}
                            </div>
                          </div>
                        </div>
                        <div>
                          {" "}
                          <FollowButton artist={eachFollowedArtist} />
                        </div>
                      </div>
                      {width <= 768 ? (
                        <div className="box-20-px-m-top"></div>
                      ) : (
                        <div className="box-40-px-m-top"></div>
                      )}
                      {artworks.length > 0 && (
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                          }}
                        >
                          <div className="artworks-wrapper">
                            {artworks.map((eachArtwork) => {
                              return (
                                <div
                                  onClick={() => {
                                    navigate(`/artwork/${eachArtwork.urlName}`);
                                  }}
                                  className="pointer"
                                  key={eachArtwork._id}
                                  style={{
                                    flexShrink: 0,
                                  }}
                                >
                                  <div className="image-wrapper">
                                    <img
                                      style={{
                                        maxWidth: "200px",
                                        maxHeight: "250px",
                                        width: "100vw",
                                        height: "100dvh",
                                        objectFit: "cover",
                                      }}
                                      src={eachArtwork.imageUrl}
                                      alt=""
                                    />
                                  </div>
                                  <div
                                    style={{
                                      maxWidth: "200px",
                                      overflow: "hidden",
                                      whiteSpace: "nowrap",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {eachArtwork.creator}
                                  </div>
                                  <div
                                    className="unica-italic-font"
                                    style={{
                                      maxWidth: "200px",
                                      overflow: "hidden",
                                      whiteSpace: "nowrap",
                                      textOverflow: "ellipsis",
                                      color: "rgb(112,112,112)",
                                    }}
                                  >
                                    {eachArtwork.title}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {width <= 768 ? (
                        <div className="box-20-px-m-top"></div>
                      ) : (
                        <div className="box-20-px-m-top"></div>
                      )}
                    </div>
                  );
                })}
            </div>
            {followedArtists.length > visibleArtistsCount && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                <Button
                  className="hover_bg_color_effect_white_text"
                  backgroundColor="black"
                  height="100dvh"
                  width="100%"
                  maxWidth="135.59px"
                  maxHeight="50px"
                  padding="1px 25px"
                  margin="0"
                  borderRadius="9999px"
                  border="none"
                  pointerEvents={moreArtistLoading ? "none" : "auto"}
                  cursor={moreArtistLoading ? "default" : "pointer"}
                  opacity={moreArtistLoading ? "0.3" : "1"}
                  text="Show More"
                  textColor="white"
                  fontSize="16px"
                  lineHeight="1px"
                  loadingScenario={moreArtistLoading}
                  strokeColorLoadingSpinner={false}
                  onClick={() => showMoreArtists()}
                />
              </div>
            )}
          </>
        ) : (
          <div className="non-followed-artists-info">
            <div>Followed Artists</div>
            <div className="box-40-px-m-top"></div>
            <div
              style={{
                color: "rgb(112, 112, 112)",
              }}
            >
              Nothing yet.
            </div>{" "}
            <div className="box-40-px-m-top"></div>
            <div>Followed Galleries & Institutions</div>{" "}
            <div className="box-40-px-m-top"></div>
            <div
              style={{
                color: "rgb(112, 112, 112)",
              }}
            >
              Nothing yet.
            </div>{" "}
            <div className="box-40-px-m-top"></div>
            <div>Followed Categories</div>{" "}
            <div className="box-40-px-m-top"></div>
            <div
              style={{
                color: "rgb(112, 112, 112)",
              }}
            >
              Nothing yet.
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default SavesFollows;
