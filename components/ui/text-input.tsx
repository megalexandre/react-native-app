import { Colors } from '@/constants/theme';
import React from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  useColorScheme,
  View,
} from 'react-native';
import { ThemedText } from '../themed-text';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  labelTestID?: string;
  errorTestID?: string;
}

export function TextInput({ label, error, labelTestID, errorTestID, testID, ...props }: CustomTextInputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const resolvedLabelTestID = labelTestID ?? (testID ? `${testID}-label` : undefined);
  const resolvedErrorTestID = errorTestID ?? (testID ? `${testID}-error` : undefined);
  const resolvedContainerTestID = testID ? `${testID}-container` : undefined;

  return (
    <View testID={resolvedContainerTestID} style={styles.container}>
      {label && <ThemedText testID={resolvedLabelTestID} type="subtitle" style={styles.label}>{label}</ThemedText>}
      <RNTextInput testID={testID} {...props} style={[styles.input, { color: colors.text, borderColor: error ? '#ff4444' : colors.icon, backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5' }]} placeholderTextColor={colors.icon} />
      {error && <ThemedText testID={resolvedErrorTestID} style={styles.error}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'system',
  },
  error: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
});
