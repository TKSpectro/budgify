import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ProfileScreen from '../screens/ProfileScreen';
import { RootTabParamList } from '../types';
import { HomeStack } from './HomeStack';

const BottomTab = createBottomTabNavigator<RootTabParamList>();
export function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName='HomeStack'
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
      }}
    >
      <BottomTab.Screen
        name='HomeStack'
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name='book' color={color} />,
        }}
      />

      <BottomTab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          title: 'Profile',
          // TODO: Maybe use the user avatar here?
          tabBarIcon: ({ color }) => <TabBarIcon name='user-o' color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}
/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
