import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '../../components/Themed';
import { Container } from '../../components/UI/Container';

interface Props {
  navigation: any;
}

export default function ResetPasswordScreen({ navigation }: Props) {
  return (
    <Container>
      <Text style={styles.title}>ResetPassword</Text>
      <Text style={styles.link} onPress={() => navigation.navigate('SignIn')}>
        <FontAwesome name='arrow-left' size={20} />
        Go back
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
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
