import { NextRequest, NextResponse } from 'next/server';
import { UrlService } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { shortCode } = await request.json();

    if (!shortCode) {
      return NextResponse.json(
        { error: 'Short code is required' },
        { status: 400 }
      );
    }

    const updatedUrl = UrlService.incrementClicks(shortCode);
    
    if (!updatedUrl) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUrl);
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}