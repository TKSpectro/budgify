import { ValidationError } from 'apollo-server';
import { compareSync, hashSync } from 'bcrypt';
import { prisma } from './prisma';

/**
 * Hash a plain text password and return the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = hashSync(password, 10);

  return hashedPassword;
}

/**
 * Verify that a hashed password and a plain text password match.
 */
export function verifyPassword(
  hashedPassword: string,
  password: string,
): boolean {
  return compareSync(password, hashedPassword);
}

/**
 * Attempts to authenticate a user, given their username and password.
 */
export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: 'insensitive',
      },
    },
  });

  if (!user || !user.hashedPassword) {
    throw new ValidationError('Email not found');
  }

  // If the password is invalid, reject the authenticate request:
  if (!(await verifyPassword(user.hashedPassword, password))) {
    throw new ValidationError('Invalid password.');
  }

  return user;
}
