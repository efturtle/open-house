const BACKEND_URL = 'http://127.0.0.1:8000/api';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ property: string }> }
) {
  try {
    const { property: propertyId } = await params;
    
    const response = await fetch(`${BACKEND_URL}/properties/${propertyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return Response.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching property:', error);
    return Response.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ property: string }> }
) {
  try {
    const { property: propertyId } = await params;
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/properties/${propertyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return Response.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error updating property:', error);
    return Response.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ property: string }> }
) {
  try {
    const { property: propertyId } = await params;
    
    const response = await fetch(`${BACKEND_URL}/properties/${propertyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return Response.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend error: ${response.status}`);
    }

    // Some APIs return 204 No Content for successful DELETE
    if (response.status === 204) {
      return new Response(null, { status: 204 });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error deleting property:', error);
    return Response.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ property: string }> }
) {
  try {
    const { property: propertyId } = await params;
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/properties/${propertyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return Response.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error patching property:', error);
    return Response.json(
      { error: 'Failed to patch property' },
      { status: 500 }
    );
  }
}