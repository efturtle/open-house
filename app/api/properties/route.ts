import { BACKEND_URL } from '../../../lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const sort = searchParams.get('sort');
    
    // Build backend URL with parameters
    let backendUrl = `${BACKEND_URL}/properties?page=${page}`;
    
    // For initial load, prioritize available properties
    if (sort === 'status_priority') {
      backendUrl += '&status=disponible';
    }
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return Response.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating property:', error);
    return Response.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}