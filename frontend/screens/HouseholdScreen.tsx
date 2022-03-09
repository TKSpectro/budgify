import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { Button, StyleSheet, Text } from 'react-native';
import { Container } from '../components/UI/Container';
import { HomeStackScreenProps } from '../types';

const GET_HOUSEHOLD = gql`
  query GET_HOUSEHOLD($id: ID!) {
    household(id: $id) {
      id
      name
    }
  }
`;

export default function HouseholdScreen({
  navigation,
}: HomeStackScreenProps<'Household'>) {
  const id =
    navigation.getState().routes[navigation.getState().index]?.params?.id;

  const { data } = useQuery(GET_HOUSEHOLD, {
    variables: { id },
  });

  const household = data?.household;

  return (
    <Container>
      <Text style={styles.text}>{household?.name}</Text>
      {id && (
        <Button
          title='Chatroom'
          onPress={() => {
            navigation.navigate('HouseholdChat', { id });
          }}
        />
      )}
    </Container>
  );
}

export const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  notFound: {
    borderColor: '#9ca3af',
    borderWidth: 2,
    borderRadius: 10,
    color: '#f87171',
    fontSize: 20,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
