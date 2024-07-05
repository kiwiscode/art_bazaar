import React, { useState } from "react";

const ReadMoreLess = ({ text, maxLength }) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  const displayText = showFullText ? text : `${text.slice(0, maxLength)}...`;

  return (
    <div>
      <span className="artist-description unica-regular-font">
        {displayText}
      </span>{" "}
      {text.length > maxLength && (
        <span className="read-more" onClick={toggleShowFullText}>
          {showFullText ? "Read less" : "Read more"}
        </span>
      )}
    </div>
  );
};

export default ReadMoreLess;
