import { initMockApiInterceptor } from '@/services/mock-api';

initMockApiInterceptor();

export async function httpPost<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw { message: data.message || data.error || 'Falha na requisição', status: response.status };
  }

  return data as TResponse;
}
