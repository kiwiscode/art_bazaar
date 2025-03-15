import { useLocation, useNavigate } from "react-router-dom";
import useWindowDimensions from "../../utils/useWindowDimensions";
import Footer from "../components/Footer";
import HeaderNavBar from "../components/HeaderNavBar";
import { useContext, useEffect } from "react";
import { CollectorContext } from "../components/CollectorContext";

function SavesAlerts() {
  const { width } = useWindowDimensions();
  const location = useLocation();
  const navigate = useNavigate();
  const { collectorInfo } = useContext(CollectorContext);
  const navItems = [
    { label: "Saves", path: "/favorites/saves" },
    { label: "Follows", path: "/favorites/follows" },
    { label: "Alerts", path: "/favorites/alerts" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate, collectorInfo]);

  return (
    <>
      {/* custom saves page header */}
      <div className="saves-header-wrapper unica-regular-font">
        {/* profile back banner */}
        <div className="profile-back-banner">
          <div className="box-20-px-m-top"></div>
          <div
            onClick={() => navigate("/collector-profile/my-collection")}
            style={{
              gap: "10px",
              fontSize: "13px",
              lineHeight: "1px",
              display: "inline-flex",
              alignItems: "center",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            <svg width={18} height={14} viewBox="0 0 18 18" fill="currentColor">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.0601 15.94L5.12012 9L12.0601 2.06L12.9401 2.94L6.88012 9L12.9401 15.06L12.0601 15.94Z"
              ></path>
            </svg>
            <span>Profile</span>
          </div>
          <div className="box-20-px-m-top"></div>
        </div>
        {width <= 768 ? (
          <div className="box-20-px-m-top"></div>
        ) : (
          <div className="box-40-px-m-top"></div>
        )}
        <div
          className="favorite-text-header"
          style={{
            letterSpacing: "-0.01em",
            fontSize: width <= 768 ? "26px" : "60px",
            lineHeight: width <= 768 ? "32px" : "70px",
          }}
        >
          Favorites
        </div>
        {width <= 768 ? (
          <div className="box-20-px-m-top"></div>
        ) : (
          <div className="box-60-px-m-top"></div>
        )}
      </div>
      <HeaderNavBar
        wrapperMargin={width <= 768 ? "0px" : "0px 40px"}
        responsivePadding={"0px 20px"}
        items={navItems}
        currentPath={location.pathname}
        width={width}
      />
      {width <= 768 ? (
        <div className="box-20-px-m-top"></div>
      ) : (
        <div className="box-60-px-m-top"></div>
      )}
      <div
        className="unica-regular-font"
        style={{
          padding: width <= 768 ? "0px 20px" : "0px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: width <= 768 ? "26px" : "40px",
              lineHeight: width <= 768 ? "40px" : "48px",
              letterSpacing: "-0.01em",
            }}
          >
            <div>Hunting for a</div>
            <div> particular artwork?</div>
          </div>
          {width <= 768 ? (
            <div className="box-40-px-m-top"></div>
          ) : (
            <div className="box-40-px-m-top"></div>
          )}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <div>
              <svg
                viewBox="0 0 18 18"
                fill="currentColor"
                width={18}
                height={18}
              >
                <path d="M11.5001 3.00003C11.9597 3.00003 12.4148 3.09056 12.8395 3.26645C13.2641 3.44234 13.6499 3.70015 13.9749 4.02515C14.2999 4.35016 14.5577 4.736 14.7336 5.16063C14.9095 5.58527 15.0001 6.0404 15.0001 6.50003C15.0001 6.95965 14.9095 7.41478 14.7336 7.83942C14.5577 8.26406 14.2999 8.6499 13.9749 8.9749C13.6499 9.29991 13.2641 9.55771 12.8395 9.73361C12.4148 9.9095 11.9597 10 11.5001 10C10.5718 10 9.68156 9.63128 9.02519 8.9749C8.36881 8.31852 8.00006 7.42828 8.00006 6.50003C8.00006 5.57177 8.36881 4.68153 9.02519 4.02515C9.68156 3.36878 10.5718 3.00003 11.5001 3.00003ZM11.5001 2.00003C10.61 2.00003 9.74002 2.26395 8.99999 2.75841C8.25997 3.25288 7.6832 3.95568 7.3426 4.77795C7.00201 5.60022 6.91289 6.50502 7.08653 7.37793C7.26016 8.25085 7.68874 9.05267 8.31808 9.68201C8.94742 10.3113 9.74924 10.7399 10.6222 10.9136C11.4951 11.0872 12.3999 10.9981 13.2221 10.6575C14.0444 10.3169 14.7472 9.74011 15.2417 9.00009C15.7361 8.26007 16.0001 7.39004 16.0001 6.50003C16.0014 5.90871 15.8859 5.32295 15.6602 4.77639C15.4345 4.22983 15.1031 3.73323 14.685 3.31511C14.2669 2.89698 13.7703 2.56556 13.2237 2.33988C12.6771 2.1142 12.0914 1.99871 11.5001 2.00003ZM9.44206 9.52503L8.56206 8.64503L2.06006 15.06L2.94006 15.94L9.44206 9.52503Z"></path>
              </svg>
            </div>
            <div>
              <div>Find your artist</div>
              <div
                style={{
                  color: "rgb(112,112,112)",
                }}
              >
                On an artist page, go to the Works for Sale section.
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <div>
              <svg
                width={18}
                height={18}
                viewBox="0 0 18 18"
                fill="currentColor"
              >
                <path d="M10.006 11V9.99997H11.006V13H10.006V12H4V11H10.006ZM7.996 6.99997V7.99997H6.996V4.99997H7.996V5.99997H14V6.99997H7.996ZM6 5.99997V6.99997H4V5.99997H6ZM12 12V11H14V12H12Z"></path>
              </svg>
            </div>
            <div>
              <div>Filter</div>
              <div
                style={{
                  color: "rgb(112,112,112)",
                }}
              >
                Set the filters for any search criteria you have, like price,
                medium or size.
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <div>
              <svg
                width={18}
                height={18}
                viewBox="0 0 18 18"
                fill="currentColor"
              >
                <path d="M14.5909 12.229C13.5477 10.7754 12.9712 9.03892 12.9379 7.25001V5.93801C12.9379 4.89359 12.523 3.89194 11.7845 3.15342C11.046 2.4149 10.0444 2.00001 8.99993 2.00001C7.95551 2.00001 6.95387 2.4149 6.21535 3.15342C5.47683 3.89194 5.06193 4.89359 5.06193 5.93801V7.25001C5.02871 9.03892 4.4522 10.7754 3.40893 12.229C3.35808 12.2939 3.3262 12.3716 3.31685 12.4535C3.30749 12.5354 3.32102 12.6183 3.35593 12.693C3.42993 12.843 3.58293 12.938 3.74993 12.938H6.69893C6.63286 13.1506 6.5975 13.3715 6.59393 13.594C6.59393 14.2321 6.84742 14.8441 7.29863 15.2953C7.74985 15.7465 8.36182 16 8.99993 16C9.63804 16 10.25 15.7465 10.7012 15.2953C11.1524 14.8441 11.4059 14.2321 11.4059 13.594C11.4024 13.3715 11.367 13.1506 11.3009 12.938H14.2499C14.4169 12.938 14.5699 12.843 14.6439 12.693C14.6788 12.6183 14.6924 12.5354 14.683 12.4535C14.6737 12.3716 14.6418 12.2939 14.5909 12.229ZM10.5309 13.594C10.5309 14.0001 10.3696 14.3895 10.0825 14.6766C9.7954 14.9637 9.40598 15.125 8.99993 15.125C8.59389 15.125 8.20447 14.9637 7.91735 14.6766C7.63023 14.3895 7.46893 14.0001 7.46893 13.594C7.47093 13.366 7.52493 13.142 7.62593 12.938H10.3739C10.4749 13.142 10.5289 13.366 10.5309 13.594ZM4.57193 12.063C5.44321 10.607 5.91412 8.94661 5.93693 7.25001V5.93801C5.93693 5.12565 6.25964 4.34656 6.83407 3.77214C7.40849 3.19772 8.18758 2.87501 8.99993 2.87501C9.81229 2.87501 10.5914 3.19772 11.1658 3.77214C11.7402 4.34656 12.0629 5.12565 12.0629 5.93801V7.25001C12.0854 8.94652 12.556 10.6069 13.4269 12.063H4.57193Z"></path>
              </svg>
            </div>
            <div>
              <div>Create alert</div>
              <div
                style={{
                  color: "rgb(112,112,112)",
                }}
              >
                When you’re ready, click “Create Alert”.
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <div>
              <svg
                width={18}
                height={18}
                viewBox="0 0 18 18"
                fill="currentColor"
              >
                <path d="M5.688 6.00002L9.047 2.24402L12.314 6.00002H15V15H3V6.00002H5.688ZM7.03 6.00002H10.988L9.036 3.75602L7.03 6.00002ZM4 7.00002V14H14V7.00002H4ZM6 9.00002V12H12V9.00002H6ZM5 8.00002H13V13H5V8.00002Z"></path>
              </svg>
            </div>
            <div>
              <div>Get a match</div>
              <div
                style={{
                  color: "rgb(112,112,112)",
                }}
              >
                Get notifications when there’s a match.
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default SavesAlerts;
