/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          HomeStack: {
            screens: {
              HomeScreen: 'home',
              HouseholdScreen: 'household',
            },
          },
          Profile: {
            screens: {
              ProfileScreen: 'profile',
            },
          },
        },
      },
      Login: {
        screens: {
          LoginScreen: 'login',
        },
      },
      SignUp: {
        screens: {
          SignUpScreen: 'signup',
        },
      },
      ResetPassword: {
        screens: {
          ResetPasswordScreen: 'resetpassword',
        },
      },
      Modal: 'modal',
      NotFound: '*',
    },
  },
};

export default linking;
