"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HeroContentProps {
  onStartQuiz: () => void;
}

export default function HeroContent({ onStartQuiz }: HeroContentProps) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="font-playfair text-[clamp(72px,8vw,120px)] text-sand tracking-wide leading-none mb-4 drop-shadow-lg">
          Let's Go
        </h1>
        <p className="text-amber italic text-2xl font-light mb-8">
          Your next adventure is waiting.
        </p>
        <p className="text-sand/80 text-base max-w-[480px] mx-auto mb-10 leading-relaxed">
          Tell us your budget, your vibe, and your dates — we'll find where you're going.
        </p>
      </motion.div>

      <motion.button
        onClick={onStartQuiz}
        className="bg-terracotta text-sand font-bold text-lg px-8 py-4 rounded-full shadow-[0_0_20px_rgba(193,68,14,0.3)] hover:shadow-[0_0_30px_rgba(193,68,14,0.5)] transition-all"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        Plan My Trip →
      </motion.button>

      <motion.div
        className="absolute bottom-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <ChevronDown className="w-8 h-8 text-amber/50" />
      </motion.div>
    </div>
  );
}
