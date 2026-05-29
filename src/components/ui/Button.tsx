import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', disabled, loading, style }: ButtonProps) {
  const variantStyle = variantStyles[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variantStyle.container,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: variantStyle.textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const variantStyles = {
  primary: {
    container: { backgroundColor: colors.primary } as ViewStyle,
    textColor: colors.onPrimary,
  },
  secondary: {
    container: { backgroundColor: colors.muted } as ViewStyle,
    textColor: colors.foreground,
  },
  outline: {
    container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border } as ViewStyle,
    textColor: colors.foreground,
  },
  ghost: {
    container: { backgroundColor: 'transparent' } as ViewStyle,
    textColor: colors.primary,
  },
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    ...typography.button,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});
