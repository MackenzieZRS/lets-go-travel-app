"use client";

import { useState } from "react";
import { QuizState } from "@/lib/types";

interface StepProps {
  state: QuizState;
  updateState: (updates: Partial<QuizState>) => void;
  onNext: () => void;
}

export default function Step8TripLength({ state, updateState, onNext }: StepProps) {
  const [selected, setSelected] = useState<string | null>(state.tripLengthPreference);

  const handleContinue = () => {
    if (selected) {
      updateState({ tripLengthPreference: selected });
      onNext();
    }
  };

  const options = [
    { id: "Weekend (2-3 days)", label: "Weekend (2–3 days)" },
    { id: "Short Trip (4-6 days)", label: "Short Trip (4–6 days)" },
    { id: "Full Week (7 days)", label: "Full Week (7 days)" },
    { id: "Extended (8-14 days)", label: "Extended (8–14 days)" },
  ];

  return (
    <div className="w-full text-center">
      <h2 className="font-playfair text-3xl md:text-4xl text-sand mb-12">
        How long do you want to be away?
      </h2>
      
      <div className="flex flex-col gap-4 max-w-sm mx-auto mb-12">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={`p-4 rounded-full border-2 transition-all font-semibold ${
              selected === opt.id
                ? "border-amber bg-amber text-charcoal shadow-[0_0_15px_rgba(232,150,58,0.3)]"
                : "border-sand/20 bg-charcoal text-sand hover:border-amber/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected}
        className="px-8 py-4 bg-terracotta text-sand font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#A3380B] transition-colors"
      >
        Continue →
      </button>
    </div>
  );
}
