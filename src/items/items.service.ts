import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Items } from './entities/item.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createItemInput: CreateItemInput,
    userId: string,
  ): Promise<Items> {
    return await this.prisma.items.create({
      data: {
        ...createItemInput,
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async findAll(user: User): Promise<Items[]> {
    if (user.rol.includes('admin')) {
      return await this.prisma.items.findMany({
        include: {
          user: true,
        },
      });
    }
    return await this.prisma.items.findMany({
      where: {
        deleted: false,
        userId: user.id,
      },
      include: {
        user: true,
      },
    });
  }

  async findOne(id: string, user: User): Promise<Items> {
    let item: Items;
    if (user.rol.includes('admin')) {
      item = await this.prisma.items.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
        },
      });
    }

    item = await this.prisma.items.findUnique({
      where: {
        id,
        deleted: false,
        userId: user.id,
      },
      include: {
        user: true,
      },
    });
    if (!item) throw new NotFoundException('Item not found');

    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Items> {
    if (user.rol.includes('admin')) {
      const item = this.prisma.items.update({
        where: {
          id,
        },
        data: updateItemInput,
      });
      return item;
    }

    const item = this.prisma.items.update({
      where: {
        id,
        deleted: false,
        userId: user.id,
      },
      data: updateItemInput,
    });
    return item;
  }

  async remove(id: string, user: User): Promise<Items> {
    if (user.rol.includes('admin')) {
      return this.prisma.items.update({
        where: {
          id,
          deleted: false,
        },
        data: {
          deleted: true,
        },
        include: {
          user: true,
        },
      });
    }

    return this.prisma.items.update({
      where: {
        id,
        deleted: false,
        userId: user.id,
      },
      data: {
        deleted: true,
      },
      include: {
        user: true,
      },
    });
  }
}
