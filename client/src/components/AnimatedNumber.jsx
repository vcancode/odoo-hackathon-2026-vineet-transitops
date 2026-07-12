import React, { useState, useEffect, useRef } from "react";

const AnimatedNumber = ({ value = 0, duration = 1200, suffix = "", prefix = "" }) => {
  const [display, setDisplay] = useState(0);
  const startTime = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const targetValue = Number(value) || 0;
    startTime.current = null;

    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * targetValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedNumber;
