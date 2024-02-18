import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

import { Items as Item } from "@prisma/client";

@InputType()
export class CreateItemInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: Item[`name`]

  @Field(() => Int)
  @IsNotEmpty()
  @IsPositive()
  quantity: Item[`quantity`]

  @Field(() => String, { nullable:true })
  @IsString()
  @IsOptional()
  quantityUnits?: Item[`quantityUnits`]

  // @Field(()=> ID)
  // @IsUUID()
  // @IsNotEmpty()
  // userId: Item[`userId`]
}
