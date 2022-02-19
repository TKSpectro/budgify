import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { builder } from './builder';
import './resolvers';
import { prisma } from './utils/prisma';

export const schema = builder.toSchema({});
export const pubsub = new PubSub();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set');
}

(async function () {
  const app = express();
  const httpServer = createServer(app);

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: '/',
    },
  );

  const server = new ApolloServer({
    schema,
    context: async ({ req, res }) => {
      let user = null;

      try {
        if (req.headers.authorization?.startsWith('Bearer ')) {
          const token = req.headers.authorization?.split(' ')[1] || null;

          if (token) {
            const data = jwt.verify(token, process.env.JWT_SECRET!);

            if (typeof data !== 'string') {
              user = await prisma.user.findFirst({
                where: {
                  id: data.id,
                },
              });
            }
          }
        }
      } catch (error) {}

      return { req, res, user };
    },
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app, path: '/' });

  httpServer.listen({ port: 3000 }, () =>
    console.log(
      `🚀 Server ready at http://localhost:3000${server.graphqlPath}`,
    ),
  );
})();
