import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DateScalar } from '../common/scalars/date.scalar';
import { UserResolver } from './user.resolver';

@Module({
  imports: [PrismaModule],
  providers: [UserResolver, DateScalar],
})
export class UserModule {}
