import Anthropic from '@anthropic-ai/sdk';
import { QuizState } from './types';

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.error("CRITICAL ERROR: ANTHROPIC_API_KEY is missing from environment variables.");
}

const anthropic = new Anthropic({
  apiKey: apiKey || '',
});

export async function searchDestinations(state: QuizState) {
  const systemPrompt = `Expert travel advisor. Return ONLY raw JSON. No preamble.
Exactly 3-5 destinations from approved list: Havana, Nassau, Cancun, Tulum, San Juan, Medellin, Cartagena, Mexico City, Buenos Aires, Lima, Lisbon, Porto, Barcelona, Rome, Amsterdam, Prague, Budapest, Athens, Santorini, Dubrovnik, Bangkok, Bali, Chiang Mai, Hanoi, Ho Chi Minh City, Tokyo, Kyoto, New Orleans, Miami, Nashville, Austin, Denver, Savannah, Sedona, Key West, Charleston, Dubai, Marrakech, Cape Town.

Constraints:
- Budget: ${state.budget} USD total.
- From: ${state.origin}.
- Transport: ${state.transportModes.join(", ")} within ${state.maxTravelHours} hours.
- Vibes: ${state.vibes.join(", ")}.
- Dates: ${state.departureDate} to ${state.returnDate}.

JSON Schema:
{
  "destinations": [{
    "name": "string", "country": "string", "region": "string",
    "transportType": "flight"|"drive"|"both",
    "estimatedFlightHours": number|null, "estimatedDriveHours": number|null,
    "estimatedFlightCostMin": number, "estimatedFlightCostMax": number,
    "estimatedHotelCostMin": number, "estimatedHotelCostMax": number,
    "estimatedFoodActivitiesCostMin": number, "estimatedFoodActivitiesCostMax": number,
    "estimatedTotalMin": number, "estimatedTotalMax": number,
    "whyItFitsYou": "string (2 sentences)", "vibeScore": number, "vibeMatches": ["string"],
    "budgetFit": boolean, "budgetOverage": number|null,
    "googleFlightsUrl": "string", "bookingComUrl": "string", "unsplashQuery": "string"
  }]
}`;

  try {
    const modelName = 'claude-sonnet-4-5';
    console.log(`Attempting search with model: ${modelName}`);
    
    const message = await anthropic.messages.create({
      model: modelName,
      max_tokens: 2000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{ role: 'user', content: 'Find trips. JSON only.' }],
    }, {
      timeout: 20000 // 20 seconds
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found in response");
    
    return JSON.parse(match[0]);
  } catch (error: any) {
    console.error("Claude API Error:", error.message);
    if (error.stack) console.error("Stack trace:", error.stack);
    
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is missing.");
    }
    throw error;
  }
}


