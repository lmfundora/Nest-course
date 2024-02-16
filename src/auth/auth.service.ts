import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private loger = new Logger('AuthUser');

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async singUp(createAuthDto: CreateAuthDto): Promise<Auth> {
    try {
      const user = await this.prisma.users.create({
        data: {
          ...createAuthDto,
          password: bcrypt.hashSync(createAuthDto.password, 10),
        },
      });

      const token = this.getJwtToken(user.id);

      delete user.password;

      return { token, user };
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async logIn(createAuthDto: CreateAuthDto): Promise<Auth> {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          email: createAuthDto.email,
        },
      });

      if (!bcrypt.compareSync(createAuthDto.password, user.password)) {
        throw new BadRequestException('Email or passord incorect');
      }

      const token = this.getJwtToken(user.id);

      delete user.password;

      return { token, user };
    } catch (error) {
        throw new BadRequestException('Email or passord incorect');
    }
  }

  revalidateToken(user: User): Auth {
    
    const token = this.getJwtToken(user.id)
  
    return {
      token,
      user
    }
  }

  private handleDbError(error: any): never {
    if (error.code === 'P2002') {
      throw new BadRequestException('El email ingresado ya está registrado.');
    }

    this.loger.error(error);
    throw new InternalServerErrorException('Please search server logs.');
  }

  async validateUser(id: string): Promise<User> {

    const user = await this.prisma.users.findUnique({
      where: {
        id,
        deleted: false
      }
    });

    if (!user) {
      throw new NotFoundException('Not found user')
    };

    delete(user.password);

    return user;
  }
}
