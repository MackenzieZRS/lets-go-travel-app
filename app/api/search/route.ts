export const maxDuration = 30;
import { NextResponse } from 'next/server';
import { searchDestinations } from '@/lib/claude';
import { QuizState } from '@/lib/types';


export async function POST(req: Request) {
  try {
    const body: QuizState = await req.json();
    
    // In a real app, implement rate limiting here
    
    // Call Claude
    const results = await searchDestinations(body);
    
    // In a real app, cache this response in Supabase
    
    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Search API Error:', error.message);
    console.error('Full stack trace:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Failed to find destinations',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

