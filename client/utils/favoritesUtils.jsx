import axios from "axios";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

export const addToFavorites = async (
  collectorInfo,
  artwork,
  getToken,
  sendDataToParent
) => {
  if (collectorInfo.active) {
    sendDataToParent(false);
    try {
      await axios.post(
        `${API_URL}/collectors/${collectorInfo?._id}/favorite`,
        {
          artworkInformation: {
            artworkId: artwork._id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
    } catch (error) {
      console.error("error:", error);
    }
  } else {
    sendDataToParent(true);
  }
};

export const removeFromFavorites = async (collectorInfo, artwork, getToken) => {
  try {
    await axios.delete(
      `${API_URL}/collectors/${collectorInfo?._id}/favorites/${artwork?._id}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
};

export const getFavorites = (collectorId) => {};
