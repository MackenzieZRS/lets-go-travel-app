"use client";

import { QuizState } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingScreen from "@/components/loading/LoadingScreen";
import { getDestinationImage } from "@/lib/destinationImages";

interface StepProps {
  state: QuizState;
  onEdit: (step: number) => void;
}

export default function StepReview({ state, onEdit }: StepProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isApiComplete, setIsApiComplete] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setIsApiComplete(false);
    
    // Store search params in localStorage or sessionStorage to pass to results page
    // Or we can fetch right here and pass the results via state/context, but localStorage is easiest for page transitions
    sessionStorage.setItem("letsgo_search", JSON.stringify(state));
    
    try {
      // Initiate search API call
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch results from API");
      }
      
      const data = await res.json();
      sessionStorage.setItem("letsgo_results", JSON.stringify(data));
      
      // Preload images before completing loading screen
      const preloadImages = async (destinations: any[]) => {
        const promises = destinations.map(dest => {
          return new Promise<void>((resolve) => {
            const { url } = getDestinationImage(dest.name);
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = url;
          });
        });
        await Promise.all(promises);
      };

      await preloadImages(data.destinations || []);
      
      setIsApiComplete(true);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      // Would show a toast error here
      alert("Something went wrong. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] bg-charcoal flex flex-col items-center justify-center">
        <LoadingScreen 
          origin={state.origin} 
          budget={state.budget}
          isComplete={isApiComplete} 
          onComplete={() => router.push("/results")} 
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <h2 className="font-playfair text-3xl md:text-4xl text-center text-sand mb-8">
        Review Your Trip
      </h2>
      
      <div className="bg-charcoal border border-sand/10 rounded-2xl p-6 mb-8 space-y-4">
        <div className="flex justify-between items-center border-b border-sand/10 pb-4">
          <div>
            <div className="text-xs text-terracotta uppercase tracking-wider mb-1">Origin</div>
            <div className="text-sand font-medium">{state.origin}</div>
          </div>
          <button onClick={() => onEdit(1)} className="text-sm text-sand/50 hover:text-terracotta">Edit</button>
        </div>

        <div className="flex justify-between items-center border-b border-sand/10 pb-4">
          <div>
            <div className="text-xs text-terracotta uppercase tracking-wider mb-1">Dates</div>
            <div className="text-sand font-medium">
              {state.departureDate?.toLocaleDateString()} – {state.returnDate?.toLocaleDateString()}
            </div>
          </div>
          <button onClick={() => onEdit(2)} className="text-sm text-sand/50 hover:text-terracotta">Edit</button>
        </div>

        <div className="flex justify-between items-center border-b border-sand/10 pb-4">
          <div>
            <div className="text-xs text-terracotta uppercase tracking-wider mb-1">Transport</div>
            <div className="text-sand font-medium capitalize">
              {state.transportModes.join(" & ")} (up to {state.maxTravelHours} hrs)
            </div>
          </div>
          <button onClick={() => onEdit(3)} className="text-sm text-sand/50 hover:text-terracotta">Edit</button>
        </div>

        <div className="flex justify-between items-center border-b border-sand/10 pb-4">
          <div>
            <div className="text-xs text-terracotta uppercase tracking-wider mb-1">Vibes</div>
            <div className="text-sand font-medium">
              {state.vibes.join(", ")}
            </div>
          </div>
          <button onClick={() => onEdit(5)} className="text-sm text-sand/50 hover:text-terracotta">Edit</button>
        </div>

        <div className="flex justify-between items-center border-b border-sand/10 pb-4">
          <div>
            <div className="text-xs text-terracotta uppercase tracking-wider mb-1">Group</div>
            <div className="text-sand font-medium capitalize">
              {state.groupType}
            </div>
          </div>
          <button onClick={() => onEdit(6)} className="text-sm text-sand/50 hover:text-terracotta">Edit</button>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-terracotta uppercase tracking-wider mb-1">Budget</div>
            <div className="text-sand font-bold text-xl">
              ${state.budget.toLocaleString()}
            </div>
          </div>
          <button onClick={() => onEdit(7)} className="text-sm text-sand/50 hover:text-terracotta">Edit</button>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full px-8 py-5 bg-terracotta text-sand text-lg font-bold rounded-full shadow-[0_0_20px_rgba(193,68,14,0.3)] hover:shadow-[0_0_30px_rgba(193,68,14,0.5)] transition-all"
      >
        Find My Trip ✈
      </button>
    </div>
  );
}
