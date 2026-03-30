import tamaguiConfig from '@/tamagui.config';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Modal, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';
import { TamaguiProvider } from 'tamagui';

import { AuthProvider, useAuth } from '@/components/auth-provider';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';


const SIDE_MENU_WIDTH = 300;

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
  const isLoginRoute = pathname === '/login';
  const { isAuthenticated, signOut } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const sideMenuAnimatedValue = useRef(new Animated.Value(-SIDE_MENU_WIDTH)).current;

  useEffect(() => {
    setMenuVisible(false);
    setSideMenuVisible(false);
  }, [pathname]);

  const openMenu = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const openSideMenu = useCallback(() => {
    sideMenuAnimatedValue.stopAnimation();
    setSideMenuVisible(true);
    requestAnimationFrame(() => {
      Animated.timing(sideMenuAnimatedValue, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }).start();
    });
  }, [sideMenuAnimatedValue]);

  const closeSideMenu = () => {
    sideMenuAnimatedValue.stopAnimation();
    Animated.timing(sideMenuAnimatedValue, {
      toValue: -SIDE_MENU_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setSideMenuVisible(false);
      }
    });
  };

  const edgeSwipeResponder = useMemo(
    () =>
      PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        if (isLoginRoute || sideMenuVisible) {
          return false;
        }
        return evt.nativeEvent.pageX <= 24;
      },
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        if (isLoginRoute || sideMenuVisible) {
          return false;
        }
        return gestureState.dx > 12;
      },
      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dx > 24) {
          openSideMenu();
        }
      },
    }),
    [isLoginRoute, openSideMenu, sideMenuVisible]
  );

  const handleNavigate = (path: '/profile' | '/settings') => {
    closeMenu();
    closeSideMenu();
    router.push(path);
  };

  const handleSignOut = async () => {
    closeMenu();
    closeSideMenu();
    await signOut();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        <ThemeProvider value={DefaultTheme}>
          <Stack
            screenOptions={{
              headerTitle: () => (
                <Pressable
                  testID="app-title"
                  accessibilityRole="button"
                  accessibilityLabel="Abrir menu lateral"
                  onPress={openSideMenu}
                >
                  <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
                    App Payments
                  </Text>
                </Pressable>
              ),
              headerTitleAlign: 'left',
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.text,
              headerShadowVisible: true,
              headerRight: isLoginRoute ? undefined : () => (
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
            <Stack.Screen name="login" options={{ headerShown: false }} />
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

          <Modal transparent animationType="none" visible={sideMenuVisible} onRequestClose={closeSideMenu}>
            <Pressable style={styles.sideMenuBackdrop} onPress={closeSideMenu}>
              <Animated.View
                testID="side-menu"
                style={[
                  styles.sideMenu,
                  {
                    backgroundColor: colors.background,
                    borderColor: '#e5e7eb',
                    transform: [{ translateX: sideMenuAnimatedValue }],
                  },
                ]}
              >
                <Pressable onPress={() => {}}>
                <Pressable
                  onPress={closeSideMenu}
                  style={styles.sideMenuClose}
                  testID="side-menu-close"
                >
                  <Text style={{ fontSize: 28, color: colors.text }}>×</Text>
                </Pressable>
                <MenuItem label="Perfil" onPress={() => handleNavigate('/profile')} />
                <MenuItem label="Configurações" onPress={() => handleNavigate('/settings')} />
                {isAuthenticated ? <MenuItem label="Sair" danger onPress={handleSignOut} /> : null}
                </Pressable>
              </Animated.View>
            </Pressable>
          </Modal>

          <View
            pointerEvents={isLoginRoute || sideMenuVisible ? 'none' : 'auto'}
            style={styles.edgeSwipeZone}
            {...edgeSwipeResponder.panHandlers}
          />

          <StatusBar backgroundColor="transparent" translucent style="dark" />
        </ThemeProvider>
      </TamaguiProvider>
    </SafeAreaView>
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
  sideMenuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sideMenu: {
    flex: 1,
    width: '75%',
    maxWidth: 300,
    borderRightWidth: 1,
    paddingTop: 16,
  },
  sideMenuClose: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  edgeSwipeZone: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 24,
    zIndex: 5,
  },
});
