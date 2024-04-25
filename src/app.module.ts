import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ItemsModule } from './items/items.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ AuthModule ],
      inject: [ JwtService ],
      useFactory: async(jwtService: JwtService) =>({
        playground: false,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        context({req}) {
          const token = req.headers.authorization?.replace('Bearer ', '');
          if( !token ) throw new Error('Token needed');

          const payload = jwtService.decode( token );
          
          if( !payload ) throw new Error('Token not valid')
        }
      })
    }),

    ItemsModule,
    PrismaModule,
    UsersModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
