"use client";

import { useEffect, useState } from "react";
import { Destination } from "@/lib/types";
import { motion } from "framer-motion";
import { getDestinationImage } from "@/lib/destinationImages";

interface DestinationCardProps {
  destination: Destination;
  onClick: () => void;
}

export default function DestinationCard({ destination, onClick }: DestinationCardProps) {
  const imageInfo = getDestinationImage(destination.name);
  const imageUrl = imageInfo.url;

  const primaryVibe = destination.vibeMatches[0] || "";
  let tintClass = "";
  if (["Beach & Sun", "Wellness & Slow Travel"].includes(primaryVibe)) {
    tintClass = "from-dusty-blue/40";
  } else if (["Adventure & Outdoors", "Road Trip & Scenic", "Budget Max"].includes(primaryVibe)) {
    tintClass = "from-sage/40";
  } else if (["Food & Culture", "History & Art", "Nightlife & Social", "City Break"].includes(primaryVibe)) {
    tintClass = "from-terracotta/40";
  }

  return (
    <motion.div 
      className="relative w-full h-[60vh] md:h-[500px] rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Background Image with Parallax setup */}
      <div className="absolute inset-0 bg-charcoal transition-transform duration-700 ease-out group-hover:scale-105">
        <img
          src={imageUrl}
          alt={imageInfo.alt}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80";
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent opacity-90" />
      {tintClass && (
        <div className={`absolute inset-0 bg-gradient-to-t ${tintClass} via-transparent to-transparent mix-blend-color opacity-50`} />
      )}

      {/* Badges top left */}
      <div className="absolute top-4 left-4 flex gap-2">
        <div className={`px-3 py-1 bg-charcoal/80 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border shadow-lg ${
          destination.transportType === 'flight' ? 'text-dusty-blue border-dusty-blue/30' : 
          destination.transportType === 'drive' ? 'text-sage border-sage/30' : 
          'text-sand border-sand/20'
        }`}>
          {destination.transportType === 'flight' ? '✈ Flight' : destination.transportType === 'drive' ? '🚗 Drive' : '✈ / 🚗 Mix'}
        </div>
      </div>

      {/* Content Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col gap-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="font-playfair text-3xl md:text-4xl text-sand mb-2 drop-shadow-md">
              {destination.name}
            </h3>
            <div className="text-sand/80 font-medium text-sm">
              {destination.country}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {destination.vibeMatches.slice(0, 2).map((vibe, idx) => (
            <span key={vibe} className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${idx % 2 === 0 ? 'bg-sage/20 text-sage border-sage/30' : 'bg-dusty-blue/20 text-dusty-blue border-dusty-blue/30'}`}>
              {vibe}
            </span>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-sand/20 flex items-center justify-between">
          <div>
            <div className="text-xs text-sand/60 uppercase tracking-wider mb-1">Est. Total / Person</div>
            <div className="text-xl font-bold text-sand">
              ${destination.estimatedTotalMin} – ${destination.estimatedTotalMax}
            </div>
          </div>
          
          <div className="px-5 py-2.5 rounded-full border border-terracotta text-terracotta font-semibold text-sm group-hover:bg-terracotta group-hover:text-sand transition-colors duration-300">
            View Trip →
          </div>
        </div>
      </div>
    </motion.div>
  );
}
