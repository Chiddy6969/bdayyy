"use client";

import { useState } from "react";
import MusicPlayer from "@/components/MusicPlayer";
import Background from "@/components/Background";
import Scene1 from "@/components/Scene1";
import Scene2 from "@/components/Scene2";

export default function Home() {
  const [scene, setScene] = useState<1 | 2>(1);

  return (
    <main className="relative w-full h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-br from-theme-cream to-[#F3EEF9]">
      <Background />
      <MusicPlayer />
      
      {/* We only render Scene 1 if it's active. Once cut, it fades out itself and calls setScene(2) */}
      {scene === 1 && (
        <Scene1 onCakeCut={() => setScene(2)} />
      )}

      {/* Scene 2 mounts and fades in automatically via its own Framer Motion animation */}
      {scene === 2 && (
        <Scene2 />
      )}
    </main>
  );
}
