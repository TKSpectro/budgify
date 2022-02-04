import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewRecipeInput } from './dto/new-recipe.input';
import { RecipesArgs } from './dto/recipes.args';
import { Recipe } from './models/recipe.model';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async create(data: NewRecipeInput): Promise<Recipe> {
    return this.prisma.recipe.create({
      data,
    });
  }

  async findOneById(id: string): Promise<Recipe> {
    return this.prisma.recipe.findFirst({ where: { id: id } });
  }

  async findAll(recipesArgs: RecipesArgs): Promise<Recipe[]> {
    return this.prisma.recipe.findMany({ ...recipesArgs });
  }

  async remove(id: string): Promise<boolean> {
    return !!this.prisma.recipe.delete({ where: { id: id } });
  }
}
