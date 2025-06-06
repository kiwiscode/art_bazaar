import { useContext } from "react";
import ProfileImage from "./ProfileImage";
import { CollectorContext } from "./CollectorContext";
import useWindowDimensions from "../../utils/useWindowDimensions";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderNavBar from "./HeaderNavBar";
export const CollectorProfileHeader = () => {
  const { collectorInfo } = useContext(CollectorContext);
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { label: "Artworks", path: "/collector-profile/my-collection" },
    { label: "Artists", path: "/collector-profile/artists" },
    { label: "Insights", path: "/collector-profile/insights" },
  ];
  return (
    <>
      <div
        className="unica-regular-font header-entry-profile-collector"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <div>
            <ProfileImage
              fontSize={"26px"}
              collectorInfo={collectorInfo}
              width={width <= 768 ? "70px" : "100px"}
              height={width <= 768 ? "70px" : "100px"}
            />
          </div>
          <div
            className="dflex"
            style={{
              flexDirection: "column",
            }}
          >
            <div
              className="font-size-responsive-bp-768px-20px"
              style={{
                fontSize: "40px",
                lineHeight: "48px",
                letterSpacing: "-0.01em",
              }}
            >
              {collectorInfo?.name}
            </div>
            <div
              style={{
                display: "flex",
                gap: "20px",
              }}
            >
              {width <= 768 && (
                <>
                  <div className="text-decoration-underline font-size-responsive-bp-768px-13px">
                    <span
                      className="pointer"
                      onClick={() => navigate("/favorites/saves")}
                    >
                      Favorites
                    </span>
                  </div>
                  <div className=" text-decoration-underline font-size-responsive-bp-768px-13px">
                    <span
                      className="pointer"
                      onClick={() => navigate("/settings/edit-profile")}
                    >
                      Settings
                    </span>
                  </div>
                </>
              )}
            </div>
            <div
              className="dflex algncenter display-none-bp-768px"
              style={{
                gap: "5px",
                marginTop: "5px",
              }}
            >
              <svg
                width={18}
                height={18}
                viewBox="0 0 18 18"
                fill="currentColor"
              >
                <path d="M9.39481 16.807C9.34807 16.8672 9.28818 16.916 9.21972 16.9495C9.15126 16.983 9.07604 17.0005 8.99981 17.0005C8.92357 17.0005 8.84835 16.983 8.77989 16.9495C8.71143 16.916 8.65154 16.8672 8.6048 16.807C4.8178 11.957 2.9248 8.58101 2.9248 6.56001C2.9248 3.538 5.8828 0.880005 9.04181 0.880005C12.2378 0.880005 14.9758 3.35801 14.9758 6.50001C14.9758 8.62101 13.1138 12.022 9.39481 16.807ZM13.9748 6.50001C13.9748 3.93401 11.7068 1.88001 9.04181 1.88001C6.4118 1.88001 3.9238 4.11601 3.9238 6.56001C3.9238 8.21001 5.6158 11.286 8.99881 15.683C12.3188 11.343 13.9758 8.25001 13.9758 6.50001H13.9748ZM8.99981 9.00001C9.53024 9.00001 10.0389 8.78929 10.414 8.41422C10.7891 8.03915 10.9998 7.53044 10.9998 7.00001C10.9998 6.46957 10.7891 5.96086 10.414 5.58579C10.0389 5.21072 9.53024 5.00001 8.99981 5.00001C8.46937 5.00001 7.96066 5.21072 7.58559 5.58579C7.21052 5.96086 6.9998 6.46957 6.9998 7.00001C6.9998 7.53044 7.21052 8.03915 7.58559 8.41422C7.96066 8.78929 8.46937 9.00001 8.99981 9.00001ZM8.99981 10C8.60584 10 8.21573 9.92241 7.85175 9.77164C7.48778 9.62088 7.15706 9.3999 6.87848 9.12133C6.59991 8.84275 6.37893 8.51203 6.22817 8.14806C6.0774 7.78408 5.99981 7.39397 5.99981 7.00001C5.99981 6.60604 6.0774 6.21593 6.22817 5.85195C6.37893 5.48798 6.59991 5.15726 6.87848 4.87868C7.15706 4.60011 7.48778 4.37913 7.85175 4.22837C8.21573 4.0776 8.60584 4.00001 8.99981 4.00001C9.79545 4.00001 10.5585 4.31608 11.1211 4.87868C11.6837 5.44129 11.9998 6.20436 11.9998 7.00001C11.9998 7.79566 11.6837 8.55872 11.1211 9.12133C10.5585 9.68394 9.79545 10 8.99981 10Z"></path>
              </svg>
              <span>Germany</span>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <div className="text-decoration-underline display-none-bp-768px">
            <span
              className="pointer"
              onClick={() => navigate("/favorites/saves")}
            >
              Favorites
            </span>
          </div>
          <div className=" text-decoration-underline display-none-bp-768px">
            <span
              className="pointer"
              onClick={() => navigate("/settings/edit-profile")}
            >
              Settings
            </span>
          </div>
        </div>
      </div>

      <div className="box-60-px-m-top unica-regular-font"></div>
      <HeaderNavBar
        wrapperMargin={width <= 768 ? "0px" : "0px 0px"}
        responsivePadding={"0px 20px"}
        items={navItems}
        currentPath={location.pathname}
        width={width}
      />
    </>
  );
};
