// Backend API configuration and utility functions
export const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000/api';

// Type definitions for common API responses
export interface ApiError {
  error: string;
  details?: string;
}

export interface BackendResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

// Helper function to make backend API calls with consistent error handling
export async function backendFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<BackendResponse<T>> {
  try {
    const url = `${BACKEND_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const status = response.status;
    
    // Handle different status codes
    if (status === 204) {
      return { status, data: null as T };
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Backend error: ${status}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      return {
        status,
        error: errorMessage,
      };
    }

    const data = await response.json();
    return { status, data };
  } catch (error) {
    console.error('Backend API error:', error);
    return {
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Helper to create standardized error responses
export function createErrorResponse(
  message: string,
  status: number = 500
): Response {
  return Response.json({ error: message }, { status });
}

// Helper to create success responses
export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): Response {
  return Response.json(data, { status });
}

// Helper to forward query parameters to backend
export function forwardSearchParams(
  requestUrl: string,
  backendEndpoint: string
): string {
  const { searchParams } = new URL(requestUrl);
  const backendUrl = new URL(`${BACKEND_URL}${backendEndpoint}`);
  
  searchParams.forEach((value, key) => {
    backendUrl.searchParams.append(key, value);
  });
  
  return backendUrl.toString();
}