import { NextResponse } from 'next/server';
import { UrlService } from '@/lib/database';

export async function GET() {
  try {
    const urls = UrlService.getAllUrls();
    return NextResponse.json(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}