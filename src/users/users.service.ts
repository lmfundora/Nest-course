import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput, UpdateUserInput } from './dto/inputs';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(private readonly prisma: PrismaService){}

  async findAll(): Promise<User[]> {
    return await this.prisma.users.findMany({
      where: {
        deleted: false,
      }
    })

  }

  async findOne(id: string): Promise<User> {
    
    const user = await this.prisma.users.findUnique({
      where:{
        id: id,
        deleted: false
      }
    });

    if(!user) throw new NotFoundException('User not found.');

    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User>{
  
    const user = await this.prisma.users.update({
      where:{
        id: id,
        deleted: false,
      },
      data: updateUserInput,
    });

    return user;
  }

  async remove(id: string): Promise<User> {

    const user = await this.prisma.users.update({
      where:{
        id: id,
        deleted: false,
      },
      data: {
        deleted: true,
      },
    });

    return user;
  }
}
