import { gql, useQuery } from '@apollo/client';
import { FlatList, Text } from 'native-base';
import React from 'react';
import { StatusBar, StyleSheet, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HouseholdItem } from '../components/household/HouseholdItem';
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
    <SafeAreaView style={styles.container}>
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
