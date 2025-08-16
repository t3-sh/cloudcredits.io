import React, { useState, useEffect } from "react";
import GitHubButton from "react-github-btn";

interface StarCTADialogProps {
  show: boolean;
  onClose: () => void;
}

export default function StarCTADialog({ show, onClose }: StarCTADialogProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    }
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-xl w-full p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close dialog"
        >
          <svg
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mb-4">
            {/* GIF demonstration */}
            <div className="w-full max-w-md mx-auto mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
              <img
                src="/video/star-on-github-hq.gif"
                alt="How to star the repository on GitHub"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              This helped you save money?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Star us on GitHub! It takes 2 seconds and helps us build better
              tools for finding free cloud credits.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {/* GitHub Star Button */}
            <div className="flex justify-center">
              <GitHubButton
                href="https://github.com/t3-sh/cloudcredits.io"
                data-color-scheme="no-preference: light; light: light; dark: dark;"
                data-icon="octicon-star"
                data-size="large"
                data-show-count="true"
                aria-label="Star t3-sh/cloudcredits.io on GitHub"
              >
                Star
              </GitHubButton>
            </div>

            {/* Maybe Later Button */}
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Not now
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            This is a fully open-source project 💙
          </div>
        </div>
      </div>
    </div>
  );
}
