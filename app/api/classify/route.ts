import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'File must be CSV format' }, { status: 400 });
    }

    // Read and parse CSV content
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return NextResponse.json({ error: 'Empty CSV file' }, { status: 400 });
    }

    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
      const row: Record<string, any> = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      data.push(row);
    }

    // TODO: Replace this section with your actual backend API call
    // const backendResponse = await fetch('YOUR_BACKEND_API_URL/classify', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ data }),
    // });
    // const results = await backendResponse.json();

    // For now, return mock classification results
    const mockResults = data.map((row, index) => {
      const classifications = ['Category A', 'Category B', 'Category C', 'Category D'];
      const classification = classifications[index % classifications.length];
      const confidence = Math.random() * 0.4 + 0.6; // 60-100% confidence

      return {
        data: row,
        classification,
        confidence,
        processedAt: new Date().toISOString(),
      };
    });

    return NextResponse.json(mockResults);
  } catch (error) {
    console.error('Classification API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}