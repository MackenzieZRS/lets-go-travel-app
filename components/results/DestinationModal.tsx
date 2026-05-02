"use client";

import { useEffect, useState } from "react";
import { Destination } from "@/lib/types";
import { motion } from "framer-motion";
import { X, Share2, MapPin, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { getDestinationImage } from "@/lib/destinationImages";

interface DestinationModalProps {
  destination: Destination;
  onClose: () => void;
}

export default function DestinationModal({ destination, onClose }: DestinationModalProps) {
  const [copied, setCopied] = useState(false);
  const imageInfo = getDestinationImage(destination.name);
  const imageUrl = imageInfo.url;

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, [destination.name, destination.country]);

  const handleShare = () => {
    const text = `Let's go to ${destination.name}, ${destination.country}! Estimated budget: $${destination.estimatedTotalMin}-$${destination.estimatedTotalMax}.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 flex flex-col bg-charcoal overflow-y-auto"
    >
      {/* Hero Section */}
      <div className="relative w-full h-[40vh] min-h-[300px] shrink-0">
        <div className="absolute inset-0">
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
          <div className="absolute inset-0 bg-charcoal/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent" />
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-charcoal/40 backdrop-blur-md rounded-full text-sand hover:bg-charcoal/60 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-playfair text-5xl md:text-7xl text-sand font-bold mb-2 drop-shadow-lg">
              {destination.name}
            </h2>
            <div className="flex items-center gap-2 text-sand/90 text-lg md:text-xl font-medium">
              <MapPin className="w-5 h-5 text-terracotta" />
              {destination.country} • {destination.region}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto max-w-4xl px-6 py-12">
        {/* Overview Strip */}
        <div className="flex flex-wrap items-center gap-6 mb-12 pb-8 border-b border-sand/10">
          <div className="flex items-center gap-2 text-sand/80">
            <Clock className="w-5 h-5 text-terracotta" />
            <span className="font-semibold uppercase tracking-wide text-sm">
              {destination.transportType === 'flight' 
                ? `~${destination.estimatedFlightHours}h flight` 
                : destination.transportType === 'drive'
                  ? `~${destination.estimatedDriveHours}h drive`
                  : 'Mixed transport'}
            </span>
          </div>
          
          <div className="h-4 w-px bg-sand/20 hidden md:block"></div>
          
          <div className="flex gap-2">
            {destination.vibeMatches?.map((vibe, idx) => (
              <span key={vibe} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${idx % 2 === 0 ? 'bg-sage text-charcoal' : 'bg-dusty-blue text-sand'}`}>
                {vibe}
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Main Content (Left Column) */}
          <div className="md:col-span-3 space-y-12">
            
            <section>
              <h3 className="font-playfair text-3xl text-sand mb-4">Why it fits you</h3>
              <p className="text-sand/80 text-lg leading-relaxed">
                {destination.whyItFitsYou}
              </p>
            </section>

            <section>
              <h3 className="font-playfair text-3xl text-sand mb-6">Book Your Flights</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={destination.googleFlightsUrl || "https://flights.google.com"} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 px-6 py-4 border-2 border-dusty-blue text-sand font-bold rounded-xl text-center hover:bg-dusty-blue hover:text-charcoal transition-colors"
                >
                  Search Google Flights →
                </a>
                <a 
                  href="https://kayak.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 px-6 py-4 border-2 border-sand/30 text-sand font-bold rounded-xl text-center hover:border-sand hover:bg-sand/5 transition-colors"
                >
                  Search on Kayak →
                </a>
              </div>
            </section>

            <section>
              <h3 className="font-playfair text-3xl text-sand mb-6">Where to Stay</h3>
              <div className="grid gap-4">
                <div className="p-5 rounded-2xl bg-sand/5 border border-sand/10 flex justify-between items-center group hover:bg-sand/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🏨</div>
                    <div>
                      <div className="font-bold text-sand">Hotels</div>
                      <div className="text-sm text-sand/60">Mid-range comfort</div>
                    </div>
                  </div>
                  <a href={destination.bookingComUrl || "https://booking.com"} target="_blank" rel="noreferrer" className="text-terracotta font-semibold group-hover:underline">
                    Browse Booking.com →
                  </a>
                </div>
                
                <div className="p-5 rounded-2xl bg-sand/5 border border-sand/10 flex justify-between items-center group hover:bg-sand/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🛏</div>
                    <div>
                      <div className="font-bold text-sand">Hostels</div>
                      <div className="text-sm text-sand/60">Budget friendly</div>
                    </div>
                  </div>
                  <a href="https://hostelworld.com" target="_blank" rel="noreferrer" className="text-terracotta font-semibold group-hover:underline">
                    Browse Hostelworld →
                  </a>
                </div>

                <div className="p-5 rounded-2xl bg-sand/5 border border-sand/10 flex justify-between items-center group hover:bg-sand/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🏠</div>
                    <div>
                      <div className="font-bold text-sand">Airbnb</div>
                      <div className="text-sm text-sand/60">Live like a local</div>
                    </div>
                  </div>
                  <a href="https://airbnb.com" target="_blank" rel="noreferrer" className="text-terracotta font-semibold group-hover:underline">
                    Browse Airbnb →
                  </a>
                </div>
              </div>
            </section>

            <section>
              <details className="group">
                <summary className="font-playfair text-2xl text-sand cursor-pointer list-none flex items-center justify-between pb-4 border-b border-sand/20">
                  <span>Sample 3-Day Itinerary</span>
                  <span className="text-terracotta group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="pt-8 space-y-8 pl-4 border-l-2 border-amber/30 ml-2">
                  {destination.sampleItinerary?.map((day, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute w-3 h-3 bg-terracotta rounded-full -left-[23px] top-1.5 ring-4 ring-charcoal" />
                      <h4 className="font-bold text-terracotta mb-3">Day {day.day}</h4>
                      <ul className="space-y-3">
                        {day.activities.map((act, i) => (
                          <li key={i} className="text-sand/80 flex items-start gap-3">
                            <span className="text-terracotta mt-1">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            </section>

          </div>

          {/* Sidebar (Right Column) */}
          <div className="md:col-span-2 space-y-6">
            <div className="sticky top-6">
              <div className="p-8 rounded-3xl bg-sand border-l-4 border-terracotta shadow-xl">
                <h3 className="font-playfair text-2xl text-charcoal mb-6 font-bold">Cost Breakdown</h3>
                
                <div className="space-y-4 text-charcoal mb-8 font-medium">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-semibold"><span>✈️</span> Flights/Travel</span>
                    <span className="text-terracotta font-bold">${destination.estimatedFlightCostMin} - ${destination.estimatedFlightCostMax}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-semibold"><span>🏨</span> Hotels</span>
                    <span className="text-terracotta font-bold">${destination.estimatedHotelCostMin} - ${destination.estimatedHotelCostMax}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-semibold"><span>🍽</span> Food & Activities</span>
                    <span className="text-terracotta font-bold">${destination.estimatedFoodActivitiesCostMin} - ${destination.estimatedFoodActivitiesCostMax}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-charcoal/10">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-charcoal font-bold uppercase tracking-wider text-sm">Total Estimate</span>
                    <span className="font-playfair text-3xl text-terracotta font-bold">
                      ${destination.estimatedTotalMin} - ${destination.estimatedTotalMax}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/50 leading-relaxed">
                    *Estimates per person based on typical prices. Click links for live pricing.
                  </p>
                </div>
              </div>

              <button 
                onClick={handleShare}
                className="w-full mt-6 py-4 flex items-center justify-center gap-2 border-2 border-sage bg-charcoal-light text-sand font-bold rounded-2xl hover:bg-sage hover:text-charcoal transition-colors"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-sage" /> : <Share2 className="w-5 h-5" />}
                {copied ? "Copied to clipboard!" : "Share This Trip"}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}
