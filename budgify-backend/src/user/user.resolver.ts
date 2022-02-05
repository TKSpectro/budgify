import { Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './models/user.model';

@Resolver((of) => User)
export class UserResolver {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  @Query((returns) => User)
  async me(): Promise<User> {
    return this.prisma.user.findFirst();
  }
}
