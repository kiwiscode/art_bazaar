import { useEffect, useState } from "react";

export default function useOutsideClick(ref) {
  const [isOutsideClicked, setIsOutsideClicked] = useState(false);

  const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOutsideClicked(true);
    } else {
      setIsOutsideClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [ref]);

  return { isOutsideClicked };
}
