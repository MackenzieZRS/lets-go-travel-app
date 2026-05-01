"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Destination, QuizState } from "@/lib/types";
import ResultsGrid from "@/components/results/ResultsGrid";
import DestinationModal from "@/components/results/DestinationModal";
import Link from "next/link";
import { getDestinationImage } from "@/lib/destinationImages";

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<{ destinations: Destination[] } | null>(null);
  const [searchParams, setSearchParams] = useState<QuizState | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [imagesReady, setImagesReady] = useState(false);
  
  const formattedDates = searchParams?.departureDate && searchParams?.returnDate 
    ? `${new Date(searchParams.departureDate).toLocaleDateString()} - ${new Date(searchParams.returnDate).toLocaleDateString()}` 
    : '';

  useEffect(() => {
    const rawResults = sessionStorage.getItem("letsgo_results");
    const rawSearch = sessionStorage.getItem("letsgo_search");
    
    if (rawResults) {
      const parsedResults = JSON.parse(rawResults);
      setResults(parsedResults);
      
      const preloadImages = async (destinations: Destination[]) => {
        const promises = destinations.map(dest => {
          return new Promise<void>((resolve) => {
            const { url } = getDestinationImage(dest.name);
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve(); // resolve anyway — onError fallback handles it
            img.src = url;
          });
        });
        await Promise.all(promises);
      };

      preloadImages(parsedResults.destinations || []).then(() => {
        setImagesReady(true);
      });
    } else {
      // In a real app, we might want to redirect to home if no results are found
      // router.push("/");
      // For demo purposes, we will just show empty or mock state
    }
    
    if (rawSearch) {
      setSearchParams(JSON.parse(rawSearch));
    }
  }, [router]);

  if (!results) {
    return (
      <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center p-6">
        <div className="text-sand text-2xl font-playfair animate-pulse">Loading your results...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-charcoal text-sand selection:bg-terracotta/30 pb-20">
      <header className="sticky top-0 z-40 bg-charcoal/80 backdrop-blur-md border-b border-sand/10 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-playfair text-2xl font-bold tracking-wider text-sand hover:text-terracotta transition-colors">
          Let's Go ✈
        </Link>
        <Link 
          href="/"
          className="px-4 py-2 border border-dusty-blue text-dusty-blue hover:bg-dusty-blue hover:text-charcoal rounded-full text-sm font-semibold transition-colors"
        >
          New Search
        </Link>
      </header>
      
      {searchParams && (
        <div className="text-center py-12 px-6">
          <p 
            className="text-sm uppercase tracking-widest font-inter mb-4"
            style={{ color: 'var(--color-sand-dark)' }}
          >
            {searchParams.origin} · {formattedDates} · ${searchParams.budget.toLocaleString()}
          </p>
          <h1 
            className="font-playfair leading-tight mb-3"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--color-sand)' }}
          >
            Here's where life takes you.
          </h1>
          <p 
            className="font-inter text-base max-w-sm mx-auto"
            style={{ color: 'var(--color-sand-dark)' }}
          >
            {results.destinations?.length || 0} trips curated for your budget and vibe.
          </p>
        </div>
      )}

      <div className={`container mx-auto px-4 pb-12 transition-opacity duration-700 ${imagesReady ? 'opacity-100' : 'opacity-0'}`}>
        
        <ResultsGrid 
          destinations={results.destinations || []} 
          onSelect={(dest) => setSelectedDestination(dest)} 
        />
      </div>

      {selectedDestination && (
        <DestinationModal 
          destination={selectedDestination} 
          onClose={() => setSelectedDestination(null)} 
        />
      )}
    </main>
  );
}
