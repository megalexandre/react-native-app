import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { AuthUser } from '@/services/auth-model';

const SESSION_STORAGE_KEY = 'app-payments.session';

export interface AuthSession {
  token: string;
  user: AuthUser;
}

function getWebStorage(): Storage | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  return localStorage;
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return getWebStorage()?.getItem(key) ?? null;
  }

  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    getWebStorage()?.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    getWebStorage()?.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

export async function readSession(): Promise<AuthSession | null> {
  const rawValue = await getItem(SESSION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const session = JSON.parse(rawValue) as AuthSession;

    if (!session?.token || !session?.user?.id) {
      await removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    return session;
  } catch {
    await removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export async function saveSession(session: AuthSession): Promise<void> {
  await setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  await removeItem(SESSION_STORAGE_KEY);
}

export async function readSessionToken(): Promise<string | null> {
  const session = await readSession();
  return session?.token ?? null;
}