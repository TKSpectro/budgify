import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DateScalar } from '../common/scalars/date.scalar';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3d' },
    }),
  ],
  providers: [UserResolver, DateScalar],
})
export class UserModule {}
