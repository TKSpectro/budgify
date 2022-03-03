import { FontAwesome } from '@expo/vector-icons';
import { Text, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

interface Props {
  navigation: any;
}

export default function ResetPasswordScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ResetPassword</Text>
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        <FontAwesome name='arrow-left' size={20} />
        Go back
      </Text>
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
  link: {
    color: 'white',
    margin: 6,
    borderWidth: 1,
    padding: 10,
  },
});
