import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { useDatabase } from './src/hooks/useDatabase';
import { colors } from './src/theme';

export default function App() {
  const { ready, error } = useDatabase();

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Database Error: {error.message}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <RootNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  error: {
    color: colors.destructive,
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
});
