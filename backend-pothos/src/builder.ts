import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import SmartSubscriptionPlugin, {
  subscribeOptionsFromIterator,
} from '@pothos/plugin-smart-subscriptions';
import ValidationPlugin from '@pothos/plugin-validation';
import type PrismaTypes from '../prisma/pothos-types';
import { Context } from './types';
import { prisma } from './utils/prisma';

export const builder = new SchemaBuilder<{
  DefaultInputFieldRequiredness: true;
  PrismaTypes: PrismaTypes;
  Context: Context;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
  AuthScopes: {
    public: boolean;
    user: boolean;
    unauthenticated: boolean;
  };
}>({
  defaultInputFieldRequiredness: true,
  plugins: [
    ScopeAuthPlugin,
    ValidationPlugin,
    SmartSubscriptionPlugin,
    PrismaPlugin,
  ],
  prisma: {
    client: prisma,
  },
  authScopes: ({ user }) => ({
    public: true,
    user: !!user,
    unauthenticated: !user,
  }),
  smartSubscriptions: {
    ...subscribeOptionsFromIterator((name, { pubsub }) => {
      return pubsub.asyncIterator(name);
    }),
  },
});

// Initializes the query and mutation to be defaulted to user authScope
builder.queryType({
  authScopes: {
    user: true,
  },
});

builder.mutationType({
  authScopes: {
    user: true,
  },
});

// builder.subscriptionType({});

// Custom DateTime scalar
builder.scalarType('DateTime', {
  serialize: (date) => date.toISOString(),
  parseValue: (date) => {
    if (typeof date !== 'string') {
      throw new Error('Unknown date value.');
    }

    return new Date(date);
  },
});
