import { Redirect } from 'expo-router';
import { ScrollView, Text, YStack } from 'tamagui';

import { useAuth } from '@/components/auth-provider';

export default function DashboardScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <ScrollView
      testID="home-screen"
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <YStack gap={16}>
        <Text fontSize={28} fontWeight="700">
          Dashboard
        </Text>
        <Text>Resumo de pagamentos e atividades recentes.</Text>
      </YStack>
    </ScrollView>
  );
}
