import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

interface ContainerProps {
  children: React.ReactNode;
}

export function Container({ children }: ContainerProps) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight || 0,
  },
});
