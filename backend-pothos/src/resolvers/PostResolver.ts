import { builder } from '../builder';
import { prisma } from '../utils/prisma';

builder.prismaObject('Post', {
  findUnique: ({ id }) => ({ id: Number.parseInt(String(id), 10) }),

  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    content: t.exposeString('content'),
    author: t.relation('author'),
    comments: t.relation('comments'),
  }),
});

builder.prismaObject('Comment', {
  findUnique: ({ id }) => ({ id: Number.parseInt(String(id), 10) }),
  fields: (t) => ({
    id: t.exposeID('id'),
    comment: t.exposeString('comment'),
    author: t.relation('author'),
    post: t.relation('post'),
  }),
});

const DEFAULT_PAGE_SIZE = 10;

builder.queryFields((t) => ({
  post: t.prismaField({
    type: 'Post',
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: (query, root, args) =>
      prisma.post.findUnique({
        ...query,
        where: { id: Number.parseInt(String(args.id), 10) },
      }),
  }),
  posts: t.prismaField({
    type: ['Post'],
    args: {
      take: t.arg.int(),
      skip: t.arg.int(),
    },
    resolve: (query, root, args) =>
      prisma.post.findMany({
        ...query,
        take: args.take ?? DEFAULT_PAGE_SIZE,
        skip: args.skip ?? 0,
      }),
  }),
  user: t.prismaField({
    type: 'User',
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: (query, root, args) =>
      prisma.user.findUnique({
        ...query,
        where: { id: args.id?.toString() },
      }),
  }),
}));
