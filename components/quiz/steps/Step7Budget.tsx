"use client";

import { useState } from "react";
import { QuizState } from "@/lib/types";

interface StepProps {
  state: QuizState;
  updateState: (updates: Partial<QuizState>) => void;
  onNext: () => void;
  isEditMode?: boolean;
}

export default function Step7Budget({ state, updateState, onNext, isEditMode }: StepProps) {
  const [budget, setBudget] = useState(state.budget.toString());

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const numBudget = parseInt(budget);
    if (!isNaN(numBudget) && numBudget >= 200 && numBudget <= 20000) {
      updateState({ budget: numBudget });
      onNext();
    }
  };

  return (
    <div className="w-full text-center">
      <h2 className="font-playfair text-3xl md:text-4xl text-sand mb-2">
        What's your total trip budget?
      </h2>
      <p className="text-terracotta italic mb-12">Per person. Flights + hotels. We keep it real.</p>
      
      <form onSubmit={handleContinue} className="max-w-xs mx-auto mb-12">
        <div className="relative flex items-center justify-center">
          <span className="text-sand text-5xl font-bold mr-2">$</span>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            min="200"
            max="20000"
            className="w-full bg-transparent border-b-2 border-terracotta pb-2 text-5xl font-bold text-sand focus:outline-none focus:border-terracotta transition-colors text-center p-0 m-0"
            autoFocus
          />
        </div>
        <p className="text-sand/50 text-sm mt-6">
          Most trips in our range: $500 – $5,000
        </p>
        
        <button
          type="submit"
          disabled={!budget || parseInt(budget) < 200 || parseInt(budget) > 20000}
          className="mt-12 px-8 py-4 bg-terracotta text-sand font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#A3380B] transition-colors w-full"
        >{isEditMode ? "Save & Return to Review →" : "Review My Plan →"}</button>
      </form>
    </div>
  );
}
