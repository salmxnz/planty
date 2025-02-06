const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables');
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export const post = async <T>(
  endpoint: string,
  body: any,
  headers: HeadersInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null as T,
      status: 500,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};

export const get = async <T>(
  endpoint: string,
  headers: HeadersInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    const data = await response.json();
    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null as T,
      status: 500,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};