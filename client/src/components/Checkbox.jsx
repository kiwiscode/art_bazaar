import { useState } from "react";

export default function Checkbox({
  width,
  height,
  svgIcon,
  text,
  border,
  borderRadius,
  className,
  onClick = () => {},
  flexBoxWrapperClassName,
  checkboxClassName,
  textClassName,
  hoverEffect,
  backgroundColor,
  conditionalArray,
  id,
}) {
  const [wrapperHovered, setWrapperHovered] = useState(false);
  return (
    <>
      <div
        onClick={onClick}
        onMouseEnter={() => hoverEffect && setWrapperHovered(true)}
        onMouseLeave={() => hoverEffect && setWrapperHovered(false)}
        className={flexBoxWrapperClassName}
        style={{
          gap: "10px",
          cursor: "pointer",
        }}
      >
        <div
          className={`${
            wrapperHovered && !conditionalArray.includes(id)
              ? "hover_color_effect_border_div"
              : wrapperHovered && conditionalArray.includes(id)
              ? "hover_bg_color_effect_border_div"
              : null
          }`}
          style={{
            width,
            height,
            border,
            backgroundColor,
          }}
        >
          {svgIcon && <div>{svgIcon}</div>}
        </div>
        <div>{text}</div>
      </div>
    </>
  );
}
