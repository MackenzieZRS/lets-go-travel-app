"use client";

import { useState } from "react";
import { QuizState } from "@/lib/types";

interface StepProps {
  state: QuizState;
  updateState: (updates: Partial<QuizState>) => void;
  onNext: () => void;
  isEditMode?: boolean;
}

export default function Step1Location({ state, updateState, onNext, isEditMode }: StepProps) {
  const [input, setInput] = useState(state.origin);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length > 2) {
      updateState({ origin: input.trim() });
      onNext();
    }
  };

  return (
    <div className="w-full text-center">
      <h2 className="font-playfair text-4xl md:text-5xl text-sand mb-12">
        Where are you starting from?
      </h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. New York, NY"
          className="w-full bg-charcoal border-b-2 border-sand/30 pb-4 text-3xl text-center text-sand focus:outline-none focus:border-terracotta transition-colors placeholder:text-sand/20"
          autoFocus
        />
        <button
          type="submit"
          disabled={input.trim().length < 3}
          className="mt-12 w-full md:w-auto px-8 py-4 bg-terracotta text-sand font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#A3380B] transition-colors"
        >{isEditMode ? "Save & Return to Review →" : "Continue →"}</button>
      </form>
    </div>
  );
}
