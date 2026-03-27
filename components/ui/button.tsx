import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { ThemedText } from '../themed-text';

interface ButtonProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export function Button({
  onPress,
  title,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
  testID,
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity testID={testID} onPress={onPress} disabled={isDisabled} style={[styles.button, isPrimary ? { backgroundColor: isDisabled ? '#cccccc' : colors.tint } : { backgroundColor: 'transparent', borderWidth: 2, borderColor: isDisabled ? '#cccccc' : colors.tint }, style]}>
      {loading ? (<ActivityIndicator color={isPrimary ? colors.background : colors.tint} size="small" />) : (<ThemedText style={[styles.text, isPrimary && { color: colors.background }, !isPrimary && { color: colors.tint }, textStyle]}>{title}</ThemedText>)}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
