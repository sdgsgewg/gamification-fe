"use client";
import { useEffect, useState } from "react";

export function useIsTablet() {
  const [isSmallTablet, setIsSmallTablet] = useState(false);
  const [isMediumTablet, setIsMediumTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      setIsSmallTablet(width >= 640 && width < 768);
      setIsMediumTablet(width >= 768 && width < 1024);
    };

    handleResize(); // jalankan sekali di awal
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isSmallTablet, isMediumTablet };
}
