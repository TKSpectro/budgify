import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  from,
  InMemoryCache,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
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
const wsLink = new WebSocketLink({
  uri: Constants.manifest?.extra?.wsUrl,
  options: {
    lazy: true,
    connectionCallback: () => console.log('connected ws'),
  },
});
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

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

// Initialize Apollo Client
const client = new ApolloClient({
  link: from([authLink, errorLink, splitLink]),
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
