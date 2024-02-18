import {  IsArray, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => String)
  @IsUUID()
  id: string;

  @Field(() => ID, {nullable:true})
  lastUpdatedBy: string

  @Field(() => [String], {nullable: true})
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  rol?: string[]
}
