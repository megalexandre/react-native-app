import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/components/auth-provider';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

function AppNavigator() {
  const colors = Colors['light'];
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, signOut } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    setMenuVisible(false);
  }, [pathname]);

  const openMenu = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleNavigate = (path: '/profile' | '/settings') => {
    closeMenu();
    router.push(path);
  };

  const handleSignOut = async () => {
    closeMenu();
    await signOut();
    router.replace('/login');
  };

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={{
          headerTitle: 'App Payments',
          headerTitleAlign: 'left',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: true,
          headerRight: () => (
            <Pressable
              testID="topbar-menu-button"
              accessibilityRole="button"
              accessibilityLabel="Abrir menu"
              hitSlop={8}
              style={styles.headerMenuButton}
              onPress={openMenu}
            >
              <IconSymbol name="line.3.horizontal" size={22} color={colors.text} />
            </Pressable>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="login" />
        <Stack.Screen name="profile" options={{ title: 'Perfil' }} />
        <Stack.Screen name="settings" options={{ title: 'Configurações' }} />
      </Stack>

      <Modal transparent animationType="fade" visible={menuVisible} onRequestClose={closeMenu}>
        <Pressable style={styles.backdrop} onPress={closeMenu}>
          <Pressable
            testID="topbar-menu"
            onPress={() => {}}
            style={[
              styles.menuCard,
              {
                backgroundColor: colors.background,
                borderColor: '#e5e7eb',
              },
            ]}
          >
            <MenuItem label="Perfil" onPress={() => handleNavigate('/profile')} />
            <MenuItem label="Configurações" onPress={() => handleNavigate('/settings')} />
            {isAuthenticated ? <MenuItem label="Sair" danger onPress={handleSignOut} /> : null}
          </Pressable>
        </Pressable>
      </Modal>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

function MenuItem({
  label,
  onPress,
  danger,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.menuItem}>
      <Text style={[styles.menuItemText, danger ? styles.menuItemDanger : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerMenuButton: {
    marginRight: 10,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  menuCard: {
    marginTop: 62,
    marginRight: 12,
    marginLeft: 'auto',
    width: 204,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  menuItemText: {
    fontSize: 16,
    color: '#11181C',
    fontWeight: '500',
  },
  menuItemDanger: {
    color: '#d14343',
  },
});
