import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query, is_followup } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid query parameter',
          sql_query: null,
          chart_type: 'bar',
          data: null,
          insights: null
        },
        { status: 400 }
      );
    }

    // Forward to backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, is_followup }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { 
          success: false,
          error: error.error || 'Failed to process query from backend.',
          sql_query: null,
          chart_type: 'bar',
          data: null,
          insights: null
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Query API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process query. Please make sure the backend is running on http://localhost:8000',
        sql_query: null,
        chart_type: 'bar',
        data: null,
        insights: null
      },
      { status: 500 }
    );
  }
}
