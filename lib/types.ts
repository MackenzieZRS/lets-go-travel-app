export interface Destination {
  name: string;
  country: string;
  region: string;
  transportType: "flight" | "drive" | "both";
  estimatedFlightHours?: number;
  estimatedDriveHours?: number;
  estimatedFlightCostMin: number;
  estimatedFlightCostMax: number;
  estimatedHotelCostMin: number;
  estimatedHotelCostMax: number;
  estimatedFoodActivitiesCostMin: number;
  estimatedFoodActivitiesCostMax: number;
  estimatedTotalMin: number;
  estimatedTotalMax: number;
  whyItFitsYou: string; // 2 sentences, warm casual tone
  vibeScore: number; // 0-100
  vibeMatches: string[]; // e.g. ["Beach & Sun", "Foodie"]
  budgetFit: boolean;
  budgetOverage?: number;
  sampleItinerary: {
    day: number;
    activities: string[];
  }[];
  googleFlightsUrl: string;
  bookingComUrl: string;
  unsplashQuery: string; // optimized search term for Unsplash
}

export interface QuizState {
  origin: string;
  departureDate: Date | null;
  returnDate: Date | null;
  transportModes: ("flight" | "drive")[];
  maxTravelHours: number;
  vibes: string[];
  groupType: "solo" | "couple" | "friends" | null;
  budget: number;
  tripLengthPreference: string | null;
  hasPassport: boolean | null;
}
