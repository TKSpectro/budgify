import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { compareSync, hashSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../user/models/user.model';

@Resolver((of) => User)
export class AuthResolver {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  @Mutation((returns) => String)
  async signin(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    const user = await this.prisma.user.findFirst({ where: { email: email } });

    if (!user || !compareSync(password, user.hashedPassword)) {
      throw new ApolloError('Invalid credentials');
    }

    return 'Bearer ' + jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  }

  @Mutation((returns) => String)
  async signup(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    const hashedPassword = hashSync(password, 10);

    let user;
    try {
      user = await this.prisma.user.create({
        data: { name, email, hashedPassword },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ApolloError('User with this email already exists');
      }
      throw new ApolloError('Something went wrong');
    }
    return 'Bearer ' + jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  }
}
