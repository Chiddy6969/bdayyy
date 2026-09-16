"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Simple heart SVG component
const Heart = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function Background() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-noise" />; // Prevents hydration mismatch

  // Generates positions for floating elements
  const elements = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // percentage
    y: Math.random() * 100, // percentage
    size: Math.random() * 20 + 10, // px
    duration: Math.random() * 20 + 20, // seconds
    delay: Math.random() * -20 // random start time
  }));

  return (
    <>
      <div className="bg-noise" />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {elements.map((el) => (
          <motion.div
            key={el.id}
            initial={{ 
              x: `${el.x}vw`, 
              y: `${el.y}vh`,
              opacity: 0
            }}
            animate={{
              y: [`${el.y}vh`, `${el.y - 20}vh`, `${el.y + 10}vh`, `${el.y}vh`],
              x: [`${el.x}vw`, `${el.x + 5}vw`, `${el.x - 5}vw`, `${el.x}vw`],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 90, 180, 360]
            }}
            transition={{
              duration: el.duration,
              repeat: Infinity,
              delay: el.delay,
              ease: "linear"
            }}
            className="absolute text-theme-lilac"
          >
            <Heart className={`w-[${el.size}px] h-[${el.size}px]`} />
          </motion.div>
        ))}
      </div>
    </>
  );
}
