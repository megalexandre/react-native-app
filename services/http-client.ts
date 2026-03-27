import { initMockApiInterceptor } from '@/services/mock-api';
import { readSessionToken } from '@/services/session-storage';

initMockApiInterceptor();

export async function httpPost<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const token = await readSessionToken();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw { message: data.message || data.error || 'Falha na requisição', status: response.status };
  }

  return data as TResponse;
}
