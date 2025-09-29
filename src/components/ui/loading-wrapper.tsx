import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Loading from "./loading";

interface LoadingWrapperProps {
  children: React.ReactNode;
  duration?: number;
}

const LoadingWrapper = ({ children, duration = 1500 }: LoadingWrapperProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedBefore, setHasLoadedBefore] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only show loading on first visit to website
    if (!hasLoadedBefore) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setHasLoadedBefore(true);
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [location.pathname, duration, hasLoadedBefore]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <Loading key="loading" text="Crafting Experience..." />
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {!isLoading && (
          <div key="content">
            {children}
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LoadingWrapper;