import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [PrismaModule],
  providers: [AuthResolver],
  exports: [],
})
export class AuthModule {}
