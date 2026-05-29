import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CalendarScreen } from '../../screens/CalendarScreen';
import { CalendarStackParamList } from '../../types/navigation';
import { colors } from '../../theme';

const Stack = createNativeStackNavigator<CalendarStackParamList>();

export function CalendarStack() {
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
        name="Calendar"
        component={CalendarScreen}
        options={{ title: 'Calendar' }}
      />
    </Stack.Navigator>
  );
}
