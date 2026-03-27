import { StyleSheet } from 'react-native';

import { useAuth } from '@/components/auth-provider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';

export default function HomeScreen() {
  const { signOut } = useAuth();

  return (
    <ThemedView testID="home-screen" style={styles.container}>
      <ThemedText testID="home-title" type="title">Area logada</ThemedText>
      <ThemedText testID="home-subtitle">Login realizado com sucesso.</ThemedText>
      <Button testID="logout-submit" title="Sair" onPress={signOut} variant="secondary" style={styles.button} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
    button: {
      marginTop: 8,
      minWidth: 160,
    },
});
