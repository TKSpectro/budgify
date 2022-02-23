import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { StatusBar, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeStackScreenProps } from '../types';

const GET_HOUSEHOLD = gql`
  query GET_HOUSEHOLD($id: ID!) {
    household(id: $id) {
      id
      name
      payments {
        id
      }
    }
  }
`;

export default function HouseholdScreen({
  navigation,
}: HomeStackScreenProps<'Household'>) {
  const id =
    navigation.getState().routes[navigation.getState().index]?.params?.id;

  const { data } = useQuery(GET_HOUSEHOLD, { variables: { id } });
  const household = data?.household;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>{household?.name}</Text>
      <Text style={styles.text}>{JSON.stringify(household, null, 2)}</Text>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight || 0,
  },
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
