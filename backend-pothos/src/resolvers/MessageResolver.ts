import { builder } from '../builder';
import { pubsub } from '../server';
import { prisma } from '../utils/prisma';

builder.prismaObject('Message', {
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    text: t.exposeString('text'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    deletedAt: t.expose('deletedAt', { type: 'DateTime', nullable: true }),
    sender: t.relation('sender'),
    receiver: t.relation('receiver', { nullable: true }),
    household: t.relation('household', { nullable: true }),
  }),
});

builder.queryFields((t) => ({
  messages: t.prismaField({
    type: ['Message'],
    description: 'Retrieve a chat with either an other user or a household',
    args: {
      householdId: t.arg.id(),
    },
    resolve: (query, root, args, ctx) => {
      return prisma.message.findMany({
        ...query,
        where: {
          senderId: ctx.user?.id,
          householdId: args.householdId,
        },
      });
    },
  }),
}));

const CreateMessageInput = builder.inputType('CreateMessage', {
  fields: (t) => ({
    text: t.string({}),
    receiverId: t.id({ required: false }),
    householdId: t.id({ required: false }),
  }),
});

builder.mutationFields((t) => ({
  createMessage: t.prismaField({
    type: 'Message',
    args: {
      input: t.arg({ type: CreateMessageInput }),
    },
    resolve: async (query, root, args, ctx) => {
      const message = prisma.message.create({
        ...query,
        data: {
          text: args.input.text,
          sender: { connect: { id: ctx.user?.id } },
          receiver: args.input.receiverId
            ? {
                connect: { id: args.input.receiverId },
              }
            : undefined,
          household: args.input.householdId
            ? { connect: { id: args.input.householdId } }
            : undefined,
        },
      });

      pubsub.publish('messageSent', { message });

      return message;
    },
  }),
}));

const MessageSentInput = builder.inputType('MessageSent', {
  fields: (t) => ({
    householdId: t.id(),
  }),
});

builder.subscriptionField('messageSent', (t) => {
  return t.prismaField({
    type: 'Message',
    args: { input: t.arg({ type: MessageSentInput }) },
    subscribe: (_, {}, ctx, _info) => {
      return {
        [Symbol.asyncIterator]() {
          return pubsub.asyncIterator('messageSent');
        },
      };
    },
    resolve: (_, payload: any) => {
      return payload.message;
    },
  });
});
