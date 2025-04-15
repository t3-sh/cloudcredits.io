import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AIInputProps {
  onSubmit?: (value: string) => void;
  loading?: boolean;
}

export default function AIInput({ onSubmit, loading = false }: AIInputProps) {
  const placeholders = [
    "find a free KYC as a service API for a fintech startup",
    "looking at least $30k for GPUs credits to scale my AI startup, simple application process",
    "i need text-to-speech and voice generating API credits for my call answering SaaS",
    "i need free access to a quantum computer for my research",
    "i need a free or very cheap kubernetes cluster for my school project",
    "email campaign and customer support for a marketing agency",
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);
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

  const draw = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(inputRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, 40);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: any[] = [];

    for (let t = 0; t < 800; t++) {
      let i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        let e = i + 4 * n;
        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3],
            ],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  const animate = (start: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color: color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
        }
      });
    };
    animateFrame(start);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating && !internalLoading) {
      vanishAndSubmit();
    }
  };

  const vanishAndSubmit = () => {
    if (!value.trim() || internalLoading || animating) return;

    // Set both internal loading and animating states
    setAnimating(true);
    setInternalLoading(true);
    draw();

    const inputValue = value;
    if (inputValue && inputRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0,
      );
      animate(maxX);

      if (typeof window !== "undefined") {
        // First check if onSubmit prop is provided and use it
        if (onSubmit) {
          try {
            onSubmit(inputValue);
          } catch (error) {
            console.error("Error calling onSubmit:", error);
            setInternalLoading(false);
          }
        }
        // Only fall back to global handleAISubmit if onSubmit prop wasn't provided
        else if ("handleAISubmit" in window) {
          try {
            (window as any).handleAISubmit(inputValue);
          } catch (error) {
            console.error("Error calling handleAISubmit:", error);
            setInternalLoading(false);
          }
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!internalLoading && !animating) {
      vanishAndSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!animating && !internalLoading) {
      setValue(e.target.value);
    }
  };

  // Determine if input should be disabled
  const isDisabled = internalLoading || animating;

  return (
    <form
      className={`w-full relative max-w-3xl mx-auto bg-white dark:bg-zinc-800 h-14 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200 ${isDisabled ? "opacity-80" : ""}`}
      onSubmit={handleSubmit}
      style={{ pointerEvents: isDisabled ? "none" : "auto" }}
    >
      <canvas
        className={`absolute pointer-events-none text-base transform scale-50 top-[25%] left-2 sm:left-8 origin-top-left filter invert dark:invert-0 pr-20 ${
          !animating ? "opacity-0" : "opacity-100"
        }`}
        ref={canvasRef}
      />
      <input
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={value}
        type="text"
        disabled={isDisabled}
        placeholder={internalLoading ? "Thinking..." : ""}
        className={`w-full relative text-sm sm:text-base z-50 border-none dark:text-white bg-transparent text-black h-full rounded-full focus:outline-none focus:ring-0 pl-5 sm:pl-12 pr-20 ${
          animating ? "text-transparent dark:text-transparent" : ""
        } ${isDisabled ? "cursor-not-allowed" : ""}`}
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
          {internalLoading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm sm:text-base font-normal text-primary pl-5 sm:pl-12 text-left w-[calc(100%-3rem)] truncate"
            >
              {animating ? "Processing..." : ""}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
