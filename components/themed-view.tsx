import { type ViewProps, View } from 'tamagui';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

function flattenStyle(style: any): any {
  if (Array.isArray(style)) {
    // Recursively flatten and merge objects
    return Object.assign({}, ...style.map(flattenStyle));
  }
  return style || {};
}
export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  // Always flatten style to avoid array-of-array issues on web
  const flatStyle = flattenStyle([{ backgroundColor }, style]);
  return <View style={flatStyle} {...otherProps} />;
}
