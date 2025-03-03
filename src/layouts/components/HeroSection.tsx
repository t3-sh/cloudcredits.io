import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import useTheme from "@/hooks/useTheme";

export default function HeroSection() {
  const theme = useTheme();

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

  const words = [
    "Cloud", // cloudsearch.png
    "Startup", // startup.png
    "SaaS", // saas.png
    "Compute", // server.png
    "AI", // compute.png
    "Database", // database.png
    "Storage", // storage.png
    "Software", // saas.png
    "Tools", // tools.png
    "Monitoring", // saas.png
    "Analytics", // startup.png
    "Marketing", // marketing.png
    "Ads", // marketing.png
    "Sales", // saas.png
  ];

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

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [highlightedImage, setHighlightedImage] = useState("");

  useEffect(() => {
    const word = words[currentWordIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(word.substring(0, currentText.length + 1));

        if (currentText.length === word.length) {
          setTypingSpeed(1500);
          setIsDeleting(true);
        } else {
          setTypingSpeed(80 + Math.random() * 50);
          if (currentText.length === 0) {
            setHighlightedImage(wordToImageMap[word] || "");
          }
        }
      } else {
        setCurrentText(word.substring(0, currentText.length - 1));

        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((currentWordIndex + 1) % words.length);
          setHighlightedImage("");
          setTypingSpeed(500);
        } else {
          setTypingSpeed(40 + Math.random() * 30);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [
    currentText,
    currentWordIndex,
    isDeleting,
    typingSpeed,
    words,
    wordToImageMap,
  ]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black relative overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5 }}
      >
        {/* <img
          src="/images/hero/bits.png"
          alt="Background Pattern"
          className="w-full h-full object-cover"
        /> */}
      </motion.div>

      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
        style={{
          background:
            theme === "dark"
              ? `
              radial-gradient(circle at 20% 20%, rgba(76, 29, 149, 0.4) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.4) 0%, transparent 40%)
            `
              : `
              radial-gradient(circle at 20% 20%, rgba(76, 29, 149, 0.2) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 40%)
            `,
        }}
      />

      <motion.div
        className="text-center px-4 z-20 w-full max-w-5xl absolute top-8 md:top-12 left-0 right-0 mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: "easeOut",
        }}
      >
        <div className="flex flex-col items-center">
          <motion.p
            className="text-2xl md:text-3xl font-medium text-dark dark:text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            Find and Secure
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-dark dark:text-white flex flex-wrap justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <span className="mr-3">Best</span>
            <span className="inline-block min-w-[140px] md:min-w-[220px]">
              <span className="text-gradient">{currentText}</span>
            </span>
            <span className="ml-3">Credits</span>
          </motion.h1>
        </div>

        <div className="mb-10 max-w-2xl mx-auto flex flex-col items-center text-center gap-4">
          <span className="font-semibold text-lg text-gradient inline-block">
            The most comprehensive discount collection to accelerate your
            projects
          </span>

          <motion.div
            className="flex items-center justify-center flex-wrap md:flex-nowrap gap-3 md:gap-4 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {[
              { color: "purple", text: "Fully Open Source", icon: "•" },
              { color: "blue", text: "Community Driven", icon: "•" },
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
                <span className={`text-${uvp.color}-500 text-xl font-bold leading-none`}>
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
          className="mb-0 flex items-center justify-center"
        >
          <a
            href="/providers"
            className="btn bg-primary text-white px-8 py-3 rounded-md mr-4 inline-flex items-center gap-2 hover:bg-opacity-90"
          >
            <span className="leading-none self-center">Explore Credits</span>
            <span className="leading-none self-center ml-1">→</span>
          </a>
          <a
            href="https://github.com/DUALSTACKS/cloudcredits.io"
            className="btn border border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 inline-flex items-center gap-2"
            target="_blank"
          >
            <FaGithub size={20} />
            <span className="leading-none self-center">Star on GitHub</span>
          </a>
        </motion.div>
        
        {/* Grid of frosted glass icons */}
        <motion.div
          className="mt-16 w-full max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8 }}
        >
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 md:gap-6 relative">
            {[
              { src: "/images/hero/coin.png", alt: "Cloud Coin", offset: { x: 0, y: 0 } },
              { src: "/images/hero/database.png", alt: "Database", offset: { x: -5, y: 8 } },
              { src: "/images/hero/cloudsearch.png", alt: "Cloud Search", offset: { x: 10, y: -5 } },
              { src: "/images/hero/server.png", alt: "Server", offset: { x: 5, y: 12 } },
              { src: "/images/hero/saas.png", alt: "SaaS", offset: { x: 12, y: -8 } },
              { src: "/images/hero/compute.png", alt: "Compute", offset: { x: -12, y: 5 } },
              { src: "/images/hero/startup.png", alt: "Startup", offset: { x: 8, y: 10 } },
              { src: "/images/hero/storage.png", alt: "Storage", offset: { x: -10, y: -5 } },
              { src: "/images/hero/marketing.png", alt: "Marketing", offset: { x: 5, y: -12 } },
              { src: "/images/hero/tools.png", alt: "Tools", offset: { x: -5, y: 10 } },
            ].map((card, index) => {
              const isHighlighted = highlightedImage && card.src.includes(highlightedImage);
              
              return (
                <motion.div
                  key={index}
                  className="rounded-xl border border-white/10 shadow-md flex items-center justify-center cursor-pointer aspect-square"
                  style={{
                    ...glassCardStyle,
                    boxShadow: isHighlighted
                      ? "0 0 15px rgba(255, 255, 255, 0.4)"
                      : undefined,
                    border: isHighlighted
                      ? "1px solid rgba(255, 255, 255, 0.4)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    transform: `translate(${card.offset.x}px, ${card.offset.y}px)`,
                  }}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isHighlighted ? 0.9 : 0.7,
                  }}
                  whileHover={{
                    scale: 0.85,
                    boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    transition: { duration: 0.2 },
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: 2.0 + index * 0.08 },
                    scale: { duration: 0.3 },
                  }}
                >
                  <motion.img
                    src={card.src}
                    alt={card.alt}
                    className="object-contain p-1"
                    style={{
                      width: "100%",
                      height: "100%",
                      maxHeight: "none",
                    }}
                    animate={{
                      scale: isHighlighted ? 1.1 : 1,
                      rotate: isHighlighted ? 10 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    whileHover={{
                      scale: 1.1,
                      rotate: 10,
                      transition: { duration: 0.2 },
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      <div className="h-24 md:h-32"></div>
    </section>
  );
}
