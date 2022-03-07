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
  const { field, fieldState } = useController({
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

      {fieldState.error && (
        <Text style={styles.error}>{fieldState.error.message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: '#ccc' },
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
  error: { color: 'red', marginLeft: 12, marginBottom: 12 },
});
