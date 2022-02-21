import { gql, useMutation } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';
import { createContext, useEffect, useMemo, useReducer } from 'react';

const LOGIN = gql`
  mutation LOGIN($input: LoginInput!) {
    login(input: $input)
  }
`;

const SIGNUP = gql`
  mutation SIGNUP($input: SignUpInput!) {
    signUp(input: $input)
  }
`;

interface IAuthContext {
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (data: any) => void;
  signOut: () => void;
  signUp: (data: any) => void;
}

export const AuthContext = createContext<IAuthContext>({
  isLoading: true,
  isLoggedIn: false,
  login: () => {},
  signOut: () => {},
  signUp: () => {},
});

interface Props {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(
    (prevState: any, action: { type: any; token?: any }) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            token: action.token,
            isLoading: false,
          };
        case 'LOGIN':
          SecureStore.setItemAsync('token', action.token);
          return {
            ...prevState,
            isSignout: false,
            token: action.token,
          };
        case 'SIGN_OUT':
          SecureStore.deleteItemAsync('token');
          return {
            ...prevState,
            isSignout: true,
            token: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      token: null,
    },
  );

  const [loginMutation] = useMutation(LOGIN, {
    onError: (error) => console.info('AUTH | LOGIN ERROR |', error),
    onCompleted: async (data) => {
      console.info('AUTH | LOGIN');
      dispatch({ type: 'LOGIN', token: data?.login });
    },
  });

  const [signUpMutation] = useMutation(SIGNUP, {
    onError: (error) => console.info('AUTH | SIGNUP ERROR |', error),
    onCompleted: async (data) => {
      console.info('AUTH | SIGNUP');
      dispatch({ type: 'LOGIN', token: data?.signUp });
    },
  });

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync('token');
      } catch (e) {
        // Restoring token failed
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      isLoading: state.isLoading,
      isLoggedIn: !!state.token,
      login: async (data: any) => {
        loginMutation({ variables: { input: data } });
      },
      signOut: () => {
        console.info('AUTH | LOGOUT');
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async (data: any) => {
        signUpMutation({ variables: { input: data } });
      },
    }),
    [state.isLoading, state.token],
  );

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
