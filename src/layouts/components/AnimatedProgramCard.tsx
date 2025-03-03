import React from "react";
import { motion } from "framer-motion";

interface AnimatedProgramCardProps {
  color: string;
  children: React.ReactNode;
  status: "Active" | "Beta" | "Upcoming" | "Discontinued";
}

export function AnimatedProgramCard({
  color,
  children,
  status,
}: AnimatedProgramCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "Active":
        return "#22c55e";
      case "Beta":
        return "#3b82f6";
      case "Upcoming":
        return "#eab308";
      default:
        return "#ef4444";
    }
  };

  const statusColor = getStatusColor();

  return (
    <motion.div
      className={`group relative rounded-2xl h-full min-h-[28rem] flex flex-col overflow-hidden
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
        ease: [0.23, 1, 0.32, 1],
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
              ${statusColor}20 0%,
              transparent 40%
            ),
            radial-gradient(
              circle at 100% 100%,
              ${color}15 0%,
              transparent 40%
            ),
            radial-gradient(
              circle at 0% 100%,
              ${statusColor}15 0%,
              transparent 50%
            )
          `,
        }}
      />

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

      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={{ opacity: 0 }}
        whileHover={{
          opacity: 0.15,
          transition: { duration: 0.3 },
        }}
        style={{
          background: `radial-gradient(
            circle at 50% 50%,
            ${color}30,
            transparent 70%
          )`,
        }}
      />

      <div
        className="absolute bottom-0 right-0 w-32 h-32 opacity-20"
        style={{
          background: `linear-gradient(
            135deg,
            transparent 40%,
            ${statusColor}20 70%,
            ${statusColor}40 100%
          )`,
        }}
      />
    </motion.div>
  );
}
