import { useState } from "react";
import { TextField, Backdrop, ClickAwayListener } from "@mui/material";
import CopyTextButton from "./CopyTextButton";

const ShareButton = ({ artwork, text }) => {
  const artworkName = artwork.title.replace(/\s+/g, "-").toLowerCase();
  const [showShareOptions, setShowShareOptions] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const currentUrl = window.location.href;
  const [copyStatus, setCopyStatus] = useState(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  function handleShowShareOptions() {
    setShowShareOptions(!showShareOptions);
  }

  function handleCloseShareOptions() {
    setShowShareOptions(false);
  }

  const handleShareClick = (option) => {
    const artistName = artwork.artist.name;
    const artworkTitle = artwork.title;

    const originalReferer = encodeURIComponent(
      `https://www.artbazaar.net/artwork/{${artworkName}`
    );
    const text = encodeURIComponent(`Check out ${artistName}, ${artworkTitle}`);
    const url = encodeURIComponent(
      `https://www.artbazaar.net/artwork/${artworkName}`
    );
    const via = encodeURIComponent("artbazaar");
    let shareUrl;

    switch (option) {
      case "facebook":
        shareUrl = `https://facebook.com/intent/post?original_referer=${originalReferer}&text=${text}&url=${url}&via=${via}`;
        break;
      case "x":
        shareUrl = `https://x.com/intent/post?original_referer=${originalReferer}&text=${text}&url=${url}&via=${via}`;
        break;
      case "mail":
        shareUrl = `mailto:?subject=${encodeURIComponent(
          "Check out this artwork!"
        )}&body=${text} ${url}`;
        break;
      case "tumblr":
        shareUrl = `https://tumblr.com/intent/post?original_referer=${originalReferer}&text=${text}&url=${url}&via=${via}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/intent/post?original_referer=${originalReferer}&text=${text}&url=${url}&via=${via}`;
        break;
      default:
        return;
    }
    let screenWidth = window.screen.width;
    let screenHeight = window.screen.height;
    let windowWidth = 800; // Pencerenin genişliği
    let windowHeight = 400; // Pencerenin yüksekliği

    let left = (screenWidth - windowWidth) / 2;
    let top = (screenHeight - windowHeight) / 2;

    window.open(
      shareUrl,
      "newWindow",
      "left=" +
        left +
        ",top=" +
        top +
        ",width=" +
        windowWidth +
        ",height=" +
        windowHeight
    );
  };

  // receive copy status
  const receiveDataFromChild = (data) => {
    setCopyStatus(data);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        handleShowShareOptions();
      }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px",
        position: "relative",
        cursor: "default",
      }}
    >
      <div
        className="pointer hover_color_effect_t-d-kind-of-blue"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0px",
        }}
      >
        <div>
          <svg height={18} width={18} viewBox="0 0 18 18" fill="currentColor">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.547 3.81696L5.704 6.20296C5.67793 6.22483 5.64768 6.24114 5.61508 6.25091C5.58249 6.26067 5.54825 6.26368 5.51445 6.25975C5.48065 6.25581 5.44802 6.24502 5.41854 6.22804C5.38906 6.21105 5.36335 6.18823 5.343 6.16096L5.043 5.75996C5.00529 5.70946 4.98804 5.64658 4.99472 5.5839C5.00139 5.52123 5.0315 5.46339 5.079 5.42196L8.658 2.29896C8.7516 2.21724 8.87228 2.1733 8.99651 2.17571C9.12074 2.17811 9.23963 2.22668 9.33 2.31196L9.335 2.31696L9.352 2.33096L12.952 5.50596C12.9991 5.54749 13.0288 5.6052 13.0353 5.66763C13.0418 5.73007 13.0245 5.79266 12.987 5.84296L12.687 6.24496C12.6666 6.27223 12.6409 6.29505 12.6115 6.31204C12.582 6.32902 12.5493 6.33981 12.5155 6.34375C12.4818 6.34768 12.4475 6.34467 12.4149 6.33491C12.3823 6.32514 12.3521 6.30883 12.326 6.28696L9.534 3.94496V7.99996H13.5C13.6326 7.99996 13.7598 8.05264 13.8536 8.14641C13.9473 8.24018 14 8.36736 14 8.49996V14.5C14 14.6326 13.9473 14.7597 13.8536 14.8535C13.7598 14.9473 13.6326 15 13.5 15H4.5C4.36739 15 4.24021 14.9473 4.14645 14.8535C4.05268 14.7597 4 14.6326 4 14.5V8.49996C4 8.36736 4.05268 8.24018 4.14645 8.14641C4.24021 8.05264 4.36739 7.99996 4.5 7.99996H8.547V3.81696ZM8.547 8.99996H5V14H13V8.99996H9.534V11.75C9.534 11.8163 9.50766 11.8799 9.46078 11.9267C9.41389 11.9736 9.3503 12 9.284 12H8.797C8.7307 12 8.66711 11.9736 8.62022 11.9267C8.57334 11.8799 8.547 11.8163 8.547 11.75V8.99996Z"
            ></path>
          </svg>
        </div>
        <div
          style={{
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            padding: "6px",
          }}
          variant="text"
        >
          {text && "Share"}
        </div>{" "}
      </div>
      {/* share svg */}
      {showShareOptions && (
        <Backdrop
          style={{
            zIndex: 1,
          }}
          open={true}
          sx={{
            backgroundColor: "transparent",
          }}
        >
          <ClickAwayListener onClickAway={handleCloseShareOptions}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                position: "absolute",
                backgroundColor: "white",
                bottom: "200px",
                left: "380px",
              }}
              className="unica-regular-font popover-custom-ui-light-theme"
            >
              <div>
                {/* share options */}

                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    minWidth: "320px",
                    padding: "10px",
                  }}
                >
                  <button
                    onClick={() => setShowShareOptions(false)}
                    className="pointer"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "38px",
                      height: "38px",
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                  >
                    <svg
                      width={18}
                      height={18}
                      viewBox="0 0 18 18"
                      fill="rgb(0,0,0)"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.88006 9.00001L14.4401 13.56L13.5601 14.44L9.00006 9.88001L4.44006 14.44L3.56006 13.56L8.12006 9.00001L3.56006 4.44001L4.44006 3.56001L9.00006 8.12001L13.5601 3.56001L14.4401 4.44001L9.88006 9.00001Z"
                      ></path>
                    </svg>
                  </button>
                  <div
                    style={{
                      fontSize: "26px",
                      lineHeight: "32px",
                      color: "rgb(0,0,0)",
                    }}
                  >
                    Share
                  </div>
                  <div
                    style={{
                      gap: "12px",
                    }}
                    className="dflex algncenter jfycenter"
                  >
                    <div>
                      <TextField
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        sx={{
                          "& .Mui-focused input + fieldset": {
                            border: "1px solid rgb(16, 35, 215) !important",
                            transition: "border-color 0.25s ease 0s",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor:
                              copyStatus === "Copied"
                                ? "rgb(16, 35, 215) !important"
                                : "#C2C2C2 !important",
                            transition: "border-color 0.25s ease 0s",
                          },
                          "& .MuiInputLabel-shrink": {
                            color: isFocused && "rgb(16, 35, 215) !important",
                            transition:
                              "color 0.25s ease 0s, transform 0.25s ease 0s",
                          },
                        }}
                        type="text"
                        name="email"
                        id="outlined-basic"
                        variant={"outlined"}
                        style={{
                          width: "100%",
                          marginTop: "12px",
                        }}
                        value={currentUrl}
                      />{" "}
                    </div>

                    <CopyTextButton
                      sendDataToParent={receiveDataFromChild}
                      text={currentUrl}
                    />
                  </div>

                  <div
                    style={{
                      borderWidth: "1px 1px 0px",
                      borderStyle: "solid",
                      backgroundColor: "transparent",
                      borderColor: "rgb(231,231,231)",
                      margin: "20px 0px",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  ></div>
                  <div
                    className="unica-regular-font"
                    style={{
                      display: "flex",
                      flexFlow: "wrap",
                    }}
                  >
                    <div
                      onClick={() => {
                        handleShareClick("facebook");
                      }}
                      className="pointer"
                      style={{
                        margin: 0,
                        padding: "5px 0px",
                        display: "flex",
                        alignItems: "center",
                        flexBasis: "50%",
                        gap: "5px",
                      }}
                    >
                      <div className="dflex ">
                        <svg
                          height={18}
                          width={18}
                          viewBox="0 0 18 18"
                          fill="currentColor"
                        >
                          <g clip-path="url(#a)">
                            <path d="M8.98158 0C4.0348 0 0 4.06601 0 9.05106C0 13.4141 3.08598 17.1552 7.33265 17.9536L7.59058 18V11.6689H5.30604V9.05106H7.59058V7.05518C7.59058 5.95977 7.913 5.05003 8.52098 4.44662C9.11054 3.8525 9.96725 3.53687 10.9898 3.53687C11.4964 3.53687 12.0215 3.58329 12.3623 3.62971C12.5558 3.64827 12.7124 3.67612 12.8229 3.68541L12.9703 3.70397L12.998 5.94121H11.8649C11.349 5.94121 10.9621 6.08974 10.7134 6.37751C10.5107 6.61888 10.4002 6.95307 10.4002 7.35224V9.05106H12.8966L12.5005 11.6689H10.4094V18L10.6673 17.9536C14.914 17.1552 18 13.4141 18 9.05106C17.9724 4.06601 13.9376 0 8.98158 0Z"></path>
                          </g>
                          <defs>
                            <clipPath id="a">
                              <rect width="18" height="18"></rect>
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <div>Facebook</div>
                    </div>
                    <div
                      onClick={() => {
                        handleShareClick("x");
                      }}
                      className="pointer"
                      style={{
                        margin: 0,
                        padding: "5px 0px",
                        display: "flex",
                        alignItems: "center",
                        flexBasis: "50%",
                        gap: "5px",
                      }}
                    >
                      <div className="dflex">
                        <svg
                          x="0px"
                          y="0px"
                          viewBox="0 0 18 18"
                          xml:space="preserve"
                          fill="currentColor"
                          height={18}
                          width={18}
                        >
                          <polygon points="9.1,8.2 6.6,4.6 5.3,4.6 8.4,9.1 8.7,9.6 8.7,9.6 11.4,13.4 12.7,13.4 9.5,8.8  "></polygon>
                          <path d="M9,0C4,0,0,4,0,9c0,5,4,9,9,9s9-4,9-9C18,4,14,0,9,0z M11,14l-2.7-3.9L5,14H4.1l3.8-4.4L4.1,4H7l2.5,3.7L12.7,4h0.9 L9.9,8.2h0l4,5.8H11z"></path>
                        </svg>
                      </div>
                      <div>X</div>
                    </div>{" "}
                    <div
                      onClick={() => {
                        handleShareClick("mail");
                      }}
                      className="pointer"
                      style={{
                        margin: 0,
                        padding: "5px 0px",
                        display: "flex",
                        alignItems: "center",
                        flexBasis: "50%",
                        gap: "5px",
                      }}
                    >
                      <div className="dflex">
                        <svg
                          viewBox="0 0 18 18"
                          fill="currentColor"
                          height={18}
                          width={18}
                        >
                          <path d="M2.875 5.39202V13.625H15.125V5.54502L9.002 11L2.875 5.39202ZM14.58 4.87502H3.588L9.011 9.83802L14.581 4.87502H14.58ZM2.014 4.60502L2 4.59202L2.021 4.57202C2.0557 4.4306 2.13082 4.30235 2.23719 4.20291C2.34356 4.10346 2.47657 4.03714 2.62 4.01202L2.632 4.00002L2.641 4.00802C2.67709 4.00272 2.71352 4.00005 2.75 4.00002H15.25C15.4489 4.00002 15.6397 4.07903 15.7803 4.21969C15.921 4.36034 16 4.5511 16 4.75002V13.75C16 13.9489 15.921 14.1397 15.7803 14.2803C15.6397 14.421 15.4489 14.5 15.25 14.5H2.75C2.55109 14.5 2.36032 14.421 2.21967 14.2803C2.07902 14.1397 2 13.9489 2 13.75V4.75002C2 4.70002 2.005 4.65202 2.014 4.60502Z"></path>
                        </svg>
                      </div>
                      <div>Mail</div>
                    </div>
                    <div
                      onClick={() => {
                        handleShareClick("pinterest");
                      }}
                      className="pointer"
                      style={{
                        margin: 0,
                        padding: "5px 0px",
                        display: "flex",
                        alignItems: "center",
                        flexBasis: "50%",
                        gap: "5px",
                      }}
                    >
                      <div className="dflex">
                        <svg
                          x="0px"
                          y="0px"
                          viewBox="0 0 18 18"
                          xml:space="preserve"
                          fill="currentColor"
                          width={18}
                          height={18}
                        >
                          <path d="M9,1C4.6,1,1,4.6,1,9c0,3.3,2,6.1,4.8,7.3c0-0.6,0-1.2,0.1-1.8c0.2-0.6,1-4.4,1-4.4S6.7,9.6,6.7,8.9c0-1.2,0.7-2.1,1.5-2.1 C9,6.8,9.3,7.3,9.3,8c0,0.7-0.5,1.8-0.7,2.8c-0.2,0.8,0.4,1.5,1.3,1.5c1.5,0,2.5-1.9,2.5-4.3c0-1.8-1.2-3.1-3.3-3.1 c-2.4,0-3.9,1.8-3.9,3.8c0,0.7,0.2,1.2,0.5,1.6c0.1,0.2,0.2,0.2,0.1,0.4c0,0.1-0.1,0.5-0.2,0.6c-0.1,0.2-0.2,0.3-0.4,0.2 c-1.1-0.5-1.6-1.7-1.6-3.1c0-2.3,1.9-5,5.7-5c3.1,0,5.1,2.2,5.1,4.6c0,3.1-1.7,5.5-4.3,5.5c-0.9,0-1.7-0.5-2-1c0,0-0.5,1.8-0.6,2.2 c-0.2,0.6-0.5,1.2-0.8,1.7C7.5,16.9,8.2,17,9,17c4.4,0,8-3.6,8-8C17,4.6,13.4,1,9,1z"></path>
                        </svg>
                      </div>
                      <div>Pinterest</div>
                    </div>
                    <div
                      onClick={() => {
                        handleShareClick("tumblr");
                      }}
                      className="pointer"
                      style={{
                        margin: 0,
                        padding: "5px 0px",
                        display: "flex",
                        alignItems: "center",
                        flexBasis: "50%",
                        gap: "5px",
                      }}
                    >
                      <div className="dflex">
                        <svg
                          x="0px"
                          y="0px"
                          viewBox="0 0 18 18"
                          xml:space="preserve"
                          fill="currentColor"
                          width={18}
                          height={18}
                        >
                          <path d="M9,0C4,0,0,4,0,9s4,9,9,9s9-4,9-9S14,0,9,0z M12.4,15h-2c-1.8,0-3.1-0.9-3.1-3.1V8.3H5.6V6.4c1.8-0.5,2.6-2,2.6-3.4h1.9v3.1 h2.2v2.2h-2.2v3.1c0,0.9,0.5,1.3,1.2,1.3h1.1V15z"></path>
                        </svg>
                      </div>
                      <div>Tumblr</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ClickAwayListener>
        </Backdrop>
      )}
    </div>
  );
};

export default ShareButton;
