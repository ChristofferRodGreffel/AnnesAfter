import { useState, useEffect } from 'react';

// Udviklet fælles i gruppen
// Bruges til at altid at en opdateret bredde på brugerens skærm
// Bruges f.eks. til at vide om admin-baren skal være åben by default

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
