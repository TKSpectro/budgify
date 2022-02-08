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
          TabOne: {
            screens: {
              TabOneScreen: 'one',
            },
          },
          SignIn: {
            screens: {
              SignInScreen: 'signin',
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
          Profile: {
            screens: {
              ProfileScreen: 'profile',
            },
          },
        },
      },
      Modal: 'modal',
      NotFound: '*',
    },
  },
};

export default linking;
