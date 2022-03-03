import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorModeValue } from 'native-base';
import * as React from 'react';
import { useContext } from 'react';
import LoginScreen from '../screens/Auth/LoginScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import HouseholdScreen from '../screens/HouseholdScreen';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { RootStackParamList, RootTabParamList } from '../types';
import { AuthContext } from './auth';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation() {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      // theme={useColorModeValue(DarkTheme, DefaultTheme)}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();
function RootNavigator() {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoading && isLoggedIn ? (
        <Stack.Screen name='Root' component={BottomTabNavigator} />
      ) : (
        <>
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='SignUp' component={SignUpScreen} />
          <Stack.Screen name='ResetPassword' component={ResetPasswordScreen} />
        </>
      )}

      <Stack.Screen name='NotFound' component={NotFoundScreen} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name='Modal' component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const HomeStack = () => {
  const MyStack = createNativeStackNavigator();

  return (
    <MyStack.Navigator screenOptions={{ headerShown: false }}>
      <MyStack.Screen name='Home' component={HomeScreen} />
      <MyStack.Screen name='Household' component={HouseholdScreen} />
    </MyStack.Navigator>
  );
};

const BottomTab = createBottomTabNavigator<RootTabParamList>();
function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName='HomeStack'
      screenOptions={{
        tabBarStyle: {
          backgroundColor: useColorModeValue('white', 'black'),
        },
        tabBarActiveTintColor: useColorModeValue('black', 'white'),
        headerShown: false,
      }}
      sceneContainerStyle={{
        backgroundColor: useColorModeValue('white', 'black'),
      }}
    >
      <BottomTab.Screen
        name='HomeStack'
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: () => <TabBarIcon name='book' />,
        }}
      />

      <BottomTab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          title: 'Profile',
          // TODO: Maybe use the user avatar here?
          tabBarIcon: () => <TabBarIcon name='user-o' />,
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
}) {
  return (
    <FontAwesome
      size={30}
      style={{ marginBottom: -3 }}
      color={useColorModeValue('black', 'white')}
      {...props}
    />
  );
}
