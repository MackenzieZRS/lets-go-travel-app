"use client";

import { useState } from "react";
import { QuizState } from "@/lib/types";

interface StepProps {
  state: QuizState;
  updateState: (updates: Partial<QuizState>) => void;
  onNext: () => void;
}

export default function Step9Passport({ state, updateState, onNext }: StepProps) {
  const [selected, setSelected] = useState<boolean | null>(state.hasPassport);

  const handleContinue = () => {
    if (selected !== null) {
      updateState({ hasPassport: selected });
      onNext();
    }
  };

  return (
    <div className="w-full text-center">
      <h2 className="font-playfair text-3xl md:text-4xl text-sand mb-2">
        Do you have a valid passport?
      </h2>
      <p className="text-amber italic mb-12">This helps us filter destinations that require one.</p>
      
      <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
        <button
          onClick={() => setSelected(true)}
          className={`flex-1 p-8 rounded-2xl border-2 transition-all ${
            selected === true
              ? "border-amber bg-amber/10 text-amber shadow-[0_0_15px_rgba(232,150,58,0.2)]"
              : "border-sand/20 bg-charcoal text-sand/60 hover:border-sand/40"
          }`}
        >
          <div className="text-4xl mb-4">🛂</div>
          <div className="font-bold text-xl">Yes, I have one ✓</div>
        </button>

        <button
          onClick={() => setSelected(false)}
          className={`flex-1 p-8 rounded-2xl border-2 transition-all ${
            selected === false
              ? "border-amber bg-amber/10 text-amber shadow-[0_0_15px_rgba(232,150,58,0.2)]"
              : "border-sand/20 bg-charcoal text-sand/60 hover:border-sand/40"
          }`}
        >
          <div className="text-4xl mb-4">🇺🇸</div>
          <div className="font-bold text-xl">No, keep it domestic</div>
        </button>
      </div>

      <button
        onClick={handleContinue}
        disabled={selected === null}
        className="px-8 py-4 bg-terracotta text-sand font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#A3380B] transition-colors"
      >
        Review My Plan →
      </button>
    </div>
  );
}
