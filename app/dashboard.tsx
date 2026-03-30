import { Redirect } from 'expo-router';
import { ScrollView, Text, YStack } from 'tamagui';

import { useAuth } from '@/components/auth-provider';
import { Card } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/use-dashboard-data';

export default function DashboardScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const { data, loading, error } = useDashboardData();

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

        <Card
          data-testid="dashboard-balance-card"
          testID="dashboard-balance-card"
          title="Saldo disponível"
          subtitle="Atualizado agora"
          rightSlot={<Text fontSize={12}>Hoje</Text>}
          footer={<Text color="$blue10" fontWeight="600">Ver extrato</Text>}>
          <Text fontSize={30} fontWeight="700">R$ 12.480,90</Text>
        </Card>

        <Card
          data-testid="dashboard-pending-card"
          testID="dashboard-pending-card"
          title="Próximos pagamentos"
          subtitle="2 cobranças pendentes"
          footer={null}
        >
          <Text>Plano Pro · R$ 89,90 · vence amanhã</Text>
          <Text>Serviço de API · R$ 249,00 · vence em 3 dias</Text>
        </Card>
      </YStack>
    </ScrollView>
  );
}
