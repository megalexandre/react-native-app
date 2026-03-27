import { Redirect } from 'expo-router';
import { StyleSheet } from 'react-native';

import { useAuth } from '@/components/auth-provider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProfileScreen() {
  const { isAuthenticated, isLoading, session } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Perfil</ThemedText>
      <ThemedText>Usuário: {session?.user?.username ?? '-'}</ThemedText>
      <ThemedText>Nome: {session?.user?.name ?? '-'}</ThemedText>
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
