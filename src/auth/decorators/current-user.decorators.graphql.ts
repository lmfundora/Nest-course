import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUserGraphql = createParamDecorator(
  (roles: ValidRoles[] = [], ctxGraphql: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(ctxGraphql);
    const user: User = ctx.getContext().req.user;;

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
