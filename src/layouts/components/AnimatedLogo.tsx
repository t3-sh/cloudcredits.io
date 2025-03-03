import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedLogoProps {
  logoWidth: string;
  logoHeight: string;
  src: string;
  srcDarkmode?: string;
  title: string;
  themeSwitcher: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

export function AnimatedLogo({
  logoWidth,
  logoHeight,
  src,
  srcDarkmode,
  title,
  themeSwitcher,
}: AnimatedLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isHovered) {
      const newParticles: Particle[] = [];
      const colors = [
        "rgba(26, 232, 217, 0.7)",
        "rgba(195, 123, 255, 0.7)",
        "rgba(250, 213, 94, 0.7)",
        "rgba(247, 109, 29, 0.7)",
      ];

      for (let i = 0; i < 8; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100 - 50, // Position relative to logo
          y: Math.random() * 100 - 50,
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: Math.random() * 1 + 1,
          delay: Math.random() * 0.3,
        });
      }

      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isHovered]);

  const logoVariants = {
    initial: {
      scale: 0.95,
      opacity: 0,
      rotate: -5,
    },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
      },
    },
    hover: {
      scale: 1.05,
      rotate: [0, -2, 0],
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

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
    hover: (i: number) => ({
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        delay: i * 0.05,
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

  const glowVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    animate: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    },
    hover: {
      opacity: 0.7,
      scale: 1.2,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const particleVariants = {
    initial: (particle: Particle) => ({
      opacity: 0,
      scale: 0,
      x: 0,
      y: 0,
    }),
    animate: (particle: Particle) => ({
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      x: [0, particle.x, particle.x * 2],
      y: [0, particle.y, particle.y * 2],
      transition: {
        duration: particle.duration,
        delay: particle.delay,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: Math.random() * 0.5,
      },
    }),
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
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        variants={glowVariants}
        style={{
          background: isHovered
            ? "radial-gradient(circle, rgba(250,213,94,0.3) 0%, rgba(247,109,29,0.1) 70%, rgba(247,109,29,0) 100%)"
            : "radial-gradient(circle, rgba(26,232,217,0.3) 0%, rgba(195,123,255,0.1) 70%, rgba(195,123,255,0) 100%)",
        }}
      />

      <AnimatePresence>
        {isHovered &&
          particles.map((particle) => (
            <motion.div
              key={particle.id}
              custom={particle}
              variants={particleVariants}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, scale: 0 }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                left: "50%",
                top: "50%",
                marginLeft: -particle.size / 2,
                marginTop: -particle.size / 2,
                zIndex: -1,
              }}
            />
          ))}
      </AnimatePresence>

      <motion.div
        className="flex-shrink-0 mr-3 relative"
        variants={logoVariants}
      >
        <img
          src={src}
          className={`inline-block ${themeSwitcher ? "dark:hidden" : ""}`}
          width={parseInt(logoWidth) * 2}
          height={parseInt(logoHeight) * 2}
          alt={title}
          style={{
            height: `${logoHeight}px`,
            width: `${logoWidth}px`,
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
              height: `${logoHeight}px`,
              width: `${logoWidth}px`,
            }}
          />
        )}
      </motion.div>

      <div className="flex items-baseline relative">
        <motion.span
          custom={0}
          variants={textVariants}
          style={{ fontFamily: "'Inconsolata', sans-serif" }}
          className={`text-xl leading-none bg-clip-text text-transparent transition-all duration-300 ${
            isHovered
              ? "bg-gradient-to-r from-[#FAD55E] to-[#F76D1D]"
              : "bg-gradient-to-r from-[#1AE8D9] to-[#C37BFF]"
          }`}
        >
          Cloud
        </motion.span>
        <motion.span
          custom={1}
          variants={textVariants}
          style={{ fontFamily: "'Inconsolata', sans-serif" }}
          className={`text-xl leading-none bg-clip-text text-transparent mx-1 transition-all duration-300 ${
            isHovered
              ? "bg-gradient-to-r from-[#1AE8D9] to-[#C37BFF]"
              : "bg-gradient-to-r from-[#FAD55E] to-[#F76D1D]"
          }`}
        >
          Credits
        </motion.span>
        <motion.span
          custom={2}
          variants={textVariants}
          style={{ fontFamily: "'Inconsolata', sans-serif" }}
          className={`text-xl leading-none bg-clip-text text-transparent transition-all duration-300 ${
            isHovered
              ? "bg-gradient-to-r from-[#FAD55E] to-[#F76D1D]"
              : "bg-gradient-to-r from-[#1AE8D9] to-[#C37BFF]"
          }`}
        >
          .io
        </motion.span>

        <motion.div
          className={`absolute -bottom-1 left-0 h-0.5 ${
            isHovered
              ? "bg-gradient-to-r from-[#FAD55E] to-[#F76D1D]"
              : "bg-gradient-to-r from-[#1AE8D9] to-[#C37BFF]"
          }`}
          variants={underlineVariants}
        />
      </div>
    </motion.div>
  );
}
