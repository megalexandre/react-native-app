import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import { Card } from './card';

export function DashboardBalanceSkeleton() {
  // Animação de pulsação
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.6, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  // Cores do tema Tamagui
  const theme = useTheme();
  const bg = theme.gray5?.val ?? '#e5e7eb';

  return (
    <Card
      aria-busy
      title={undefined}
      subtitle={undefined}
      rightSlot={undefined}
      footer={undefined}
    >
      {/* Header */}
      <XStack alignItems="flex-start" justifyContent="space-between" gap={12} marginBottom={8}>
        {/* Título */}
        <YStack flex={1} gap={4}>
          <Animated.View
            style={{
              width: 120,
              height: 18,
              borderRadius: 4,
              backgroundColor: bg,
              marginBottom: 6,
              opacity: pulse,
            }}
          />
        </YStack>
        {/* Slot direito */}
        <Animated.View
          style={{
            width: 40,
            height: 14,
            borderRadius: 4,
            backgroundColor: bg,
            opacity: pulse,
          }}
        />
      </XStack>

      {/* Valor principal */}
      <Animated.View
        style={{
          width: 160,
          height: 32,
          borderRadius: 6,
          backgroundColor: bg,
          marginBottom: 10,
          opacity: pulse,
        }}
      />

      {/* Subtexto */}
      <Animated.View
        style={{
          width: 110,
          height: 16,
          borderRadius: 4,
          backgroundColor: bg,
          marginBottom: 18,
          opacity: pulse,
        }}
      />

      {/* Footer */}
      <Animated.View
        style={{
          width: 90,
          height: 16,
          borderRadius: 4,
          backgroundColor: bg,
          marginTop: 10,
          opacity: pulse,
        }}
      />
    </Card>
  );
}
