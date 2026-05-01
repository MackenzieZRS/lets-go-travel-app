import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // In a real app, check Supabase cache first for the query
    
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
    
    if (!UNSPLASH_ACCESS_KEY) {
      // Mock response if no key
      return NextResponse.json({
        imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80",
        photographer: "Alice Wander",
        photographerUrl: "https://unsplash.com"
      });
    }

    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' landscape')}&orientation=landscape&per_page=1`, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    if (!res.ok) {
      console.warn('Unsplash API failed, returning mock photo. Status:', res.status);
      return NextResponse.json({
        imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80",
        photographer: "Alice Wander",
        photographerUrl: "https://unsplash.com"
      });
    }

    const data = await res.json();
    const photo = data.results[0];

    if (!photo) {
      return NextResponse.json({ error: 'No images found' }, { status: 404 });
    }

    const result = {
      imageUrl: photo.urls.regular,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html
    };

    // In a real app, cache this result in Supabase

    return NextResponse.json(result);
  } catch (error) {
    console.error('Images API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}
