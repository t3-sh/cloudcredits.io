import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingMessages = [
  "Summoning cloud credit wizards",
  "Scanning the startup multiverse",
  "Consulting the oracle of free tiers",
  "Decoding the matrix of discounts",
  "Awakening dormant credit dragons",
  "Channeling entrepreneurial energy",
  "Mining the depths of SaaS secrets",
  "Brewing a potion of perfect matches",
  "Reading the tea leaves of tech deals",
  "Unlocking hidden treasure chests",
  "Negotiating with discount demons",
  "Translating your wishes into reality",
  "Activating the deal detection algorithm",
  "Consulting the startup spirit guides",
  "Diving into the ocean of opportunities",
  "Weaving magic spells for savings",
  "Connecting to the cosmic credit network",
  "Interrogating the database goblins",
  "Tickling the servers for answers",
  "Performing dark arts of cost reduction",
  "Searching through digital dimensions",
  "Communing with the cloud deities",
  "Unleashing the hounds of savings",
  "Deciphering ancient startup scrolls",
  "Mixing ingredients for success sauce",
  "Calibrating the opportunity detector",
  "Whispering to sleeping algorithms",
  "Gathering intel from silicon spies",
  "Consulting the council of CTOs",
  "Hacking the mainframe of miracles",
  "Assembling your dream team of deals",
  "Polishing the crystal ball of credits",
  "Activating turbo-charged search mode",
  "Befriending the API overlords",
  "Downloading wisdom from the clouds",
];

export default function LoadingIndicator() {
  const [currentMessage, setCurrentMessage] = useState(0);
  useEffect(() => {
    // Change message every 2 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => {
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="text-center py-12 animate-fade-in">
      <div className="inline-flex flex-col items-center gap-4">
        {/* Animated message container */}
        <motion.div
          className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 min-h-[3rem] flex items-center animate-pulse-glow"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessage}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-lg text-gray-600 dark:text-gray-400 font-medium flex items-center"
            >
              <span>{loadingMessages[currentMessage]}</span>
              <div className="ml-2 flex">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1 h-1 bg-primary rounded-full mx-0.5"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
