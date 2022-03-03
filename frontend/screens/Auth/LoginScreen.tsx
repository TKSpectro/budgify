import { Button, Input, Text, View } from 'native-base';
import React, { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dimensions } from 'react-native';
import { AuthContext } from '../../navigation/auth';

interface Props {
  navigation: any;
}

type FormDate = {
  email: string;
  password: string;
};

export default function LoginScreen({ navigation }: Props) {
  const { login } = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDate>({ defaultValues: { email: '', password: '' } });

  const onSubmit = (data: FormDate) => {
    login({ ...data });
  };

  return (
    <View
      // style={styles.container}
      flex={1}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Text fontSize={20} fontWeight='bold'>
        Sign in
      </Text>

      <Controller
        name='email'
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Email'
            autoCompleteType='email'
            w={Dimensions.get('window').width - 50}
            maxW={512}
            m={1}
            borderColor={'#ccc'}
          />
        )}
      />
      {errors.email && <Text>This is required.</Text>}

      <Controller
        name='password'
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            secureTextEntry={true}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Password'
            autoCompleteType='password'
            w={Dimensions.get('window').width - 50}
            maxW={512}
            m={1}
            borderColor={'#ccc'}
          />
        )}
      />
      {errors.password && <Text>This is required.</Text>}

      <Button onPress={handleSubmit(onSubmit)} m={1}>
        Sign in
      </Button>

      <Text onPress={() => navigation.navigate('SignUp')} m={1} p={1}>
        No account? Sign up
      </Text>
      <Text onPress={() => navigation.navigate('ResetPassword')} m={1} p={1}>
        Forgot your password? Reset it
      </Text>
    </View>
  );
}
