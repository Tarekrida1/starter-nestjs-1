import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth/auth.controller';
import {  UserSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthConstants } from '../../commons/constants/auth-constants';
import { JwtStrategy } from './auth/jwt.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  JwtModule.register({
    secret: AuthConstants.secretKey,
    signOptions: { expiresIn: AuthConstants.expiresIn },
  }),
  HttpModule
],
  controllers: [UsersController,AuthController],
  providers: [UsersService,JwtStrategy],
  exports:[UsersService]
})
export class UsersModule {}
