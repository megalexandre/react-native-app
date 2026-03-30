import type { YStackProps } from '@tamagui/stacks';
import React, { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';



type CardVariant = 'elevated' | 'outlined';

interface CardProps extends YStackProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  footer?: ReactNode;
  rightSlot?: ReactNode;
  contentStyle?: YStackProps['style'];
  variant?: CardVariant;
  testID?: string;
  onPress?: () => void;
}

export function Card({
  title,
  subtitle,
  children,
  footer,
  rightSlot,
  contentStyle,
  variant = 'elevated',
  testID,
  onPress,
  ...rest
}: CardProps) {
  const resolvedHeaderTestID = testID ? `${testID}-header` : undefined;
  const resolvedTitleTestID = testID ? `${testID}-title` : undefined;
  const resolvedSubtitleTestID = testID ? `${testID}-subtitle` : undefined;
  const resolvedRightSlotTestID = testID ? `${testID}-right-slot` : undefined;
  const resolvedContentTestID = testID ? `${testID}-content` : undefined;
  const resolvedFooterTestID = testID ? `${testID}-footer` : undefined;

  const content = (
    <YStack
      backgroundColor="$background"
      borderRadius={14}
      padding={16}
      data-testid={testID}
      {...(variant === 'outlined'
        ? { borderWidth: 1, borderColor: '$borderColor' }
        : {
            borderWidth: 1,
            borderColor: '$borderColor',
            shadowColor: '$shadowColor',
            shadowOpacity: 0.08,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 3 },
            elevation: 2,
          })}
      {...rest}
    >
      {(title || subtitle || rightSlot) && (
        <XStack testID={resolvedHeaderTestID} data-testid={resolvedHeaderTestID} alignItems="flex-start" justifyContent="space-between" gap={12}>
          <YStack flex={1} gap={4}>
            {title ? (
              <Text testID={resolvedTitleTestID} data-testid={resolvedTitleTestID} fontSize={18} fontWeight="600" lineHeight={24}>
                {title}
              </Text>
            ) : null}
            {subtitle ? (
              <Text testID={resolvedSubtitleTestID} data-testid={resolvedSubtitleTestID} fontSize={14} lineHeight={20} color="$color8">
                {subtitle}
              </Text>
            ) : null}
          </YStack>
          {rightSlot ? (
            <YStack testID={resolvedRightSlotTestID} data-testid={resolvedRightSlotTestID} alignItems="flex-end" justifyContent="center">
              {rightSlot}
            </YStack>
          ) : null}
        </XStack>
      )}

      {children ? (
        <YStack testID={resolvedContentTestID} data-testid={resolvedContentTestID} marginTop={12} gap={8} style={contentStyle}>
          {children}
        </YStack>
      ) : null}

      {footer ? (
        <YStack testID={resolvedFooterTestID} data-testid={resolvedFooterTestID} marginTop={14}>
          {footer}
        </YStack>
      ) : null}
    </YStack>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{
          borderRadius: 14,
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        }]}
        testID={testID}
      >
        {content}
      </Pressable>
    );
  }
  return content;
}
