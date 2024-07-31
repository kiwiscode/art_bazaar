import { message } from "antd";
import { Link } from "react-router-dom";

export const useAntdMessageHandler = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const showErrorMessage = (customMessage, duration) => {
    messageApi.success({
      type: "success",
      content: (
        <div>
          <span style={{ fontSize: "15px", lineHeight: "20px" }}>
            {customMessage}
          </span>
        </div>
      ),
      duration: duration,
      className: "error-message unica-regular-font",
    });
  };
  const showCustomMessage = (customMessage, duration) => {
    messageApi.success({
      type: "success",
      content: (
        <div>
          <span style={{ fontSize: "15px", lineHeight: "20px" }}>
            {customMessage}
          </span>{" "}
        </div>
      ),
      duration: duration,
      className: "success-message unica-regular-font",
    });
  };

  const showCustomMessageDarkBg = (customMessage, duration) => {
    messageApi.success({
      type: "success",
      content: (
        <div>
          <span style={{ fontSize: "15px", lineHeight: "20px" }}>
            {customMessage}
          </span>{" "}
        </div>
      ),
      duration: duration,
      className: "custom-message-dark-bg unica-regular-font",
    });
  };

  const showCustomMessageArtworkSave = (message1, message2, link, duration) => {
    messageApi.success({
      type: "success",
      content: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
            gap: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <div style={{ fontSize: "16px", lineHeight: "20px" }}>
              {message1}
            </div>
            <div style={{ fontSize: "15px", lineHeight: "20px" }}>
              {message2}
            </div>{" "}
          </div>
          <div
            style={{
              textDecoration: "underline",
            }}
          >
            {link}
          </div>
        </div>
      ),
      duration: duration,
      className: "success-message unica-regular-font",
    });
  };

  return {
    showCustomMessage,
    showErrorMessage,
    showCustomMessageArtworkSave,
    showCustomMessageDarkBg,
    contextHolder,
  };
};
