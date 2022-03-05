import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Button, ScrollView, StatusBar, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeStackScreenProps } from '../types';

const GET_HOUSEHOLD = gql`
  query GET_HOUSEHOLD($id: ID!) {
    household(id: $id) {
      id
      name
      payments {
        id
      }
      messages {
        id
        text
        # sender {
        #   id
        #   name
        # }
      }
    }
  }
`;

const GET_MESSAGES = gql`
  subscription GET_MESSAGES($messageSentInput: MessageSent!) {
    messageSent(input: $messageSentInput) {
      id
      text
      # sender {
      #   id
      #   name
      # }
    }
  }
`;

const CREATE_MESSAGE = gql`
  mutation CREATE_MESSAGE($input: CreateMessage!) {
    createMessage(input: $input) {
      id
      text
    }
  }
`;

export default function HouseholdScreen({
  navigation,
}: HomeStackScreenProps<'Household'>) {
  const id =
    navigation.getState().routes[navigation.getState().index]?.params?.id;

  const { data, subscribeToMore } = useQuery(GET_HOUSEHOLD, {
    variables: { id },
  });
  const household = data?.household;

  const [createMessage] = useMutation(CREATE_MESSAGE);

  // TODO: Using this kills the usage of hot reloading because the ws connection gets lost on reload
  useEffect(() => {
    subscribeToMore({
      document: GET_MESSAGES,

      variables: { messageSentInput: { householdId: id } },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          household: {
            ...prev.household,
            messages: [newMessage, ...prev.household.messages],
          },
        });
      },
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>{household?.name}</Text>
      <ScrollView>
        <Text style={styles.text}>{JSON.stringify(household, null, 2)}</Text>
      </ScrollView>
      <Button
        title='Send Message'
        onPress={() => {
          createMessage({
            variables: {
              input: {
                householdId: household.id,
                text: `Test ${new Date().toJSON()}`,
              },
            },
          });
        }}
      />
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight || 0,
  },
  text: {
    color: 'white',
  },
  notFound: {
    borderColor: '#9ca3af',
    borderWidth: 2,
    borderRadius: 10,
    color: '#f87171',
    fontSize: 20,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
