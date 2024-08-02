const LoadingSpinner = ({
  outsidebtnloading,
  isLoadingProfileImage,
  welcomeModalClosing,
}) => {
  return (
    <>
      <div
        className="dflex jfycenter"
        style={{
          height: welcomeModalClosing && "100%",
          alignItems: welcomeModalClosing && "center",
        }}
      >
        <div className="spinner bottomSpinner">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              focusable="false"
            >
              <line
                x1="4"
                y1="6"
                x2="24"
                y2="22"
                stroke={
                  outsidebtnloading
                    ? "rgb(16, 35, 215)"
                    : isLoadingProfileImage
                    ? "black"
                    : "white"
                }
                strokeWidth="6"
              >
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  from="0 14 14"
                  to="360 14 14"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </line>
            </svg>
          </span>
        </div>
      </div>
    </>
  );
};

export default LoadingSpinner;
