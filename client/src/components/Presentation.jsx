import React from "react";

const Presentation = ({
  totalIndex,
  activeIndex,
  sendClickedIndexToParent,
  show,
}) => {
  // Array.from ile HTML öğeleri içeren bir dizi oluşturuyoruz
  const presentation = Array.from({ length: totalIndex }, (_, index) => (
    <div
      key={index}
      onClick={() => sendClickedIndexToParent(index)}
      style={{
        width: "100%",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          backgroundColor:
            activeIndex === index ? "black" : "rgb(202, 205, 236)",
          height: "1px",
          margin: "12px",

          transition: "background-color 250ms ease 0s",
        }}
        key={index}
      ></div>
    </div>
  ));

  return (
    <>
      {show && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {presentation}
        </div>
      )}
    </>
  );
};

export default Presentation;
