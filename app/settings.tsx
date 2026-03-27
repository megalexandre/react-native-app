import { Redirect } from 'expo-router';
import { StyleSheet } from 'react-native';

import { useAuth } from '@/components/auth-provider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SettingsScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Configurações</ThemedText>
      <ThemedText>Notificações: ativas</ThemedText>
      <ThemedText>Tema: automático</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
});
