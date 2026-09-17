"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import photo1 from "../../public/images/photo1.jpg";
import photo2 from "../../public/images/photo2.jpg";
import photo3 from "../../public/images/photo3.jpg";
import photo4 from "../../public/images/photo4.jpg";
import photo5 from "../../public/images/photo5.jpg";
import photo6 from "../../public/images/photo6.jpg";
import photo7 from "../../public/images/photo7.jpg";
import photo8 from "../../public/images/photo8.jpg";
import photo9 from "../../public/images/photo9.jpg";
import photo10 from "../../public/images/photo10.jpg";

const postcards = [
  {
    id: 1,
    imageSrc: photo1,
    note: "I am all yours, now, tomorrow and forever",
    rotation: Math.random() * 12 - 6,
  },
  {
    id: 2,
    imageSrc: photo2,
    note: "I love Exploring new places with you, Can't wait to explore the wholeee world with you hehe",
    rotation: Math.random() * 12 - 6,
  },
  {
    id: 3,
    imageSrc: photo3,
    note: "Talking to you is the favourite part of my day",
    rotation: Math.random() * 12 - 6,
  },
  {
    id: 4,
    imageSrc: photo4,
    note: "Always drunk on you hehe",
    rotation: Math.random() * 12 - 6,
  },
  {
    id: 5,
    imageSrc: photo5,
    note: "Loving you is the greatest adventure ",
    rotation: Math.random() * 12 - 6,
  },
  {
    id: 6,
    imageSrc: photo6,
    note: "Even on my bad days, you're still the reason I smile",
    rotation: Math.random() * 12 - 6,
  },
  {
    id: 7,
    imageSrc: photo7,
    note: "You are artwork 🤌, I could admire you for a thousand lifetimes",
    rotation: Math.random() * 12 - 6,
  },
  {
    id: 8,
    imageSrc: photo8,
    note: "I would choose you in every universe 🫶",
    rotation: Math.random() * 12 - 6,
  },
  {
    id: 9,
    imageSrc: photo9,
    note: "I am so proud of the person you are, you are the beshttt <3",
    rotation: Math.random() * 12 - 6,
  },
  {
    id: 10,
    imageSrc: photo10,
    note: "No matter how much I say I love you I will ALWAYS Love you wayyyy moreee.",
    rotation: Math.random() * 12 - 6,
  }
];

export default function Scene2() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <motion.div 
      className="min-h-screen w-full flex flex-col items-center py-20 px-4 md:px-8 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl text-theme-plum mb-12 text-center drop-shadow-sm px-4">
        Ussss Woohooooo
      </h2>

      {/* Scattered Layout Container */}
      <div className="w-full max-w-6xl mx-auto flex flex-wrap justify-center gap-8 md:gap-12 pb-32">
        {mounted && postcards.map((card) => {
          const isFlipped = activeCard === card.id;

          return (
            <motion.div
              key={card.id}
              className="relative w-64 h-80 md:w-72 md:h-96 cursor-pointer preserve-3d perspective-1000"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              style={{ rotate: isFlipped ? 0 : card.rotation }}
              whileHover={!isFlipped ? { 
                scale: 1.05, 
                rotate: 0, 
                zIndex: 10,
                transition: { duration: 0.3 } 
              } : {}}
              animate={isFlipped ? { zIndex: 20, scale: 1.1 } : { zIndex: 1, scale: 1 }}
              onClick={() => setActiveCard(isFlipped ? null : card.id)}
            >
              {/* Inner Card wrapper for 3D flip */}
              <motion.div 
                className="w-full h-full relative preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              >
                {/* Front of postcard (Photo) */}
                <div className="absolute inset-0 backface-hidden bg-white p-4 pb-16 soft-shadow rounded-sm flex flex-col items-center justify-center border border-gray-100">
                  {/* Pin/Tape detail */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-theme-cream/80 border border-theme-gold/20 -rotate-2 opacity-80 z-10 shadow-sm" />
                  
                  <div className="relative w-full h-full bg-gray-100 overflow-hidden">
                    <Image
                      src={card.imageSrc}
                      alt={`Memory ${card.id}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 300px"
                      onError={(e) => {
                        // Fallback if image doesn't exist yet
                        (e.target as HTMLElement).style.display = 'none';
                        (e.target as HTMLElement).parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400 font-sans text-sm">photo${card.id}.jpg</div>`;
                      }}
                    />
                  </div>
                </div>

                {/* Back of postcard (Note) */}
                <div 
                  className="absolute inset-0 backface-hidden bg-white p-8 soft-shadow rounded-sm flex items-center justify-center border border-gray-100"
                  style={{ transform: "rotateY(180deg)" }}
                >
                   {/* Postage stamp detail */}
                   <div className="absolute top-4 right-4 w-10 h-12 border-2 border-dashed border-gray-300 flex items-center justify-center opacity-40">
                     <span className="text-[10px] font-sans text-gray-400">STAMP</span>
                   </div>

                   {/* Lines for writing */}
                   <div className="absolute inset-0 top-20 bottom-10 left-8 right-8 flex flex-col justify-between opacity-10 pointer-events-none">
                     {[...Array(6)].map((_, i) => (
                       <div key={i} className="w-full border-b border-theme-plum"></div>
                     ))}
                   </div>

                   <p className="font-script text-xl md:text-2xl lg:text-3xl text-theme-dark text-center leading-relaxed relative z-10 rotate-[-2deg]">
                     {card.note}
                   </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Closing Section */}
      <motion.div 
        className="w-full max-w-2xl mx-auto text-center pb-32"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-theme-plum mb-6 px-4">
          Happy Birthdayyy, my loveeee.
        </h3>
        <p className="font-sans text-base sm:text-lg text-theme-dark/80 px-4">
          {/* TODO: Customize closing message */}
          I am so gratefull to have you in my life, you are the best thing that has happen to me in my life ong. Hope this is the only year we are celebrating our birthdays apart.
        </p>
        
        <motion.div 
          className="mt-12 text-theme-gold flex justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
