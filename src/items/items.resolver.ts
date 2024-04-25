import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Items } from './entities/item.entity';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { NotFoundException, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graph-jwt-auth.guard';
import { CurrentUserGraphql } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Items)
@UseGuards(GqlAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Items, { name: 'CreateItem' })
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUserGraphql([
      ValidRoles.user,
      ValidRoles.admin,
      ValidRoles.superUser,
    ])
    user: User,
  ): Promise<Items> {
    return this.itemsService.create(createItemInput, user.id);
  }

  @Query(() => [Items], { name: 'ListItems' })
  async findAll(
    @CurrentUserGraphql()
    user: User,
  ): Promise<Items[]> {
    return this.itemsService.findAll(user);
  }

  @Query(() => Items, { name: 'ListOneItem' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUserGraphql()
    user: User,
  ): Promise<Items> {
    return this.itemsService.findOne(id, user);
  }

  @Mutation(() => Items, { name: 'UpdateOneItem' })
  async updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUserGraphql()
    user: User,
  ): Promise<Items> {
    try {
      return await this.itemsService.update(
        updateItemInput.id,
        updateItemInput,
        user,
      );
    } catch (error) {
      throw new NotFoundException('Item not found.');
    }
  }

  @Mutation(() => Items, { name: 'DeleteItem' })
  async removeItem(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUserGraphql()
    user: User,
  ): Promise<Items> {
    try {
      return await this.itemsService.remove(id, user);
    } catch (error) {
      throw new NotFoundException('Item not found.');
    }
  }
}
