import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import SmartSubscriptionPlugin, {
  subscribeOptionsFromIterator,
} from '@pothos/plugin-smart-subscriptions';
import ValidationPlugin from '@pothos/plugin-validation';
import type PrismaTypes from '../prisma/pothos-types';
import { pubsub } from './server';
import { Context } from './types';
import { prisma } from './utils/prisma';

export const builder = new SchemaBuilder<{
  DefaultInputFieldRequiredness: true;
  PrismaTypes: PrismaTypes;
  Context: Context;
  Scalars: {
    // Force ID to be always a string as we only use UUIDs
    ID: { Input: string; Output: string | number };
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
    ...subscribeOptionsFromIterator((name) => {
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

builder.subscriptionType({
  // TODO: Figure out how to enable auth for subscriptions (withFilter)
  // authScopes: {
  //   user: true,
  // },
});

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
