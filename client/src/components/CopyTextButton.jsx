import { useEffect, useState } from "react";

const CopyTextButton = ({ text, sendDataToParent }) => {
  const [copyStatus, setCopyStatus] = useState("Copy");

  useEffect(() => {
    if (copyStatus === "Copied") {
      const timeoutId = setTimeout(() => {
        setCopyStatus("Copy");
        sendDataToParent("Copy");
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [copyStatus]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Copied");
      sendDataToParent("Copied");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      style={{
        height: "30px",
        maxHeight: "30px",
        margin: "0px 0px 0px 20px",
        borderRadius: "9999px",
        border: "1px solid rgb(0,0,0)",
        background: "transparent",
        maxWidth: "95px",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="unica-regular-font hover_bg_color_effect_white_text pointer"
      onClick={handleCopy}
    >
      <span
        style={{
          padding: "1px 25px",
        }}
      >
        {copyStatus}
      </span>
    </button>
  );
};

export default CopyTextButton;
