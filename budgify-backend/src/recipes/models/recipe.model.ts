import {
  ArgsType,
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { IsOptional, Length, Max, MaxLength, Min } from 'class-validator';

@ObjectType({ description: 'recipe ' })
export class Recipe {
  @Field((type) => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt: Date;

  @Field((type) => [String])
  ingredients: string[];
}

@InputType()
export class NewRecipeInput {
  @Field()
  @MaxLength(30)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(30, 255)
  description?: string;

  @Field(() => [String])
  ingredients: string[];
}

@ArgsType()
export class RecipesArgs {
  @Field(() => Int)
  @Min(0)
  skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25;
}
