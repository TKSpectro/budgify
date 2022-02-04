import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DateScalar } from '../common/scalars/date.scalar';
import { RecipesResolver } from './recipes.resolver';
import { RecipesService } from './recipes.service';

@Module({
  imports: [PrismaModule],
  providers: [RecipesResolver, RecipesService, DateScalar],
})
export class RecipesModule {}
