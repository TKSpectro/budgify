import { gql, useQuery } from '@apollo/client';
import React, { useContext } from 'react';
import { Button, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
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
  const { setIsLoggedIn } = useContext(AuthContext);

  const { data, client } = useQuery(GET_ME);
  const me = data?.me;

  const handleLogout = () => {
    client.clearStore();
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.title}>{JSON.stringify(me, null, 2)}</Text>
      <Button title='Logout' onPress={handleLogout} />
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
