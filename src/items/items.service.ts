import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Items } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createItemInput: CreateItemInput, userId: string): Promise<Items> {
    return await this.prisma.items.create({
      data: {
        ...createItemInput,
        userId
      },
    });
  }

  async findAll(): Promise<Items[]> {
    return await this.prisma.items.findMany({
      where: {
        deleted: false,
      },
    });
  }

  async findOne(id: string): Promise<Items> {
    const item = await this.prisma.items.findUnique({
      where: {
        id,
        deleted: false,
      },
    });

    if (!item) throw new NotFoundException('Item not found');

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Items> {

    const item = this.prisma.items.update({
      where: {
        id,
        deleted: false,
      },
      data: updateItemInput,
    });

    return item;
  }

  async remove(id: string): Promise<Items> {
    return this.prisma.items.update({
      where: {
        id,
        deleted: false,
      },
      data: {
        deleted: true,
      },
    });
  }
}
