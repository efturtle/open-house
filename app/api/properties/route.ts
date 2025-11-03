import { BACKEND_URL } from '../../../lib/api-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build backend URL and forward all search parameters
    const backendUrl = new URL(`${BACKEND_URL}/properties`);
    
    // Forward all search parameters to the backend
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });
    
    // Log the forwarded URL for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Forwarding request to backend:', backendUrl.toString());
    }
    
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
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