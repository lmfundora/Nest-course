import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (roles: ValidRoles[] = [], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new InternalServerErrorException(
        'No user inside the request. Make sure that we used the AuthGard',
      );
    }

    if(roles.length === 0) return user;

    for(const rol of user.rol) {
      if( roles.includes(rol as ValidRoles)){
        return user;
      }
    }

    throw new ForbiddenException('Unauthorized.')
  },
);
