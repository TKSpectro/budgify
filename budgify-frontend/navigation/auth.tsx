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

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
