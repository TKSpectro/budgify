import { builder } from '../builder';
import { authenticateUser, hashPassword } from '../utils/auth';
import { prisma } from '../utils/prisma';
import { createSession, removeSession } from '../utils/sessions';

builder.queryField('me', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    skipTypeScopes: true,
    resolve: (query, _root, _args, { session }) => {
      if (!session?.userId) {
        return null;
      }

      return prisma.user.findUnique({
        ...query,
        where: { id: session.userId },
        rejectOnNotFound: true,
      });
    },
  }),
);

builder.mutationField('logout', (t) =>
  t.field({
    type: 'String',
    resolve: async (_root, _args, { ironSession, session }) => {
      await removeSession(ironSession, session);
      return 'SUCCESS';
    },
  }),
);

const LoginInput = builder.inputType('LoginInput', {
  fields: (t) => ({
    email: t.string({ validate: { email: true } }),
    password: t.string({ validate: { minLength: 6 } }),
  }),
});

builder.mutationField('login', (t) =>
  t.prismaField({
    type: 'User',
    skipTypeScopes: true,
    authScopes: {
      unauthenticated: true,
    },
    args: {
      input: t.arg({ type: LoginInput }),
    },
    resolve: async (_query, _root, { input }, { ironSession }) => {
      const user = await authenticateUser(input.email, input.password);

      // implement email verification
      const ENABLE_EMAIL_VERIFICATION = false;
      if (ENABLE_EMAIL_VERIFICATION) {
        if (user.emailVerified) {
          await createSession(ironSession, user);
        } else {
          // We re-send the verification email for convenience:
          // await sendVerificationEmail(user);
        }
      } else {
        await createSession(ironSession, user);
      }

      return user;
    },
  }),
);

const SignUpInput = builder.inputType('SignUpInput', {
  fields: (t) => ({
    name: t.string({
      validate: {
        minLength: 1,
        maxLength: 100,
      },
    }),
    email: t.string({ validate: { email: true } }),
    password: t.string({ validate: { minLength: 6 } }),
  }),
});

builder.mutationField('signUp', (t) =>
  t.prismaField({
    type: 'User',
    skipTypeScopes: true,
    authScopes: {
      unauthenticated: true,
    },
    args: {
      input: t.arg({ type: SignUpInput }),
    },
    resolve: async (query, _root, { input }, { ironSession }) => {
      const user = await prisma.user.create({
        ...query,
        data: {
          name: input.name,
          email: input.email,
          hashedPassword: await hashPassword(input.password),
        },
      });
      // implement email verification
      const ENABLE_EMAIL_VERIFICATION = false;
      if (ENABLE_EMAIL_VERIFICATION) {
        // await sendVerificationEmail(user);
      } else {
        await createSession(ironSession, user);
      }

      return user;
    },
  }),
);
