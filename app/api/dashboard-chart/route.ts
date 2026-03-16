import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const chartId = request.nextUrl.searchParams.get('chart_id');

    if (!chartId) {
      return NextResponse.json(
        { success: false, error: 'Missing chart_id parameter' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/dashboard-chart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chart_id: chartId }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const chartData = await response.json();
    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Dashboard chart API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { chart_id } = await request.json();

    if (!chart_id || typeof chart_id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid chart_id' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/dashboard-chart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chart_id }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const chartData = await response.json();
    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Dashboard chart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process dashboard chart request' },
      { status: 500 }
    );
  }
}
