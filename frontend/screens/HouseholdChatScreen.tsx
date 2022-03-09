import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useContext, useEffect } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Container } from '../components/UI/Container';
import { AuthContext } from '../navigation/auth';
import { HomeStackScreenProps } from '../types';

const GET_HOUSEHOLD = gql`
  query GET_HOUSEHOLD($id: ID!) {
    household(id: $id) {
      id
      name
      messages {
        id
        text
        createdAt
        sender {
          id
          name
        }
      }
    }
  }
`;

const GET_MESSAGES = gql`
  subscription GET_MESSAGES($messageSentInput: MessageSent!) {
    messageSent(input: $messageSentInput) {
      id
      text
      createdAt
      sender {
        id
        name
      }
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

export default function HouseholdChatScreen({
  navigation,
}: HomeStackScreenProps<'Household'>) {
  const { userId } = useContext(AuthContext);
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
    <Container>
      <Text style={styles.text}>{household?.name}</Text>
      <ScrollView style={styles.scrollView}>
        {household?.messages.map((message: any) => {
          const isFromMe = userId === message.sender.id;

          return (
            <View
              style={[
                styles.message,
                isFromMe ? styles.messageRight : styles.messageLeft,
              ]}
              key={message.id}
            >
              <Text key={message.id} style={styles.text}>
                {message.createdAt}
              </Text>
            </View>
          );
        })}
        <Text></Text>
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
    </Container>
  );
}

export const styles = StyleSheet.create({
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
  scrollView: {
    width: '100%',
  },
  message: {
    borderWidth: 2,
    borderRadius: 8,

    padding: 4,
    margin: 2,
  },
  messageLeft: {
    borderColor: 'green',
    alignSelf: 'flex-start',
  },
  messageRight: {
    borderColor: 'blue',
    alignSelf: 'flex-end',
  },
});
