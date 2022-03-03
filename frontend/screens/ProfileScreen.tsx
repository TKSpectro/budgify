import { gql, useQuery } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';
import { Button, Text, useColorMode, View } from 'native-base';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { AuthContext } from '../navigation/auth';

const GET_ME = gql`
  query GET_ME {
    me {
      id
      name
      email
      createdAt
    }
  }
`;

export default function ProfileScreen() {
  const { signOut } = useContext(AuthContext);
  const { toggleColorMode, colorMode } = useColorMode();

  const { data, client } = useQuery(GET_ME);
  const me = data?.me;

  const handleLogout = () => {
    SecureStore.deleteItemAsync('token');
    client.clearStore();
    signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.title}>{JSON.stringify(me, null, 2)}</Text>
      <Button onPress={handleLogout}>Logout</Button>
      <Button onPress={toggleColorMode}>{colorMode}</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
