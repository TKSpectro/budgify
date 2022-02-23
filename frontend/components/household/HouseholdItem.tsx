import React from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import { View } from '../Themed';

interface Props {
  household: {
    id: string;
    name: string;
  };
}

export const HouseholdItem = ({ household }: Props) => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{household.name}</Text>
    </View>
  );
};

export const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    borderColor: '#9ca3af',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    width: Dimensions.get('window').width - 40,
    marginVertical: 8,
    marginHorizontal: 16,
    justifyContent: 'space-between',
  },
  title: {
    color: '#2dd4bf',
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    color: '#2dd4bf',
    fontSize: 20,
    marginLeft: 8,
  },
  button: {
    paddingHorizontal: 4,
    borderWidth: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    color: '#f87171',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
