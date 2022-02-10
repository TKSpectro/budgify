import { Inject, UseGuards } from '@nestjs/common';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/guards/auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './models/user.model';

@Resolver((of) => User)
export class UserResolver {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  @Query((returns) => User)
  @UseGuards(new AuthGuard())
  async me(@Context() context): Promise<User> {
    return this.prisma.user.findFirst({ where: { id: context.user.id } });
  }
}
