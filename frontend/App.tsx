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
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
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

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <AuthProvider>
          <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </SafeAreaProvider>
        </AuthProvider>
      </ApolloProvider>
    );
  }
}
