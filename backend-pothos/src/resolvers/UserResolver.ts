import { builder } from '../builder';

builder.prismaObject('User', {
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    hashedPassword: t.exposeString('hashedPassword'),
    emailVerified: t.exposeBoolean('emailVerified'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    households: t.relation('households'),
    payments: t.relation('payments'),
  }),
});
