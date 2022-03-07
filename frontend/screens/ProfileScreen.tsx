import { gql, useQuery } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';
import React, { useContext } from 'react';
import { Button, StyleSheet } from 'react-native';
import { Text } from '../components/Themed';
import { Container } from '../components/UI/Container';
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

  const { data, client } = useQuery(GET_ME);
  const me = data?.me;

  const handleLogout = () => {
    SecureStore.deleteItemAsync('token');
    client.clearStore();
    signOut();
  };

  return (
    <Container>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.title}>{JSON.stringify(me, null, 2)}</Text>
      <Button title='Logout' onPress={handleLogout} />
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
