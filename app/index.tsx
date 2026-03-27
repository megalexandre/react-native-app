import { Redirect } from 'expo-router';

import { useAuth } from '@/components/auth-provider';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/login'} />;
}
