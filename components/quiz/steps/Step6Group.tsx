"use client";

import { useState } from "react";
import { QuizState } from "@/lib/types";

interface StepProps {
  state: QuizState;
  updateState: (updates: Partial<QuizState>) => void;
  onNext: () => void;
  isEditMode?: boolean;
}

export default function Step6Group({ state, updateState, onNext, isEditMode }: StepProps) {
  const [selected, setSelected] = useState<QuizState["groupType"]>(state.groupType);

  const handleContinue = () => {
    if (selected) {
      updateState({ groupType: selected });
      onNext();
    }
  };

  const options = [
    { id: "solo" as const, label: "Just Me", icon: "🧍" },
    { id: "couple" as const, label: "My Partner", icon: "👫" },
    { id: "friends" as const, label: "Friends", icon: "👯" },
  ];

  return (
    <div className="w-full text-center">
      <h2 className="font-playfair text-3xl md:text-4xl text-sand mb-12">
        Who's coming with you?
      </h2>
      
      <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={`flex-1 p-8 rounded-2xl border-2 transition-all ${
              selected === opt.id
                ? "border-sage bg-sage/10 text-sage shadow-[0_0_15px_rgba(232,150,58,0.2)]"
                : "border-sand/20 bg-charcoal text-sand/60 hover:border-sand/40"
            }`}
          >
            <div className="text-4xl mb-4">{opt.icon}</div>
            <div className="font-bold text-xl">{opt.label}</div>
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected}
        className="px-8 py-4 bg-terracotta text-sand font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#A3380B] transition-colors"
      >{isEditMode ? "Save & Return to Review →" : "Continue →"}</button>
    </div>
  );
}
