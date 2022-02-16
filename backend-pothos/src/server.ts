import { ApolloServer } from 'apollo-server';
import { builder } from './builder';
import './resolvers';
import { resolveSession } from './utils/sessions';

const PORT = 3000;

export const schema = builder.toSchema({});

export const server = new ApolloServer({
  schema,
  context: async ({ req, res }) => {
    const { session, ironSession } = await resolveSession(req, res);

    return { req, res, ironSession, session };
  },
});

void server.listen(PORT, (error: unknown) => {
  if (error) {
    throw error;
  }

  console.log(`🚀 Server started at http://127.0.0.1:${PORT}`);
});
