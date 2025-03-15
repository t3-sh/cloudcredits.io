import React, { useState } from "react";
import { motion } from "framer-motion";

interface LogoProps {
  logoWidth: string;
  logoHeight: string;
  src: string;
  srcDarkmode?: string;
  title: string;
  themeSwitcher: boolean;
}

export function Logo({
  logoWidth,
  logoHeight,
  src,
  srcDarkmode,
  title,
  themeSwitcher,
}: LogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  const textVariants = {
    initial: {
      opacity: 0,
    },
    animate: (i: number) => ({
      opacity: 1,
      transition: {
        delay: 0.2 + i * 0.1,
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      },
    }),
  };

  const underlineVariants = {
    initial: {
      width: 0,
      opacity: 0,
      x: "50%",
    },
    animate: {
      width: "0%",
      opacity: 0,
      x: "50%",
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      width: "100%",
      opacity: 1,
      x: "0%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="inline-flex items-center relative"
      initial="initial"
      animate="animate"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex-shrink-0 mr-2 relative">
        <img
          src={src}
          className={`inline-block ${themeSwitcher ? "dark:hidden" : ""}`}
          width={parseInt(logoWidth) * 2}
          height={parseInt(logoHeight) * 2}
          alt={title}
          style={{
            height: `${parseInt(logoHeight) * 0.8}px`,
            width: `${parseInt(logoWidth) * 0.8}px`,
          }}
        />
        {themeSwitcher && srcDarkmode && (
          <img
            src={srcDarkmode}
            className="hidden dark:inline-block"
            width={parseInt(logoWidth) * 2}
            height={parseInt(logoHeight) * 2}
            alt={title}
            style={{
              height: `${parseInt(logoHeight) * 0.8}px`,
              width: `${parseInt(logoWidth) * 0.8}px`,
            }}
          />
        )}
      </div>

      <div className="flex items-baseline relative">
        <motion.span
          custom={0}
          variants={textVariants}
          style={{ fontFamily: "'Inconsolata', sans-serif" }}
          className={`text-base leading-none transition-all duration-300 ${
            isHovered ? "text-[#F9C454]" : "text-[#1AE8D9] dark:text-[#1AE8D9]"
          }`}
        >
          Cloud
        </motion.span>
        <motion.span
          custom={1}
          variants={textVariants}
          style={{ fontFamily: "'Inconsolata', sans-serif" }}
          className={`text-base leading-none mx-1 transition-all duration-300 ${
            isHovered ? "text-[#1AE8D9]" : "text-[#F9C454] dark:text-[#F9C454]"
          }`}
        >
          Credits
        </motion.span>
        <motion.span
          custom={2}
          variants={textVariants}
          style={{ fontFamily: "'Inconsolata', sans-serif" }}
          className={`text-base leading-none transition-all duration-300 ${
            isHovered ? "text-[#F9C454]" : "text-[#1AE8D9] dark:text-[#1AE8D9]"
          }`}
        >
          .io
        </motion.span>

        <motion.div
          className={`absolute -bottom-1 left-0 h-0.5 ${
            isHovered ? "bg-[#F9C454]" : "bg-[#1AE8D9]"
          }`}
          variants={underlineVariants}
        />
      </div>
    </motion.div>
  );
}
