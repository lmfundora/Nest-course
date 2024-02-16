import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput, UpdateUserInput } from './dto/inputs';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'ListUsers' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'ListOneUser' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User, { name: 'UpdateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    try {
      return this.usersService.update(updateUserInput.id, updateUserInput);
    } catch (error) {
      throw new NotFoundException('User not found.');
    }
  }

  @Mutation(() => User, { name: 'DeleteUser' })
  async removeUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    try {
      return this.usersService.remove(id);
    } catch (error) {
      throw new NotFoundException('User not found.');
    }
  }
}
