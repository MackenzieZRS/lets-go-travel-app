"use client";

import { useState } from "react";
import FlightPathCanvas from "@/components/hero/FlightPathCanvas";
import HeroContent from "@/components/hero/HeroContent";
import QuizModal from "@/components/quiz/QuizModal";

export default function Home() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-charcoal overflow-hidden">
      <FlightPathCanvas />
      <HeroContent onStartQuiz={() => setIsQuizOpen(true)} />
      
      {isQuizOpen && (
        <QuizModal onClose={() => setIsQuizOpen(false)} />
      )}
    </main>
  );
}
