import { Inject } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ApolloError } from 'apollo-server-express';
import { compareSync, hashSync } from 'bcrypt';
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

  // TODO: Move auth resolvers into a separate module
  @Mutation((returns) => String)
  async signin(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    const user = await this.prisma.user.findFirst({ where: { email: email } });

    if (!user || !compareSync(password, user.hashedPassword)) {
      throw new ApolloError('Invalid credentials');
    }

    return this.jwtService.sign({ id: user.id });
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

    return this.jwtService.sign({ id: user.id });
  }
}
