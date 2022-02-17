import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import { builder } from './builder';
import './resolvers';
import { resolveSession } from './utils/sessions';

const PORT = 3000;

export const schema = builder.toSchema({});

async function startApolloServer() {
  // Required logic for integrating with Express
  const app = express();
  const httpServer = createServer(app);

  const server = new ApolloServer({
    schema,
    context: async ({ req, res }) => {
      const { session, ironSession } = await resolveSession(req, res);

      return { req, res, ironSession, session };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app, path: '/' });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 3000 }, resolve),
  );
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
}

startApolloServer();
