"use client";

import { useState } from "react";
import { QuizState } from "@/lib/types";

interface StepProps {
  state: QuizState;
  updateState: (updates: Partial<QuizState>) => void;
  onNext: () => void;
  isEditMode?: boolean;
}

const VIBES = [
  { id: "Beach & Sun", icon: "🏖", label: "Beach & Sun" },
  { id: "Adventure & Outdoors", icon: "🧗", label: "Adventure & Outdoors" },
  { id: "Food & Culture", icon: "🍜", label: "Food & Culture" },
  { id: "History & Art", icon: "🏛", label: "History & Art" },
  { id: "Nightlife & Social", icon: "🎉", label: "Nightlife & Social" },
  { id: "Road Trip & Scenic", icon: "🛣", label: "Road Trip & Scenic" },
  { id: "Budget Max", icon: "💸", label: "Budget Max" },
  { id: "Wellness & Slow Travel", icon: "🧘", label: "Wellness & Slow Travel" },
  { id: "City Break", icon: "🌆", label: "City Break" },
];

export default function Step5Vibes({ state, updateState, onNext, isEditMode }: StepProps) {
  const [selected, setSelected] = useState<string[]>(state.vibes);

  const toggleVibe = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selected.length > 0) {
      updateState({ vibes: selected });
      onNext();
    }
  };

  return (
    <div className="w-full text-center">
      <h2 className="font-playfair text-3xl md:text-4xl text-sand mb-2">
        What do you want to do?
      </h2>
      <p className="text-sand/60 italic mb-8">Pick everything that calls to you.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {VIBES.map((vibe) => {
          const isSelected = selected.includes(vibe.id);
          const getVibeColorClass = (id: string, isSelected: boolean) => {
            if (!isSelected) return "bg-transparent border-sand/20 text-sand hover:border-sand/50";
            if (["Beach & Sun", "Wellness & Slow Travel"].includes(id)) {
              return "bg-dusty-blue border-dusty-blue text-sand shadow-[0_0_15px_rgba(107,143,168,0.3)]";
            }
            if (["Adventure & Outdoors", "Road Trip & Scenic", "Budget Max"].includes(id)) {
              return "bg-sage border-sage text-charcoal shadow-[0_0_15px_rgba(125,158,140,0.3)]";
            }
            return "bg-terracotta border-terracotta text-sand shadow-[0_0_15px_rgba(193,68,14,0.3)]";
          };
          
          return (
            <button
              key={vibe.id}
              onClick={() => toggleVibe(vibe.id)}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${getVibeColorClass(vibe.id, isSelected)}`}
            >
              <div className="text-3xl">{vibe.icon}</div>
              <div className={`font-medium text-sm ${isSelected ? 'font-bold' : ''}`}>
                {vibe.label}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleContinue}
        disabled={selected.length === 0}
        className="px-8 py-4 bg-terracotta text-sand font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#A3380B] transition-colors"
      >{isEditMode ? "Save & Return to Review →" : "Continue →"}</button>
    </div>
  );
}
