import axios from "axios";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

export const addFollow = async (collectorInfo, getToken, artist) => {
  try {
    await axios.post(
      `${API_URL}/artist/collectors/${collectorInfo?._id}/follow/${artist?._id}`,
      {},
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

export const undoFollow = async (collectorInfo, getToken, artist) => {
  try {
    await axios.post(
      `${API_URL}/artist/collectors/${collectorInfo?._id}/unfollow/${artist?._id}`,
      {},
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
