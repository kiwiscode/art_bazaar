import React, { useState } from "react";

export default function Input({
  placeholder,
  inputType,
  icon,
  iconPositionLeft,
  iconPositionRight,
  iconFlexPosition,
  iconOpacity,
  width,
  maxWidth,
  minWidth,
  wrapperWidth,
  wrapperMaxWidth,
  wrapperMinWidth,
  wrapperHeight,
  wrapperMaxHeight,
  wrapperMinHeight,
  height,
  maxHeight,
  minHeight,
  borderRadius,
  onChange = () => {},
  value,
  name,
  withLabel,
  labelClassName,
  labelHtmlFor,
  labelText,
  className,
  searchInputWithLabel,
  searchInputWithLabelClassName,
  searchInputWithLabelHtmlFor,
  searchInputWithLabelText,
  inputRef,
  iconAsText,
  disabledInput,
}) {
  const [border, setBorder] = useState("1px solid rgb(194, 194, 194)");

  return (
    <div
      className="input-wrapper"
      style={{
        position: "relative",
        display: "inline-block",
        width: wrapperWidth,
        minWidth: wrapperMinWidth,
        maxWidth: wrapperMaxWidth,
        height: wrapperHeight,
        maxHeight: wrapperMaxHeight,
        minHeight: wrapperMinHeight,
      }}
    >
      {icon && iconPositionLeft && (
        <span
          className="icon"
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            display: iconFlexPosition,
            opacity: iconOpacity,
          }}
        >
          {icon}
        </span>
      )}
      <input
        ref={inputRef}
        className={className}
        placeholder={placeholder}
        type={inputType}
        style={{
          width: width,
          maxWidth: maxWidth,
          minWidth: minWidth,
          border: border,
          paddingTop: "5px",
          paddingBottom: "5px",
          paddingLeft: icon && iconPositionLeft ? "30px" : "10px",
          paddingRight: icon && iconPositionRight ? "30px" : "10px",
          transition: "border 0.25s ease",
          height: height,
          maxHeight: maxHeight,
          minHeight: minHeight,
          fontSize: "16px",
          lineHeight: "26px",
          borderRadius: borderRadius,
          outline: "none",
          opacity: disabledInput && "0.3",
          pointerEvents: disabledInput && "none",
        }}
        onFocus={() => setBorder("1px solid rgb(16, 35, 215)")}
        onBlur={() => setBorder("1px solid rgb(194, 194, 194)")}
        onChange={onChange}
        value={value || ""}
        name={name}
      />

      {withLabel || searchInputWithLabel ? (
        <label
          style={{
            color: disabledInput && "rgb(212,212,212)",
          }}
          className={labelClassName || searchInputWithLabelClassName}
          htmlFor={labelHtmlFor || searchInputWithLabelHtmlFor}
        >
          {labelText || searchInputWithLabelText}
        </label>
      ) : null}

      {icon && iconPositionRight && (
        <span
          className={iconAsText ? "unica-regular-font" : "icon"}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: iconAsText && "rgb(112,112,112)",
          }}
        >
          {icon}
        </span>
      )}
    </div>
  );
}
