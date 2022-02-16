import { builder } from '../builder';

builder.prismaObject('User', {
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    hashedPassword: t.exposeString('hashedPassword'),
    emailVerified: t.exposeBoolean('emailVerified'),
    posts: t.relation('posts'),
    comments: t.relation('comments'),
  }),
});
