import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import AuthProvider from './navigation/auth';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: Constants.manifest?.extra?.apiUrl,
  // 'http://localhost:3000/' + 'graphql/'
  cache: new InMemoryCache(),
  // TODO: Load token from async storage
  headers: {
    authorization: '',
  },
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
