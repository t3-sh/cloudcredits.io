import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "cloudcredits-star-cta-shown";
const DELAY_MS = 3000; // 3 seconds delay after first successful response

export function useStarCTA() {
  const [shouldShow, setShouldShow] = useState(false);
  const [hasShownBefore, setHasShownBefore] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    try {
      const hasShown = localStorage.getItem(STORAGE_KEY) === "true";
      setHasShownBefore(hasShown);
    } catch (error) {
      console.warn("Failed to read from localStorage:", error);
    }
  }, []);

  // Function to trigger the star CTA after a successful response
  const triggerStarCTA = useCallback(() => {
    if (hasShownBefore) return;

    setTimeout(() => {
      setShouldShow(true);
    }, DELAY_MS);
  }, [hasShownBefore]);

  // Function to close the dialog and mark as shown
  const closeStarCTA = useCallback(() => {
    setShouldShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
      setHasShownBefore(true);
    } catch (error) {
      console.warn("Failed to write to localStorage:", error);
    }
  }, []);

  return {
    shouldShow,
    triggerStarCTA,
    closeStarCTA,
    hasShownBefore,
  };
}