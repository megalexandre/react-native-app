import { Redirect } from 'expo-router';
import { Text, YStack } from 'tamagui';

import { useAuth } from '@/components/auth-provider';

export default function SettingsScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <YStack flex={1} padding={20} gap={12}>
      <Text fontSize={32} lineHeight={32} fontWeight="700">
        Configurações
      </Text>
      <Text>Notificações: ativas</Text>
      <Text>Tema: automático</Text>
    </YStack>
  );
}
