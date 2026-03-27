export interface AuthUser { id: string; username: string; name?: string; }
export interface LoginResponse { token: string; user: AuthUser; }
export interface LoginCredentials { username: string; password: string; }

export class AuthError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'AuthError';
  }
}