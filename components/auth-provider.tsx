import React, { createContext, useContext, useEffect, useState } from 'react';

import { clearSession, readSession, saveSession, type AuthSession } from '@/services/session-storage';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  session: AuthSession | null;
  signIn: (session: AuthSession) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const storedSession = await readSession();

        if (isMounted) {
          setSession(storedSession);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function signIn(nextSession: AuthSession) {
    await saveSession(nextSession);
    setSession(nextSession);
  }

  async function signOut() {
    await clearSession();
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session?.token,
        isLoading,
        session,
        signIn,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}