"use client";

import { useState } from "react";
import { QuizState } from "@/lib/types";

interface StepProps {
  state: QuizState;
  updateState: (updates: Partial<QuizState>) => void;
  onNext: () => void;
  isEditMode?: boolean;
}

export default function Step3Transport({ state, updateState, onNext, isEditMode }: StepProps) {
  const [selected, setSelected] = useState<("flight" | "drive")[]>(state.transportModes);

  const toggleMode = (mode: "flight" | "drive") => {
    setSelected((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const handleContinue = () => {
    if (selected.length > 0) {
      updateState({ transportModes: selected });
      onNext();
    }
  };

  return (
    <div className="w-full text-center">
      <h2 className="font-playfair text-3xl md:text-4xl text-sand mb-12">
        How do you want to get there?
      </h2>
      
      <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
        <button
          onClick={() => toggleMode("flight")}
          className={`flex-1 p-8 rounded-2xl border-2 transition-all ${
            selected.includes("flight")
              ? "border-sage bg-sage/10 text-sage shadow-[0_0_15px_rgba(232,150,58,0.2)]"
              : "border-sand/20 bg-charcoal text-sand/60 hover:border-sand/40"
          }`}
        >
          <div className="text-4xl mb-4">✈️</div>
          <div className="font-bold text-xl">Flying</div>
        </button>

        <button
          onClick={() => toggleMode("drive")}
          className={`flex-1 p-8 rounded-2xl border-2 transition-all ${
            selected.includes("drive")
              ? "border-sage bg-sage/10 text-sage shadow-[0_0_15px_rgba(232,150,58,0.2)]"
              : "border-sand/20 bg-charcoal text-sand/60 hover:border-sand/40"
          }`}
        >
          <div className="text-4xl mb-4">🚗</div>
          <div className="font-bold text-xl">Driving</div>
        </button>
      </div>

      <button
        onClick={handleContinue}
        disabled={selected.length === 0}
        className="px-8 py-4 bg-terracotta text-sand font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#A3380B] transition-colors"
      >{isEditMode ? "Save & Return to Review →" : "Continue →"}</button>
    </div>
  );
}
