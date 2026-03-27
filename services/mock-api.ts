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

const API_URL = normalizeEnvUrl(process.env.EXPO_PUBLIC_API_URL);
const USE_MOCK_API = process.env.EXPO_PUBLIC_USE_MOCK_API === 'true';
let interceptorInitialized = false;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mockAuthLogin(credentials: LoginCredentials): LoginResponse {
  const username = credentials.username.trim().toLowerCase();

  if (username === 'admin' && credentials.password === '123456') {
    return {
      token: 'mock-jwt-token',
      user: {
        id: '1',
        username: 'admin',
        name: 'Administrador',
      },
    };
  }

  if (username === 'demo' && credentials.password === '123456') {
    return {
      token: 'mock-jwt-token-demo',
      user: {
        id: '2',
        username: 'demo',
        name: 'Usuario Demo',
      },
    };
  }

  throw new MockApiError('Usuário ou senha inválidos.', 401);
}

export async function mockApiRequest(path: string, body?: unknown): Promise<unknown> {
  await sleep(500);

  if (path === '/auth/login') {
    return mockAuthLogin(body as LoginCredentials);
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
  if (API_URL) {
    return url.startsWith(API_URL) && url.endsWith('/auth/login');
  }

  return url === '/auth/login' || url.endsWith('/auth/login');
}

function createJsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function initMockApiInterceptor(): void {
  if (interceptorInitialized || (!USE_MOCK_API && API_URL)) {
    return;
  }

  interceptorInitialized = true;
  const originalFetch = global.fetch.bind(global);

  global.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = getRequestUrl(input);

    if (!shouldInterceptUrl(url)) {
      return originalFetch(input, init);
    }

    let body: unknown;
    if (init?.body && typeof init.body === 'string') {
      body = JSON.parse(init.body);
    }

    try {
      const payload = await mockApiRequest('/auth/login', body);
      return createJsonResponse(payload, 200);
    } catch (error: unknown) {
      if (isMockApiError(error)) {
        return createJsonResponse({ message: error.message }, error.status);
      }

      return createJsonResponse({ message: 'Erro interno no mock API.' }, 500);
    }
  };
}
