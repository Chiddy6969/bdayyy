"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

export default function Scene1({ onCakeCut }: { onCakeCut: () => void }) {
  const [candlesOut, setCandlesOut] = useState<boolean[]>([false, false, false, false, false]);
  const [showFallback, setShowFallback] = useState(false);
  const [canCut, setCanCut] = useState(false);
  const [isCutting, setIsCutting] = useState(false);
  const [hideScene, setHideScene] = useState(false);
  
  const lastBlowTime = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Staggered text animation variants
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1] as const
      }
    })
  };

  const name = "Happy Birthday, Chunmyiiii";
  const words = name.split(" ");

  useEffect(() => {
    // 10 second fallback timer
    const fallbackTimer = setTimeout(() => {
      setShowFallback(true);
    }, 10000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    // Audio processing for blowing candles
    let animationFrameId: number;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array;

    const startMic = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("MediaDevices API not available (requires HTTPS or localhost).");
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        // Use webkitAudioContext for Safari compatibility
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        audioContextRef.current = audioContext;
        
        const microphone = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        microphone.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        let highVolumeFrames = 0;

        const checkVolume = () => {
          if (!analyser) return;
          analyser.getByteFrequencyData(dataArray as any);
          
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const averageVolume = sum / dataArray.length;

          // Threshold for blowing (tune this sensitivity if needed)
          if (averageVolume > 70) {
            highVolumeFrames++;
          } else {
            highVolumeFrames = 0;
          }

          // If volume is high for ~600ms (approx 35 frames at 60fps)
          if (highVolumeFrames > 35) {
            extinguishAllCandles();
            highVolumeFrames = 0; // reset
          }

          animationFrameId = requestAnimationFrame(checkVolume);
        };

        checkVolume();
      } catch (err) {
        console.error("Microphone access denied or error:", err);
        // If mic access fails (e.g. mobile Safari requires user gesture or permission denied),
        // immediately show the fallback button so they can proceed.
        setShowFallback(true);
      }
    };

    startMic();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const extinguishAllCandles = () => {
    setCandlesOut([true, true, true, true, true]);
  };

  useEffect(() => {
    if (candlesOut.every(c => c === true) && !canCut) {
      setTimeout(() => setCanCut(true), 1000);
      setShowFallback(false); // Hide fallback if all are out
    }
  }, [candlesOut, canCut]);

  const handleCutCake = () => {
    if (!canCut || isCutting) return;
    setIsCutting(true);

    // Confetti burst
    const end = Date.now() + 2 * 1000;
    const colors = ['#E6E6FA', '#C8A2C8', '#673147', '#D4AF7F', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        // Confetti settled, trigger transition
        setTimeout(() => {
          setHideScene(true);
          setTimeout(() => {
             onCakeCut();
          }, 800); // Wait for fade out
        }, 500);
      }
    }());
  };

  const renderCake = () => (
    <>
      {/* SVG Cake */}
      <svg width="240" height="240" viewBox="0 0 240 240" className="drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Base Plate */}
        <ellipse cx="120" cy="200" rx="100" ry="20" fill="#E6E6FA" stroke="#C8A2C8" strokeWidth="2" />
        
        {/* Bottom Tier */}
        <path d="M40 190 C 40 210, 200 210, 200 190 L 200 130 C 200 150, 40 150, 40 130 Z" fill="#FCFAFF" stroke="#C8A2C8" strokeWidth="2" />
        
        {/* Top Tier */}
        <path d="M60 140 C 60 155, 180 155, 180 140 L 180 80 C 180 95, 60 95, 60 80 Z" fill="#E6E6FA" stroke="#C8A2C8" strokeWidth="2" />
        
        {/* Frosting drips */}
        <path d="M60 85 Q 70 100 80 85 Q 90 110 100 85 Q 110 100 120 85 Q 130 115 140 85 Q 150 105 160 85 Q 170 100 180 85" fill="none" stroke="#FCFAFF" strokeWidth="6" strokeLinecap="round" />
        <path d="M40 135 Q 60 150 80 135 Q 100 160 120 135 Q 140 155 160 135 Q 180 160 200 135" fill="none" stroke="#E6E6FA" strokeWidth="6" strokeLinecap="round" />
        
        {/* Cake details/decorations */}
        <circle cx="120" cy="115" r="4" fill="#D4AF7F" />
        <circle cx="80" cy="110" r="4" fill="#D4AF7F" />
        <circle cx="160" cy="110" r="4" fill="#D4AF7F" />
      </svg>

      {/* Candles */}
      <div className="absolute top-[20px] left-0 right-0 flex justify-center gap-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="relative w-2 h-12 flex flex-col items-center">
            {/* Flame */}
            {!candlesOut[i] && (
              <motion.div
                className="w-3 h-5 bg-gradient-to-t from-theme-gold to-yellow-200 rounded-full mb-1 drop-shadow-md origin-bottom"
                animate={{
                  scaleY: [1, 1.1, 0.9, 1.15, 1],
                  skewX: [0, -5, 5, -2, 0],
                  opacity: [0.9, 1, 0.8, 1]
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
            {/* Extinguished Smoke */}
            {candlesOut[i] && (
              <motion.div
                className="w-1 h-1 bg-gray-400 rounded-full mb-3"
                initial={{ opacity: 1, scale: 1, y: 0 }}
                animate={{ opacity: 0, scale: 3, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}
            {/* Candle Stick */}
            <div className={`w-2 h-8 rounded-sm bg-theme-plum shadow-inner ${candlesOut[i] ? 'mt-4' : ''}`} />
          </div>
        ))}
      </div>
    </>
  );

  return (
    <motion.div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative z-10"
      initial={{ opacity: 1 }}
      animate={{ opacity: hideScene ? 0 : 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center mb-16 relative z-10 px-4">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-theme-plum mb-4 font-bold flex flex-wrap justify-center gap-2 sm:gap-4">
          {words.map((word, i) => (
            <motion.span
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={wordVariants}
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p 
          className="font-sans text-base sm:text-lg md:text-xl text-theme-dark opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          {/* TODO: Add subheading */}
          Make a wish and blow out the candles...
        </motion.p>
      </div>

      <div className="relative mt-8 w-[240px] h-[240px] mx-auto">
        {/* Custom cursor active only when can cut */}
        <div 
          className={`absolute inset-0 ${canCut ? 'cursor-[url(/knife.svg)_0_24,pointer]' : ''}`}
          onClick={handleCutCake}
        >
          {/* Left Half */}
          <motion.div 
            className="absolute inset-0"
            style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
            animate={isCutting ? { x: -40, rotate: -5, opacity: 0 } : {}}
            transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
          >
            {renderCake()}
          </motion.div>

          {/* Right Half */}
          <motion.div 
            className="absolute inset-0"
            style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
            animate={isCutting ? { x: 40, rotate: 5, opacity: 0 } : {}}
            transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
          >
            {renderCake()}
          </motion.div>
          
          {/* Slice Animation Overlay */}
          {isCutting && (
            <motion.div 
              className="absolute inset-0 z-20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg viewBox="0 0 240 240" className="w-full h-full">
                <motion.line 
                  x1="120" y1="40" x2="120" y2="200" 
                  stroke="#FCFAFF" strokeWidth="2" strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>
          )}
        </div>

        {/* Fallback button */}
        {showFallback && !canCut && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full flex justify-center z-50"
          >
            <motion.button
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="glass-panel px-6 py-3 rounded-full text-theme-plum font-serif text-sm md:text-base hover:bg-white/40 transition-colors shadow-lg whitespace-nowrap"
              onClick={extinguishAllCandles}
            >
              Can&apos;t blow? Tap here 🕯️
            </motion.button>
          </motion.div>
        )}

        {/* Cut Cake button */}
        {canCut && !isCutting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2"
          >
            <motion.button
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="glass-panel px-6 py-3 rounded-full text-theme-plum font-serif font-bold text-lg hover:bg-white/40 transition-colors shadow-lg"
              onClick={handleCutCake}
            >
              Cut the Cake
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Down arrow scroll indicator (hidden once cut) */}
      {!canCut && (
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-8 text-theme-lilac"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}
