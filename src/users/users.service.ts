import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput, UpdateUserInput } from './dto/inputs';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0) {
      return await this.prisma.users.findMany({
        where: {
          deleted: false,
        },
      });
    }

    return await this.prisma.users.findMany({
      where: {
        deleted: false,
        rol: {
          hasSome: roles,
        },
      },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
        deleted: false,
      },
    });

    if (!user) throw new NotFoundException('User not found.');

    return user;
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    lastUpdatedBy: string,
  ): Promise<User> {

    if(updateUserInput.password) updateUserInput.password = bcrypt.hashSync(updateUserInput.password, 10);

    const user = await this.prisma.users.update({
      where: {
        id,
        deleted: false,
      },
      data: {
        ...updateUserInput,
        lastUpdatedBy
      },
    });

    return user;
  }

  async remove(id: string, lastUpdatedBy: string): Promise<User> {
    const user = await this.prisma.users.update({
      where: {
        id: id,
        deleted: false,
      },
      data: {
        deleted: true,
        lastUpdatedBy,
      },
    });

    return user;
  }
}
