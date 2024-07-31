import React from "react";

const DefaultProfileImage = ({ artistInfo, borderRadius }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      backgroundColor: "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: borderRadius,
    }}
  >
    <span className="unica-regular-font">
      {artistInfo?.name?.slice(0, 1).toUpperCase()}
    </span>
  </div>
);

const ArtistProfileImage = ({ artistInfo, width, height, borderRadius }) => {
  return (
    <div
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        border: " 1px solid rgb(231, 231, 231)",
      }}
    >
      {artistInfo?.profilePic !== "@imageUrl" ? (
        <img
          src={artistInfo?.profilePic}
          alt="Profile"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <DefaultProfileImage
          borderRadius={borderRadius}
          artistInfo={artistInfo}
        />
      )}
    </div>
  );
};
export default ArtistProfileImage;
