import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const response = await fetch(`${backendUrl}/upload-csv`, {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('CSV upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process CSV upload' },
      { status: 500 }
    );
  }
}
