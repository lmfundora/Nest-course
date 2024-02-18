import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/inputs';
import { NotFoundException, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ValidRolesArgs } from './dto/ardgs/roles.args';
import { GqlAuthGuard } from 'src/auth/guards/graph-jwt-auth.guard';
import { CurrentUserGraphql } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'ListUsers' })
  async findAll(
    @Args() valirRoles: ValidRolesArgs,
    @CurrentUserGraphql([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User[]> {
    return this.usersService.findAll(valirRoles.roles);
  }

  @Query(() => User, { name: 'ListOneUser' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUserGraphql([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User, { name: 'UpdateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUserGraphql([
      ValidRoles.user,
      ValidRoles.superUser,
      ValidRoles.superUser,
    ])
    user: User,
  ): Promise<User> {
    try {
      return this.usersService.update(updateUserInput.id, updateUserInput, user.id);
    } catch (error) {
      throw new NotFoundException('User not found.');
    }
  }

  @Mutation(() => User, { name: 'DeleteUser' })
  async removeUser(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUserGraphql([
      ValidRoles.user,
      ValidRoles.admin,
      ValidRoles.superUser,
    ])
    user: User,
  ): Promise<User> {
    try {
      return this.usersService.remove(id, user.id);
    } catch (error) {
      throw new NotFoundException('User not found.');
    }
  }
}
