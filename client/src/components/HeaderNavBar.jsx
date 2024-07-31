import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderNavBar = ({
  items,
  currentPath,
  width,
  responsivePadding,
  wrapperMargin,
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
      {items.map((item) => (
        <div
          key={item.path}
          onClick={() => navigate(item.path)}
          className={
            currentPath === item.path
              ? "unica-regular-font pointer"
              : "unica-regular-font pointer hover_color_effect_t-d hover_color_effect"
          }
          style={{
            display: "inline-flex",
            textAlign: "center",
            boxSizing: "border-box",
            fontSize: width <= 768 ? "13px" : "16px",
            lineHeight: width <= 768 ? "20px" : "26px",
            borderBottom: currentPath === item.path && "1px solid rgb(0,0,0)",
            padding: responsivePadding,
            height: "40px",
            color:
              currentPath !== item.path ? "rgb(112, 112, 112)" : "rgb(0,0,0)",
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default HeaderNavBar;
