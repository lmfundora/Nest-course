import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String, { description: 'Example field (placeholder)' })
  id: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @Field(() => String)
  deleted: boolean;

  @Field(() => String)
  email: string;

  @Field(()=> [String])
  rol: string[]
}
