import { User } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { IncomingMessage, OutgoingMessage } from 'http';

export interface Context {
  req: IncomingMessage;
  res: OutgoingMessage;
  user: User | null;
  pubsub: PubSub;
}
