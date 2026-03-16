import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/kpis`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const kpis = await response.json();
    return NextResponse.json(kpis);
  } catch (error) {
    console.error('KPI API error:', error);
    return NextResponse.json(
      {
        revenue: 0,
        orders: 0,
        products_sold: 0,
        avg_rating: 0,
        reviews: 0,
      },
      { status: 500 }
    );
  }
}
