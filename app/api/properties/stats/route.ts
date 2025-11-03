import { BACKEND_URL } from '../../../../lib/api-utils';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/properties/stats`, {
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
    console.error('Error fetching property stats:', error);
    return Response.json(
      { error: 'Failed to fetch property statistics' },
      { status: 500 }
    );
  }
}