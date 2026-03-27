import { AuthError, LoginCredentials, LoginResponse } from '@/services/auth-model';
import { httpPost } from '@/services/http-client';

function normalizeEnvUrl(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  return value.trim().replace(/^['\"]|['\"]$/g, '');
}

const API_URL = normalizeEnvUrl(process.env.EXPO_PUBLIC_API_URL);

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const payload = await remoteRequest(credentials);

    if (!payload?.token || !payload?.user?.id) {
      throw new AuthError('Resposta de autenticação inválida.');
    }

    return payload as LoginResponse;
  } catch (error: any) {
    const message = error.message || error.error || 'Falha ao autenticar';
    throw new AuthError(message, error.status);
  }
}

async function remoteRequest(body: LoginCredentials) {
  const endpoint = API_URL ? `${API_URL}/auth/login` : '/auth/login';
  return httpPost<LoginResponse>(endpoint, body);
}