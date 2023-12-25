import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import {  Role } from '@interfaces';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}


  @Roles([Role.admin])
  @UseGuards(JwtAuthGuard,RolesGuard)
  
  @Post()
  create(@Body() user: User) {
    return this.usersService.create(user);
  }

  @Roles([Role.admin])
  @UseGuards(JwtAuthGuard,RolesGuard)
  
  @Get()
  findAll(@Query() query: User) {
    return this.usersService.findAll(query);
  }

  // @Roles([Role.customer])
  // @UseGuards(JwtAuthGuard,RolesGuard)
  // @Put('/profile')
  // updateProfile(@Body() user: User, @Req() request: RequestWithUser) {
  //   return this.usersService.updateProfile(user,request);
  // }


  @Roles([Role.admin])
  @UseGuards(JwtAuthGuard,RolesGuard)
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Roles([Role.admin])
  @UseGuards(JwtAuthGuard,RolesGuard)
  
  @Put(':id')
  update(@Param('id') id: string, @Body() user: User) {
    return this.usersService.update(id, user);
  }

  @Roles([Role.admin])
  @UseGuards(JwtAuthGuard,RolesGuard)
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }


}
