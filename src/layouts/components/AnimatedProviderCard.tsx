import React from "react";
import { motion } from "framer-motion";

interface AnimatedProviderCardProps {
  color: string;
  children: React.ReactNode;
}

export function AnimatedProviderCard({
  color,
  children,
}: AnimatedProviderCardProps) {
  return (
    <motion.div
      className={`group relative rounded-2xl h-[28rem] flex flex-col overflow-hidden
      backdrop-blur-xl bg-white/10 dark:bg-black/20
      border border-white/5 dark:border-white/10
      shadow-[0_8px_32px_rgba(0,0,0,0.03),inset_0_0_0_1px_rgba(255,255,255,0.1)]
      dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.05)]
      will-change-transform backface-visible-hidden
      transform-gpu`}
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1], // Custom cubic bezier for smoother animation
      }}
      whileHover={{
        scale: 1.02,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      }}
    >
      {/* Ambient light effect */}
      <motion.div
        className="absolute inset-0 opacity-70 dark:opacity-90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1 }}
        style={{
          background: `
            radial-gradient(
              circle at 0% 0%,
              ${color}30 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 100% 0%,
              ${color}20 0%,
              transparent 40%
            ),
            radial-gradient(
              circle at 100% 100%,
              ${color}15 0%,
              transparent 40%
            ),
            radial-gradient(
              circle at 0% 100%,
              ${color}25 0%,
              transparent 50%
            )
          `,
        }}
      />

      {/* Base gradient background */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 0.8 }}
        style={{
          background: `radial-gradient(
            circle at top,
            ${color}35 0%,
            ${color}25 20%,
            ${color}15 40%,
            ${color}05 60%,
            transparent 100%
          )`,
        }}
      />

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, x: "-100%" }}
        whileHover={{
          opacity: [0, 0.5, 0],
          x: ["100%", "0%", "-100%"],
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          },
        }}
        style={{
          background: `linear-gradient(
            105deg,
            transparent 0%,
            ${color}15 10%,
            ${color}25 20%,
            ${color}15 30%,
            transparent 50%
          )`,
        }}
      />

      {/* Top border gradient */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0.23, 1, 0.32, 1],
        }}
        style={{
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
          opacity: 0.7,
        }}
      />

      {/* Content container with improved text rendering */}
      <motion.div
        className="relative z-10 flex flex-col h-full transform-gpu"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.3,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={{ opacity: 0 }}
        whileHover={{
          opacity: 0.15,
          transition: { duration: 0.3 },
        }}
        style={{
          boxShadow: `inset 0 0 100px ${color}`,
        }}
      />
    </motion.div>
  );
}
