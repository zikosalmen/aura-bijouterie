"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 rtl:right-auto rtl:left-6">
      {/* Scroll To Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.8 }}
            onClick={scrollToTop}
            className="w-12 h-12 bg-background border border-gold/30 text-gold rounded-full shadow-lg flex items-center justify-center hover:bg-gold hover:text-white transition-all focus:outline-none"
            aria-label="Remonter"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/212600000000"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group focus:outline-none"
        aria-label="WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-7 h-7 fill-current group-hover:scale-110 transition-transform"
        >
          <path d="M11.99 2C6.47 2 2 6.48 2 12c0 1.76.46 3.42 1.25 4.88L2 22l5.12-1.25A9.975 9.975 0 0 0 11.99 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.3c-1.46 0-2.88-.36-4.14-1.02l-.3-.15-3.08.75.76-3-.18-.34C4.37 15.19 4 13.63 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.33-5.69c-.24-.12-1.41-.69-1.63-.77-.22-.08-.38-.12-.54.12-.16.24-.61.77-.75.93-.14.16-.28.18-.52.06-1.55-.78-2.61-1.46-3.62-3.18-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.41-.14 0-.3 0-.46 0-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.58 1.5.62 2.11.67 2.87.56.88-.13 1.41-.58 1.63-1.14.22-.56.22-1.04.16-1.14s-.22-.16-.46-.28z"/>
        </svg>
      </a>
    </div>
  );
}
