import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedAccordionProps {
  question: string;
  answer: string;
  color: string;
  index: number;
}

export function AnimatedAccordion({
  question,
  answer,
  color,
  index,
}: AnimatedAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`
        rounded-xl overflow-hidden
        backdrop-blur-xl bg-white/10 dark:bg-black/20
        border border-white/10 dark:border-white/5
        hover:bg-white/20 dark:hover:bg-black/30
        transition-colors duration-300
      `}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <h3 className="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white/90 leading-tight">
            {question}
          </h3>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`flex-shrink-0 mt-2 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            style={{ color }}
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{
              height: contentRef.current?.offsetHeight || "auto",
              transition: {
                height: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
              },
            }}
            exit={{
              height: 0,
              transition: {
                height: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
              },
            }}
            className="overflow-hidden"
          >
            <div ref={contentRef} className="px-8 pb-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    opacity: { duration: 0.2, delay: 0.1 },
                    y: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
                  },
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    opacity: { duration: 0.2 },
                  },
                }}
                className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400"
                dangerouslySetInnerHTML={{ __html: answer }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AccordionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const styles = `
  .prose {
    line-height: 1.75;
  }

  .prose p {
    margin-bottom: 1em;
  }

  .prose p:last-child {
    margin-bottom: 0;
  }

  .prose a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  .prose ul {
    list-style-type: disc;
    padding-left: 1.5em;
    margin: 1em 0;
  }

  .prose ol {
    list-style-type: decimal;
    padding-left: 1.5em;
    margin: 1em 0;
  }

  .prose li {
    margin: 0.5em 0;
  }

  .prose code {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 0.25em;
    font-size: 0.9em;
  }

  .prose pre {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 1em;
    border-radius: 0.5em;
    overflow-x: auto;
    margin: 1em 0;
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
