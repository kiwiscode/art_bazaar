import { useRef, useEffect, useState } from "react";

const ZoomableImageCanvas = ({ image, sendDataToParent }) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [sliderValue, setSliderValue] = useState(1);
  const animationRef = useRef(null);

  function handleClose(e) {
    e.stopPropagation();
    sendDataToParent(true);
  }

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    canvas.className = "canvas";
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.src = image;
    img.onload = () => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.width - 95;
      const imgHeight = img.height - 165;

      const x = (canvasWidth - imgWidth * scale) / 2;
      const y = (canvasHeight - imgHeight * scale) / 2;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
    };
  };

  const handleWheel = (e) => {
    if (e.deltaY < 0 && scale !== 5) {
      setScale((prevScale) => {
        const newScale = Math.min(prevScale + 0.85, 5);
        setSliderValue(newScale);
        return newScale;
      });
    } else if (e.deltaY > 0 && scale !== 1) {
      setScale((prevScale) => {
        const newScale = Math.max(prevScale - 0.85, 1);
        setSliderValue(newScale);
        return newScale;
      });
    }
  };

  const handleSliderChange = (e) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
    setSliderValue(newScale);
  };

  "scale:", scale;

  // animation frame
  const animateCanvas = () => {
    if (animationRef.current) {
      animationRef.current = requestAnimationFrame(animateCanvas);
      drawCanvas();
    }
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animateCanvas);
    return () => cancelAnimationFrame(animationRef.current);
  }, [scale, image]);

  return (
    <div
      className="context"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        transition: "scale 250ms ease 0s",
      }}
      onWheel={handleWheel}
    >
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          width: "80px",
          height: "80px",
          top: "0",
          right: "0",
          border: "none",
          cursor: "pointer",
          zIndex: 1001,
          background: "transparent",
          padding: "0px",
        }}
      >
        <svg width={40} height={40} viewBox="0 0 18 18" fill="white">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.88006 9.00001L14.4401 13.56L13.5601 14.44L9.00006 9.88001L4.44006 14.44L3.56006 13.56L8.12006 9.00001L3.56006 4.44001L4.44006 3.56001L9.00006 8.12001L13.5601 3.56001L14.4401 4.44001L9.88006 9.00001Z"
          ></path>
        </svg>
      </button>
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          borderRadius: "2px",
          background: "rgba(0, 0, 0, 0.6)",
          opacity: "1",
          transform: "translateX(-50%)",
          transition: "opacity 250ms ease 0s",
          width: "240px",
          height: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          padding: "10px",
        }}
      >
        {/* minus btn */}
        <svg
          onClick={() => {
            if (scale !== 1) {
              handleWheel({ deltaY: 100 });
            }
          }}
          style={{
            display: "block",
            height: "32px",
            width: "32px",
            padding: "10px",
            flexShrink: "0",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
          stroke="rgb(255, 255, 255)"
        >
          <line x1="0" y1="50%" x2="100%" y2="50%" strokeWidth="2px"></line>
        </svg>

        {/* slider input */}
        <input
          className="slider-input"
          min="1"
          max="5"
          step="0.001"
          type="range"
          value={sliderValue}
          onChange={handleSliderChange}
        />

        {/* plus btn */}
        <svg
          onClick={() => {
            if (scale !== 5) {
              handleWheel({ deltaY: -100 });
            }
          }}
          style={{
            display: "block",
            height: "32px",
            width: "32px",
            padding: "10px",
            flexShrink: "0",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
          stroke="rgb(255, 255, 255)"
        >
          <line x1="50%" y1="0" x2="50%" y2="100%" strokeWidth="2px"></line>
          <line x1="0" y1="50%" x2="100%" y2="50%" strokeWidth="2px"></line>
        </svg>
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          display: "block",
          transition: "scale 250ms ease 0s !important",
        }}
      />
    </div>
  );
};

export default ZoomableImageCanvas;
