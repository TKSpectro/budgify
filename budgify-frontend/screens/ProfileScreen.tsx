import React, { useContext } from 'react';
import { Button, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { AuthContext } from '../navigation/auth';

export default function ProfileScreen() {
  const { setIsLoggedIn } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Button title='Logout' onPress={() => setIsLoggedIn(false)} />
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
