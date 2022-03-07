import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../components/Themed';
import { Container } from '../components/UI/Container';
import { RootStackScreenProps } from '../types';

export default function NotFoundScreen({
  navigation,
}: RootStackScreenProps<'NotFound'>) {
  return (
    <Container>
      <Text style={styles.title}>This screen doesn't exist.</Text>
      <TouchableOpacity
        onPress={() => navigation.replace('Root')}
        style={styles.link}
      >
        <Text style={styles.linkText}>Go to home screen!</Text>
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
