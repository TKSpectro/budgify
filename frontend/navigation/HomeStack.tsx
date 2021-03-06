import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import HomeScreen from '../screens/HomeScreen';
import HouseholdChatScreen from '../screens/HouseholdChatScreen';
import HouseholdScreen from '../screens/HouseholdScreen';

export const HomeStack = () => {
  const MyStack = createNativeStackNavigator();

  return (
    <MyStack.Navigator screenOptions={{ headerShown: false }}>
      <MyStack.Screen name='Home' component={HomeScreen} />
      <MyStack.Screen name='Household' component={HouseholdScreen} />
      <MyStack.Screen name='HouseholdChat' component={HouseholdChatScreen} />
    </MyStack.Navigator>
  );
};
