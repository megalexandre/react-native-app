import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { useAuth } from '@/components/auth-provider';
import { ThemedView } from '@/components/themed-view';

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
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ThemedView></ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
  },
  container: {
    gap: 16,
  },
  heroCard: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  heroCopy: {
    gap: 8,
  },
  heroTitle: {
    lineHeight: 38,
  },
  heroSubtitle: {
    opacity: 0.8,
  },
  heroButton: {
    alignSelf: 'flex-start',
    minWidth: 128,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    borderRadius: 18,
    padding: 18,
    gap: 8,
  },
  statValue: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700',
  },
  statHint: {
    opacity: 0.65,
  },
  sectionCard: {
    borderRadius: 18,
    padding: 18,
    gap: 16,
  },
  activityList: {
    gap: 14,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  activityMeta: {
    opacity: 0.65,
    fontSize: 14,
  },
  positiveValue: {
    color: '#0f9f6e',
    fontWeight: '700',
  },
  negativeValue: {
    color: '#d14343',
    fontWeight: '700',
  },
});
