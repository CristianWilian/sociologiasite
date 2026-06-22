const API_URL = '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error: string;
}

export async function apiRequest<T = any>(
  action: string,
  { method = 'GET', payload = null } = {} as { method?: string; payload?: any }
): Promise<T> {
  const options: RequestInit = {
    method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
    },
  };

  if (payload !== null) {
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(`${API_URL}/${action}`, options);
  const result: ApiResponse<T> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Falha na comunicação com o servidor.');
  }

  return result.data;
}
