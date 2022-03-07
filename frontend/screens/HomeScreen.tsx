import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { HouseholdItem } from '../components/household/HouseholdItem';
import { Container } from '../components/UI/Container';
import { HomeStackScreenProps } from '../types';

const GET_HOUSEHOLDS = gql`
  query GET_HOUSEHOLDS {
    me {
      id
      households {
        id
        name
      }
    }
  }
`;

export default function HomeScreen({
  navigation,
}: HomeStackScreenProps<'Home'>) {
  const { data } = useQuery(GET_HOUSEHOLDS);
  const households = data?.me?.households;

  return (
    <Container>
      <FlatList
        data={households}
        renderItem={({ item }) => (
          <TouchableHighlight
            onPress={(e) => {
              navigation.navigate('Household', { id: item.id });
            }}
          >
            <HouseholdItem household={item} />
          </TouchableHighlight>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.notFound}>No Households found</Text>
        }
      />
    </Container>
  );
}

export const styles = StyleSheet.create({
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
