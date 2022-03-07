import { gql, useQuery } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';
import React, { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import Input from '../components/UI/Input';
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

type FormDate = {
  email: string;
};

export default function ProfileScreen() {
  const { signOut } = useContext(AuthContext);

  const { data, client } = useQuery(GET_ME);
  const me = data?.me;

  const handleLogout = () => {
    SecureStore.deleteItemAsync('token');
    client.clearStore();
    signOut();
  };

  const methods = useForm<FormDate>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.title}>{JSON.stringify(me, null, 2)}</Text>
      <Button title='Logout' onPress={handleLogout} />
      <Button title='Switch theme' onPress={() => {}} />
      <FormProvider {...methods}>
        <Input
          name='email'
          label='Email'
          rules={{ required: true, minLength: { value: 4, message: 'test' } }}
        />
      </FormProvider>
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
