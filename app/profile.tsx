import { Redirect } from 'expo-router';
import { Text, YStack } from 'tamagui';

import { useAuth } from '@/components/auth-provider';

export default function ProfileScreen() {
  const { isAuthenticated, isLoading, session } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <YStack flex={1} padding={20} gap={12}>
      <Text fontSize={32} lineHeight={32} fontWeight="700">
        Perfil
      </Text>
      <Text>Usuário: {session?.user?.username ?? '-'}</Text>
      <Text>Nome: {session?.user?.name ?? '-'}</Text>
    </YStack>
  );
}
