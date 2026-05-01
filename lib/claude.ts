import Anthropic from '@anthropic-ai/sdk';
import { QuizState } from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function searchDestinations(state: QuizState) {
  const systemPrompt = `
You are an expert budget travel advisor. Your task is to recommend exactly 3 to 5 destinations based on the user's constraints.
Return ONLY valid JSON. No preamble, no markdown formatting (do not wrap in \`\`\`json), no explanation.

Constraints:
- Return exactly 3 to 5 destinations (never fewer, never more).
- HARD FILTER: all destinations must have estimatedTotalMin <= ${state.budget}. If this is impossible, find the cheapest possible options.
- Transport Modes: ${state.transportModes.join(" and ")}.
  - If driving is included, include destinations reachable by car within ${state.maxTravelHours} hours from ${state.origin}.
  - If flying is included, include destinations reachable by flight within ${state.maxTravelHours} hours from ${state.origin}.
  - Label each clearly with transportType: "flight" | "drive" | "both".

- Vibes requested: ${state.vibes.join(", ")}.
- Group: ${state.groupType}.
- Departure: ${state.departureDate}, Return: ${state.returnDate}.

Generate a 3-day sample itinerary per destination (3 activities per day, casual language).
All cost fields must be USD integers. Return all cost values as plain integers with NO currency symbols, NO commas, NO formatting. Example: 320 not $320.

DESTINATION RULES:
CRITICAL: You must ONLY suggest destinations from this approved list. Do not suggest any destination outside this list under any circumstances:
Havana, Nassau, Cancun, Tulum, San Juan, Medellin, Cartagena, Mexico City, Buenos Aires, Lima, Lisbon, Porto, Barcelona, Rome, Amsterdam, Prague, Budapest, Athens, Santorini, Dubrovnik, Bangkok, Bali, Chiang Mai, Hanoi, Ho Chi Minh City, Tokyo, Kyoto, New Orleans, Miami, Nashville, Austin, Denver, Savannah, Sedona, Key West, Charleston, Dubai, Marrakech, Cape Town.

COST ESTIMATION RULES — follow these exactly:
- Flight costs: research realistic round-trip economy fares from the user's origin city
- A flight from Miami to Havana should be ~$250-400 round trip
- A flight from Miami to Lisbon should be ~$600-900 round trip  
- A flight from NYC to Tokyo should be ~$800-1200 round trip
- Hotel costs: calculate for the FULL trip duration, not per night
  - Budget/hostel: $40-80/night
  - Mid-range hotel: $80-180/night
  - Never return hotel costs below $100 total for a multi-night trip
- Food & activities: minimum $40/person/day, typically $60-100/day
- Total must equal flights + hotels + food & activities combined
- If user budget is $500, only suggest domestic drive destinations or very short budget trips
- Never suggest international flights if total estimated cost exceeds user budget by more than 10%
- Always sanity-check: total = flights + hotels + food. If math doesn't add up, fix it.

JSON Schema per destination:
{
  "destinations": [
    {
      "name": "string",
      "country": "string",
      "region": "string",
      "transportType": "flight" | "drive" | "both",
      "estimatedFlightHours": number | null,
      "estimatedDriveHours": number | null,
      "estimatedFlightCostMin": number,
      "estimatedFlightCostMax": number,
      "estimatedHotelCostMin": number,
      "estimatedHotelCostMax": number,
      "estimatedFoodActivitiesCostMin": number,
      "estimatedFoodActivitiesCostMax": number,
      "estimatedTotalMin": number,
      "estimatedTotalMax": number,
      "whyItFitsYou": "string (2 sentences, warm casual tone)",
      "vibeScore": number (0-100),
      "vibeMatches": ["string"],
      "budgetFit": boolean,
      "budgetOverage": number | null,
      "sampleItinerary": [
        { "day": number, "activities": ["string"] }
      ],
      "googleFlightsUrl": "string",
      "bookingComUrl": "string",
      "unsplashQuery": "string (optimized search term for Unsplash landscape)"
    }
  ]
}
`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: 'Find my perfect budget trips based on my constraints. Return only the raw JSON.'
        }
      ],
    });

    // Parse the response
    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    let jsonStr = text.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '');
    }
    
    console.log("Claude Raw Response:", jsonStr.substring(0, 500) + "...");

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Claude API Error:", error);
    throw error;
  }
}
