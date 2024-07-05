import { useState, useEffect } from "react";

function getScrollPosition() {
  const { scrollY: y } = window;
  return {
    y,
  };
}

export default function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(getScrollPosition());

  useEffect(() => {
    function handleScroll() {
      setScrollPosition(getScrollPosition());
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollPosition;
}
