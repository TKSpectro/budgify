import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { PrismaModule } from './prisma/prisma.module';
import { RecipesModule } from './recipes/recipes.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    RecipesModule,
    UserModule,
  ],
})
export class AppModule {}
