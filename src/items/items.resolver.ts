import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Items } from './entities/item.entity';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { NotFoundException, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from "src/auth/guards/graph-jwt-auth.guard";

@Resolver(() => Items)
@UseGuards(GqlAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Items, { name: 'CreateItem' })
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
  ): Promise<Items> {
    return this.itemsService.create(createItemInput);
  }

  @Query(() => [Items], { name: 'ListItems' })
  async findAll(): Promise<Items[]> {
    return this.itemsService.findAll();
  }

  @Query(() => Items, { name: 'ListOneItem' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Items> {
    return this.itemsService.findOne(id);
  }

  @Mutation(() => Items, { name: 'UpdateOneItem' })
  async updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
  ): Promise<Items> {
    try {
      return await this.itemsService.update(updateItemInput.id, updateItemInput);
    } catch (error) {
      throw new NotFoundException("Item not found.");
    }
  }

  @Mutation(() => Items, { name: 'DeleteItem' })
  async removeItem(@Args('id', { type: () => ID }) id: string): Promise<Items> {
    try {
      return await  this.itemsService.remove(id);
    } catch (error) {
      throw new NotFoundException('Item not found.');
    }
  }
}
