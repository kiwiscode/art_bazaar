import { useState } from "react";

const ReadMoreLess = ({ text, maxLength, artworkPage }) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  const displayText = showFullText
    ? text
    : artworkPage && text.length < 311
    ? `${text.slice(0, maxLength)}`
    : `${text?.slice(0, maxLength)}...`;

  return (
    <div>
      <span className="artist-description unica-regular-font">
        {displayText}
      </span>{" "}
      {text?.length > maxLength && (
        <span className="read-more" onClick={toggleShowFullText}>
          {showFullText ? "Read less" : "Read more"}
        </span>
      )}
    </div>
  );
};

export default ReadMoreLess;
