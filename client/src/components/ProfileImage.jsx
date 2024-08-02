import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const DefaultProfileImage = ({ collectorInfo, fontSize }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      backgroundColor: "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      fontSize: fontSize,
    }}
  >
    <span className="unica-regular-font">
      {collectorInfo?.name?.slice(0, 1)}
    </span>
  </div>
);

const ProfileImage = ({
  collectorInfo,
  width,
  height,
  fontSize,
  isLoading,
}) => {
  return (
    <div
      style={{
        width: width,
        height: height,
        borderRadius: "50%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        border:
          collectorInfo?.profileImage !== "@imageUrl" && !isLoading
            ? "none"
            : "1px solid rgb(231, 231, 231)",
      }}
    >
      {!isLoading ? (
        <>
          {collectorInfo?.profileImage !== "@imageUrl" ? (
            <img
              src={collectorInfo?.profileImage}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <DefaultProfileImage
              fontSize={fontSize}
              collectorInfo={collectorInfo}
            />
          )}
        </>
      ) : (
        <LoadingSpinner
          isLoadingProfileImage={true}
          outsidebtnloading={false}
        />
      )}
    </div>
  );
};

export default ProfileImage;
