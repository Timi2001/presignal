import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // This endpoint is called by GitHub Actions to trigger processing
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    // Trigger the processing pipeline
    const response = await fetch(`${baseUrl}/api/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Analysis triggered',
      result: data
    });

  } catch (error) {
    console.error('[v0] Trigger analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger analysis', details: String(error) },
      { status: 500 }
    );
  }
}
