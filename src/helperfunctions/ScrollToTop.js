import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Udviklet fælles i gruppen

// Scroller til toppen af en side, når man navigerer til en ny side.
const ScrollToTop = () => {
  // Extracts pathname property(key) from an object
  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, [pathname]);
};

export default ScrollToTop;
