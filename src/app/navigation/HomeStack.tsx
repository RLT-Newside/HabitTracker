import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../../screens/DashboardScreen';
import { AddEditHabitScreen } from '../../screens/AddEditHabitScreen';
import { HabitDetailScreen } from '../../screens/HabitDetailScreen';
import { HomeStackParamList } from '../../types/navigation';
import { colors } from '../../theme';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.foreground,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'JHabits' }}
      />
      <Stack.Screen
        name="HabitDetail"
        component={HabitDetailScreen}
        options={{ title: 'Habit Details' }}
      />
      <Stack.Screen
        name="AddEditHabit"
        component={AddEditHabitScreen}
        options={{ title: 'New Habit', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
