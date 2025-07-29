import { NextRequest, NextResponse } from 'next/server';
import { UrlService } from '@/lib/database';

export async function DELETE(request: NextRequest) {
  try {
    const { shortCode } = await request.json();

    if (!shortCode) {
      return NextResponse.json(
        { error: 'Short code is required' },
        { status: 400 }
      );
    }

    const deleted = UrlService.deleteUrl(shortCode);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}