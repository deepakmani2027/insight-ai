import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/dashboard-insights`);

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Dashboard insights API error:', error);
    return NextResponse.json(
      { success: false, insights: [], error: 'Failed to fetch dashboard insights' },
      { status: 500 }
    );
  }
}
