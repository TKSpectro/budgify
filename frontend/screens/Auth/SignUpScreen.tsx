import { FontAwesome } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, StyleSheet } from 'react-native';
import { Text } from '../../components/Themed';
import { Container } from '../../components/UI/Container';
import Input from '../../components/UI/Input';
import { AuthContext } from '../../navigation/auth';

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface Props {
  navigation: any;
}

export default function SignUpScreen({ navigation }: Props) {
  const { signUp } = useContext(AuthContext);
  const form = useForm<FormData>({
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = (data: FormData) => {
    signUp({ ...data });
  };

  return (
    <Container>
      <Text style={styles.title}>SignUp</Text>

      <FormProvider {...form}>
        <Input
          name='name'
          label='Name'
          rules={{
            required: { value: true, message: 'Name is required.' },
          }}
          autoCompleteType='name'
        />

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
