"use client";

import { Destination } from "@/lib/types";
import DestinationCard from "./DestinationCard";
import { motion } from "framer-motion";

interface ResultsGridProps {
  destinations: Destination[];
  onSelect: (dest: Destination) => void;
}

export default function ResultsGrid({ destinations, onSelect }: ResultsGridProps) {
  // Determine layout class based on number of results
  // For 3 items: 3 equal columns
  // For other numbers, we can use a dynamic grid
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
      {destinations.map((dest, index) => (
        <motion.div
          key={dest.name}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
          className={`h-full ${
            destinations.length > 3 && index % 3 === 0 ? "md:col-span-2 lg:col-span-2" : ""
          }`}
        >
          <DestinationCard destination={dest} onClick={() => onSelect(dest)} />
        </motion.div>
      ))}
    </div>
  );
}
