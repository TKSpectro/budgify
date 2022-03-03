import { Text, View } from 'native-base';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';

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
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    width: Dimensions.get('window').width - 40,
    marginVertical: 8,
    marginHorizontal: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
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
    fontSize: 20,
    fontWeight: 'bold',
  },
});
