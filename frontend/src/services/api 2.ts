const API_URL = '/api'; // Vite proxy handles the full URL

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export class ApiError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data: any = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

async function fetchWithAuth<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
    credentials: 'include', // Important for CORS with credentials (session auth)
  };

  try {
    const response = await fetch(url, config);
    
    // Get response text first (can only read once)
    const text = await response.text();
    
    // Try to parse as JSON
    let data: ApiResponse<T>;
    try {
      data = JSON.parse(text);
    } catch {
      // If not JSON, throw error with the text
      if (!response.ok) {
        throw new ApiError(
          text || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          null
        );
      }
      throw new ApiError(
        'Invalid response format',
        response.status,
        null
      );
    }

    if (!response.ok) {
      throw new ApiError(
        data.error || data.message || 'An error occurred',
        response.status,
        data
      );
    }

    // Django returns {data: {...}} or the data directly
    if (data.data !== undefined) {
      return data.data;
    }
    
    // If no 'data' field, return the whole response
    return data as unknown as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Handle network errors or non-JSON responses
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Network error. Please check your connection.', 0);
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0,
      error
    );
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    fetchWithAuth<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options?: RequestInit) =>
    fetchWithAuth<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any, options?: RequestInit) =>
    fetchWithAuth<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: any, options?: RequestInit) =>
    fetchWithAuth<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchWithAuth<T>(endpoint, { ...options, method: 'DELETE' }),
};

