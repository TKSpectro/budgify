import React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

interface InputProps extends TextInputProps, UseControllerProps {
  label?: string;
  defaultValue?: string;
}

export default function Input({
  label,
  name,
  rules,
  defaultValue,
  ...props
}: InputProps) {
  const { field } = useController({
    name,
    rules,
    defaultValue,
  });

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        onBlur={field.onBlur}
        onChangeText={field.onChange}
        value={field.value}
        {...props}
      />

      {/* {errors[name] && <Text>This is required.</Text>} */}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: '#ccc' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    color: '#ccc',
    width: Dimensions.get('window').width - 50,
  },
});
