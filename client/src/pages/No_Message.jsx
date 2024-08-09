import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function No_Message() {
  const navigate = useNavigate()
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div className="unica-regular-font">
          <div
            style={{
              fontSize: "26px",
              lineHeight: "32px",
              letterSpacing: "-0.01em",
              marginBottom: "10px",
            }}
          >
            There are currently
            <br />
            no conversations.
          </div>
          <div
            style={{
              fontSize: "16px",
              lineHeight: "20px",
            }}
          >
            When you inquire about available
            <br />
            artworks, they will appear here.
          </div>
          <div style={{
            marginTop: "20px"
          }}></div>
          <Button
              className="hover_bg_color_effect_white_text"
              backgroundColor="black"
              height="50px" 
              width="100%"
              maxHeight="50px"
              maxWidth="200px"
              padding="1px 25px"
              margin="0"
              borderRadius="9999px"
              border="none"
              pointerEvents="auto"
              cursor="pointer"
              opacity="1"
              text="Browse Works"
              textColor="white"
              fontSize="16px"
              lineHeight="20px"
              onClick={() => navigate(`/`)}
            />
        </div>
      </div>
    </>
  );
}

export default No_Message;
