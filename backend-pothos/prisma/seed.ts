import faker from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();

faker.seed(123);

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Tom Käppler',
      email: 'tom@mail.com',
      hashedPassword: hashSync('123123123', 10),
      emailVerified: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: faker.name.findName(),
      email: 'user@mail.com',
      hashedPassword: hashSync('123123123', 10),
      emailVerified: true,
    },
  });

  const household = await prisma.household.create({
    data: {
      name: 'My Household',
      owner: { connect: { id: user.id } },
      members: { connect: [{ id: user.id }, { id: user2.id }] },
      payments: {
        createMany: {
          data: [
            {
              name: 'Electricity',
              userId: user.id,
              value: 50,
            },
            {
              name: 'Gas',
              userId: user.id,
              value: 50,
            },
            {
              name: 'Water',
              userId: user.id,
              value: 50,
            },
          ],
        },
      },
    },
  });
}

void main()
  .then(() => void console.log('DB seeded with test data'))
  .catch((error) => {
    console.error(error);
    throw error;
  })
  .finally(() => void prisma.$disconnect());
