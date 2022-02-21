import { FontAwesome } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Dimensions, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '../../components/Themed';
import { AuthContext } from '../../navigation/auth';

type FormDate = {
  name: string;
  email: string;
  password: string;
};

interface Props {
  navigation: any;
}

export default function SignUpScreen({ navigation }: Props) {
  const { signUp } = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDate>({
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = (data: FormDate) => {
    signUp({ ...data });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SignUp</Text>

      <Controller
        name='name'
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Name'
            autoCompleteType='name'
          />
        )}
      />
      {errors.name && <Text>This is required.</Text>}

      <Controller
        name='email'
        control={control}
        rules={{ required: true }}
        // TODO: Validate correct email format
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Email'
            autoCompleteType='email'
          />
        )}
      />
      {errors.email && <Text>This is required.</Text>}

      <Controller
        name='password'
        control={control}
        rules={{ required: true }}
        // TODO: Validate length etc.
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Password'
            autoCompleteType='password'
          />
        )}
      />
      {errors.password && <Text>This is required.</Text>}

      <Button title='Sign up' onPress={handleSubmit(onSubmit)} />

      <Text style={styles.link} onPress={() => navigation.navigate('SignIn')}>
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
});
