import { useContext, useState } from "react";
import { CollectorContext } from "../components/CollectorContext";
import { addFollow, undoFollow } from "../../utils/artistFollowUtils";
import { extractIds } from "../../utils/extractIds";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function FollowButton({
  sendDataToParent,
  artist,
  showFollowerNum,
  followerCount,
}) {
  const { collectorInfo, getToken, updateCollector } =
    useContext(CollectorContext);
  const [followerIds, setFollowerIds] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const followedArtistIds = extractIds(collectorInfo?.followedArtists, "_id");
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
  return (
    <>
      <div className="artist-follow-btn-wrapper">
        <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            if (collectorInfo?.active) {
              console.log("artist:", artist);
              if (sendDataToParent) {
                sendDataToParent(false);
              }
              if (followedArtistIds?.includes(artist?._id)) {
                updateCollector({
                  followedArtists: (
                    collectorInfo?.followedArtists || []
                  ).filter((eachArtist) => eachArtist?._id !== artist._id),
                });
                refreshCollector();

                undoFollow(collectorInfo, getToken, artist);
              } else {
                updateCollector({
                  followedArtists: [
                    artist,
                    ...(collectorInfo?.followedArtists || []),
                  ],
                });
                refreshCollector();
                addFollow(collectorInfo, getToken, artist);
              }
            } else {
              if (sendDataToParent) {
                sendDataToParent(true);
              }
            }
          }}
          className="hover_bg_color_effect_white_text_black"
        >
          {followedArtistIds?.includes(artist?._id) && !isHovered ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  left: "5px",
                }}
              >
                <svg
                  height={18}
                  width={18}
                  viewBox="0 0 18 18"
                  fill="currentColor"
                >
                  <path d="M6.93608 12.206L14.5761 4.576L15.4241 5.425L6.93208 13.905L2.68408 9.623L3.53608 8.777L6.93608 12.206Z"></path>
                </svg>
              </div>
              <div
                style={{
                  width: "100%",
                }}
              >
                Following
              </div>
            </div>
          ) : followedArtistIds?.includes(artist?._id) && isHovered ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  left: "5px",
                }}
              >
                <svg
                  height={18}
                  width={18}
                  viewBox="0 0 18 18"
                  fill="currentColor"
                >
                  <path d="M6.93608 12.206L14.5761 4.576L15.4241 5.425L6.93208 13.905L2.68408 9.623L3.53608 8.777L6.93608 12.206Z"></path>
                </svg>
              </div>

              <div
                style={{
                  width: "100px",
                }}
              >
                Unfollow
              </div>
            </div>
          ) : (
            "Follow"
          )}
        </button>
        <span
          className="unica-regular-font"
          style={{
            fontSize: "13px",
            lineHeight: "20px",
            color: "rgb(112,112,112)",
            marginLeft: "12px",
          }}
        >
          {showFollowerNum && followerCount > 0 && <span>{followerCount}</span>}
        </span>
      </div>
    </>
  );
}

export default FollowButton;
