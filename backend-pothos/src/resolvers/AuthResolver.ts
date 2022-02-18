import { builder } from '../builder';
import { authenticateUser, createJWT, hashPassword } from '../utils/auth';
import { prisma } from '../utils/prisma';

builder.queryField('me', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    skipTypeScopes: true,
    resolve: (query, _root, _args, { user }) => {
      if (!user?.id) {
        return null;
      }

      return prisma.user.findUnique({
        ...query,
        where: { id: user.id },
        rejectOnNotFound: true,
      });
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
  t.field({
    type: 'String',
    skipTypeScopes: true,
    authScopes: {
      unauthenticated: true,
    },
    args: {
      input: t.arg({ type: LoginInput }),
    },
    resolve: async (root, { input }) => {
      const authenticatedUser = await authenticateUser(
        input.email,
        input.password,
      );

      // TODO: implement email verification
      const ENABLE_EMAIL_VERIFICATION = false;
      if (ENABLE_EMAIL_VERIFICATION) {
        if (!authenticatedUser.emailVerified) {
        } else {
          // We re-send the verification email for convenience:
          // await sendVerificationEmail(user);
        }
      }

      return createJWT({ id: authenticatedUser.id });
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
  t.field({
    type: 'String',
    skipTypeScopes: true,
    authScopes: {
      unauthenticated: true,
    },
    args: {
      input: t.arg({ type: SignUpInput }),
    },
    resolve: async (root, { input }) => {
      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          hashedPassword: await hashPassword(input.password),
        },
      });
      // TODO: implement email verification
      const ENABLE_EMAIL_VERIFICATION = false;
      if (ENABLE_EMAIL_VERIFICATION) {
        if (!user.emailVerified) {
        } else {
          // We re-send the verification email for convenience:
          // await sendVerificationEmail(user);
        }
      }

      return createJWT({ id: user.id });
    },
  }),
);
