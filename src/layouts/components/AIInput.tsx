import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AIInputProps {
  onSubmit?: (value: string) => void;
  loading?: boolean;
}

export default function AIInput({ onSubmit, loading = false }: AIInputProps) {
  const MAX_LENGTH = 500;
  const placeholders = [
    "find a free KYC as a service API for a fintech startup",
    "looking for at least $30k in GPU credits to scale my AI startup, simple application process",
    "I need text-to-speech and voice generating API credits for my call answering SaaS",
    "I need free access to a quantum computer for my research",
    "I need a free or very cheap Kubernetes cluster for my school project",
    "need email campaign and customer support tools for a marketing agency",
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [internalLoading, setInternalLoading] = useState(loading);

  // Sync external loading prop with internal state
  useEffect(() => {
    setInternalLoading(loading);
  }, [loading]);

  // Monitor data-loading attribute on parent element
  useEffect(() => {
    const checkLoadingAttribute = () => {
      const parentElement = document.querySelector("[data-ai-input]");
      if (parentElement && parentElement.hasAttribute("data-loading")) {
        setInternalLoading(true);
      }
    };

    // Check immediately
    checkLoadingAttribute();

    // Set up mutation observer to watch for attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-loading"
        ) {
          checkLoadingAttribute();
        }
      });
    });

    const parentElement = document.querySelector("[data-ai-input]");
    if (parentElement) {
      observer.observe(parentElement, { attributes: true });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation();
    }
  };

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !internalLoading) {
      handleFormSubmit();
    }
  };

  const handleFormSubmit = async () => {
    if (!value.trim() || internalLoading) return;

    setInternalLoading(true);
    const inputValue = value;

    try {
      if (typeof window !== "undefined") {
        if (onSubmit) {
          await onSubmit(inputValue);
        } else if ("handleAISubmit" in window) {
          await (window as any).handleAISubmit(inputValue);
        }
        // Clear input after successful submission
        setValue("");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      // Optionally handle the error state, e.g., show a message to the user
    } finally {
      // Ensure loading state is reset even if there was an error or no submit handler
      // But don't reset if external loading prop is true
      if (!loading) {
        setInternalLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!internalLoading) {
      handleFormSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!internalLoading) {
      // Enforce max length
      if (e.target.value.length <= MAX_LENGTH) {
        setValue(e.target.value);
      }
    }
  };

  // Determine if input should be disabled
  const isDisabled = internalLoading;

  return (
    <form
      className={`w-full relative max-w-3xl mx-auto bg-white dark:bg-zinc-800 h-14 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200 ${isDisabled ? "opacity-80" : ""}`}
      onSubmit={handleSubmit}
      style={{ pointerEvents: isDisabled ? "none" : "auto" }}
    >
      <input
        // Limit input length
        maxLength={MAX_LENGTH}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={value}
        type="text"
        disabled={isDisabled}
        placeholder={internalLoading ? "Thinking..." : ""}
        className={`w-full relative text-sm sm:text-base z-50 border-none dark:text-white bg-transparent text-black h-full rounded-full focus:outline-none focus:ring-0 pl-5 sm:pl-12 pr-20 ${isDisabled ? "cursor-not-allowed" : ""}`}
      />

      <button
        disabled={!value.trim() || isDisabled}
        type="submit"
        className="absolute right-3 top-1/2 z-50 -translate-y-1/2 h-10 w-10 rounded-full disabled:bg-gray-100 bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition duration-200 flex items-center justify-center"
      >
        {internalLoading ? (
          <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
        ) : (
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300 h-5 w-5"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <motion.path
              d="M5 12l14 0"
              initial={{
                strokeDasharray: "50%",
                strokeDashoffset: "50%",
              }}
              animate={{
                strokeDashoffset: value ? 0 : "50%",
              }}
              transition={{
                duration: 0.3,
                ease: "linear",
              }}
            />
            <path d="M13 18l6 -6" />
            <path d="M13 6l6 6" />
          </motion.svg>
        )}
      </button>

      <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && !internalLoading && (
            <motion.p
              initial={{
                y: 5,
                opacity: 0,
              }}
              key={`current-placeholder-${currentPlaceholder}`}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -15,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "linear",
              }}
              className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-5 sm:pl-12 text-left w-[calc(100%-3rem)] truncate"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {/* Character counter */}
      <div className="absolute bottom-1 right-3 text-xs text-gray-500 z-50">
        {value.length}/{MAX_LENGTH}
      </div>
    </form>
  );
}
