"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element on client side
    audioRef.current = new Audio("/music.mp3");
    audioRef.current.loop = true;
    
    // Check if autoplay works (rare, but good to check)
    // Most browsers block this unless interacted
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback failed:", err);
      });
    }
  };

  return (
    <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
      <button 
        onClick={toggleMusic}
        className="glass-panel w-12 h-12 rounded-full flex items-center justify-center text-theme-plum hover:bg-white/40 transition-colors"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Volume2 size={24} />
          </motion.div>
        ) : (
          <VolumeX size={24} opacity={0.7} />
        )}
      </button>
    </div>
  );
}
