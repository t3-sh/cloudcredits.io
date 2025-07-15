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
  // Check if we have a prompt in URL and set it as the value
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const prompt = urlParams.get("prompt");
    if (prompt) {
      setValue(prompt);
    }
  }, []);

  const startAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  };

  useEffect(() => {
    if (!loading) {
      startAnimation();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleFormSubmit();
    }
  };

  const handleFormSubmit = async () => {
    if (!value.trim() || loading) return;

    const inputValue = value;

    try {
      if (typeof window !== "undefined") {
        if (onSubmit) {
          await onSubmit(inputValue);
        } else {
          // Fallback: navigate directly
          const url = new URL(window.location.href);
          url.pathname = "/deals/assistant";
          url.searchParams.set("prompt", inputValue);
          window.location.href = url.toString();
        }
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loading) {
      handleFormSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!loading) {
      if (e.target.value.length <= MAX_LENGTH) {
        setValue(e.target.value);
      }
    }
  };

  // Animated thinking text with dots
  const ThinkingText = () => {
    const [dotCount, setDotCount] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setDotCount((prev) => (prev + 1) % 4);
      }, 500);
      return () => clearInterval(interval);
    }, []);

    return (
      <span className="text-gray-600 dark:text-gray-400 font-medium">
        {".".repeat(dotCount)}
      </span>
    );
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form
        className="w-full relative bg-white dark:bg-zinc-800 h-14 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition-all duration-300"
        onSubmit={handleSubmit}
      >
        {/* Shimmer overlay when loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-full overflow-hidden z-30"
            >
              {/* Animated shimmer background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900/20 dark:via-blue-800/30 dark:to-blue-900/20">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          maxLength={MAX_LENGTH}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          value={value}
          type="text"
          disabled={loading}
          placeholder=""
          className="w-full relative text-sm sm:text-base z-10 border-none dark:text-white bg-transparent text-black h-full rounded-full focus:outline-none focus:ring-0 pl-5 sm:pl-12 pr-20 disabled:cursor-not-allowed"
        />

        <button
          disabled={!value.trim() || loading}
          type="submit"
          className="absolute right-3 top-1/2 z-40 -translate-y-1/2 h-10 w-10 rounded-full disabled:bg-gray-100 bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition-all duration-200 flex items-center justify-center"
        >
          {loading ? (
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

        <div className="absolute inset-0 flex items-center rounded-full pointer-events-none z-20">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="thinking"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="pl-5 sm:pl-12"
              >
                <ThinkingText />
              </motion.div>
            ) : !value ? (
              <motion.p
                initial={{ y: 5, opacity: 0 }}
                key={`current-placeholder-${currentPlaceholder}`}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.3, ease: "linear" }}
                className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-5 sm:pl-12 text-left w-[calc(100%-3rem)] truncate"
              >
                {placeholders[currentPlaceholder]}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Character counter */}
        <div className="absolute bottom-1 right-3 text-xs text-gray-500 z-40">
          {value.length}/{MAX_LENGTH}
        </div>
      </form>
    </div>
  );
}
