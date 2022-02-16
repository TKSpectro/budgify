/* eslint-disable no-await-in-loop */
/* eslint-disable no-magic-numbers */
import faker from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

faker.seed(123);

console.log('creating users and posts');

async function main() {
  for (let i = 1; i <= 100; i += 1) {
    await prisma.user.create({
      data: {
        id: i.toString(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        hashedPassword: faker.internet.password(),
        emailVerified: true,
      },
    });
  }

  for (let i = 1; i <= 100; i += 1) {
    await prisma.post.create({
      data: {
        id: i,
        authorId: faker.datatype.number({ min: 1, max: 100 }).toString(),
        title: faker.lorem.text(),
        content: faker.lorem.paragraphs(2),
      },
    });
  }

  for (let i = 1; i <= 100; i += 1) {
    await prisma.comment.create({
      data: {
        id: i,
        authorId: faker.datatype.number({ min: 1, max: 100 }).toString(),
        postId: faker.datatype.number({ min: 1, max: 100 }),
        comment: faker.lorem.text(),
      },
    });
  }
}

void main()
  .then(() => void console.log('DB seeded with test data'))
  .catch((error) => {
    console.error(error);
    throw error;
  })
  .finally(() => void prisma.$disconnect());
