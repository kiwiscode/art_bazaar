import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CollectorContext } from "../components/CollectorContext";
import { useNavigate } from "react-router-dom";

// when working on local version
const API_URL = import.meta.env.VITE_APP_API_URL;

function Conversations() {
  const navigate = useNavigate();
  const { collectorInfo, getToken } = useContext(CollectorContext);
  const [conversations, setConversations] = useState([]);

  const getConversations = async () => {
    try {
      const result = await axios.get(
        `${API_URL}/collectors/${collectorInfo?._id}/conversations`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setConversations(result.data);
      console.log("result conversations:", result);
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    if (collectorInfo._id) {
      getConversations();
    }
  }, [collectorInfo]);

  useEffect(() => {
    if (collectorInfo?._id && conversations.length === 0) {
      navigate("/user/conversations/no-messages");
      console.log("hello world");
    }
  }, [conversations, collectorInfo, navigate]);

  return (
    <>
      <div>CONVERSATIONS ...</div>
    </>
  );
}

export default Conversations;
