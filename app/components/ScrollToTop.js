"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="p-3 bg-stone-800 text-white rounded-full shadow-lg hover:bg-stone-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-stone-500"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
