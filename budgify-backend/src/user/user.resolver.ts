import { Inject } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ApolloError } from 'apollo-server-express';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './models/user.model';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Query((returns) => User)
  async me(@Context() context): Promise<User> {
    const token = context?.req?.headers?.authorization || '';

    if (!token) {
      throw new ApolloError('No token provided');
    }

    const decoded = this.jwtService.verify(token);

    return this.prisma.user.findFirst({ where: { id: decoded.id } });
  }

  @Mutation((returns) => String)
  async signin(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    const user = await this.prisma.user.findFirst({ where: { email: email } });
    if (!user) {
      throw new ApolloError('User not found');
    }

    // TODO: Check if data is actually correct

    return this.jwtService.sign({ id: user.id });
  }
}
