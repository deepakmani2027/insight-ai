import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { data, query } = await request.json();

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: 'Invalid data provided' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/generate-story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, query }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process story generation' },
      { status: 500 }
    );
  }
}
