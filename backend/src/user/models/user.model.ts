import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'user ' })
export class User {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  hashedPassword: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
