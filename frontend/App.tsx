import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  from,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { extendTheme, NativeBaseProvider } from 'native-base';
import React from 'react';
import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';
import AuthProvider from './navigation/auth';

const httpLink = createHttpLink({ uri: Constants.manifest?.extra?.apiUrl });
const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync('token');

  return {
    headers: {
      ...headers,
      authorization: token || null,
    },
  };
});
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, extensions, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );

      if (extensions.code == '401' && message.includes('invalid token')) {
        console.log('[GraphQL error]: Unauthorized');
        SecureStore.deleteItemAsync('token');

        // TODO: Somehow need to redirect user back to login screen
      }
    });

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

// Initialize Apollo Client
const client = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
});

const config = {
  useSystemColorMode: true,

  initialColorMode: 'light',
};

const colors = {
  primary: {
    50: '#EEF2F6',
    100: '#CFD9E7',
    200: '#B1C1D8',
    300: '#92A9C9',
    400: '#7491B9',
    500: '#5578AA',
    600: '#446088',
    700: '#334866',
    800: '#223044',
    900: '#111822',
  },
};

const theme = extendTheme({ config, colors });

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <AuthProvider>
          <NativeBaseProvider theme={theme}>
            <Navigation />
            <StatusBar />
          </NativeBaseProvider>
        </AuthProvider>
      </ApolloProvider>
    );
  }
}
