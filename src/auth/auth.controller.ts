import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorators';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('singUp')
  async singUp(@Body() createAuthDto: CreateAuthDto): Promise<Auth> {
    return this.authService.singUp(createAuthDto);
  }

  @Post('logIn')
  async logIn(@Body() CreateAuthDto: CreateAuthDto): Promise<Auth> {
    return this.authService.logIn(CreateAuthDto);
  }

  @UseGuards( JwtAuthGuard)
  @Post('revalidate')
  revalidateToken(
    @CurrentUser(/**[ValidRoles.admin]*/) user: User
  ): Auth {
    return this.authService.revalidateToken(user);
  }
}
