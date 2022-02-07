import * as SecureStore from 'expo-secure-store';
import { createContext, useState } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (newValue: boolean) => {},
});

interface Props {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // TODO: write some actual fucking auth logic with actually works
  const token = SecureStore.getItemAsync('token').then((token) => {
    setIsLoggedIn(!!token);
  });

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
