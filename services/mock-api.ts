import type { LoginCredentials, LoginResponse } from '@/services/auth-model';

class MockApiError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
    this.name = 'MockApiError';
  }
}

function normalizeEnvUrl(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  return value.trim().replace(/^['\"]|['\"]$/g, '');
}

function normalizeEnvBoolean(value?: string): boolean {
  if (!value) {
    return false;
  }

  const normalized = value.trim().replace(/^['\"]|['\"]$/g, '').toLowerCase();
  return normalized === 'true' || normalized === '1';
}

const API_URL = normalizeEnvUrl(process.env.EXPO_PUBLIC_API_URL);
const USE_MOCK_API = normalizeEnvBoolean(process.env.EXPO_PUBLIC_USE_MOCK_API);
let interceptorInitialized = false;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mockAuthLogin(credentials: LoginCredentials): LoginResponse {
  return {
    token: 'mock-jwt-token-demo',
    user: {
      id: '2',
      username: 'alexandre',
      name: 'Alexandre',
    },
    role: 'admin',
  };
}
export async function mockApiRequest(path: string, body?: unknown): Promise<unknown> {
  await sleep(500);

  if (path === '/auth/login') {
    return mockAuthLogin(body as LoginCredentials);
  }

  if (path === '/dashboard') {
    // Mock para dashboard
    return {
      summary: {
        total: 1000,
        text: '8',
      },
    };
  }

  throw new MockApiError(`Endpoint mock não implementado: ${path}`, 404);
}

export function isMockApiError(error: unknown): error is MockApiError {
  return error instanceof MockApiError;
}

function getRequestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
}

function shouldInterceptUrl(url: string): boolean {
  if (USE_MOCK_API) {
    return (
      url === '/auth/login' ||
      url.endsWith('/auth/login') ||
      url === '/dashboard' ||
      url.endsWith('/dashboard')
    );
  }

  if (API_URL) {
    return (
      (url.startsWith(API_URL) && url.endsWith('/auth/login')) ||
      (url.startsWith(API_URL) && url.endsWith('/dashboard'))
    );
  }

  return (
    url === '/auth/login' ||
    url.endsWith('/auth/login') ||
    url === '/dashboard' ||
    url.endsWith('/dashboard')
  );
}

function createJsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Interceptor desabilitado: as chamadas agora vão para o endpoint real (WireMock)
export function initMockApiInterceptor(): void {
  // Não faz mais nada
}

