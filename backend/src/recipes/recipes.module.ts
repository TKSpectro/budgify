import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DateScalar } from '../common/scalars/date.scalar';
import { RecipesResolver } from './recipes.resolver';

@Module({
  imports: [PrismaModule],
  providers: [RecipesResolver, DateScalar],
})
export class RecipesModule {}
