import { Redirect } from 'expo-router';
import { ScrollView, Text, YStack } from 'tamagui';

import { useAuth } from '@/components/auth-provider';
import { Card } from '@/components/ui/card';
import { DashboardBalanceSkeleton } from '@/components/ui/DashboardBalanceSkeleton';
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
          title="Valores a Receber"
          subtitle="Total"
          rightSlot={<Text fontSize={12}>Hoje</Text>}
          footer={<Text color="$blue10" fontWeight="600">Ver extrato</Text>}>
          {loading || !data ? (
            <DashboardBalanceSkeleton />
          ) : (
            <>
              <Text fontSize={30} fontWeight="700">
                {`R$ ${data.summary.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              </Text>
              <Text color="$green10">{`${data.summary.text}% comparado com o mês anterior`}</Text>
            </>
          )}
        </Card>
      </YStack>
    </ScrollView>
  );
}
