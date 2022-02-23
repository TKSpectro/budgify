import { builder } from '../builder';
import { pubsub } from '../server';
import { prisma } from '../utils/prisma';

builder.prismaObject('Payment', {
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    value: t.exposeFloat('value'),
    description: t.exposeString('description', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    household: t.relation('household'),
    user: t.relation('user'),
  }),
});

builder.queryFields((t) => ({
  payment: t.prismaField({
    type: 'Payment',
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: (query, root, args, ctx) => {
      return prisma.payment.findFirst({
        ...query,
        where: {
          id: args.id,
          // User needs to be a member of the household where the payment exists
          household: { members: { some: { id: { equals: ctx.user?.id } } } },
        },
      });
    },
  }),
}));

const CreatePaymentInput = builder.inputType('CreatePayment', {
  fields: (t) => ({
    name: t.string({
      validate: {
        minLength: 1,
      },
    }),
    value: t.int({}),
    description: t.string({ required: false, validate: { minLength: 1 } }),
    householdId: t.id({}),
  }),
});

builder.mutationField('createPayment', (t) =>
  t.prismaField({
    type: 'Payment',
    args: {
      input: t.arg({ type: CreatePaymentInput }),
    },
    resolve: async (query, _root, args, ctx) => {
      const payment = await prisma.payment.create({
        ...query,
        data: {
          name: args.input.name,
          value: args.input.value,
          description: args.input.description,
          household: { connect: { id: args.input.householdId } },
          user: { connect: { id: ctx.user?.id } },
        },
      });

      pubsub.publish('paymentCreated', { payment });

      return payment;
    },
  }),
);

builder.subscriptionField('paymentCreated', (t) => {
  return t.prismaField({
    type: 'Payment',
    subscribe: () => {
      return {
        [Symbol.asyncIterator]() {
          return pubsub.asyncIterator('paymentCreated');
        },
      };
    },
    resolve: (_, payload: any) => {
      return payload?.payment;
    },
  });
});
