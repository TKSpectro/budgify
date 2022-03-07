import { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, StyleSheet } from 'react-native';
import { Text } from '../../components/Themed';
import { Container } from '../../components/UI/Container';
import Input from '../../components/UI/Input';
import { AuthContext } from '../../navigation/auth';

interface Props {
  navigation: any;
}

interface FormData {
  email: string;
  password: string;
}

export default function LoginScreen({ navigation }: Props) {
  const { login } = useContext(AuthContext);
  const form = useForm<FormData>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: FormData) => {
    login({ ...data });
  };

  return (
    <Container>
      <Text style={styles.title}>Sign in</Text>

      <FormProvider {...form}>
        <Input
          name='email'
          label='Email'
          rules={{
            required: { value: true, message: 'Email is required.' },
          }}
          autoCompleteType='email'
        />

        <Input
          name='password'
          label='Password'
          rules={{
            required: { value: true, message: 'Password is required.' },
          }}
          secureTextEntry={true}
          autoCompleteType='password'
        />

        <Button title='Sign in' onPress={form.handleSubmit(onSubmit)} />
      </FormProvider>

      <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
        No account? Sign up
      </Text>
      <Text
        style={styles.link}
        onPress={() => navigation.navigate('ResetPassword')}
      >
        Forgot your password? Reset it
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
    borderColor: 'white',
    color: 'white',
    margin: 6,
    borderWidth: 1,
    padding: 10,
  },
});
