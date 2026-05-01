"use client";

import { useEffect, useState } from "react";
import InteractiveGlobe from "./InteractiveGlobe";

interface LoadingScreenProps {
  isComplete: boolean;    // true when API has responded
  onComplete: () => void; // navigate to results
  origin: string;         // for personalized copy
  budget: number;
}

export default function LoadingScreen({ isComplete, onComplete, origin, budget }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const LOADING_MESSAGES = [
    "Scanning the globe for your perfect trip...",
    `Checking flights from ${origin}...`,
    `Calculating how far $${budget.toLocaleString()} really goes...`,
    "Matching destinations to your vibe...",
    "Finding hidden gems that fit your budget...",
    "Comparing routes and travel times...",
    "Locking in the best options for you...",
    "Almost there — good things take a moment...",
  ];

  // Progress animation
  useEffect(() => {
    let frame: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      let target: number;
      if (elapsed < 8) {
        target = (elapsed / 8) * 55;        // 0→55% in first 8s
      } else if (elapsed < 20) {
        target = 55 + ((elapsed - 8) / 12) * 25; // 55→80% over next 12s
      } else {
        target = 80 + Math.min((elapsed - 20) / 25, 1) * 14; // 80→94% slowly
      }

      setProgress(Math.min(target, 94)); // Hard cap at 94% until API responds
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Jump to 100% only when API responds
  useEffect(() => {
    if (isComplete) {
      setProgress(100);
      setTimeout(() => onComplete(), 800); // brief pause at 100% then navigate
    }
  }, [isComplete, onComplete]);

  // Cycle messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(i => (i + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center"
         style={{ background: 'var(--color-charcoal)' }}>

      {/* Globe — existing Three.js component, keep as is */}
      <div className="w-full max-w-md aspect-square">
        <InteractiveGlobe />
      </div>

      {/* Progress section — sits below globe */}
      <div className="w-full max-w-md px-8 mt-8">

        {/* Cycling copy — animate between messages with fade */}
        <p 
          key={messageIndex} // key change triggers re-mount for fade animation
          className="text-center font-inter text-base mb-6 animate-fade-in"
          style={{ color: 'var(--color-sand-dark)' }}
        >
          {LOADING_MESSAGES[messageIndex]}
        </p>

        {/* Progress bar track */}
        <div 
          className="w-full h-1 rounded-full overflow-hidden"
          style={{ background: 'var(--color-charcoal-mid)' }}
        >
          {/* Progress bar fill */}
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--color-terracotta), var(--color-sage))'
            }}
          />
        </div>

        {/* Percentage — subtle, small */}
        <p 
          className="text-center text-xs mt-2 font-inter"
          style={{ color: 'var(--color-charcoal-mid)' }}
        >
          {Math.round(progress)}%
        </p>

      </div>
    </div>
  );
}
