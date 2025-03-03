import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface RoadmapItem {
  name: string;
  description: string;
  date: string;
  displayDate?: string;
  category: "functionality" | "content";
  action?: string;
  action_url?: string;
}

interface AnimatedRoadmapProps {
  items: RoadmapItem[];
  primaryColor: string;
  secondaryColor?: string;
}

export function AnimatedRoadmap({
  items,
  primaryColor,
  secondaryColor = "#6366f1",
}: AnimatedRoadmapProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);
  // Use once: true to only trigger the animation once
  const isInView = useInView(containerRef, { once: true, amount: 0.05 });

  // Set hasAnimated to true once the component is in view
  useEffect(() => {
    if (isInView) {
      setHasAnimated(true);
    }
  }, [isInView]);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.1
      }
    }
  };

  const lineVariants = {
    hidden: { height: "0%" },
    visible: { 
      height: "100%",
      transition: { 
        duration: 1.2,
        ease: "easeInOut" 
      }
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Legend for categories */}
      <motion.div 
        className="flex flex-wrap justify-center mb-10 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView || hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: primaryColor }}
          ></div>
          <span className="text-sm font-medium">Functionality</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: secondaryColor }}
          ></div>
          <span className="text-sm font-medium">Content</span>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line - only show on desktop */}
        {!isMobile && (
          <motion.div
            variants={lineVariants}
            initial="hidden"
            animate={isInView || hasAnimated ? "visible" : "hidden"}
            className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full z-0 hidden md:block"
            style={{ background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})` }}
          />
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView || hasAnimated ? "visible" : "hidden"}
          className="relative z-10"
        >
          {items.map((item, index) => {
            const itemRef = useRef(null);
            const isItemInView = useInView(itemRef, { once: true, amount: 0.1 });
            const itemColor = item.category === "functionality" ? primaryColor : secondaryColor;
            
            return (
              <motion.div
                key={`${item.name}-${index}`}
                ref={itemRef}
                variants={itemVariants}
                className={`mb-12 md:mb-16 ${
                  isMobile 
                    ? "flex flex-col" 
                    : `flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`
                }`}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Mobile timeline dot and line */}
                {isMobile && (
                  <motion.div 
                    className="flex items-center mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <motion.div
                      className="w-6 h-6 rounded-full border-4 z-10 flex items-center justify-center mr-4"
                      style={{ 
                        borderColor: itemColor,
                        backgroundColor: "white",
                      }}
                      whileHover={{ scale: 1.2 }}
                    >
                      <motion.div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: itemColor }}
                        animate={{ 
                          scale: hoveredItem === index ? 1.5 : 1
                        }}
                      />
                    </motion.div>
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-sm font-medium px-3 py-1 rounded-full" 
                        style={{ 
                          backgroundColor: itemColor,
                          color: "white"
                        }}
                      >
                        {item.displayDate || item.date}
                      </span>
                      <span 
                        className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800"
                        style={{ color: itemColor }}
                      >
                        {item.category}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Content box */}
                <motion.div
                  className={`${
                    isMobile 
                      ? "w-full" 
                      : `w-5/12 ${index % 2 === 0 ? "pr-8" : "pl-8"}`
                  }`}
                  initial={{ 
                    opacity: 0, 
                    x: isMobile ? 0 : (index % 2 === 0 ? -30 : 30) 
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.1 + (index * 0.1),
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ 
                      opacity: 1,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      borderColor: itemColor,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        <span 
                          className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hidden md:inline-block ml-2"
                          style={{ color: itemColor }}
                        >
                          {item.category}
                        </span>
                      </div>
                      {!isMobile && (
                        <span 
                          className="text-sm font-medium px-3 py-1 rounded-full ml-2 flex-shrink-0" 
                          style={{ 
                            backgroundColor: itemColor,
                            color: "white"
                          }}
                        >
                          {item.displayDate || item.date}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
                    {item.action && item.action_url && (
                      <a
                        href={item.action_url}
                        className="inline-flex items-center gap-1 text-sm font-medium transition-all duration-300 hover:gap-2"
                        style={{ color: itemColor }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.action}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M12 5l7 7-7 7"></path>
                        </svg>
                      </a>
                    )}
                  </motion.div>
                </motion.div>

                {/* Center dot - only for desktop */}
                {!isMobile && (
                  <motion.div
                    className="w-2/12 flex justify-center items-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.2 + (index * 0.1),
                      type: "spring",
                      stiffness: 300,
                      damping: 10
                    }}
                  >
                    <motion.div
                      className="w-6 h-6 rounded-full border-4 z-10 flex items-center justify-center"
                      style={{ 
                        borderColor: itemColor,
                        backgroundColor: "white",
                      }}
                      whileHover={{ scale: 1.2 }}
                      animate={{ 
                        scale: hoveredItem === index ? 1.2 : 1,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <motion.div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: itemColor }}
                        animate={{ 
                          scale: hoveredItem === index ? 1.5 : 1,
                          transition: { duration: 0.3 }
                        }}
                      />
                    </motion.div>
                  </motion.div>
                )}

                {/* Empty space for alternating layout - only for desktop */}
                {!isMobile && <div className="w-5/12" />}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
} 
