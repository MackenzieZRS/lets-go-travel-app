export const runtime = 'edge';
export const maxDuration = 25;

import { NextResponse } from 'next/server';
import { searchDestinations } from '@/lib/claude';
import { QuizState } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body: QuizState = await req.json();
    const results = await searchDestinations(body);
    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Search API Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to find destinations', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
