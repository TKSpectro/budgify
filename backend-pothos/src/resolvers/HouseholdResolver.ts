import { builder } from '../builder';
import { prisma } from '../utils/prisma';

builder.prismaObject('Household', {
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    owner: t.relation('owner'),
    members: t.relation('members'),
    payments: t.relation('payments'),
  }),
});

builder.queryFields((t) => ({
  household: t.prismaField({
    type: 'Household',
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: (query, root, args, ctx) => {
      return prisma.household.findFirst({
        ...query,
        where: {
          id: args.id,
          members: { some: { id: { equals: ctx.user?.id } } },
        },
      });
    },
  }),
  households: t.prismaField({
    type: ['Household'],
    nullable: true,
    resolve: (query, root, args, ctx) => {
      return prisma.user
        .findUnique({ ...query, where: { id: ctx.user?.id } })
        .households();
    },
  }),
}));

const CreateHouseholdInput = builder.inputType('CreateHousehold', {
  fields: (t) => ({
    name: t.string({
      validate: {
        minLength: 1,
      },
    }),
  }),
});

builder.mutationField('createHousehold', (t) =>
  t.prismaField({
    type: 'Household',
    args: {
      input: t.arg({ type: CreateHouseholdInput }),
    },
    resolve: async (query, _root, args, ctx) => {
      const household = await prisma.household.create({
        ...query,
        data: {
          name: args.input.name,
          owner: { connect: { id: ctx.user?.id } },
          members: { connect: { id: ctx.user?.id } },
        },
      });

      return household;
    },
  }),
);
