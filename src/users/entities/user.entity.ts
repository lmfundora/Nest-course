import { ObjectType, Field, Int, GraphQLISODateTime, ID } from '@nestjs/graphql';
import { Items } from 'src/items/entities/item.entity';

@ObjectType()
export class User {
  @Field(() => ID, { description: 'Example field (placeholder)' })
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

  @Field(()=> ID, {nullable: true})
  lastUpdatedBy?: string

  // @Field(()=> Items, {nullable: true})
  // items: Items
}
