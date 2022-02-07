import { gql, useMutation } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';
import { createContext, useEffect, useMemo, useReducer } from 'react';

const SIGNIN = gql`
  mutation SIGNIN($email: String!, $password: String!) {
    signin(email: $email, password: $password)
  }
`;

interface IAuthContext {
  isLoading: boolean;
  isLoggedIn: boolean;
  signIn: (data: any) => void;
  signOut: () => void;
  signUp: (data: any) => void;
}

export const AuthContext = createContext<IAuthContext>({
  isLoading: true,
  isLoggedIn: false,
  signIn: () => {},
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
        case 'SIGN_IN':
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

  const [signInMutation] = useMutation(SIGNIN, {
    onError: (error) => console.info('AUTH | SIGNIN ERROR |', error),
    onCompleted: async (data) => {
      console.info('AUTH | SIGNIN');
      dispatch({ type: 'SIGN_IN', token: data?.signin });
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

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      isLoading: state.isLoading,
      isLoggedIn: !!state.token,
      signIn: async (data: any) => {
        signInMutation({ variables: data });
      },
      signOut: () => {
        console.info('AUTH | LOGOUT');
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async (data: any) => {
        // TODO: Same as signIn
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    [state.isLoading, state.token],
  );

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
