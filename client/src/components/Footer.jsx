import useWindowDimensions from "../../utils/useWindowDimensions";

function Footer() {
  const { width } = useWindowDimensions();
  return (
    <>
      <div className="box-20-px-m-top"></div>
      {/* <div
        style={{
          borderWidth: "1px 1px 0px",
          borderStyle: "solid",
          borderColor: "rgb(231,231,231)",
          boxSizing: "border-box",
          padding: "0px",
          width: "100%",
        }}
      ></div> */}
      <div className="footer-wrapper unica-regular-font">
        {/* <div className="footer-grid-container">
          <div className="col-3 footer-div-wrapper">
            <div>About us</div>
            <div>About</div>
            <div>Jobs</div>
            <div>Press</div>
            <div>Contact</div>
          </div>
          <div className="col-3 footer-div-wrapper">
            <div>Resources</div>
            <div>Open Source</div>
            <div>Blog</div>
          </div>
          <div className="col-3 footer-div-wrapper">
            <div>Partnerships</div>
            <div>Art Bazaar for Galleries</div>
            <div>Art Bazaar for Museums</div>
            <div>Art Bazaar for Auctions</div>
            <div>Art Bazaar for Fairs</div>
          </div>
          <div className="col-3 footer-div-wrapper">
            <div>Support</div>
            <div>Visit our Help Center</div>
            <div>Buying on Art Bazaar</div>
            <div
              style={{
                fontWeight: "bold",
              }}
            >
              Get the App
            </div>
            <div>iOS App</div>
            <div>Android App</div>
          </div>
          {width <= 768 && (
            <div className="col-3 responsive-footer-text-wrapper">
              <div
                style={{
                  cursor: "default",
                  color: "rgb(112, 112, 112)",
                }}
              >
                <span>© 2024 Art Bazaar | Designed & Developed by</span>{" "}
                <a
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                  rel="noreferrer"
                  className="kiwisc0de--"
                  target="_blank"
                  href="https://www.aykutkav.com"
                >
                  kiwisc0de
                </a>
              </div>
              <div>Terms and Conditions</div>
              <div>Auction Supplement </div>
              <div> Buyer Guarantee </div>
              <div>Privacy Policy </div>
              <div>Security</div>
              <div>Do not sell my personal information</div>
              <div>Theme</div>
            </div>
          )}
        </div> */}

        <div
          style={{
            borderWidth: "1px 1px 0px",
            borderStyle: "solid",
            borderColor: "rgb(231,231,231)",
            boxSizing: "border-box",
          }}
        ></div>
        <div className="footer-flex-div-container-last-item unica-regular-font">
          <div
            className="dflex"
            style={{
              gap: "20px",
              alignItems: "center",
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Arka Plan  */}
              <rect width="100" height="100" fill="#f5f5f5" />

              {/* Sanat Figürü */}
              <circle cx="50" cy="50" r="30" fill="#FF6347" />

              {/* Çizgi  */}
              <line
                x1="20"
                y1="20"
                x2="80"
                y2="80"
                stroke="#333"
                strokeWidth="3"
              />

              {/* Yazı  */}
              <text
                x="50"
                y="95"
                fontSize="16"
                textAnchor="middle"
                fill="#333"
                className="unica-regular-font"
              >
                Art Bazaar
              </text>
            </svg>
            <div className="footer-text-wrapper display-none-bp-768px ">
              <div
                style={{
                  cursor: "default",
                  color: "rgb(112, 112, 112)",
                }}
              >
                <span>© 2024 Art Bazaar | Designed & Developed by</span>{" "}
                <a
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                  rel="noreferrer"
                  className="kiwisc0de--"
                  target="_blank"
                  href="https://www.aykutkav.com"
                >
                  kiwisc0de
                </a>
              </div>
              {/* <div>Terms and Conditions</div>
              <div>Auction Supplement </div>
              <div> Buyer Guarantee </div>
              <div>Privacy Policy </div>
              <div>Security</div>
              <div>Do not sell my personal information</div>
              <div>Theme</div> */}
            </div>
          </div>
          <div className="footer-flex-svg-wrapper">
            <div>
              <a
                target="_blank"
                href="
                https://x.com/kiwisc0de
              "
                style={{
                  textDecoration: "none",
                  color: "initial",
                }}
              >
                <svg
                  x="0px"
                  y="0px"
                  viewBox="0 0 18 18"
                  xmlSpace="preserve"
                  fill="currentColor"
                >
                  <polygon points="9.1,8.2 6.6,4.6 5.3,4.6 8.4,9.1 8.7,9.6 8.7,9.6 11.4,13.4 12.7,13.4 9.5,8.8  "></polygon>
                  <path d="M9,0C4,0,0,4,0,9c0,5,4,9,9,9s9-4,9-9C18,4,14,0,9,0z M11,14l-2.7-3.9L5,14H4.1l3.8-4.4L4.1,4H7l2.5,3.7L12.7,4h0.9 L9.9,8.2h0l4,5.8H11z"></path>
                </svg>
              </a>
            </div>

            <div>
              <a
                target="_blank"
                href="
                https://www.instagram.com/ayktkav
             "
                style={{
                  textDecoration: "none",
                  color: "initial",
                }}
              >
                <svg viewBox="0 0 18 18" fill="currentColor">
                  <g clipPath="url(#a)">
                    <path d="M8.99992 7.17C7.98992 7.17 7.16992 7.99 7.16992 9.01C7.16992 10.02 7.98992 10.84 9.00992 10.84C10.0199 10.84 10.8399 10.02 10.8399 9C10.8399 7.98 10.0199 7.17 8.99992 7.17Z"></path>
                    <path d="M13.47 6.77C13.44 6.23 13.35 5.94 13.28 5.75C13.18 5.49 13.06 5.31 12.87 5.12C12.68 4.93 12.49 4.81 12.24 4.71C12.05 4.63 11.75 4.55 11.22 4.52C10.64 4.49 10.47 4.49 9 4.49C7.53 4.49 7.36 4.49 6.78 4.53C6.24 4.56 5.95 4.65 5.76 4.72C5.5 4.82 5.32 4.94 5.13 5.13C4.94 5.32 4.82 5.51 4.72 5.76C4.65 5.95 4.56 6.25 4.53 6.78C4.5 7.36 4.5 7.53 4.5 9C4.5 10.47 4.5 10.64 4.54 11.22C4.57 11.76 4.66 12.05 4.73 12.24C4.83 12.5 4.95 12.68 5.14 12.87C5.33 13.06 5.52 13.18 5.77 13.28C5.96 13.35 6.26 13.44 6.79 13.47C7.37 13.5 7.54 13.5 9.01 13.5C10.48 13.5 10.65 13.5 11.23 13.46C11.77 13.43 12.06 13.34 12.25 13.27C12.51 13.17 12.69 13.05 12.88 12.86C13.07 12.67 13.19 12.48 13.29 12.23C13.36 12.04 13.45 11.74 13.48 11.21C13.51 10.63 13.51 10.46 13.51 8.99C13.51 7.52 13.51 7.35 13.47 6.77ZM9 11.82C7.44 11.82 6.17 10.56 6.17 9C6.17 7.44 7.43 6.17 8.99 6.17C10.55 6.17 11.82 7.43 11.82 8.99C11.82 10.55 10.56 11.82 9 11.82ZM11.93 6.71C11.57 6.71 11.27 6.42 11.27 6.05C11.27 5.69 11.56 5.39 11.93 5.39C12.29 5.39 12.59 5.68 12.59 6.05C12.59 6.41 12.3 6.71 11.93 6.71Z"></path>
                    <path d="M9 0C4.03 0 0 4.03 0 9C0 13.97 4.03 18 9 18C13.97 18 18 13.97 18 9C18 4.03 13.97 0 9 0ZM14.47 11.26C14.44 11.85 14.35 12.25 14.22 12.59C14.08 12.95 13.89 13.26 13.59 13.57C13.29 13.88 12.98 14.06 12.62 14.21C12.27 14.35 11.87 14.44 11.29 14.47C10.7 14.5 10.52 14.5 9.02 14.51C7.53 14.51 7.34 14.51 6.75 14.48C6.16 14.45 5.76 14.36 5.41 14.23C5.05 14.09 4.74 13.9 4.43 13.6C4.12 13.29 3.93 12.99 3.79 12.63C3.65 12.28 3.56 11.88 3.53 11.3C3.5 10.71 3.5 10.53 3.49 9.03C3.49 7.54 3.49 7.35 3.52 6.76C3.55 6.17 3.64 5.77 3.77 5.42C3.91 5.06 4.1 4.75 4.4 4.44C4.7 4.13 5.01 3.94 5.37 3.8C5.72 3.66 6.12 3.57 6.7 3.54C7.29 3.51 7.47 3.51 8.97 3.5C10.46 3.5 10.65 3.5 11.24 3.53C11.83 3.56 12.23 3.65 12.58 3.78C12.94 3.92 13.25 4.11 13.56 4.41C13.87 4.72 14.05 5.02 14.2 5.38C14.34 5.73 14.43 6.13 14.46 6.71C14.49 7.3 14.49 7.48 14.5 8.98C14.5 10.47 14.5 10.66 14.47 11.25V11.26Z"></path>
                  </g>
                  <defs>
                    <clipPath id="a">
                      <rect width="18" height="18"></rect>
                    </clipPath>
                  </defs>
                </svg>
              </a>
            </div>
            <div>
              <a
                rel="noreferrer"
                target="_blank"
                href="https://github.com/kiwiscode"
                style={{
                  textDecoration: "none",
                  color: "initial",
                }}
              >
                <svg
                  height="18"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  version="1.1"
                  width="18"
                  data-view-component="true"
                >
                  <path d="M12 1C5.9225 1 1 5.9225 1 12C1 16.8675 4.14875 20.9787 8.52125 22.4362C9.07125 22.5325 9.2775 22.2025 9.2775 21.9137C9.2775 21.6525 9.26375 20.7862 9.26375 19.865C6.5 20.3737 5.785 19.1912 5.565 18.5725C5.44125 18.2562 4.905 17.28 4.4375 17.0187C4.0525 16.8125 3.5025 16.3037 4.42375 16.29C5.29 16.2762 5.90875 17.0875 6.115 17.4175C7.105 19.0812 8.68625 18.6137 9.31875 18.325C9.415 17.61 9.70375 17.1287 10.02 16.8537C7.5725 16.5787 5.015 15.63 5.015 11.4225C5.015 10.2262 5.44125 9.23625 6.1425 8.46625C6.0325 8.19125 5.6475 7.06375 6.2525 5.55125C6.2525 5.55125 7.17375 5.2625 9.2775 6.67875C10.1575 6.43125 11.0925 6.3075 12.0275 6.3075C12.9625 6.3075 13.8975 6.43125 14.7775 6.67875C16.8813 5.24875 17.8025 5.55125 17.8025 5.55125C18.4075 7.06375 18.0225 8.19125 17.9125 8.46625C18.6138 9.23625 19.04 10.2125 19.04 11.4225C19.04 15.6437 16.4688 16.5787 14.0213 16.8537C14.42 17.1975 14.7638 17.8575 14.7638 18.8887C14.7638 20.36 14.75 21.5425 14.75 21.9137C14.75 22.2025 14.9563 22.5462 15.5063 22.4362C19.8513 20.9787 23 16.8537 23 12C23 5.9225 18.0775 1 12 1Z"></path>
                </svg>
              </a>
            </div>
            <div>
              <a
                rel="noreferrer"
                target="_blank"
                href="https://www.linkedin.com/in/kavaykut"
                style={{
                  textDecoration: "none",
                  color: "initial",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  id="Layer_1"
                  version="1.1"
                  viewBox="0 0 1000 1000"
                  xmlSpace="preserve"
                >
                  <title />
                  <g>
                    <path d="M500,1000L500,1000C223.9,1000,0,776.1,0,500l0,0C0,223.9,223.9,0,500,0l0,0c276.1,0,500,223.9,500,500l0,0   C1000,776.1,776.1,1000,500,1000z" />
                    <g>
                      <g>
                        <path
                          fill="#FFFFFF"
                          d="M184.2,387.3h132.9V815H184.2V387.3z M250.7,174.7c42.5,0,77,34.5,77,77.1s-34.5,77.1-77,77.1     c-42.6,0-77.1-34.5-77.1-77.1C173.5,209.3,208,174.7,250.7,174.7"
                        />
                        <path
                          fill="#FFFFFF"
                          d="M400.5,387.3H528v58.4h1.8c17.7-33.6,61-69.1,125.8-69.1c134.6,0,159.5,88.6,159.5,203.7V815H682.2V607.1     c0-49.7-0.9-113.4-69.1-113.4c-69.2,0-79.8,54-79.8,109.8v211.6H400.5V387.3z"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
