import React from "react";
import { motion } from "framer-motion";
import useTheme from "@/hooks/useTheme";

interface AnimatedBackgroundProps {
  color?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ color }) => {
  const theme = useTheme();
  // Use provided color or fall back to theme color
  const primaryColor = color || "#2BDFDC";

  const lines = Array.from({ length: 6 });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Horizontal lines */}
      {lines.map((_, index) => (
        <motion.div
          key={index}
          className="absolute h-[1px] w-full"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${primaryColor} 50%, transparent 100%)`,
            top: `${(100 / lines.length) * index}%`,
            opacity: theme === "dark" ? 0.15 : 0.3,
            boxShadow: `0 0 10px ${primaryColor}`,
          }}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            ease: "linear",
            delay: index * 0.5,
          }}
        />
      ))}

      {/* Vertical lines */}
      {lines.map((_, index) => (
        <motion.div
          key={`vertical-${index}`}
          className="absolute w-[1px] h-full"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${primaryColor} 50%, transparent 100%)`,
            left: `${(100 / lines.length) * index}%`,
            opacity: theme === "dark" ? 0.15 : 0.3,
            boxShadow: `0 0 10px ${primaryColor}`,
          }}
          animate={{
            y: ["-100%", "100%"],
          }}
          transition={{
            duration: 10 + index * 2,
            repeat: Infinity,
            ease: "linear",
            delay: index * 0.7,
          }}
        />
      ))}

      {/* Diagonal lines */}
      {lines.slice(0, 3).map((_, index) => (
        <motion.div
          key={`diagonal-${index}`}
          className="absolute h-[1px] origin-left"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${primaryColor} 50%, transparent 100%)`,
            top: "50%",
            left: "0",
            width: "141.4%",
            transform: `rotate(${45 + (index * 90) / 2}deg)`,
            opacity: theme === "dark" ? 0.15 : 0.3,
            boxShadow: `0 0 10px ${primaryColor}`,
          }}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 15 + index * 2.5,
            repeat: Infinity,
            ease: "linear",
            delay: index * 1.2,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
