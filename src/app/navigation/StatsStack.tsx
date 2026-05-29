import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatsScreen } from '../../screens/StatsScreen';
import { HabitStatsScreen } from '../../screens/HabitStatsScreen';
import { StatsStackParamList } from '../../types/navigation';
import { colors } from '../../theme';

const Stack = createNativeStackNavigator<StatsStackParamList>();

export function StatsStack() {
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
        name="StatsOverview"
        component={StatsScreen}
        options={{ title: 'Statistics' }}
      />
      <Stack.Screen
        name="HabitStats"
        component={HabitStatsScreen}
        options={{ title: 'Habit Stats' }}
      />
    </Stack.Navigator>
  );
}
