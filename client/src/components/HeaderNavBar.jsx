import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderNavBar = ({
  items,
  currentPath,
  width,
  responsivePadding,
  wrapperMargin,
  isPurchaseRelated,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="box-60-px-m-top unica-regular-font"
      style={{
        borderBottom: "1px solid rgb(231, 231, 231)",
        display: "flex",
        margin: wrapperMargin,
      }}
    >
      {items.map((item, index) => (
        <div
          key={item.path || index}
          onClick={() => {
            if (isPurchaseRelated) {
            } else {
              navigate(item.path);
            }
          }}
          className={
            currentPath === item.path
              ? "unica-regular-font pointer"
              : currentPath !== item.path && isPurchaseRelated
              ? "unica-regular-font"
              : "unica-regular-font pointer hover_color_effect_t-d hover_color_effect"
          }
          style={{
            cursor: currentPath !== item.path && isPurchaseRelated && "default",
            width: isPurchaseRelated && "100%",
            display: isPurchaseRelated ? "flex" : "inline-flex",
            justifyContent: isPurchaseRelated && "space-between",
            textAlign: "center",
            boxSizing: "border-box",
            fontSize: width <= 768 ? "13px" : "16px",
            lineHeight: width <= 768 ? "20px" : "26px",
            borderBottom: currentPath === item.path && "1px solid rgb(0,0,0)",
            padding: responsivePadding,
            height: "40px",
            color:
              currentPath !== item.path ? "rgb(112, 112, 112)" : "rgb(0,0,0)",
            opacity: currentPath !== item.path && isPurchaseRelated && "0.3",
          }}
        >
          {isPurchaseRelated ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span>{item.label}</span>
                {item.path.endsWith("/done") && (
                  <svg
                    viewBox="0 0 18 18"
                    fill="currentColor"
                    width={18}
                    height={18}
                  >
                    <path d="M6.93608 12.206L14.5761 4.576L15.4241 5.425L6.93208 13.905L2.68408 9.623L3.53608 8.777L6.93608 12.206Z"></path>
                  </svg>
                )}
              </div>
              <div>
                <svg
                  width={18}
                  height={10}
                  viewBox="0 0 18 18"
                  fill="currentColor"
                >
                  <path d="M5.94006 15.94L5.06006 15.06L11.1201 8.99999L5.06006 2.93999L5.94006 2.05999L12.8801 8.99999L5.94006 15.94Z"></path>
                </svg>
              </div>
            </div>
          ) : (
            <div>{item.label}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HeaderNavBar;
