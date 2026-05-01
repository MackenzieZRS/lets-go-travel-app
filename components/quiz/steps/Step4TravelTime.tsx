"use client";

import { useState } from "react";
import { QuizState } from "@/lib/types";

interface StepProps {
  state: QuizState;
  updateState: (updates: Partial<QuizState>) => void;
  onNext: () => void;
  isEditMode?: boolean;
}

export default function Step4TravelTime({ state, updateState, onNext, isEditMode }: StepProps) {
  const [hours, setHours] = useState(state.maxTravelHours);

  const handleContinue = () => {
    updateState({ maxTravelHours: hours });
    onNext();
  };

  const getHelperText = (h: number) => {
    if (h <= 3) return "Think weekend road trips or quick hops.";
    if (h <= 6) return "Cross-country or medium flights.";
    if (h <= 9) return "Going international.";
    return "The world is yours.";
  };

  return (
    <div className="w-full text-center">
      <h2 className="font-playfair text-3xl md:text-4xl text-sand mb-12">
        How long are you willing to travel?
      </h2>
      
      <div className="max-w-md mx-auto mb-16 px-4">
        <div className="relative pt-1">
          <input
            type="range"
            min="1"
            max="12"
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value))}
            className="w-full h-2 bg-sand/20 rounded-lg appearance-none cursor-pointer accent-terracotta"
          />
          <div 
            className="absolute h-2 bg-terracotta rounded-l-lg pointer-events-none top-1"
            style={{ width: `${((hours - 1) / 11) * 100}%` }}
          />
        </div>
        
        <div className="mt-8 text-3xl font-bold text-terracotta">
          Up to {hours} hour{hours > 1 ? "s" : ""}
        </div>
        <div className="mt-2 text-sand/60 italic font-playfair">
          {getHelperText(hours)}
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="px-8 py-4 bg-terracotta text-sand font-bold rounded-full hover:bg-[#A3380B] transition-colors"
      >{isEditMode ? "Save & Return to Review →" : "Continue →"}</button>
    </div>
  );
}
