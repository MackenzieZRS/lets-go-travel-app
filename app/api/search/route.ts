import { NextResponse } from 'next/server';
import { searchDestinations } from '@/lib/claude';
import { QuizState } from '@/lib/types';

export const maxDuration = 60; // Allow up to 60 seconds for Claude API response

export async function POST(req: Request) {
  try {
    const body: QuizState = await req.json();
    
    // In a real app, implement rate limiting here
    
    // Call Claude
    const results = await searchDestinations(body);
    
    // In a real app, cache this response in Supabase
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Failed to find destinations' },
      { status: 500 }
    );
  }
}
