import { Inject, NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewRecipeInput, Recipe, RecipesArgs } from './models/recipe.model';

const pubSub = new PubSub();

@Resolver((of) => Recipe)
export class RecipesResolver {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  @Query((returns) => Recipe)
  async recipe(@Args('id') id: string): Promise<Recipe> {
    const recipe = await this.prisma.recipe.findFirst({ where: { id: id } });
    if (!recipe) {
      throw new NotFoundException(id);
    }
    return recipe;
  }

  @Query((returns) => [Recipe])
  recipes(@Args() recipesArgs: RecipesArgs): Promise<Recipe[]> {
    return this.prisma.recipe.findMany({ ...recipesArgs });
  }

  @Mutation((returns) => Recipe)
  async addRecipe(
    @Args('newRecipeData') newRecipeData: NewRecipeInput,
  ): Promise<Recipe> {
    const recipe = await this.prisma.recipe.create({
      data: { ...newRecipeData },
    });
    pubSub.publish('recipeAdded', { recipeAdded: recipe });
    return recipe;
  }

  @Mutation((returns) => Boolean)
  async removeRecipe(@Args('id') id: string) {
    console.log('remove', id);
    try {
      await this.prisma.recipe.delete({ where: { id: id } });
    } catch (error) {
      // TODO: Log error for recipe not found
      return false;
    }
    return true;
  }

  @Subscription((returns) => Recipe)
  recipeAdded() {
    return pubSub.asyncIterator('recipeAdded');
  }
}
