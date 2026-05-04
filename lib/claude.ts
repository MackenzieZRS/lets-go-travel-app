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
  const systemPrompt = `You are a travel advisor. Return ONLY a JSON object, no other text.

Return exactly 3 destinations from this list ONLY: Havana, Nassau, Cancun, Tulum, San Juan, Medellin, Cartagena, Mexico City, Buenos Aires, Lima, Lisbon, Porto, Barcelona, Rome, Amsterdam, Prague, Budapest, Athens, Santorini, Dubrovnik, Bangkok, Bali, Chiang Mai, Hanoi, Ho Chi Minh City, Tokyo, Kyoto, New Orleans, Miami, Nashville, Austin, Denver, Savannah, Sedona, Key West, Charleston, Dubai, Marrakech, Cape Town.

Match these criteria:
- Budget: ${state.budget} USD total
- From: ${state.origin}
- Vibes: ${state.vibes.join(", ")}
- Dates: ${state.departureDate} to ${state.returnDate}

Return this exact JSON structure:
{
  "destinations": [{
    "name": "string",
    "country": "string",
    "region": "string",
    "transportType": "flight" | "drive",
    "estimatedFlightHours": number,
    "estimatedDriveHours": number,
    "estimatedFlightCostMin": number,
    "estimatedFlightCostMax": number,
    "estimatedHotelCostMin": number,
    "estimatedHotelCostMax": number,
    "estimatedTotalMin": number,
    "estimatedTotalMax": number,
    "whyItFitsYou": "string",
    "vibeScore": number,
    "vibeMatches": ["string"],
    "budgetFit": true,
    "googleFlightsUrl": "string",
    "bookingComUrl": "string",
    "unsplashQuery": "string"
  }]
}`;

  try {
    const modelName = 'claude-haiku-4-5-20251001';
    console.log(`Attempting search with model: ${modelName}`);
    
    const message = await anthropic.messages.create({
      model: modelName,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: 'Find trips. JSON only.' }],
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


