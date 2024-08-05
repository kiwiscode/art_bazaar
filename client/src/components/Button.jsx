import React from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function Button({
  className = "",
  backgroundColor = "transparent",
  height = "auto",
  width = "auto",
  maxHeight = "none",
  minHeight = "none",
  maxWidth = "none",
  minWidth = "none",
  padding = "0",
  margin = "0",
  borderRadius = "0",
  border = "none",
  pointerEvents = "auto",
  cursor = "default",
  opacity = "1",
  text = "Button",
  textColor = "white",
  fontSize = "0px",
  lineHeight = "0px",
  position = "",
  display = "",
  top = "",
  left = "",
  right = "",
  bottom = "",
  onClick = () => {},
  svgIcon = "",
  svgDisplay,
  loadingScenario,
  strokeColorLoadingSpinner,
  colorCustom,
}) {
  return (
    <button
      className={className}
      style={{
        backgroundColor,
        height,
        width,
        maxHeight,
        minHeight,
        maxWidth,
        minWidth,
        padding,
        margin,
        borderRadius,
        border,
        pointerEvents,
        cursor,
        color: textColor,
        fontSize,
        lineHeight,
        opacity,
        position,
        display,
        top,
        left,
        right,
        bottom,
      }}
      onClick={onClick}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loadingScenario ? (
          <LoadingSpinner
            outsidebtnloading={strokeColorLoadingSpinner}
            colorCustom={colorCustom}
          ></LoadingSpinner>
        ) : (
          <>
            {svgIcon && (
              <span style={{ marginRight: "8px", display: svgDisplay }}>
                {svgIcon}
              </span>
            )}
            {text}
          </>
        )}
      </div>
    </button>
  );
}
