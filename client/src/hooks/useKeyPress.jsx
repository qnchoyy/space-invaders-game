import { useState, useEffect, useRef } from "react";

const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = useState(false);
  const lastPressTimeRef = useRef(0);
  const debounceTimeRef = useRef(150);

  useEffect(() => {
    const downHandler = (e) => {
      if (e.key === targetKey) {
        const now = Date.now();
        if (now - lastPressTimeRef.current > debounceTimeRef.current) {
          setKeyPressed(true);
          lastPressTimeRef.current = now;
        }
        e.preventDefault();
      }
    };

    const upHandler = (e) => {
      if (e.key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]);

  return keyPressed;
};

export default useKeyPress;
