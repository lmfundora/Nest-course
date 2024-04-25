import { ObjectType, Field, Int, GraphQLISODateTime, ID } from '@nestjs/graphql';
import { Items as Item } from "@prisma/client";
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Items {
  @Field(() => String)
  id: Item[`id`];

  @Field(()=> String)
  name: Item[`name`]

  @Field(()=> Int)
  quantity: Item[`quantity`]
  
  @Field(()=> String)
  quantityUnits?: Item[`quantityUnits`]

  @Field(()=> GraphQLISODateTime)
  createdAt: Date

  @Field(()=> GraphQLISODateTime)
  updatedAt: Date

  @Field(()=> Boolean)
  deleted: Item[`deleted`]

  @Field(()=> User, {nullable:true})
  user?: User
}
