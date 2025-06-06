import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import useTheme from "@/hooks/useTheme";
import AIInput from "./AIInput";

export default function HeroSection() {
  const theme = useTheme();
  const [activeIconIndex, setActiveIconIndex] = useState(0);
  const carouselIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const glassCardStyle = {
    background:
      theme === "dark"
        ? `radial-gradient(
          circle at center,
          rgba(255,255,255,0.05) 0%,
          rgba(255,255,255,0.02) 100%
        )`
        : `radial-gradient(
          circle at center,
          rgba(0,0,0,0.03) 0%,
          rgba(0,0,0,0.01) 100%
        )`,
    backdropFilter: "blur(8px)",
  };

  const wordToImageMap: Record<string, string> = {
    Cloud: "cloudsearch.png",
    Startup: "startup.png",
    SaaS: "saas.png",
    Compute: "server.png",
    AI: "compute.png",
    Database: "database.png",
    Storage: "storage.png",
    Software: "saas.png",
    Tools: "tools.png",
    Monitoring: "saas.png",
    Analytics: "startup.png",
    Marketing: "marketing.png",
    Ads: "marketing.png",
    Sales: "cloudsearch.png",
  };

  const [highlightedImage, setHighlightedImage] = useState("");

  // All icon cards data with labels
  const allIconCards = [
    {
      src: "/images/hero/coin.png",
      alt: "Cloud Coin",
      label: "Cost Optimization",
      offset: { x: 0, y: 0 },
    },
    {
      src: "/images/hero/compute.png",
      alt: "Compute",
      label: "AI & GPU",
      offset: { x: -12, y: 5 },
    },
    {
      src: "/images/hero/database.png",
      alt: "Database",
      label: "Database",
      offset: { x: -5, y: 8 },
    },
    {
      src: "/images/hero/cloudsearch.png",
      alt: "Cloud Search",
      label: "Monitoring",
      offset: { x: 10, y: -5 },
    },
    {
      src: "/images/hero/server.png",
      alt: "Server",
      label: "Compute",
      offset: { x: 5, y: 12 },
    },
    {
      src: "/images/hero/saas.png",
      alt: "SaaS",
      label: "SaaS",
      offset: { x: 12, y: -8 },
    },
    {
      src: "/images/hero/startup.png",
      alt: "Startup",
      label: "Startup",
      offset: { x: 8, y: 10 },
    },
    {
      src: "/images/hero/storage.png",
      alt: "Storage",
      label: "Storage",
      offset: { x: -10, y: -5 },
    },
    {
      src: "/images/hero/marketing.png",
      alt: "Marketing",
      label: "Marketing",
      offset: { x: 5, y: -12 },
    },
    {
      src: "/images/hero/tools.png",
      alt: "Tools",
      label: "Tools",
      offset: { x: -5, y: 10 },
    },
  ];

  // Auto-switch carousel every 2 seconds
  useEffect(() => {
    carouselIntervalRef.current = setInterval(() => {
      setActiveIconIndex((prevIndex) => (prevIndex + 1) % allIconCards.length);
    }, 2000);

    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, [allIconCards.length]);

  const handleAISubmit = (value: string) => {
    setIsLoading(true);
    // Navigate to assistant page with the prompt
    window.location.href = `/deals/assistant?prompt=${encodeURIComponent(value)}`;
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div
        className="text-center px-4 z-20 w-full max-w-5xl mx-auto flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: "easeOut",
        }}
      >
        <div className="flex flex-col items-center">
          <motion.h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-dark dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            Community collection of best Cloud/SaaS deals
          </motion.h1>
        </div>

        <div className="mb-10 max-w-2xl mx-auto flex flex-col items-center text-center gap-4">
          <span className="text-lg inline-block text-gray-700 dark:text-gray-300">
            Discover, compare, and secure cloud credits to build without limits
          </span>

          <motion.div
            className="flex items-center justify-center flex-wrap md:flex-nowrap gap-3 md:gap-4 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {[
              { color: "blue", text: "Fully Open Source", icon: "•" },
              { color: "green", text: "Zero Affiliations", icon: "•" },
              { color: "yellow", text: "Zero Ads", icon: "•" },
            ].map((uvp, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + index * 0.15, duration: 0.5 }}
              >
                <span
                  className={`text-${uvp.color}-500 text-xl font-bold leading-none`}
                >
                  {uvp.icon}
                </span>
                <span className="text-dark dark:text-white font-medium text-sm md:text-base whitespace-nowrap">
                  {uvp.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mb-8 flex items-center justify-center"
        >
          <a
            href="/providers"
            className="btn bg-primary text-white px-8 py-3 rounded-md mr-4 inline-flex items-center gap-2 hover:bg-opacity-90"
          >
            <span className="leading-none self-center">Explore Deals</span>
            <span className="leading-none self-center ml-1">→</span>
          </a>
          <a
            href="https://github.com/t3-sh/cloudcredits.io"
            className="btn border border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 inline-flex items-center gap-2"
            target="_blank"
          >
            <FaGithub size={20} />
            <span className="leading-none self-center">Star on GitHub</span>
          </a>
        </motion.div>

        {/* AI Input section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.6 }}
          className="w-full max-w-4xl mx-auto mb-10"
        >
          <div className="text-center mb-4">
            <span className="text-gray-600 dark:text-gray-400">or</span>
            <span className="ml-2 font-medium text-dark dark:text-white">
              Ask AI
            </span>
          </div>
          <AIInput onSubmit={handleAISubmit} loading={isLoading} />
        </motion.div>

        {/* Single icon carousel with labels */}
        <motion.div
          className="mt-4 w-full max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8 }}
        >
          <div className="relative h-24 md:h-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIconIndex}
                className="absolute inset-0 flex flex-col justify-center items-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="rounded-xl border border-white/10 shadow-md flex items-center justify-center cursor-pointer mb-2"
                  style={{
                    ...glassCardStyle,
                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    width: "60px",
                    height: "60px",
                  }}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.5 },
                    rotate: {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    },
                  }}
                >
                  <motion.img
                    src={allIconCards[activeIconIndex].src}
                    alt={allIconCards[activeIconIndex].alt}
                    className="object-contain p-2"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </motion.div>
                <motion.span
                  className="text-dark dark:text-white font-medium text-sm md:text-base"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {allIconCards[activeIconIndex].label}
                </motion.span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel indicators */}
          <div className="flex justify-center mt-2 gap-1 flex-wrap max-w-xs mx-auto">
            {allIconCards.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIconIndex
                    ? "bg-primary w-4"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                onClick={() => setActiveIconIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
