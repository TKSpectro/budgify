import { gql, useMutation } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';
import { createContext, useEffect, useMemo, useReducer } from 'react';

const LOGIN = gql`
  mutation LOGIN($input: LoginInput!) {
    login(input: $input) {
      id
      token
    }
  }
`;

const SIGNUP = gql`
  mutation SIGNUP($input: SignUpInput!) {
    signUp(input: $input) {
      id
      token
    }
  }
`;

interface IAuthContext {
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (data: any) => void;
  signOut: () => void;
  signUp: (data: any) => void;
  userId: string;
}

export const AuthContext = createContext<IAuthContext>({
  isLoading: true,
  isLoggedIn: false,
  login: () => {},
  signOut: () => {},
  signUp: () => {},
  userId: '',
});

interface Props {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(
    (prevState: any, action: { type: any; token?: any; id?: any }) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            token: action.token,
            id: action.id,
            isLoading: false,
          };
        case 'LOGIN':
          SecureStore.setItemAsync('token', action.token);
          SecureStore.setItemAsync('userId', action.id);

          return {
            ...prevState,
            isSignout: false,
            token: action.token,
            id: action.id,
          };
        case 'SIGN_OUT':
          SecureStore.deleteItemAsync('token');
          SecureStore.deleteItemAsync('userId');

          return {
            ...prevState,
            isSignout: true,
            token: null,
            id: '',
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      token: null,
      id: '',
    },
  );

  const [loginMutation] = useMutation(LOGIN, {
    onError: (error) => console.info('AUTH | LOGIN ERROR |', error),
    onCompleted: async (data) => {
      console.info('AUTH | LOGIN');
      dispatch({ type: 'LOGIN', token: data?.login.token, id: data?.login.id });
    },
  });

  const [signUpMutation] = useMutation(SIGNUP, {
    onError: (error) => console.info('AUTH | SIGNUP ERROR |', error),
    onCompleted: async (data) => {
      console.info('AUTH | SIGNUP');
      dispatch({
        type: 'LOGIN',
        token: data?.signUp.token,
        id: data?.signUp.id,
      });
    },
  });

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      let userId;

      try {
        userToken = await SecureStore.getItemAsync('token');
        userId = await SecureStore.getItemAsync('userId');
      } catch (e) {
        // Restoring token failed
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken, id: userId });
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
      userId: state.id,
    }),
    [state.isLoading, state.token],
  );

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
