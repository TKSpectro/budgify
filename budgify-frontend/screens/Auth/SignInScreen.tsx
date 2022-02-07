import { gql, useMutation } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';
import { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Dimensions, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '../../components/Themed';
import { AuthContext } from '../../navigation/auth';

const SIGNIN = gql`
  mutation SIGNIN($email: String!, $password: String!) {
    signin(email: $email, password: $password)
  }
`;

interface Props {
  navigation: any;
}

type FormDate = {
  email: string;
  password: string;
};

export default function SignInScreen({ navigation }: Props) {
  const { setIsLoggedIn } = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDate>({ defaultValues: { email: '', password: '' } });

  const [signIn, { data }] = useMutation(SIGNIN, {
    onError: (error) => console.log('addRecipe error', error),
  });

  const onSubmit = (data: FormDate) => {
    signIn({ variables: data });
  };

  if (data?.signin?.length > 0) {
    SecureStore.setItemAsync('token', data.signin);
    setIsLoggedIn(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>

      <Controller
        name='email'
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Email'
          />
        )}
      />
      {errors.email && <Text>This is required.</Text>}

      <Controller
        name='password'
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Password'
          />
        )}
      />
      {errors.password && <Text>This is required.</Text>}

      <Button title='Sign in' onPress={handleSubmit(onSubmit)} />

      <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
        No account? Sign up
      </Text>
      <Text
        style={styles.link}
        onPress={() => navigation.navigate('ResetPassword')}
      >
        Forgot your password? Reset it
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
  input: {
    width: Dimensions.get('window').width - 50,
    // TODO: Check for iPad width
    maxWidth: 512,
    borderColor: 'white',
    borderRadius: 4,
    color: 'white',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  link: {
    borderColor: 'white',
    color: 'white',
    margin: 6,
    borderWidth: 1,
    padding: 10,
  },
});
